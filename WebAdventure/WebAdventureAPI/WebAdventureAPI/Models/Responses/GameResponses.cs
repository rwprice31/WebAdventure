using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses
{
    public class GameResponses : Response
    {
        public GameDto Game { get; set; }

        public GameDto[] Games { get; set; }

        public GameResponses CreateResponse(GameDto game)
        {
            return new GameResponses
            {
                StatusText = "New game successfully created!",
                StatusCode = 201,
                Status = true,
                Game = game
            };
        }

        public GameResponses UpdateResponse(GameDto game)
        {
            return new GameResponses
            {
                StatusText = "Game successfully updated!",
                StatusCode = 204,
                Status = true,
                Game = game
            };
        }

        public GameResponses AuthorsGamesFound(GameDto[] usersGames)
        {
            return new GameResponses
            {
                StatusText = "Author's games successfully found!",
                StatusCode = 200,
                Status = true,
                Games = usersGames
            };
        }
    }
}
