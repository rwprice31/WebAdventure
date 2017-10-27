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
                Response response = new Response
                {
                    StatusCode = 400,
                    Status = false,
                    StatusText = "A user with that username already exists."
                };
                return StatusCode(400, response);
            }

            user = userManager.Users.FirstOrDefault(x => x.Email == newUser.Email);
            if (user != null)
            {
                Response response = new Response
                {
                    StatusCode = 400,
                    Status = false,
                    StatusText = "A user with that email already exists."
                };
                return StatusCode(400, response);
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

                NewUserResponse response = new NewUserResponse
                {
                    StatusText = "New user successfully created!",
                    StatusCode = 201,
                    Status = true,
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
                Response response = new Response
                {
                    StatusCode = 500,
                    Status = false,
                    StatusText = "A server error has occured."
                };
                return StatusCode(500, response);
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
                    return Ok("Password Update Successfully.");
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
            var identity = await GetClaimsIdentity(loginDto);
            if (identity == null)
            {
                return BadRequest("Invalid username or password.");
            }

            var response = new
            {
                id = identity.Claims.Single(c => c.Type == "id").Value,
                auth_token = await jwtFactory.GenerateEncodedToken(loginDto.Email, identity),
                expires_in = (int)jwtOptions.ValidFor.TotalSeconds
            };

            var json = JsonConvert.SerializeObject(response);
            return new OkObjectResult(json);
        }

        private async Task<ClaimsIdentity> GetClaimsIdentity(LoginDto loginDto)
        {
            if (!string.IsNullOrEmpty(loginDto.Email) && !string.IsNullOrEmpty(loginDto.Password))
            {
                // get the user to verifty
                var userToVerify = await userManager.FindByEmailAsync(loginDto.Email);

                if (userToVerify != null)
                {
                    // check the credentials  
                    if (await userManager.CheckPasswordAsync(userToVerify, loginDto.Password))
                    {
                        return await Task.FromResult(jwtFactory.GenerateClaimsIdentity(loginDto.Email, userToVerify.Id));
                    }
                }
            }

            // Credentials are invalid, or account doesn't exist
            return await Task.FromResult<ClaimsIdentity>(null);
        }
    }
}