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
        public RoomDto Room { get; set; }

        public List<RoomDto> Rooms { get; set; }

        public RoomResponses DeleteRoomResponse(List<RoomDto> roomList) => new RoomResponses
        {
            StatusCode = 201,
            StatusText = "Room successfully deleted!",
            Status = true,
            Rooms = roomList,
        };

        public RoomResponses GetAllRoomsResponse(List<RoomDto> roomList) => new RoomResponses
        {
            StatusText = "All room's successfully returned!",
            StatusCode = 200,
            Status = true,
            Rooms = roomList
        };

        public RoomResponses GetRoomResponse(RoomDto room) => new RoomResponses
        {
            StatusText = "Room successfully found!",
            StatusCode = 200,
            Status = true,
            Room = room
        };

        public RoomResponses CreateResponse(RoomDto room) => new RoomResponses
        {
            StatusText = "New room successfully created!",
            StatusCode = 201,
            Status = true,
            Room = room
        };

        public RoomResponses UpdateResponse(RoomDto room) => new RoomResponses
        {
            StatusText = "Room successfully updated!",
            StatusCode = 200,
            Status = true,
            Room = room
        };
    }
}
