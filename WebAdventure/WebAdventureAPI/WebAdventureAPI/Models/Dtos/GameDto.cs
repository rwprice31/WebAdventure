using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class GameDto
    {
        public string Author { get; set; }

        public string Genre { get; set; }

        public string Name { get; set; }

        public string Descr { get; set; }
    }
}
