using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebAdventureAPI.Models;
using WebAdventureAPI.Models.Dtos;
using WebAdventureAPI.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using WebAdventureAPI.Models.Responses;

namespace WebAdventureAPI.Controllers
{
    [Route("api/games")]
    public class GameController : Controller
    {
        private IWARepository repo;
        private UserManager<WAUser> userManager;
        private GameResponses responses;

        public GameController(IWARepository repo, UserManager<WAUser> userManager)
        {
            this.repo = repo;
            this.userManager = userManager;
            responses = new GameResponses();
        }

        [HttpGet]
        public IActionResult GetGames([FromQuery] string author)
        {
            try
            {
                // get games by author
                if (author != null)
                {
                    return GetGameByAuthorId(author);
                }
                else
                {
                    // get all games
                    var games = new List<GameDto>();
                    foreach (var game in repo.GetAllGames())
                    {
                        var user = userManager.Users.FirstOrDefault(u => u.Id == game.AuthorId);
                        games.Add(new GameDto
                        {
                            Id = game.Id,
                            Author = new UserDto
                            {
                                Username = user.UserName
                            },
                            Genre = repo.GetGenreById(game.GenreId).Descr,
                            Name = game.Name,
                            Descr = game.Descr
                        });
                    }
                    return StatusCode(200, responses.GamesFoundResponse(games));
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpGet("{gameId}")]
        public async Task<IActionResult> GetGame([FromRoute] int gameId)
        {
            Game game = repo.GetGame(gameId);
            WAUser gameAuthor = await repo.GetGameAuthor(game);
            var genre = repo.GetGenreById(game.GenreId);
            var gameDto = new GameDto()
            {
                Descr = game.Descr,
                Name = game.Name,
                Id = game.Id,
                Genre = genre.Descr,
                Author = new UserDto()
                {
                    Username = gameAuthor.UserName
                }
            };
            if (gameDto != null)
            {
                return StatusCode(200 ,responses.GameFoundResponse(gameDto));
            }
            else
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public IActionResult CreateGame([FromBody] GameDto gameDto)
        {
            try
            {
                var newGame = new Game
                {
                    Name = gameDto.Name,
                    Descr = gameDto.Descr,
                    AuthorId = gameDto.Author.Id,
                    GenreId = repo.GetGenreByDescr(gameDto.Genre).Id
                };
                var game = repo.AddGameToDb(newGame);

                var successResponse = responses.CreateResponse(game);
                return StatusCode(201, successResponse);
            }
            catch (Exception e)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("{gameId}")]
        public IActionResult UpdateGame([FromRoute] int gameId, [FromBody] GameDto gameDto)
        {
            (IActionResult result, bool isOwner) = EnsureAuthorOwnsGame(gameDto, gameId);
            if (!isOwner)
            {
                return result;
            }
            try
            {
                if (gameId == 0)
                {
                    return StatusCode(400, ErrorResponse.CustomErrorCode(400, "You're not updating a game."));
                }
                repo.UpdateGame(gameDto, gameId);
                var updatedGameDto = new GameDto
                {
                    Id = gameId,
                    Author = gameDto.Author,
                    Descr = gameDto.Descr,
                    Genre = gameDto.Genre,
                    Name = gameDto.Name
                };
                var successResponse = responses.UpdateResponse(updatedGameDto);
                return StatusCode(200, successResponse);
            }
            catch (Exception e)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpDelete("{gameId}")]
        public IActionResult DeleteGame([FromBody] GameIdDto gameIdDto, [FromRoute] int gameId)
        {
            try
            {
                // get game
                // delete everything from every table
                // delete game
                // returhn success
                return null;
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        private IActionResult GetGameByAuthorId(string authorId)
        {
            try
            {
                var usersGames = new List<GameDto>();
                foreach (var game in repo.GetGamesByAuthor(authorId))
                {
                    var user = userManager.Users.FirstOrDefault(u => u.Id == game.AuthorId);
                    usersGames.Add(new GameDto
                    {
                        Id = game.Id,
                        Author = new UserDto
                        {
                            Username = user.UserName
                        },
                        Genre = repo.GetGenreById(game.GenreId).Descr,
                        Name = game.Name,
                        Descr = game.Descr
                    });
                }
                return StatusCode(200, responses.AuthorsGamesFound(usersGames));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        private WAUser VerifyUserCredentials(string email, string passwordHash)
        {
            return userManager.Users.FirstOrDefault(u => u.Email == email && u.PasswordHash == passwordHash);
        }

        private (IActionResult, bool) EnsureAuthorOwnsGame(GameDto gameDto, int gameId)
        {
            var currentUser = gameDto.Author;
            List<Game> currentUsersGames = repo.GetGamesByAuthor(currentUser.Id);
            if (currentUsersGames.Find(g => g.Id == gameId) == null)
            {
                var result = StatusCode(400, ErrorResponse.CustomErrorCode(400, "You can't update a game you do not own"));
                return (result, false);
            }
            return (null, true);
        }
    }
}
