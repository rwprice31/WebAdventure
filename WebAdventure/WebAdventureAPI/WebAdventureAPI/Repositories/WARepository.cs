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
                        Descr = g.Descr
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
                GameId = gameId
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
            var actionOutcome = (from ro in context.ActionOutcome
                                 join a in context.Action on ro.ActionId equals a.Id
                                 join o in context.Outcome on ro.OutcomeId equals o.Id
                                 where a.RoomId == id && o.RoomId == id
                                 select ro).ToList();

            foreach (var x in actionOutcome)
            {
                context.ActionOutcome.Remove(x);
                context.Action.Remove((from a in context.Action
                                       where a.Id == x.ActionId
                                       select a).FirstOrDefault());
                context.Outcome.Remove((from o in context.Outcome
                                        where o.Id == x.OutcomeId
                                        select o).FirstOrDefault());
                context.Room.Remove((from r in context.Room
                                     where r.Id == id
                                     select r).FirstOrDefault());
            }
            SaveChanges();
        }

        public ActionOutcomeInfoDto CreateActionOutcome(int roomId, ActionOutcomeInfoDto dto, int gameId)
        {
            context.Action.Add(new Models.DbModels.Action
            {
                Descr = dto.Action.Descr,
                GameId = gameId,
                RoomId = roomId
            });

            context.Outcome.Add(new Outcome
            {
                RoomId = roomId,
                GameId = gameId,
                ItemId = dto.Outcome.ItemId,
                MonsterId = dto.Outcome.MonsterId,
                NextRoomId = dto.Outcome.NextRoomId
            });

            SaveChanges();

            var action = (from a in context.Action
                          where a.Descr == dto.Action.Descr && a.RoomId == roomId
                          select a).FirstOrDefault();

            var outcome = (from o in context.Outcome
                           where o.RoomId == roomId && o.MonsterId == dto.Outcome.MonsterId && o.ItemId == dto.Outcome.ItemId && o.NextRoomId == dto.Outcome.NextRoomId
                           select o).FirstOrDefault();

            context.ActionOutcome.Add(new ActionOutcome
            {
                ActionId = action.Id,
                OutcomeId = outcome.Id
            });

            SaveChanges();
            return new ActionOutcomeInfoDto
            {
                Id = (from ao in context.ActionOutcome
                      where ao.ActionId == action.Id && ao.OutcomeId == outcome.Id
                      select ao.Id).FirstOrDefault(),
                Action = action,
                Outcome = new OutcomeInfoDto
                {
                    Id = outcome.Id,
                    MonsterId = outcome.MonsterId,
                    MonsterName = (from m in context.Monster
                                   where m.Id == outcome.MonsterId
                                   select m.Name).FirstOrDefault(),
                    ItemId = outcome.ItemId,
                    ItemName = (from i in context.Item
                                where i.Id == outcome.ItemId
                                select i.Name).FirstOrDefault(),
                    NextRoomId = outcome.NextRoomId,
                    NextRoomName = (from r in context.Room
                                    where r.Id == outcome.NextRoomId
                                    select r.Name).FirstOrDefault()
                }
            };
        }

        public List<ActionOutcomeInfoDto> GetActionOutcomeByRoom(int id)
        {
            return (from ao in context.ActionOutcome
                    join a in context.Action on ao.ActionId equals a.Id
                    join o in context.Outcome on ao.OutcomeId equals o.Id
                    join i in context.Item on o.ItemId equals i.Id
                    join m in context.Monster on o.MonsterId equals m.Id
                    join nr in context.Room on o.NextRoomId equals nr.Id
                    where a.RoomId == id && o.RoomId == id
                    select new ActionOutcomeInfoDto
                    {
                        Id = ao.Id,
                        Action = a,
                        Outcome = new OutcomeInfoDto
                        {
                            Id = o.Id,
                            MonsterId = m.Id,
                            MonsterName = m.Name,
                            ItemId = i.Id,
                            ItemName = i.Name,
                            NextRoomId = nr.Id,
                            NextRoomName = nr.Name
                        }
                    }).ToList();
        }

        public void DeleteActionOutcome(ActionOutcomeDeleteDto dto)
        {
            var actionOutcome = (from ao in context.ActionOutcome
                                 where ao.ActionId == dto.ActionId && ao.OutcomeId == dto.OutcomeId
                                 select ao).FirstOrDefault();

            context.ActionOutcome.Remove(actionOutcome);
            SaveChanges();

            context.Action.Remove((from a in context.Action
                                   where a.Id == actionOutcome.ActionId
                                   select a).FirstOrDefault());

            context.Outcome.Remove((from o in context.Outcome
                                    where o.Id == actionOutcome.OutcomeId
                                    select o).FirstOrDefault());

            SaveChanges();
        }

        private Outcome GetOutcome(Outcome outcome, int gameId)
        {
            return (from o in context.Outcome
                    where o.ItemId == outcome.ItemId || o.MonsterId == outcome.MonsterId || o.NextRoomId == outcome.NextRoomId && o.GameId == gameId
                    select o).FirstOrDefault();
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

            return (from p in context.Player
                    where p.GameId == gameId
                    select new PlayerDto
                    {
                        Id = p.Id,
                        Health = p.Health,
                        Attack = p.Attack,
                        Speed = p.Speed
                    }).FirstOrDefault();
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
    }
}
