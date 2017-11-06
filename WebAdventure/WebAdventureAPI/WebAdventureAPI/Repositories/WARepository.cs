using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models;

namespace WebAdventureAPI.Repositories
{
    public class WARepository : IWARepository
    {
        private WAContext context;

        public WARepository(WAContext context)
        {
            this.context = context;
        }

        public void AddGameToDb(Game game)
        {
            context.Game.Add(game);
            SaveChanges();
        }

        public List<Game> GetAllGames()
        {
            return (from game in context.Game
                    select game).ToList();
        }

        public List<Genre> GetAllGenres()
        {
            return (from genre in context.Genre
                    select genre).ToList();
        }

        public List<Game> GetGamesByAuthor(string author)
        {
            return (from game in context.Game
                    where game.AuthorId == author
                    select game).ToList();
        }

        public Genre GetGenreById(int id)
        {
            return (from genre in context.Genre
                    where genre.Id == id
                    select genre).FirstOrDefault();
        }

        public Genre GetGenreByDescr(string descr)
        {
            return (from genre in context.Genre
                    where genre.Descr == descr
                    select genre).FirstOrDefault();
        }

        public void SaveChanges()
        {
            context.SaveChanges();
        }

        public int GetGameId(Game game)
        {
            return (from g in context.Game
                    where g.AuthorId == game.AuthorId && g.Descr == game.Descr && g.GenreId == game.GenreId && g.Name == game.Name
                    select g).FirstOrDefault().Id;
        }

        public void UpdateGame(Game game)
        {
            var old = (from g in context.Game
                       where g.Id == game.Id
                       select g).FirstOrDefault();

            old.Descr = game.Descr;
            old.GenreId = game.GenreId;
            old.Name = game.Name;

            SaveChanges();
        }
    }
}
