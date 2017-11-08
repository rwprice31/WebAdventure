using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class ItemCreationDto
    {
        public string Type { get; set; }

        public string Name { get; set; }

        public string Descr { get; set; }

        public int NumberField1 { get; set; }

        public int NumberField2 { get; set; }
    }
}
