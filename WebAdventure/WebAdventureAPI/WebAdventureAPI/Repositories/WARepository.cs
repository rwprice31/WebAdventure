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

        public void AddRoomToDb(Room room)
        {
            context.Room.Add(room);
            SaveChanges();
        }

        public int GetRoomId(Room room)
        {
            return (from r in context.Room
                    where r.Descr == room.Descr && r.Name == r.Name && r.GameId == room.GameId
                    select r).FirstOrDefault().Id;
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
            var roomOptionOutcomes = (from rao in context.RoomActionOutcome
                               join ra in context.RoomAction on rao.RoomActionId equals ra.Id
                               where ra.RoomId == id
                               select new RoomActionOutcome
                               {
                                   Id = rao.Id,
                                   RoomActionId = ra.Id,
                                   OutcomeId = rao.OutcomeId
                               }).ToList();

            context.RoomActionOutcome.RemoveRange(roomOptionOutcomes);
            SaveChanges();

            var roomOptions = (from ra in context.RoomAction
                               where ra.RoomId == id
                               select new RoomAction
                               {
                                   Id = ra.Id,
                                   RoomId = id,
                                   ActionId = ra.Id
                               }).ToList();

            context.RoomAction.RemoveRange(roomOptions);
            SaveChanges();

            var room = (from r in context.Room
                        where r.Id == id
                        select r).FirstOrDefault();

            context.Room.Remove(room);
            SaveChanges();
        }

        public void CreateRoomActionOutcome(int roomId, Models.DbModels.Action action, Outcome outcome)
        {
            var _action = GetAction(action);

            if (_action == null)
            {
                context.Action.Add(action);
                SaveChanges();
                _action = GetAction(action);
            }

            context.RoomAction.Add(new RoomAction
            {
                ActionId = _action.Id,
                RoomId = roomId
            });

            SaveChanges();

            var roomAction = (from ra in context.RoomAction
                              where ra.RoomId == roomId && ra.ActionId == _action.Id
                              select ra).FirstOrDefault();

            var _outcome = GetOutcome(outcome);

            if (_outcome == null)
            {
                context.Outcome.Add(outcome);
                SaveChanges();
                _outcome = GetOutcome(outcome);
            }

            context.RoomActionOutcome.Add(new RoomActionOutcome
            {
                RoomActionId = roomAction.Id,
                OutcomeId = _outcome.Id
            });

            SaveChanges();
        }

        public List<RoomActionOutcomeInfo> GetActionOutcomeByRoom(int id)
        {
            return (from rao in context.RoomActionOutcome
                    join ra in context.RoomAction on rao.RoomActionId equals ra.Id
                    join a in context.Action on ra.ActionId equals a.Id
                    join o in context.Outcome on rao.OutcomeId equals o.Id
                    join i in context.Item on o.ItemId equals i.Id
                    join m in context.Monster on o.MonsterId equals m.Id
                    join nr in context.Room on o.NextRoomId equals nr.Id
                    where ra.RoomId == id
                    select new RoomActionOutcomeInfo
                    {
                        ActionId = a.Id,
                        ActionDescr = a.Descr,
                        MonsterId = o.MonsterId,
                        MonsterDescr = m.Name,
                        NextRoomId = o.NextRoomId,
                        NextRoomName = nr.Name,
                        ItemId = o.ItemId,
                        ItemDescr = i.Descr
                    }).ToList();
        }

        public void DeleteActionOutcome(ActionOutcomeDeleteDto dto)
        {
            var actionOutcome = (from rao in context.RoomActionOutcome
                                 join ra in context.RoomAction on rao.RoomActionId equals ra.Id
                                 where ra.RoomId == dto.RoomId && ra.ActionId == dto.ActionId && rao.OutcomeId == dto.OutcomeId
                                 select new RoomActionOutcome
                                 {
                                     Id = rao.Id,
                                     RoomActionId = ra.Id,
                                     OutcomeId = dto.OutcomeId
                                 }).FirstOrDefault();

            context.RoomActionOutcome.Remove(actionOutcome);
            SaveChanges();
        }

        private Models.DbModels.Action GetAction(Models.DbModels.Action action)
        {
            if (action.Id == 0)
            {
                return (from a in context.Action
                        where a.Descr == action.Descr
                        select a).FirstOrDefault();
            }
            else
            {
                return (from a in context.Action
                        where a.Id == action.Id
                        select a).FirstOrDefault();
            }
        }

        private Outcome GetOutcome(Outcome outcome)
        {
            return (from o in context.Outcome
                    where o.ItemId == outcome.ItemId || o.MonsterId == outcome.MonsterId || o.NextRoomId == outcome.NextRoomId
                    select o).FirstOrDefault();
        }
    }
}
