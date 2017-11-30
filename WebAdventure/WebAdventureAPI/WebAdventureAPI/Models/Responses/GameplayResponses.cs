using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses
{
    public class GameplayResponses : Response
    {
        public Object ResponseObject { get; set; }

        public GameplayResponses RoomInfoResponse(CompleteRoomInfoDto roomInfo) => new GameplayResponses
        {
            StatusText = "Room information returned",
            Status = true,
            StatusCode = 201,
            ResponseObject = roomInfo
        };

        public GameplayResponses GameInfoResponse(GameDto game) => new GameplayResponses
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Game information returned",
            ResponseObject = game
        };

        public GameplayResponses StartGameResponse(PlayerGameDto player) => new GameplayResponses
        {
            Status = true,
            StatusText = "Game Started",
            StatusCode = 201,
            ResponseObject = player
        };

        public Response UpdatedRoomResponse() => new Response
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Room updated successfully"
        };

        public GameplayResponses GetBackPackResponse(BackPackDto dto) => new GameplayResponses
        {
            Status = true,
            StatusText = "Backpack returned",
            StatusCode = 201,
            ResponseObject = dto
        };
    }
}
