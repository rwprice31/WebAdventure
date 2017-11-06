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
using WebAdventureAPI.Models.Responses.Games;
using WebAdventureAPI.Models.Responses;

namespace WebAdventureAPI.Controllers
{
    [Route("api/games")]
    public class GameController : Controller
    {
        private IWARepository repo;
        private UserManager<WAUser> userManager;

        public GameController(IWARepository repo, UserManager<WAUser> userManager)
        {
            this.repo = repo;
            this.userManager = userManager;
        }

        [HttpGet]
        public JsonResult GetAllGames()
        {
            var list = new List<GameDto>();
            foreach (var x in repo.GetAllGames())
            {
                var user = userManager.Users.FirstOrDefault(u => u.Id == x.AuthorId);
                list.Add(new GameDto
                {
                    Author = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        Username = user.UserName
                    },
                    Genre = repo.GetGenreById(x.GenreId).Descr,
                    Name = x.Name,
                    Descr = x.Descr
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
                if (gameDto.Id != 0)
                {
                    Response errorResponse = new Response
                    {
                        StatusCode = 400,
                        Status = false,
                        StatusText = "You're not creating a game."
                    };
                    return StatusCode(400, errorResponse);
                }
                var newGame = new Game
                    {
                        Name = gameDto.Name,
                        Descr = gameDto.Descr,
                        AuthorId = gameDto.Author.Id,
                        GenreId = repo.GetGenreByDescr(gameDto.Genre).Id
                    };
                    repo.AddGameToDb(newGame);
                    int newGameId = repo.GetGameId(newGame);
                    GameCreationResponse successResponse = new GameCreationResponse
                    {
                        StatusText = "New game successfully created!",
                        StatusCode = 201,
                        Status = true,
                        Game = new GameDto
                        {
                            Id = newGameId,
                            Author = gameDto.Author,
                            Descr = gameDto.Descr,
                            Genre = gameDto.Genre,
                            Name = gameDto.Name
                        }
                    };
                    return StatusCode(201, successResponse);
            }
            catch (Exception e)
            {
                Response errorResponse = new Response
                {
                    StatusCode = 500,
                    Status = false,
                    StatusText = "A server error has occured."
                };
                return StatusCode(500, errorResponse);
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut]
        public IActionResult UpdateGame([FromBody] GameDto gameDto)
        {
            try
            {
                if (gameDto.Id == 0)
                {
                    Response errorResponse = new Response
                    {
                        StatusCode = 400,
                        Status = false,
                        StatusText = "You're not updating a game."
                    };
                    return StatusCode(400, errorResponse);
                }
                var game = new Game
                {
                    Id = gameDto.Id,
                    Name = gameDto.Name,
                    Descr = gameDto.Descr,
                    AuthorId = gameDto.Author.Id,
                    GenreId = repo.GetGenreByDescr(gameDto.Genre).Id
                };
                repo.UpdateGame(game);
                GameUpdationResponse successResponse = new GameUpdationResponse
                {
                    StatusText = "Game successfully updated!",
                    StatusCode = 204,
                    Status = true,
                    Game = new GameDto
                    {
                        Id = gameDto.Id,
                        Author = gameDto.Author,
                        Descr = gameDto.Descr,
                        Genre = gameDto.Genre,
                        Name = gameDto.Name
                    }
                };
                return StatusCode(204, successResponse);
            }
            catch (Exception e)
            {
                Response errorResponse = new Response
                {
                    StatusCode = 500,
                    Status = false,
                    StatusText = "A server error has occured."
                };
                return StatusCode(500, errorResponse);
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
                foreach (var x in repo.GetGamesByAuthor(authorId))
                {
                    var user = userManager.Users.FirstOrDefault(u => u.Id == x.AuthorId);
                    usersGames.Add(new GameDto
                    {
                        Author = new UserDto
                        {
                            Id = user.Id,
                            Email = user.Email,
                            Username = user.UserName
                        },
                        Genre = repo.GetGenreById(x.GenreId).Descr,
                        Name = x.Name,
                        Descr = x.Descr
                    });
                }
                UsersGamesResponse successResponse = new UsersGamesResponse
                {
                    StatusText = "User's games successfully found!",
                    StatusCode = 200,
                    Status = true,
                    Games = usersGames
                };
                return StatusCode(200, successResponse);
            }
            catch (Exception e)
            {
                Response errorResponse = new Response
                {
                    StatusCode = 500,
                    Status = false,
                    StatusText = "A server error has occured."
                };
                return StatusCode(500, errorResponse);
            }
        }

        private WAUser VerifyUserCredentials(string email, string passwordHash)
        {
            return userManager.Users.FirstOrDefault(u => u.Email == email && u.PasswordHash == passwordHash);
        }
    }
}
