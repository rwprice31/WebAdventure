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
        public JsonResult GetAllGames()
        {
            var list = new List<GetGameDto>();
            foreach (var game in repo.GetAllGames())
            {
                var user = userManager.Users.FirstOrDefault(u => u.Id == game.AuthorId);
                list.Add(new GetGameDto
                {
                    Id = game.Id,
                    Author = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        Username = user.UserName
                    },
                    Genre = repo.GetGenreById(game.GenreId).Descr,
                    Name = game.Name,
                    Descr = game.Descr
                });
            }
            return Json(list);
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
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("{gameId}")]
        public IActionResult UpdateGame([FromBody] GameDto gameDto, [FromRoute] int gameId)
        {
            try
            {
                if (gameId == 0)
                {
                    return StatusCode(400, ErrorResponse.CustomErrorCode(400, "You're not updating a game."));
                }

                var game = repo.UpdateGame(gameDto, gameId);

                return StatusCode(200, responses.UpdateResponse(game));
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

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet]
        [Route("{authorId}")]
        public IActionResult GetGameByAuthor([FromRoute] string authorId)
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
                            Id = user.Id,
                            Email = user.Email,
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
    }
}
