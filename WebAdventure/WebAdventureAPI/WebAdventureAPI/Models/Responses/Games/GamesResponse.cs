using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Games
{
    public class GamesResponse : Response
    {
        public GameDto[] Games { get; set; }
    }
}
