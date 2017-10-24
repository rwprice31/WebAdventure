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

namespace WebAdventureAPI.Controllers
{
    [Route("api/users")]
    public class UserController : Controller
    {
        private UserManager<WAUser> userManager;
        private SignInManager<WAUser> signInManager;

        public UserController(UserManager<WAUser> userManager, SignInManager<WAUser> signInManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
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
                return BadRequest("User already exists. Please try again");
            }

            user = userManager.Users.FirstOrDefault(x => x.Email == newUser.Email);
            if (user != null)
            {
                return BadRequest("Email is already in use. Please try again");
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
                return Ok(user.Id);
            }
            else
            {
                return BadRequest("User creation failed");
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
                return BadRequest("User does not exist");
            }
            else
            {
                var username = user.UserName;
                var result = await signInManager.PasswordSignInAsync(username, loginDto.Password, true, false);
                if (result.Succeeded)
                {
                    return Ok("Logged In");
                }
                else
                {
                    return BadRequest("Email/Password is incorrect");
                }
            }
        }
    }
}
