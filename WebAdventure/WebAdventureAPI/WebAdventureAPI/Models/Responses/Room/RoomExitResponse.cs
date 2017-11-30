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
            StatusCode = 200,
            StatusText = "Successfully returned exits!",
            Exits = exits
        };

        public RoomExitResponse AddExitResponse(List<ExitDto> exit) => new RoomExitResponse
        {
            Status = true,
            StatusText = "Exit successfully created!",
            StatusCode = 201,
            Exits = exit
        };

        public RoomExitResponse UpdateExitResponse(List<ExitDto> exit) => new RoomExitResponse
        {
            Status = true,
            StatusText = "Exit successfully updated!",
            StatusCode = 201,
            Exits = exit
        };

        public RoomExitResponse DeleteExitResponse(List<ExitDto> exit) => new RoomExitResponse
        {
            Status = true,
            StatusText = "Exit successfully deleted!",
            StatusCode = 200,
            Exits = exit
        };

        public Response RemoveExitResponse() => new Response
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Exit removed"
        };

        public Response DuplicateExitResponse() => new Response
        {
            Status = false,
            StatusCode = 400,
            StatusText = "You cannot add duplicate exits."
        };

        public Response RoomDoesNotContainExit() => new Response
        {
           Status = false,
           StatusCode = 400,
           StatusText = "Room does not contain exit."
        };

    }
}
