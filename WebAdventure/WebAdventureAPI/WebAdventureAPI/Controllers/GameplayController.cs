using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;
using WebAdventureAPI.Models.Responses;
using WebAdventureAPI.Repositories;

namespace WebAdventureAPI.Controllers
{
    [Route("api/games/play/{gameId}")]
    public class GameplayController : Controller
    {
        private GameplayResponses responses;
        private IWARepository repo;

        public GameplayController(IWARepository repo)
        {
            responses = new GameplayResponses();
            this.repo = repo;
        }

        [HttpGet]
        public IActionResult GetGameInformation([FromRoute] int gameId)
        {
            try
            {
                var game = repo.GetGameInformation(gameId);
                return StatusCode(201, responses.GameInfoResponse(game));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPost]
        public IActionResult StartGame([FromRoute] int gameId, [FromBody] UserDto userDto)
        {
            try
            {
                var playerGame = repo.InitializePlayerGame(gameId, userDto);
                return StatusCode(291, responses.StartGameResponse(playerGame));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpGet("{gamePlayId}/{roomId}")]
        public IActionResult GetCurrentRoomInformation([FromRoute] int roomId)
        {
            try
            {
                var roomInfo = repo.GetInformationForRoom(roomId);
                return StatusCode(291, responses.RoomInfoResponse(roomInfo));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPut("{gamePlayId}/{roomId}")]
        public IActionResult UpdatePlayerRoom([FromRoute] int roomId, [FromRoute] int gamePlayId)
        {
            try
            {
                repo.UpdatePlayerRoom(roomId, gamePlayId);
                return StatusCode(291, responses.UpdatedRoomResponse());
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }
    }
}
