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

        public RoomExitResponse AddExitResponse(List<ExitDto> exit) => new RoomExitResponse
        {
            Status = true,
            StatusText = "Exit added",
            StatusCode = 201,
            Exits = exit
        };

        public Response RemoveExitResponse() => new Response
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Exit removed"
        };

        public Response DuplicateExitResponse => new Response
        {
            Status = false,
            StatusCode = 400,
            StatusText = "You cannot add duplicate exits."
        };

    }
}
