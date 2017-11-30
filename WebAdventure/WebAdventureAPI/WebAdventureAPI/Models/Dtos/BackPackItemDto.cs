using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class BackPackItemDto
    {
        public ItemDto Item { get; set; }

        public bool? IsEquppied { get; set; }
    }
}
