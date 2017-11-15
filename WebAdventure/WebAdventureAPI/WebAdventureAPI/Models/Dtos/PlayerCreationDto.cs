using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class PlayerCreationDto
    {
        public int Health { get; set; }

        public int Speed { get; set; }

        public int Attack { get; set; }
    }
}
