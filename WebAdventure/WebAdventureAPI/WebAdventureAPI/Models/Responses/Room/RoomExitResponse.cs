using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Room
{
    public class RoomExitResponse : Response
    {
        public List<ExitDto> Exits { get; set; }

        public RoomExitResponse GetRoomExitResponse(List<ExitDto> exits) => new RoomExitResponse
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Exits returned",
            Exits = exits
        };

        public Response AddExitResponse() => new Response
        {
            Status = true,
            StatusText = "Exit added",
            StatusCode = 201
        };

        public Response RemoveExitResponse() => new Response
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Exit removed"
        };
    }
}
