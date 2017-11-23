using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class PlayerGameDto
    {
        public int Id { get; set; }

        public int PlayerId { get; set; }

        public int RoomId { get; set; }

        public int Health { get; set; }

        public string UserId { get; set; }

        public int GameId { get; set; }
    }
}
