using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class OutcomeDto
    {
        public int MonsterId { get; set; }

        public int ItemId { get; set; }

        public int NextRoomId { get; set; }
    }
}
