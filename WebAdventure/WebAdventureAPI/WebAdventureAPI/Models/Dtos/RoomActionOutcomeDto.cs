using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class RoomActionOutcomeDto
    {
        public int RoomId { get; set; }

        public int ActionId { get; set; }

        public string ActionDescr { get; set; }

        public int OptionId { get; set; }

        public int MonsterId { get; set; }

        public int ItemId { get; set; }

        public int NextRoomId { get; set; }
    }
}
