using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class RoomActionOutcomeInfoDto
    {
        public string ActionDescr { get; set; }

        public string ItemDescr { get; set; }

        public string MonsterDescr { get; set; }

        public string NextRoomName { get; set; }
    }
}
