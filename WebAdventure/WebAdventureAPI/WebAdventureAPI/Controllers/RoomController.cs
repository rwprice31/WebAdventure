using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.AspNetCore.Server.HttpSys;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using WebAdventureAPI.Models.Dtos;
using WebAdventureAPI.Models.DbModels;
using WebAdventureAPI.Repositories;
using Microsoft.AspNetCore.Identity;
using WebAdventureAPI.Models;
using WebAdventureAPI.Models.Responses;
using WebAdventureAPI.Models.Responses.Room;

namespace WebAdventureAPI.Controllers
{
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/games/{gameId}/rooms")]
    public class RoomController : Controller
    {
        private IWARepository repo;
        private UserManager<WAUser> userManager;
        private RoomResponses roomResponses;
        private RoomOptionResponses roomOptionResponses;

        public RoomController(IWARepository repo, UserManager<WAUser> userManager)
        {
            this.repo = repo;
            this.userManager = userManager;
            roomResponses = new RoomResponses();
            roomOptionResponses = new RoomOptionResponses();
        }

        [HttpPost]
        public IActionResult CreateRoom([FromBody] RoomDto roomDto, [FromRoute] int gameId)
        {
            try
            {
                var newRoom = new Room
                {
                    Name = roomDto.Name,
                    Descr = roomDto.Descr,
                    GameId = gameId
                };

                repo.AddRoomToDb(newRoom);
                var roomId = repo.GetRoomId(newRoom);

                newRoom.Id = roomId;

                return StatusCode(201, roomResponses.CreateResponse(newRoom));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPut("{roomId}")]
        public IActionResult UpdateRoom([FromBody] RoomDto roomDto, [FromRoute] int gameId, [FromRoute] int roomId)
        {
            var room = new Room
            {
                Id = roomId,
                Name = roomDto.Name,
                Descr = roomDto.Descr,
                GameId = gameId
            };

            if (room.Id == 0)
            {
                return StatusCode(404, "Room does not exist");
            }
            else
            {
                repo.UpdateRoom(room);
                return StatusCode(204, roomResponses.UpdateResponse(room));
            }
        }

        [HttpGet]
        public IActionResult GetRooms([FromRoute] int gameId)
        {
            try
            {
                var rooms = repo.GetRoomsForGame(gameId);
                var roomList = new List<Room>();
                foreach (var x in rooms)
                {
                    roomList.Add(new Room
                    {
                        Id = x.Id,
                        Descr = x.Descr,
                        Name = x.Name,
                        GameId = x.GameId
                    });
                }

                return StatusCode(201, roomResponses.GetAllRoomsResponse(roomList));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpDelete]
        public IActionResult DeleteRoom([FromBody] RoomIdDto roomIdDto)
        {
            try
            {
                repo.DeleteRoom(roomIdDto.Id);
                return StatusCode(201, roomResponses.DeleteRoomResponse());
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpGet("{roomId}/options")]
        public IActionResult GetRoomOptions([FromHeader] int roomId)
        {
            try
            {
                var list = repo.GetActionOutcomeByRoom(roomId);

                return StatusCode(200, roomOptionResponses.GetRoomOptionSuccess(list));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPost("options")]
        public IActionResult CreateOptionForRoom([FromBody] RoomActionOutcomeDto raoDto)
        {
            try
            {
                var roomActionOutcome = repo.CreateRoomActionOutcome(raoDto.RoomId,
                    new Models.DbModels.Action
                    {
                        Id = raoDto.ActionId,
                        Descr = raoDto.ActionDescr
                    },
                    new Outcome
                    {
                        Id = raoDto.OptionId,
                        MonsterId = raoDto.MonsterId,
                        ItemId = raoDto.ItemId,
                        NextRoomId = raoDto.NextRoomId
                    });

                return StatusCode(204, roomOptionResponses.GetCreateRoomOptionSuccess(roomActionOutcome));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpDelete("options")]
        public IActionResult DeleteOptionFromRoom([FromBody] ActionOutcomeDeleteDto dto)
        {
            try
            {
                repo.DeleteActionOutcome(dto);
                return StatusCode(201, roomOptionResponses.DeleteRoomOptionSuccess());
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }
    }
}
