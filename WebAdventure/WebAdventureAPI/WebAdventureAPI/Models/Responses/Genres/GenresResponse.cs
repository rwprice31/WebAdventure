using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Genres
{
    public class GenresResponse : Response
    {
        public List<GenreDto> Genres { get; set; }
    }
}
