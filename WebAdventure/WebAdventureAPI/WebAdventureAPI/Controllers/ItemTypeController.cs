using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAdventureAPI.Models;
using WebAdventureAPI.Models.DbModels;
using WebAdventureAPI.Models.Dtos;
using WebAdventureAPI.Models.Responses;
using WebAdventureAPI.Models.Responses.Genres;
using WebAdventureAPI.Models.Responses.Item;
using WebAdventureAPI.Repositories;

namespace WebAdventureAPI.Controllers
{
    [Route("api/itemtypes")]
    public class ItemTypeController : Controller
    {

        private IWARepository repo;
        private ItemTypeResponse response;

        public ItemTypeController(IWARepository repo)
        {
            this.repo = repo;
            response = new ItemTypeResponse();
        }

        [HttpGet]
        public IActionResult GetItemTypes()
        {
            List<ItemType> itemTypes = repo.GetItemTypes();
            if (itemTypes != null)
            {
                List<ItemTypeDto> itemTypesDto = new List<ItemTypeDto>();
                foreach (ItemType i in itemTypes)
                {
                    itemTypesDto.Add(
                        new ItemTypeDto
                        {
                            Type = i.Type
                        });
                }
                return StatusCode(200, response.AllItemTypeResponse(itemTypesDto));
            }
            else
            {
                Response errorResponse = new Response
                {
                    StatusText = "A server error has occured.",
                    StatusCode = 500,
                    Status = false,
                };
                return StatusCode(500, errorResponse);
            }
        }

    }
}
