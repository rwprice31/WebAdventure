using System.Collections.Generic;
using System.Linq;
using WebAdventureAPI.Models;

namespace WebAdventureAPI.Contexts
{
    public static class WAContextExtensions
    {
        public static void EnsureSeedDataForContext(this WAContext context)
        {

            if (!context.Genre.Any())
            {
                var genres = SeedDataForGenres();
                context.Genre.AddRange(genres);
            }

            context.SaveChanges();

        }

        private static List<Genre> SeedDataForGenres()
        {
            return new List<Genre>()
            {
                new Genre
                {
                    Descr = "Action" 
                },
                new Genre
                {
                    Descr = "Horror"
                },
                new Genre
                {
                    Descr = "Mystery"
                },
                new Genre
                {
                    Descr = "Comedy"
                }
            };
        }

    }
}