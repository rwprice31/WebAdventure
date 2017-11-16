using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.DbModels;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Room
{
    public class RoomOptionResponses : Response
    {
        public List<ActionOutcomeInfoDto> Options { get; set; }

        public RoomOptionResponses GetRoomOptionSuccess(List<ActionOutcomeInfoDto> options) => new RoomOptionResponses
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Options returned successfully",
            Options = options
        };

        public RoomOptionResponses GetCreateRoomOptionSuccess(ActionOutcomeInfoDto option) => new RoomOptionResponses
        {
            Status = true,
            StatusCode = 204,
            StatusText = "Option created successfully",
            Options = new List<ActionOutcomeInfoDto>
            {
                option
            }
        };

        public RoomOptionResponses DeleteRoomOptionSuccess() => new RoomOptionResponses
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Option deleted successfully"
        };
    }
}
