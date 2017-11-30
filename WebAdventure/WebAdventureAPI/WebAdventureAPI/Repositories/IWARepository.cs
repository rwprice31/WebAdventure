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

        ItemDto CreateItem(ItemDto dto, int gameId);

        void DeleteGame(int gameId);

        void DeleteItem(int itemId);

        void DeleteRoom(int id);

        Room GetRoomForGame(int gameId, int roomId);

        List<Genre> GetAllGenres();

        int GetGameId(Game game);

        List<Game> GetGamesByAuthor(string author);

        Genre GetGenreByDescr(string descr);

        Genre GetGenreById(int id);

        List<ItemType> GetItemTypes();

        List<ItemDto> GetItemsForGame(int gameId);

        ItemDto GetItemForGame(int itemId);

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

        List<ItemDto> GetItemsForRoom(int roomId);

        void AddItemToRoom(int roomId, int itemId);

        void DeleteItemFromRoom(int roomId, int itemId);

        List<MonsterDto> GetMonstersForRoom(int roomId);

        void AddMonsterToRoom(int roomId, int monsterId);

        void DeleteMonsterFromRoom(int roomId, int monsterId);

        List<ExitDto> GetExitsForRoom(int roomId);

        bool DoesRoomContainExit(int roomId, int exitId);

        ExitDto GetRoomExit(int exitId);

        ExitDto UpdateRoomExit(int exitId, ExitUpdationDto dto);

        void DeleteExitForRoom(int exitId);

        ExitDto AddExitToRoom(int roomId, ExitCreationDto dto);

        bool IsDuplicateRoomExit(int roomId, ExitCreationDto dto);

        void DeleteExitFromRoom(int roomId, ExitCreationDto dto);

        CompleteRoomInfoDto GetInformationForRoom(int roomId);

        GameDto GetGameInformation(int gameId);

        PlayerGameDto InitializePlayerGame(int gameId, UserDto user);

        void UpdatePlayerRoom(int roomId, int gamePlayId);
    }
}