using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using WebAdventureAPI.Repositories;
using WebAdventureAPI.Models.Responses.Monster;
using WebAdventureAPI.Models.Responses;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/games/{gameId}/monsters")]
    public class MonsterController : Controller
    {
        private IWARepository repo;
        private MonsterResponse response;

        public MonsterController(IWARepository repo)
        {
            this.repo = repo;
            this.response = new MonsterResponse();
        }

        [HttpGet]
        public IActionResult GetMonsters([FromRoute] int gameId)
        {
            try
            {
                var monsters = repo.GetMonstersForGame(gameId);
                return StatusCode(201, response.AllMonstersResponse(monsters));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPost]
        public IActionResult CreateMonster([FromBody] MonsterCreationDto dto, [FromRoute] int gameId)
        {
            try
            {
                var monster = repo.CreateMonster(dto, gameId);
                return StatusCode(201, response.CreateMonsterResponse(monster));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPut("{monsterId}")]
        public IActionResult UpdateMonster([FromRoute] int monsterId, [FromBody] MonsterCreationDto dto)
        {
            try
            {
                var monster = repo.UpdateMonster(dto, monsterId);
                return StatusCode(200, response.UpdateMonsterResponse(monster));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpDelete("{monsterId}")]
        public IActionResult DeleteMonster([FromRoute] int monsterId)
        {
            try
            {
                repo.DeleteMonster(monsterId);
                return StatusCode(201, response.DeleteMonsterResponse());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }
    }
}
