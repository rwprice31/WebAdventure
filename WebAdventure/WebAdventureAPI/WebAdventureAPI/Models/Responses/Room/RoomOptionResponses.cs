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
        public List<DbModels.RoomActionOutcomeInfo> Options { get; set; }

        public DbModels.RoomActionOutcomeInfo Option { get; set; }

        public RoomOptionResponses GetRoomOptionSuccess(List<DbModels.RoomActionOutcomeInfo> options) => new RoomOptionResponses
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Options returned successfully",
            Options = options
        };

        public RoomOptionResponses GetCreateRoomOptionSuccess(DbModels.RoomActionOutcomeInfo option) => new RoomOptionResponses
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
