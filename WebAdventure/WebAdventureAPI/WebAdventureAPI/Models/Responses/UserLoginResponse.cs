using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses
{
    public class UserLoginResponse : Response
    {
        public UserDto User { get; set; }
    }
}
