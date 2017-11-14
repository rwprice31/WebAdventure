using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.DbModels
{
    public class ActionOutcomeInfoDto
    {
        public int Id { get; set; }

        public Action Action { get; set; }

        public OutcomeInfoDto Outcome { get; set; }
    }
}
