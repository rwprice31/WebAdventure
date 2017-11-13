using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Item
{
    public class ItemResponse : Response
    {
        public List<ItemInfoDto> Items { get; set; }

        public ItemResponse AllItemsResponse(List<ItemInfoDto> list) => new ItemResponse
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Got all items",
            Items = list
        };

        public ItemResponse CreateItemResponse(ItemInfoDto item) => new ItemResponse
        {
            Status = true,
            StatusText = "Item Created",
            StatusCode = 201,
            Items = new List<ItemInfoDto>
            {
                item
            }
        };

        public ItemResponse UpdateItemResponse(ItemInfoDto item) => new ItemResponse
        {
            Status = true,
            StatusText = "Item Updated",
            StatusCode = 200,
            Items = new List<ItemInfoDto>
            {
                item
            }
        };

        public ItemResponse DeleteItemResponse() => new ItemResponse
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Item Deleted"
        };
    }
}
