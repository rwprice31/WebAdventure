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

        public WARepository(WAContext context)
        {
            this.context = context;
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

        public List<ItemInfoDto> GetItemsForGame(int gameId)
        {
            return (from i in context.Item
                    join h in context.Health on i.Id equals h.Id
                    join w in context.Weapon on i.Id equals w.Id
                    join d in context.Defense on i.Id equals d.Id
                    where i.GameId == gameId
                    select new ItemInfoDto
                    {
                        ItemId = i.Id,
                        Name = i.Name,
                        Descr = i.Descr,
                        HealthId = h.Id,
                        HealthPoints = h.HealthPoints,
                        WeaponId = w.Id,
                        MaxDamage = w.MaxDamage,
                        MinDamage = w.MinDamage,
                        DefenseId = d.Id,
                        DefensePoints = d.DefensePoints
                    }).ToList();
        }

        public ItemInfoDto CreateItem(ItemCreationDto dto, int gameId)
        {
            context.Item.Add(new Item
            {
                Name = dto.Name,
                Descr = dto.Descr,
                GameId = gameId
            });
            SaveChanges();

            var newItem = (from i in context.Item
                           where i.Descr == dto.Descr
                           select i).FirstOrDefault();

            SaveChanges();

            if (dto.Type.Equals("Weapon"))
            {
                context.Weapon.Add(new Weapon
                {
                    ItemId = newItem.Id,
                    MaxDamage = dto.NumberField1,
                    MinDamage = dto.NumberField2
                });
            }
            else if (dto.Type.Equals("Defense"))
            {
                context.Defense.Add(new Defense
                {
                    ItemId = newItem.Id,
                    DefensePoints = dto.NumberField1
                });
            }
            else
            {
                context.Health.Add(new Health
                {
                    ItemId = newItem.Id,
                    HealthPoints = dto.NumberField1
                });
            }
            SaveChanges();

            return (from i in context.Item
                    join w in context.Weapon on i.Id equals w.ItemId
                    join h in context.Health on i.Id equals h.ItemId
                    join d in context.Defense on i.Id equals d.ItemId
                    where i.Id == newItem.Id
                    select new ItemInfoDto
                    {
                        ItemId = i.Id,
                        Name = i.Name,
                        Descr = i.Descr,
                        WeaponId = w.Id,
                        MaxDamage = w.MaxDamage,
                        MinDamage = w.MinDamage,
                        HealthId = h.Id,
                        HealthPoints = h.HealthPoints,
                        DefenseId = d.Id,
                        DefensePoints = d.DefensePoints
                    }).FirstOrDefault();
        }

        public Item UpdateItem(int itemId, UpdateItemDto dto)
        {
            var item = new Item();
            if (dto.Type.Equals("Weapon"))
            {
                var weapon = (from w in context.Weapon
                              where w.Id == itemId
                              select w).FirstOrDefault();
                weapon.MaxDamage = dto.NumberField1;
                weapon.MinDamage = dto.NumberField2;

                item = (from i in context.Item
                        where i.Id == weapon.ItemId
                        select i).FirstOrDefault();
                item.Name = dto.Name;
                item.Descr = dto.Descr;
            }
            else if (dto.Type.Equals("Health"))
            {
                var health = (from h in context.Health
                              where h.Id == itemId
                              select h).FirstOrDefault();
                health.HealthPoints = dto.NumberField1;

                item = (from i in context.Item
                        where i.Id == health.ItemId
                        select i).FirstOrDefault();
                item.Name = dto.Name;
                item.Descr = dto.Descr;
            }
            else
            {
                var defense = (from h in context.Defense
                               where h.Id == itemId
                               select h).FirstOrDefault();
                defense.DefensePoints = dto.NumberField1;

                item = (from i in context.Item
                        where i.Id == defense.ItemId
                        select i).FirstOrDefault();
                item.Name = dto.Name;
                item.Descr = dto.Descr;
            }

            return item;
        }
    }
}
