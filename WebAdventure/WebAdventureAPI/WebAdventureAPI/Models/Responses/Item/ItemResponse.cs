using System.Collections.Generic;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Item
{
    public class ItemResponse : Response
    {
        public List<ItemDto> Items { get; set; }

        public ItemDto Item { get; set; }

        public ItemResponse AllItemsResponse(List<ItemDto> list) => new ItemResponse
        {
            Status = true,
            StatusCode = 200,
            StatusText = "Successfully retrieved items!",
            Items = list
        };

        public ItemResponse SingleItemResponse(ItemDto item) => new ItemResponse
        {
            Status = true,
            StatusCode = 200,
            StatusText = "Successfully retrieved item!",
            Item = item
        };

        public ItemResponse CreateItemResponse(ItemDto item) => new ItemResponse
        {
            Status = true,
            StatusText = "Item successfully created!",
            StatusCode = 201,
            Item = item
        };

        public ItemResponse UpdateItemResponse(ItemDto item) => new ItemResponse
        {
            Status = true,
            StatusText = "Item successfully updated!",
            StatusCode = 200,
            Items = new List<ItemDto>
            {
                item
            }
        };

        public ItemResponse DeleteItemResponse(List<ItemDto> items) => new ItemResponse
        {
            Status = true,
            StatusCode = 200,
            StatusText = "Item successfully deleted!",
            Items = items
        };
    }
}
