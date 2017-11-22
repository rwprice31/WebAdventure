using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Room
{
    public class RoomMonsterResponses : Response
    {
        public List<MonsterDto> Monsters { get; set; }

        public RoomMonsterResponses GetMonstersForGameResponse(List<MonsterDto> monsters) => new RoomMonsterResponses
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Monsters found",
            Monsters = monsters
        };

        public Response AddMonsterToRoomResponse() => new Response
        {
            Status = true,
            StatusText = "Monster added to room",
            StatusCode = 201
        };

        public Response RemoveMonsterFromRoom() => new Response
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Monster removed from room"
        };
    }
}
