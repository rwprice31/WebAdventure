using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models;

namespace WebAdventureAPI.Controllers
{
    [Route("users")]
    public class UserController : Controller
    {
        [HttpGet]
        public string Users()
        {
            return "Hello from users!";
        }
    }
}
