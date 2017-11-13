using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.HttpSys;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using WebAdventureAPI.Models;
using WebAdventureAPI.Models.Dtos;
using WebAdventureAPI.Models.Security;
using WebAdventureAPI.Services;
using WebAdventureAPI.Models.Responses;

namespace WebAdventureAPI.Controllers
{
    [Route("api/users")]
    public class UserController : Controller
    {
        private UserManager<WAUser> userManager;
        private SignInManager<WAUser> signInManager;
        private IEmailSender emailSender;
        private readonly IJwtFactory jwtFactory;
        private readonly JsonSerializerSettings serializerSettings;
        private readonly JwtIssuerOptions jwtOptions;

        public UserController(
            UserManager<WAUser> userManager,
            SignInManager<WAUser> signInManager,
            IEmailSender emailSender,
            IJwtFactory jwtFactory,
            IOptions<JwtIssuerOptions> jwtOptions)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.emailSender = emailSender;
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

                //var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
                //var callbackUrl = Url.Action("Confirm Email", "Account",
                //    new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
                //await emailSender.SendEmailAsync(user.Email, "Confirm your account",
                //$"Please confirm your account by clicking this link: <a href='{callbackUrl}'>link</a>");
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

        [HttpPut("update")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateUser([FromBody] NewUserDto newUser)
        {
            
            var user = userManager.Users.FirstOrDefault(x => x.Email == newUser.Email);
            if (user != null)
            {
                return StatusCode(400, ErrorResponse.CustomErrorCode(400, "User does not exist."));
            }

            var result = await userManager.CreateAsync(new WAUser
            {              
                Email = newUser.Email
            },
            newUser.Password);

            if (result.Succeeded)
            {
                user = userManager.Users.FirstOrDefault(x => x.UserName == newUser.Username);

                var response = "Password Update Successfully.";


                //var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
                //var callbackUrl = Url.Action("Confirm Email", "Account",
                //    new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
                //await emailSender.SendEmailAsync(user.Email, "Confirm your account",
                //$"Please confirm your account by clicking this link: <a href='{callbackUrl}'>link</a>");
                return StatusCode(201, response);
            }
            else
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
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