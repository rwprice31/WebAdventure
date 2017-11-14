using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Monster
{
    public class MonsterResponse : Response
    {
        public List<MonsterDto> Monsters { get; set; }

        public MonsterResponse AllMonstersResponse(List<MonsterDto> list) => new MonsterResponse
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Got all monsters",
            Monsters = list
        };

        public MonsterResponse CreateMonsterResponse(MonsterDto monster) => new MonsterResponse
        {
            Status = true,
            StatusText = "Monster Created",
            StatusCode = 201,
            Monsters = new List<MonsterDto>
            {
                monster
            }
        };

        public MonsterResponse UpdateMonsterResponse(MonsterDto monster) => new MonsterResponse
        {
            Status = true,
            StatusText = "Monster Updated",
            StatusCode = 200,
            Monsters = new List<MonsterDto>
            {
                monster
            }
        };

        public MonsterResponse DeleteMonsterResponse() => new MonsterResponse
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Monster Deleted"
        };
    }
}
