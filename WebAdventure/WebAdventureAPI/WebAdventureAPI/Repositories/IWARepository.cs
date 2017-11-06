using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models;

namespace WebAdventureAPI.Repositories
{
    public interface IWARepository
    {
        List<Game> GetGamesByAuthor(string author);

        List<Game> GetAllGames();

        List<Genre> GetAllGenres();

        Genre GetGenreById(int id);

        void AddGameToDb(Game game);

        Genre GetGenreByDescr(string descr);

        void SaveChanges();

        int GetGameId(Game game);

        void UpdateGame(Game game);
    }
}
