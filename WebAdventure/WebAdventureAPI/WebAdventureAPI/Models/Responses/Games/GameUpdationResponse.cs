using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Games
{
    public class GameUpdationResponse : Response
    {
        public GameDto Game { get; set; }
    }
}
