using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Room
{
    public class RoomOptionResponses : Response
    {
        public List<RoomActionOutcomeInfoDto> Options { get; set; }

        public RoomActionOutcomeDto Option { get; set; }

        public RoomOptionResponses GetRoomOptionSuccess(List<RoomActionOutcomeInfoDto> options) => new RoomOptionResponses
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Options returned successfully",
            Options = options
        };

        public RoomOptionResponses GetCreateRoomOptionSuccess(RoomActionOutcomeDto option) => new RoomOptionResponses
        {
            Status = true,
            StatusCode = 204,
            StatusText = "Option created successfully",
            Option = option
        };

        public RoomOptionResponses DeleteRoomOptionSuccess() => new RoomOptionResponses
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Option deleted successfully"
        };
    }
}
