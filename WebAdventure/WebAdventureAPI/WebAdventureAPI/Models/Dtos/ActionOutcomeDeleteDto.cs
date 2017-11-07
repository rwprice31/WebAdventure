using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class ActionOutcomeDeleteDto
    {
        public int RoomId { get; set; }

        public int ActionId { get; set; }

        public int OutcomeId { get; set; }
    }
}
