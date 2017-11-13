using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.HttpSys;
using WebAdventureAPI.Models.Dtos;
using WebAdventureAPI.Models.Responses;
using WebAdventureAPI.Models.Responses.Item;
using WebAdventureAPI.Repositories;

namespace WebAdventureAPI.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/games/{gameId}/item")]
    public class ItemController : Controller
    {
        private IWARepository repo;
        private ItemResponse response;

        public ItemController(IWARepository repo)
        {
            this.repo = repo;
            this.response = new ItemResponse();
        }

        [HttpGet]
        public IActionResult GetItems([FromRoute] int gameId)
        {
            try
            {
                var items = repo.GetItemsForGame(gameId);
                return StatusCode(201, response.AllItemsResponse(items));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPost]
        public IActionResult CreateItem([FromBody] ItemCreationDto dto, [FromRoute] int gameId)
        {
            try
            {
                var item = repo.CreateItem(dto, gameId);
                return StatusCode(201, response.CreateItemResponse(item));
            }
            catch (Exception)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpPut("{itemId}")]
        public IActionResult UpdateItem([FromRoute] int itemId, [FromBody] UpdateItemDto dto)
        {
            try
            {
                var item = repo.UpdateItem(itemId, dto);
                return StatusCode(200, response.UpdateItemResponse(new ItemInfoDto
                {
                    Id = item.Id,
                    Name = item.Name,
                    Descr = item.Descr
                }));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }

        [HttpDelete("{itemId}")]
        public IActionResult DeleteItem([FromRoute] int itemId)
        {
            try
            {
                repo.DeleteItem(itemId);
                return StatusCode(201, response.DeleteItemResponse());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ErrorResponse.ServerError);
            }
        }
    }
}
