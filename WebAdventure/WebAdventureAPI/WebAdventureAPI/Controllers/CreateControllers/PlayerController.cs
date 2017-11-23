using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using WebAdventureAPI.Repositories;
using WebAdventureAPI.Models.Responses.Player;
using WebAdventureAPI.Models.Responses;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Controllers
{
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/games/{gameId}/players")]
    public class PlayerController : Controller
    {
        private IWARepository repo;
        private PlayerResponse response;

        public PlayerController(IWARepository repo)
        {
            this.repo = repo;
            this.response = new PlayerResponse();
        }

        [HttpGet]
        public IActionResult GetPlayer([FromRoute] int gameId)
        {
            try
            {
                var player = repo.GetPlayer(gameId);
                return StatusCode(201, response.GetPlayerResponse(player));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPost]
        public IActionResult CreatePlayer([FromBody] PlayerCreationDto dto, [FromRoute] int gameId)
        {
            try
            {
                var player = repo.CreatePlayer(gameId, dto);
                return StatusCode(201, response.CreatePlayerResponse(player));
            }
            catch (Exception e)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPut("{playerId}")]
        public IActionResult UpdatePlayer([FromRoute] int playerId, [FromBody] PlayerCreationDto dto)
        {
            try
            {
                var player = repo.UpdatePlayer(playerId, dto);
                return StatusCode(200, response.UpdatePlayerResponse(player));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpDelete("{playerId}")]
        public IActionResult DeletePlayer([FromRoute] int playerId)
        {
            try
            {
                repo.DeletePlayer(playerId);
                return StatusCode(201, response.DeletePlayerResponse());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }
    }
}
