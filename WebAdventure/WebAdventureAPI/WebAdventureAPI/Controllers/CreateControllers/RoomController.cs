﻿using System;
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
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/games/{gameId}/rooms")]
    public class RoomController : Controller
    {
        private IWARepository repo;
        private RoomResponses roomResponses;
        private RoomOptionResponses roomOptionResponses;
        private RoomItemResponse roomItemResponses;
        private RoomMonsterResponses roomMonsterResponses;
        private RoomExitResponse roomExitResponses;

        public RoomController(IWARepository repo)
        {
            this.repo = repo;
            roomResponses = new RoomResponses();
            roomOptionResponses = new RoomOptionResponses();
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
                GameId = gameId
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
                        GameId = x.GameId
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
                    GameId = room.GameId
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
                            GameId = room.GameId
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

        [HttpPost("{roomId}/exits")]
        public IActionResult AddExitToRoom([FromRoute] int roomId, [FromBody] int exitRoomId)
        {
            try
            {
                repo.AddExitToRoom(roomId, exitRoomId);
                return StatusCode(201, roomExitResponses.AddExitResponse());
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPost("{roomId}/exits")]
        public IActionResult DeleteExitFromRoom([FromRoute] int roomId, [FromBody] int exitRoomId)
        {
            try
            {
                repo.DeleteExitFromRoom(roomId, exitRoomId);
                return StatusCode(201, roomExitResponses.RemoveExitResponse());
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

        [HttpPost("{roomId}/options")]
        public IActionResult CreateOptionForRoom([FromRoute] int roomId, [FromBody] ActionOutcomeInfoDto dto, [FromRoute] int gameId)
        {
            try
            {
                var actionOutcome = repo.CreateActionOutcome(roomId, dto, gameId);
                return StatusCode(204, roomOptionResponses.GetCreateRoomOptionSuccess(actionOutcome));
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
