using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAdventureAPI.Models;
using WebAdventureAPI.Models.Dtos;
using WebAdventureAPI.Models.Responses;
using WebAdventureAPI.Models.Responses.Genres;
using WebAdventureAPI.Repositories;

namespace WebAdventureAPI.Controllers
{
    [Route("api/genres")]
    public class GenreController : Controller
    {

        private IWARepository repo;

        public GenreController(IWARepository repo)
        {
            this.repo = repo;
        }

        [HttpGet]
        public IActionResult GetGenres()
        {
            List<Genre> genres = repo.GetAllGenres();
            if (genres != null)
            {
                List<GenreDto> genresDto = new List<GenreDto>();
                foreach (Genre g in genres)
                {
                    genresDto.Add(
                        new GenreDto
                        {
                            Name = g.Descr
                        }
                    );
                }
                GenresResponse successResponse = new GenresResponse
                {
                    StatusText = "Genres returned successfully!",
                    StatusCode = 200,
                    Status = true,
                    Genres = genresDto
                };
                return StatusCode(200, successResponse);
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
