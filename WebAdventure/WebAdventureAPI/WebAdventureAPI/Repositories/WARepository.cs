using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Contexts;
using WebAdventureAPI.Models;
using WebAdventureAPI.Models.DbModels;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Repositories
{
    public class WARepository : IWARepository
    {
        private WAContext context;
        private UserManager<WAUser> userManager;

        public WARepository(WAContext context,
            UserManager<WAUser> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        public GameDto AddGameToDb(Game game)
        {
            context.Game.Add(game);
            SaveChanges();
            return (from g in context.Game
                    join u in context.Users on g.AuthorId equals u.Id
                    where g.AuthorId == game.AuthorId && g.Descr == game.Descr && g.GenreId == game.GenreId && g.Name == game.Name
                    select new GameDto
                    {
                        Id = g.Id,
                        Author = new UserDto
                        {
                            Id = u.Id,
                            Email = u.Email,
                            Username = u.UserName
                        },
                        Genre = (from ge in context.Genre
                                 where ge.Id == g.GenreId
                                 select ge.Descr).FirstOrDefault(),
                        Name = g.Name,
                        Descr = g.Descr,
                        IsPublic = g.IsPublic
                    }).FirstOrDefault();
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

        public GameDto UpdateGame(GameDto game, int gameId)
        {
            var old = (from g in context.Game
                       where g.Id == gameId
                       select g).FirstOrDefault();

            old.Descr = game.Descr;
            old.GenreId = GetGenreByDescr(game.Genre).Id;
            old.Name = game.Name;
            old.IsPublic = game.IsPublic;

            SaveChanges();

            game.Id = gameId;
            return game;
        }

        public Room AddRoomToDb(RoomDto room, int gameId)
        {
            var newRoom = new Room
            {
                Name = room.Name,
                Descr = room.Descr,
                GameId = gameId,
                IsStarting = room.IsStarting
            };

            context.Room.Add(newRoom);
            SaveChanges();

            return (from r in context.Room
                    where r.Descr == room.Descr && r.Name == room.Name && r.GameId == gameId
                    select r).FirstOrDefault();
        }

        public void UpdateRoom(Room room)
        {
            var old = (from r in context.Room
                       where r.Id == room.Id
                       select r).FirstOrDefault();

            old.Descr = room.Descr;
            old.GameId = room.GameId;
            old.Name = room.Name;

            SaveChanges();
        }

        public List<Room> GetRoomsForGame(int gameId)
        {
            return (from r in context.Room
                    where r.GameId == gameId
                    select r).ToList();
        }

        public Room GetRoomForGame(int gameId, int roomId)
        {
            return (from r in context.Room
                    where r.GameId == gameId && r.Id == roomId
                    select r).FirstOrDefault();
        }

        public void DeleteRoom(int id)
        {
            var room = context.Room.Where(r => r.Id == id).First();
            context.Room.Remove(room);
            SaveChanges();
        }

        public Game GetGame(int gameId)
        {
            var game = (from g in context.Game
                       where g.Id == gameId
                       select g).FirstOrDefault();
            return game;
        }

        public async Task<WAUser> GetGameAuthor(Game game)
        {
            return await userManager.FindByIdAsync(game.AuthorId);
        }
        
        private string GetMonsterName(int id)
        {
            return (from m in context.Monster
                    where m.Id == id
                    select m.Name).FirstOrDefault();
        }

        private string GetRoomName(int id)
        {
            return (from r in context.Room
                    where r.Id == id
                    select r.Name).FirstOrDefault();
        }

        private string GetItemName(int id)
        {
            return (from i in context.Item
                    where i.Id == id
                    select i.Descr).FirstOrDefault();
        }

        public List<ItemDto> GetItemsForGame(int gameId)
        {
            var items = (from i in context.Item
                         where i.GameId == gameId
                         select i).ToList();

            var itemInfoList = new List<ItemDto>();
            foreach (var x in items)
            {
                itemInfoList.Add(new ItemDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Descr = x.Descr,
                    Points = x.Points,
                    Type = new ItemTypeDto
                    {
                        Type = (from it in context.ItemType
                                where it.Id == x.ItemTypeId
                                select it.Type).FirstOrDefault()
                    } 
                });
            }

            return itemInfoList;
        }

        public ItemDto GetItemForGame(int itemId)
        {
            var item = context.Item.Where(i => i.Id == itemId).First();
            return new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Descr = item.Descr,
                Points = item.Points,
                Type = new ItemTypeDto
                {
                    Type = context.ItemType.Where(it => item.ItemTypeId == it.Id).First().Type
                }
            };
        }

        public ItemDto CreateItem(ItemDto dto, int gameId)
        {
            var itemTypeId = context.ItemType.Where(i => i.Type.ToLower().Equals(dto.Type.Type.ToLower())).FirstOrDefault().Id;
            context.Item.Add(new Item
            {
                Name = dto.Name,
                Descr = dto.Descr,
                GameId = gameId,
                Points = dto.Points,
                ItemTypeId = itemTypeId
            });
            SaveChanges();

            return new ItemDto
            {
                Id = (from i in context.Item
                      where i.Name == dto.Name && i.GameId == gameId && i.Descr == dto.Descr && i.Points == dto.Points
                      select i.Id).FirstOrDefault(),
                Name = dto.Name,
                Descr = dto.Descr,
                Points = dto.Points,
                Type = dto.Type
            };
        }

        public ItemDto UpdateItem(int itemId, ItemDto dto)
        {
            var oldItem = (from i in context.Item
                           where i.Id == itemId
                           select i).FirstOrDefault();

            oldItem.Name = dto.Name;
            oldItem.Descr = dto.Descr;
            oldItem.Points = dto.Points;
            oldItem.ItemTypeId = (from it in context.ItemType
                                where it.Type == dto.Type.Type
                                select it.Id).FirstOrDefault();

            SaveChanges();

            return new ItemDto
            {
                Id = itemId,
                Name = dto.Name,
                Descr = dto.Descr,
                Points = dto.Points,
                Type = dto.Type
            };
        }

        public void DeleteItem(int itemId)
        {
            var item = (from i in context.Item
                        where i.Id == itemId
                        select i).FirstOrDefault();

            context.Item.Remove(item);
            context.SaveChanges();
        }

        public List<MonsterDto> GetMonstersForGame(int gameId)
        {
            return (from m in context.Monster
                    where m.GameId == gameId
                    select new MonsterDto
                    {
                        Id = m.Id,
                        Name = m.Name,
                        Descr = m.Descr,
                        Health = m.Health,
                        MaxDamage = m.MaxDamage,
                        MinDamage = m.MinDamage,
                        Speed = m.Speed,
                        AttackDescr = m.AttackDescr
                    }).ToList();
        }

        public MonsterDto UpdateMonster(MonsterCreationDto dto, int monsterId)
        {
            var monster = (from m in context.Monster
                           where m.Id == monsterId
                           select m).FirstOrDefault();

            monster.Name = dto.Name;
            monster.Descr = dto.Descr;
            monster.Health = dto.Health;
            monster.MaxDamage = dto.MaxDamage;
            monster.MinDamage = dto.MinDamage;
            monster.Speed = dto.Speed;
            monster.AttackDescr = dto.AttackDescr;

            SaveChanges();

            return new MonsterDto
            {
                Id = monsterId,
                Name = dto.Name,
                Descr = dto.Descr,
                Health = dto.Health,
                MaxDamage = dto.MaxDamage,
                MinDamage = dto.MinDamage,
                AttackDescr = dto.AttackDescr,
                Speed = dto.Speed
            };
        }

        public MonsterDto CreateMonster(MonsterCreationDto dto, int gameId)
        {
            context.Monster.Add(new Monster
            {
                Name = dto.Name,
                Descr = dto.Descr,
                Health = dto.Health,
                AttackDescr = dto.AttackDescr,
                MaxDamage = dto.MaxDamage,
                MinDamage = dto.MinDamage,
                GameId = gameId,
                Speed = dto.Speed
            });

            SaveChanges();

            return (from m in context.Monster
                    where m.GameId == gameId && m.Name == dto.Name && m.Descr == dto.Descr && m.Health == dto.Health && m.AttackDescr == dto.AttackDescr
                    select new MonsterDto
                    {
                        Id = m.Id,
                        Name = m.Name,
                        Descr = m.Descr,
                        Health = m.Health,
                        AttackDescr = m.AttackDescr,
                        MaxDamage = m.MaxDamage,
                        MinDamage = m.MinDamage,
                        Speed = m.Speed
                    }).FirstOrDefault();
        }

        public void DeleteMonster(int id)
        {
            var monster = (from m in context.Monster
                           where m.Id == id
                           select m).FirstOrDefault();

            context.Monster.Remove(monster);
            SaveChanges();
        }

        public PlayerDto GetPlayer(int gameId)
        {
            return (from p in context.Player
                    where p.GameId == gameId
                    select new PlayerDto
                    {
                        Id = p.Id,
                        Attack = p.Attack,
                        Speed = p.Speed,
                        Health = p.Health
                    }).FirstOrDefault();
        }

        public PlayerDto CreatePlayer(int gameId, PlayerCreationDto dto)
        {
            context.Player.Add(new Player
            {
                GameId = gameId,
                Attack = dto.Attack,
                Health = dto.Health,
                Speed = dto.Speed
            });

            SaveChanges();

            var player = context.Player.Where(p => p.GameId == gameId).First();
            var playerDto = new PlayerDto
            {
                Id = player.Id,
                Attack = player.Attack,
                Health = player.Health,
                Speed = player.Speed
            };
            return playerDto;
        }

        public PlayerDto UpdatePlayer(int id, PlayerCreationDto dto)
        {
            var player = (from p in context.Player
                          where p.Id == id
                          select p).FirstOrDefault();

            player.Attack = dto.Attack;
            player.Health = dto.Health;
            player.Speed = dto.Speed;

            SaveChanges();

            return new PlayerDto
            {
                Id = id,
                Attack = dto.Attack,
                Health = dto.Health,
                Speed = dto.Speed
            };
        }

        public void DeletePlayer(int id)
        {
            var player = (from p in context.Player
                          where p.Id == id
                          select p).FirstOrDefault();

            context.Player.Remove(player);
            SaveChanges();
        }

        public void DeleteGame(int gameId)
        {
            var game = (from g in context.Game
                        where g.Id == gameId
                        select g).FirstOrDefault();

            context.Game.Remove(game);
            SaveChanges();
        }

        public List<ItemType> GetItemTypes()
        {
            var itemTypes = (from i in context.ItemType
                             select i).ToList();
            return itemTypes;
        }

        public List<ItemDto> GetItemsForRoom(int roomId)
        {
            return (from ri in context.RoomItem
                    join i in context.Item on ri.ItemId equals i.Id
                    where ri.RoomId == roomId
                    select new ItemDto
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Descr = i.Descr,
                        Points = i.Points,
                        Type = (from it in context.ItemType
                                where it.Id == i.ItemTypeId
                                select new ItemTypeDto
                                {
                                    Type = it.Type
                                }).FirstOrDefault()
                    }).ToList();
        }

        public void AddItemToRoom(int roomId, int itemId)
        {
            context.RoomItem.Add(new RoomItem
            {
                ItemId = itemId,
                RoomId = roomId
            });
            context.SaveChanges();
        }

        public void DeleteItemFromRoom(int roomId, int itemId)
        {
            context.RoomItem.Remove(new RoomItem
            {
                RoomId = roomId,
                ItemId = itemId
            });
            context.SaveChanges();
        }

        public List<MonsterDto> GetMonstersForRoom(int roomId)
        {
            return (from rm in context.RoomMonster
                    join m in context.Monster on rm.MonsterId equals m.Id
                    where rm.RoomId == roomId
                    select new MonsterDto
                    {
                        Id = m.Id,
                        Name = m.Name,
                        Descr = m.Descr,
                        MaxDamage = m.MaxDamage,
                        MinDamage = m.MinDamage,
                        AttackDescr = m.AttackDescr,
                        Health = m.Health,
                        Speed = m.Speed
                    }).ToList();
        }

        public void AddMonsterToRoom(int roomId, int monsterId)
        {
            context.RoomMonster.Add(new RoomMonster
            {
                RoomId = roomId,
                MonsterId = monsterId
            });
            SaveChanges();
        }

        public void DeleteMonsterFromRoom(int roomId, int monsterId)
        {
            context.RoomMonster.Remove(new RoomMonster
            {
                RoomId = roomId,
                MonsterId = monsterId
            });
            SaveChanges();
        }

        public List<ExitDto> GetExitsForRoom(int roomId)
        {
            return (from e in context.Exits
                    join r in context.Room on e.NextRoomId equals r.Id
                    where e.CurrentRoomId == roomId
                    select new ExitDto
                    {
                        NextRoomId = e.NextRoomId,
                        Name = r.Name,
                        Descr = e.Descr,
                        Commands = e.Commands
                    }).ToList();
        }

        public void AddExitToRoom(int roomId, ExitCreationDto dto)
        {
            context.Exits.Add(new Exits
            {
                CurrentRoomId = roomId,
                NextRoomId = dto.NextRoomId,
                Descr = dto.Descr,
                Commands = dto.Commands

            });
            SaveChanges();
        }

        public void DeleteExitFromRoom(int roomId, ExitCreationDto dto)
        {
            context.Exits.Remove(new Exits
            {
                CurrentRoomId = roomId,
                NextRoomId = dto.NextRoomId,
                Commands = dto.Commands,
                Descr = dto.Descr
            });
            SaveChanges();
        }

        public CompleteRoomInfoDto GetInformationForRoom(int roomId)
        {
            var room = (from r in context.Room
                        where r.Id == roomId
                        select new RoomDto
                        {
                            Id = roomId,
                            Name = r.Name,
                            GameId = r.GameId,
                            Descr = r.Descr,
                            IsStarting = r.IsStarting
                        }).FirstOrDefault();

            var monster = (from rm in context.RoomMonster
                           join m in context.Monster on rm.MonsterId equals m.Id
                           where rm.RoomId == room.Id
                           select new MonsterDto
                           {
                               Id = m.Id,
                               Name = m.Name,
                               Descr = m.Descr,
                               MaxDamage = m.MaxDamage,
                               MinDamage = m.MinDamage,
                               Health = m.Health,
                               AttackDescr = m.AttackDescr,
                               Speed = m.Speed
                           }).FirstOrDefault();

            var item = (from ri in context.RoomItem
                        join i in context.Item on ri.ItemId equals i.Id
                        where ri.RoomId == room.Id
                        select new ItemDto
                        {
                            Id = i.Id,
                            Name = i.Name,
                            Descr = i.Descr,
                            Points = i.Points,
                            Type = (from it in context.ItemType
                                    where it.Id == i.ItemTypeId
                                    select new ItemTypeDto
                                    {
                                        Type = it.Type
                                    }).FirstOrDefault()
                        }).FirstOrDefault();

            var exits = (from e in context.Exits
                         join r in context.Room on e.CurrentRoomId equals r.Id
                         where e.CurrentRoomId == room.Id
                         select new ExitDto
                         {
                             NextRoomId = e.NextRoomId,
                             Name = r.Name,
                             Descr = e.Descr,
                             Commands = e.Commands
                         }).ToList();

            return new CompleteRoomInfoDto
            {
                Room = room,
                Exits = exits,
                Item = item,
                Monster = monster
            };
        }

        public GameDto GetGameInformation(int gameId)
        {
            return (from g in context.Game
                    where g.Id == gameId
                    select new GameDto
                    {
                        Id = g.Id,
                        Name = g.Name,
                        Descr = g.Descr,
                        Genre = (from ge in context.Genre
                                 where ge.Id == g.GenreId
                                 select ge.Descr).FirstOrDefault(),
                        Author = (from a in context.Users
                                  where a.Id == g.AuthorId
                                  select new UserDto
                                  {
                                      Username = a.UserName
                                  }).FirstOrDefault(),
                        IsPublic = g.IsPublic
                    }).FirstOrDefault();
        }

        public PlayerGameDto InitializePlayerGame(int gameId, UserDto user)
        {
            var player = (from p in context.Player
                          where p.GameId == gameId
                          select p).FirstOrDefault();

            var room = (from r in context.Room
                        where r.Id == 22
                        select r).FirstOrDefault();
            Console.WriteLine(room);

            context.PlayerGame.Add(new PlayerGame
            {
                PlayerId = player.Id,
                Health = player.Health,
                RoomId = (from r in context.Room
                          where r.GameId == gameId && r.IsStarting
                          select r.Id).FirstOrDefault(),
                UserId = user.Id,
                GameId = gameId
            });

            SaveChanges();

            var playerGame = (from pg in context.PlayerGame
                              where pg.UserId == user.Id && pg.GameId == gameId
                              select pg).LastOrDefault();

            context.Backpack.Add(new Backpack
            {
                PlayerGameId = playerGame.Id,
                Equipped = null,
                ItemId = null
            });

            SaveChanges();

            return new PlayerGameDto
            {
                Id = playerGame.Id,
                Health = playerGame.Health,
                PlayerId = playerGame.PlayerId,
                RoomId = playerGame.RoomId
            };
        }

        public void UpdatePlayerRoom(int roomId, int gamePlayId)
        {
            var gamePlay = (from gp in context.PlayerGame
                            where gp.Id == gamePlayId
                            select gp).FirstOrDefault();

            gamePlay.RoomId = roomId;
            SaveChanges();
        }
    }
}
