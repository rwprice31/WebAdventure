using System.Collections.Generic;
using System.Threading.Tasks;
using WebAdventureAPI.Models;
using WebAdventureAPI.Models.DbModels;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Repositories
{
    public interface IWARepository
    {
        GameDto AddGameToDb(Game game);

        Room AddRoomToDb(RoomDto room, int gameId);

        Game GetGame(int id);

        Task<WAUser> GetGameAuthor(Game game);

        List<Game> GetAllGames();

        ActionOutcomeInfoDto CreateActionOutcome(int roomId, ActionOutcomeInfoDto dto, int gameId);

        ItemDto CreateItem(ItemDto dto, int gameId);

        void DeleteActionOutcome(ActionOutcomeDeleteDto dto);

        void DeleteGame(int gameId);

        void DeleteItem(int itemId);

        void DeleteRoom(int id);

        Room GetRoomForGame(int gameId, int roomId);

        List<ActionOutcomeInfoDto> GetActionOutcomeByRoom(int id);

        List<Genre> GetAllGenres();

        int GetGameId(Game game);

        List<Game> GetGamesByAuthor(string author);

        Genre GetGenreByDescr(string descr);

        Genre GetGenreById(int id);

        List<ItemType> GetItemTypes();

        List<ItemDto> GetItemsForGame(int gameId);

        List<Room> GetRoomsForGame(int gameId);

        void SaveChanges();

        GameDto UpdateGame(GameDto game, int gameId);

        ItemDto UpdateItem(int itemId, ItemDto dto);

        void UpdateRoom(Room room);

        List<MonsterDto> GetMonstersForGame(int gameId);

        MonsterDto UpdateMonster(MonsterCreationDto dto, int monsterId);

        MonsterDto CreateMonster(MonsterCreationDto dto, int gameId);

        void DeleteMonster(int id);

        PlayerDto GetPlayer(int gameId);

        PlayerDto CreatePlayer(int gameId, PlayerCreationDto dto);

        PlayerDto UpdatePlayer(int id, PlayerCreationDto dto);

        void DeletePlayer(int id);
    }
}