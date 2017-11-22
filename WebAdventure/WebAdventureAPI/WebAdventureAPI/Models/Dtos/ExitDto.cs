using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class ExitDto
    {
        public int RoomId { get; set; }

        public string Name { get; set; }

        public string Descr { get; set; }

        public string Commands { get; set; }
    }
}
