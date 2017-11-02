using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Games
{
    public class GameCreationResponse : Response
    {
        public GameDto Game { get; set; }
    }
}
