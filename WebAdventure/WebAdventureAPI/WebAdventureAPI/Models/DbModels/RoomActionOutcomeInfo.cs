using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.DbModels
{
    public class RoomActionOutcomeInfo
    {
        public int ActionId { get; set; }

        public string ActionDescr { get; set; }

        public int ItemId { get; set; }

        public string ItemDescr { get; set; }

        public int MonsterId { get; set; }

        public string MonsterDescr { get; set; }

        public int NextRoomId { get; set; }

        public string NextRoomName { get; set; }
    }
}
