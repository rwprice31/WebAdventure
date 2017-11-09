using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Room
{
    public class RoomResponses : Response
    {
        public DbModels.Room Room { get; set; }

        public List<DbModels.Room> Rooms { get; set; }

        public RoomResponses DeleteRoomResponse() => new RoomResponses
        {
            StatusCode = 201,
            StatusText = "Room deleted",
            Status = true,
            Room = null,
        };

        public RoomResponses GetAllRoomsResponse(List<DbModels.Room> roomList) => new RoomResponses
        {
            StatusText = "All rooms",
            StatusCode = 201,
            Status = true,
            Rooms = roomList
        };

        public RoomResponses CreateResponse(DbModels.Room room) => new RoomResponses
        {
            StatusText = "New room successfully created!",
            StatusCode = 201,
            Status = true,
            Room = room
        };

        public RoomResponses UpdateResponse(DbModels.Room room) => new RoomResponses
        {
            StatusText = "Game successfully updated!",
            StatusCode = 204,
            Status = true,
            Room = room
        };
    }
}
