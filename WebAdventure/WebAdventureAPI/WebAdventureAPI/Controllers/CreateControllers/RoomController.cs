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
        private RoomResponses roomResponses;
        private RoomItemResponse roomItemResponses;
        private RoomMonsterResponses roomMonsterResponses;
        private RoomExitResponse roomExitResponses;

        public RoomController(IWARepository repo)
        {
            this.repo = repo;
            roomResponses = new RoomResponses();
            roomItemResponses = new RoomItemResponse();
            roomMonsterResponses = new RoomMonsterResponses();
            roomExitResponses = new RoomExitResponse();
        }

        [HttpPost]
        public IActionResult CreateRoom([FromBody] RoomDto roomDto, [FromRoute] int gameId)
        {
            try
            {
                var newRoom = repo.AddRoomToDb(roomDto, gameId);
                roomDto.Id = newRoom.Id;
                return StatusCode(201, roomResponses.CreateResponse(roomDto));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPut("{roomId}")]
        public IActionResult UpdateRoom([FromBody] RoomDto roomDto, [FromRoute] int gameId, [FromRoute] int roomId)
        {
            if (roomId == 0)
            {
                return StatusCode(404, "You're not trying to update a room.");
            }
            var room = new Room
            {
                Id = roomId,
                Name = roomDto.Name,
                Descr = roomDto.Descr,
                GameId = gameId,
                IsStarting = roomDto.IsStarting
            };
            repo.UpdateRoom(room);
            return StatusCode(200, roomResponses.UpdateResponse(roomDto));
            
        }

        [HttpGet]
        public IActionResult GetRooms([FromRoute] int gameId)
        {
            try
            {
                var rooms = repo.GetRoomsForGame(gameId);
                var roomList = new List<RoomDto>();
                foreach (var x in rooms)
                {
                    roomList.Add(new RoomDto
                    {
                        Id = x.Id,
                        Descr = x.Descr,
                        Name = x.Name,
                        GameId = x.GameId,
                        IsStarting = x.IsStarting
                    });
                }

                return StatusCode(200, roomResponses.GetAllRoomsResponse(roomList));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpGet("{roomId}")]
        public IActionResult GetRoom([FromRoute] int gameId, [FromRoute] int roomId)
        {
            try
            {
                var room = repo.GetRoomForGame(gameId, roomId);
                var roomDto = new RoomDto
                {
                    Id = room.Id,
                    Name = room.Name,
                    Descr = room.Descr,
                    GameId = room.GameId,
                    IsStarting = room.IsStarting
                };
                return StatusCode(200, roomResponses.GetRoomResponse(roomDto));
            }
            catch(Exception e)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }        
        }

        [HttpDelete("{roomId}")]
        public IActionResult DeleteRoom([FromRoute] int gameId, [FromRoute] int roomId)
        {
            try
            {
                repo.DeleteRoom(roomId);
                var rooms = repo.GetRoomsForGame(gameId);
                var roomsDto = new List<RoomDto>();
                foreach (var room in rooms)
                {
                    roomsDto.Add(
                        new RoomDto
                        {
                            Id = room.Id,
                            Name = room.Name,
                            Descr = room.Name,
                            GameId = room.GameId,
                            IsStarting = room.IsStarting
                        });
                }
                return StatusCode(201, roomResponses.DeleteRoomResponse(roomsDto));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpGet("{roomId}/items")]
        public IActionResult GetItemsForRoom([FromRoute] int roomId)
        {
            try
            {
                var items = repo.GetItemsForRoom(roomId);
                return StatusCode(201, roomItemResponses.GetRoomItemResponse(items));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPost("{roomId}/items")]
        public IActionResult AddItemToRoom([FromRoute] int roomId, [FromBody] int itemId)
        {
            try
            {
                repo.AddItemToRoom(roomId, itemId);
                return StatusCode(201, roomItemResponses.AddRoomItemResponse());
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpDelete("{roomId}/items")]
        public IActionResult DeleteItemFromRoom([FromRoute] int roomId, [FromBody] int itemId)
        {
            try
            {
                repo.DeleteItemFromRoom(roomId, itemId);
                return StatusCode(201, roomItemResponses.DeleteRoomItem());
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpGet("{roomId}/monsters")]
        public IActionResult GetMonstersForRoom([FromRoute] int roomId)
        {
            try
            {
                var monsters = repo.GetMonstersForRoom(roomId);
                return StatusCode(201, roomMonsterResponses.GetMonstersForGameResponse(monsters));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPost("{roomId}/monsters")]
        public IActionResult AddMonsterToRoom([FromRoute] int roomId, [FromBody] int monsterId)
        {
            try
            {
                repo.AddMonsterToRoom(roomId, monsterId);
                return StatusCode(201, roomMonsterResponses.AddMonsterToRoomResponse());
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpDelete("{roomId}/monsters")]
        public IActionResult DeleteMonsterFromRoom([FromRoute] int roomId, [FromBody] int monsterId)
        {
            try
            {
                repo.DeleteMonsterFromRoom(roomId, monsterId);
                return StatusCode(201, roomMonsterResponses.RemoveMonsterFromRoom());
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpGet("{roomId}/exits")]
        public IActionResult GetExitsForRoom([FromRoute] int roomId)
        {
            try
            {
                var exits = repo.GetExitsForRoom(roomId);
                return StatusCode(201, roomExitResponses.GetRoomExitResponse(exits));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpGet("{roomId}/exits/{exitId}")]
        public IActionResult GetExitForRoom([FromRoute] int roomId, [FromRoute] int exitId)
        {
            try
            {
                if (!repo.DoesRoomContainExit(roomId, exitId))
                {
                    return StatusCode(400, roomExitResponses.RoomDoesNotContainExit());
                }
                else
                {
                    var exit = new List<ExitDto>() {
                    repo.GetRoomExit(exitId)
                };
                    return StatusCode(200, roomExitResponses.GetRoomExitResponse(exit));
                }
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPut("{roomId}/exits/{exitId}")]
        public IActionResult UpdateExitForRoom([FromRoute] int roomId, [FromRoute] int exitId, [FromBody] ExitUpdationDto dto)
        {
            try
            {
                if (!repo.DoesRoomContainExit(roomId, exitId))
                {
                    return StatusCode(400, roomExitResponses.RoomDoesNotContainExit());
                }
                else
                {
                    var updatedRoom = new List<ExitDto>()
                    {
                        repo.UpdateRoomExit(exitId, dto)
                    };
                    return StatusCode(200, roomExitResponses.UpdateExitResponse(updatedRoom));
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpDelete("{roomId}/exits/{exitId}")]
        public IActionResult DeleteExitForRoom([FromRoute] int roomId, [FromRoute] int exitId)
        {
            try
            {
                if (!repo.DoesRoomContainExit(roomId, exitId))
                {
                    return StatusCode(400, roomExitResponses.RoomDoesNotContainExit());
                }
                else
                {
                    repo.DeleteExitForRoom(exitId);
                    var remainingExits = repo.GetExitsForRoom(roomId);
                    return StatusCode(200, roomExitResponses.DeleteExitResponse(remainingExits));
                }
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPost("{roomId}/exits")]
        public IActionResult AddExitToRoom([FromRoute] int roomId, [FromBody] ExitCreationDto dto)
        {
            try
            {
                var isDuplicateRoom = repo.IsDuplicateRoomExit(roomId, dto);

                if (isDuplicateRoom)
                {
                    return StatusCode(400, roomExitResponses.DuplicateExitResponse());
                }

                List<ExitDto> exit = new List<ExitDto>()
                {
                    repo.AddExitToRoom(roomId, dto)
                };
                return StatusCode(201, roomExitResponses.AddExitResponse(exit));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpDelete("{roomId}/exits")]
        public IActionResult DeleteExitFromRoom([FromRoute] int roomId, [FromBody] ExitCreationDto dto)
        {
            try
            {
                repo.DeleteExitFromRoom(roomId, dto);
                return StatusCode(201, roomExitResponses.RemoveExitResponse());
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }
    }
}
