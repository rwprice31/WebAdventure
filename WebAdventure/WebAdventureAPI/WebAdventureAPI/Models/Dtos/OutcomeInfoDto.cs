using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class OutcomeInfoDto
    {
        public int Id { get; set; }

        public int MonsterId { get; set; }

        public string MonsterName { get; set; }

        public int ItemId { get; set; }

        public string ItemName { get; set; }

        public int NextRoomId { get; set; }

        public string NextRoomName { get; set; }
    }
}
