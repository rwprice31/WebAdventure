using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebAdventureAPI.Models;
using WebAdventureAPI.Models.Dtos;
using WebAdventureAPI.Models.Responses;
using WebAdventureAPI.Models.Security;
using WebAdventureAPI.Services;

namespace WebAdventureAPI.Controllers
{
    [Route("api/users")]
    public class UserController : Controller
    {
        private UserManager<WAUser> userManager;
        private SignInManager<WAUser> signInManager;
        private IEmailSender authMessageSender;
        private readonly IJwtFactory jwtFactory;
        private readonly JsonSerializerSettings serializerSettings;
        private readonly JwtIssuerOptions jwtOptions;

        public UserController(
            UserManager<WAUser> userManager,
            SignInManager<WAUser> signInManager,
            IEmailSender authMessageSender,
            IJwtFactory jwtFactory,
            IOptions<JwtIssuerOptions> jwtOptions)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.authMessageSender = authMessageSender;
            this.jwtFactory = jwtFactory;
            this.jwtOptions = jwtOptions.Value;
            serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var users = userManager.Users.Where(x => x.Id != null).ToList();
            return Ok(users.Count);
        }

        [HttpPost("new")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateUser([FromBody] NewUserDto newUser)
        {
            var user = userManager.Users.FirstOrDefault(x => x.UserName == newUser.Username);
            if (user != null)
            {
                return StatusCode(400, ErrorResponse.CustomErrorCode(400, "A user with that username already exists."));
            }

            user = userManager.Users.FirstOrDefault(x => x.Email == newUser.Email);
            if (user != null)
            {
                return StatusCode(400, ErrorResponse.CustomErrorCode(400, "A user with that email already exists."));
            }

            var result = await userManager.CreateAsync(new WAUser
            {
                UserName = newUser.Username,
                Email = newUser.Email
            },
            newUser.Password);

            if (result.Succeeded)
            {
                user = userManager.Users.FirstOrDefault(x => x.UserName == newUser.Username);

                var response = new NewUserResponse
                {
                    User = new UserDto
                    {
                        Email = user.Email,
                        Id = user.Id,
                        Username = user.UserName
                    }
                };

                return StatusCode(201, response);
            }
            else
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPost("reset")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetUserPassword([FromBody]ResetPasswordDto reset)
        {
            var user = userManager.Users.FirstOrDefault(x => x.Email == reset.Email);
            if (user == null)
            {
                return BadRequest("User does not exist");
            }
            else
            {
                var token = await userManager.GeneratePasswordResetTokenAsync(user);
                var result = await userManager.ResetPasswordAsync(user, token, reset.NewPassword);
                

                if (result.Succeeded)
                {
                    return StatusCode(200, new ResetPasswordResponse
                    {
                        User = new UserDto
                        {
                            
                        }
                    });
                }
                else
                {
                    return BadRequest("User not updated");
                }
            }
        }

        [HttpPost("forgot")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotUserPassword([FromBody]ForgotPasswordDto forgot)
        {
            var user = await userManager.FindByEmailAsync(forgot.Email);
            if (user == null)
            {
                return BadRequest("User does not exist");
            }
           
            await authMessageSender.SendEmailAsync(forgot.Email, "Reset Password",
                       "Please reset your password by <a href='http://localhost:4200/resetpassword'>clicking here</a>.");
               
          
            //return new OkObjectResult(true);
            return StatusCode(200, new ForgotPasswordResponse
            {
                User = new UserDto
                {

                }
            });


        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            (ClaimsIdentity identity, WAUser user) = await GetClaimsIdentity(loginDto);
            if (identity == null || user == null)
            {
                return StatusCode(400, ErrorResponse.CustomErrorCode(400, "Incorrect Login"));
            }

            return StatusCode(200, new UserLoginResponse
            {
                User = new UserDto
                {
                    Auth_Token = await jwtFactory.GenerateEncodedToken(loginDto.Email, identity),
                    Email = user.Email,
                    Username = user.UserName,
                    Id = user.Id
                }
            });
        }

       

        private async Task<(ClaimsIdentity, WAUser)> GetClaimsIdentity(LoginDto loginDto)
        {

            ClaimsIdentity identity = null;
            WAUser user = null;

            if (!string.IsNullOrEmpty(loginDto.Email) && !string.IsNullOrEmpty(loginDto.Password))
            {
                // get the user to verifty
                var userToVerify = await userManager.FindByEmailAsync(loginDto.Email);

                if (userToVerify != null)
                {
                    // check the credentials  
                    if (await userManager.CheckPasswordAsync(userToVerify, loginDto.Password))
                    {
                        identity =  await Task.FromResult(jwtFactory.GenerateClaimsIdentity(loginDto.Email, userToVerify.Id));
                        user = userToVerify;
                    }
                }
            }
            // return claims identity and user
            return (identity, user);
        }
    }
}