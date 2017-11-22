using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Item
{
    public class ItemTypeResponse : Response
    {
        public List<ItemTypeDto> ItemTypes { get; set; }

        public ItemTypeResponse AllItemTypeResponse(List<ItemTypeDto> list)
        {
            return new ItemTypeResponse
            {
                Status = true,
                StatusCode = 200,
                StatusText = "Successfully retrieved all item types!",
                ItemTypes = list
            };
        }

    }
}
