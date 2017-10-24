using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebAdventureAPI.Models;
using WebAdventureAPI.Models.Dtos;
using WebAdventureAPI.Services;

namespace WebAdventureAPI.Controllers
{
    [Route("api/users")]
    public class UserController : Controller
    {
        private UserManager<WAUser> userManager;
        private SignInManager<WAUser> signInManager;
        private IEmailSender emailSender;

        public UserController(
            UserManager<WAUser> userManager, 
            SignInManager<WAUser> signInManager,
            IEmailSender emailSender)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.emailSender = emailSender;
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
                var request = BadRequest("");
                request.StatusCode = 400;
                return request;
            }

            user = userManager.Users.FirstOrDefault(x => x.Email == newUser.Email);
            if (user != null)
            {
                var request = BadRequest("");
                request.StatusCode = 401;
                return request;
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
                //var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
                //var callbackUrl = Url.Action("Confirm Email", "Account",
                //    new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
                //await emailSender.SendEmailAsync(user.Email, "Confirm your account",
                //$"Please confirm your account by clicking this link: <a href='{callbackUrl}'>link</a>");
                return Ok(user.Id);
            }
            else
            {
                var request = BadRequest("");
                request.StatusCode = 404;
                return request;
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
            var user = userManager.Users.FirstOrDefault(x => x.Email == loginDto.Email);
            if (user == null)
            {
                var result = BadRequest("");
                result.StatusCode = 401;
                return result;
            }
            else
            {
                var username = user.UserName;
                var result = await signInManager.PasswordSignInAsync(username, loginDto.Password, true, false);
                if (result.Succeeded)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
        }
    }
}