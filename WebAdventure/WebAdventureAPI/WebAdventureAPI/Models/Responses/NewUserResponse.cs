using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses
{
    public class NewUserResponse : Response
    {
        public NewUserResponse()
        {
            StatusText = "New user successfully created!";
            StatusCode = 201;
            Status = true;
        }

        public UserDto User { get; set; }
    }
}
