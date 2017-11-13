using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models;
using WebAdventureAPI.Models.DbModels;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Repositories
{
    public interface IWARepository
    {
        List<Game> GetGamesByAuthor(string author);

        Game GetGame(int id);

        Task<WAUser> GetGameAuthor(Game game);

        List<Game> GetAllGames();

        List<Genre> GetAllGenres();

        Genre GetGenreById(int id);

        void AddGameToDb(Game game);

        void AddRoomToDb(Room room);

        List<Room> GetRoomsForGame(int gameId);

        int GetRoomId(Room room);

        void UpdateRoom(Room room);

        void DeleteRoom(int id);

        Genre GetGenreByDescr(string descr);

        void SaveChanges();

        int GetGameId(Game game);

        void UpdateGame(Game game);

        List<RoomActionOutcomeInfo> GetActionOutcomeByRoom(int id);

        RoomActionOutcomeInfo CreateRoomActionOutcome(int roomId, Models.DbModels.Action action, Outcome outcome);

        void DeleteActionOutcome(ActionOutcomeDeleteDto dto);
    }
}
