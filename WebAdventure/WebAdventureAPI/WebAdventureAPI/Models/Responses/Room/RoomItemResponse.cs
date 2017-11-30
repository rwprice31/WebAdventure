using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Room
{
    public class RoomItemResponse : Response
    {
        public List<ItemDto> Items { get; set; }

        public RoomItemResponse GetRoomItemResponse(List<ItemDto> items) => new RoomItemResponse
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Items found successfully",
            Items = items
        };

        public Response AddRoomItemResponse() => new Response
        {
            Status = true,
            StatusText = "Item added to room",
            StatusCode = 201
        };

        public RoomItemResponse DeleteRoomItem(List<ItemDto> items) => new RoomItemResponse
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Item successfully deleted!",
            Items = items
        };
    }
}
