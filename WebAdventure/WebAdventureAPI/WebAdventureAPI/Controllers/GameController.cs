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
                list.Add(new GameDto
                {
                    Author = userManager.Users.FirstOrDefault(a => a.Id == x.AuthorId).UserName,
                    Genre = repo.GetGenreById(x.GenreId).Descr,
                    Name = x.Name,
                    Descr = x.Descr
                });
            }

            return Json(list);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public JsonResult CreateGame([FromHeader] string gameId, [FromBody] GameDto gameDto)
        {
            if (int.Parse(gameId) == 0)
            {
                var newGame = new Game
                {
                    Name = gameDto.Name,
                    Descr = gameDto.Descr,
                    AuthorId = gameDto.Author,
                    GenreId = repo.GetGenreByDescr(gameDto.Genre).Id
                };

                repo.AddGameToDb(newGame);

                gameId = repo.GetGameId(newGame).ToString();
            }
            else
            {
                var game = new Game
                {
                    Id = int.Parse(gameId),
                    Name = gameDto.Name,
                    Descr = gameDto.Descr,
                    AuthorId = gameDto.Author,
                    GenreId = repo.GetGenreByDescr(gameDto.Genre).Id
                };

                repo.UpdateGame(game);
            }

            return Json(new GameIdDto
            {
                Id = int.Parse(gameId)
            });
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet]
        [Route("author")]
        public JsonResult GetGameByAuthor([FromBody] AuthorDto authorDto)
        {
            var list = new List<GameDto>();
            foreach (var x in repo.GetGamesByAuthor(authorDto.Author))
            {
                list.Add(new GameDto
                {
                    Author = userManager.Users.FirstOrDefault(a => a.Id == x.AuthorId).UserName,
                    Genre = repo.GetGenreById(x.GenreId).Descr,
                    Name = x.Name,
                    Descr = x.Descr
                });
            }

            return Json(list);
        }

        private WAUser VerifyUserCredentials(string email, string passwordHash)
        {
            return userManager.Users.FirstOrDefault(u => u.Email == email && u.PasswordHash == passwordHash);
        }
    }
}
