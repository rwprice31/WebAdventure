using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class PlayerDto
    {
        public int Id { get; set; }

        public int Health { get; set; }

        public int Speed { get; set; }

        public int Attack { get; set; }
    }
}
