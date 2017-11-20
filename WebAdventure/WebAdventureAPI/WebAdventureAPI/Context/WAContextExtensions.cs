using System.Collections.Generic;
using System.Linq;
using WebAdventureAPI.Models;
using WebAdventureAPI.Models.DbModels;

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

            if (!context.ItemType.Any())
            {
                var itemTypes = SeedDataForItemTypes();
                context.ItemType.AddRange(itemTypes);
            }

            context.SaveChanges();

        }

        private static List<ItemType> SeedDataForItemTypes()
        {
            return new List<ItemType>()
            {
                new ItemType
                {
                    Type = "Health"
                },
                new ItemType
                {
                    Type = "Defense"
                },
                new ItemType
                {
                    Type="Weapon"
                }
            };
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