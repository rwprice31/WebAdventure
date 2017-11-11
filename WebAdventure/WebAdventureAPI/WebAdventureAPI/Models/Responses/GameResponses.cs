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
        public GetGameDto Game { get; set; }

        public GetGameDto[] Games { get; set; }

        public GameResponses GameFoundResponse(GetGameDto game)
        {
            return new GameResponses
            {
                StatusText = "Game successfully found!",
                StatusCode = 200,
                Status = true,
                Game = game
            };
        }

        public GameResponses GamesFoundResponse(GetGameDto[] games)
        {
            return new GameResponses
            {
                StatusText = "Game successfully found!",
                StatusCode = 200,
                Status = true,
                Games = games
            };
        }

        public GameResponses CreateResponse(GetGameDto game)
        {
            return new GameResponses
            {
                StatusText = "New game successfully created!",
                StatusCode = 201,
                Status = true,
                Game = game
            };
        }

        public GameResponses UpdateResponse(GetGameDto game)
        {
            return new GameResponses
            {
                StatusText = "Game successfully updated!",
                StatusCode = 200,
                Status = true,
                Game = game
            };
        }

        public GameResponses AuthorsGamesFound(GetGameDto[] usersGames)
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
