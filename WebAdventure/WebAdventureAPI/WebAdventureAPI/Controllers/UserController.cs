using Microsoft.AspNetCore.Identity;
using System.Web.Http;
using WebAdventureAPI.Models;

namespace WebAdventureAPI.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("users")]
    public class UserController : ApiController
    {
        private UserManager<WAUser> userManager;

        public UserController(UserManager<WAUser> userManager)
        {
            this.userManager = userManager;
        }

        [HttpGet]
        public IHttpActionResult GetUsers()
        {
            return Ok("Worked");
        }
    }
}
