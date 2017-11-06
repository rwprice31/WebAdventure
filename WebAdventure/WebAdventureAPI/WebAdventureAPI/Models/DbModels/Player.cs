using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.DbModels
{
    public class Player
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int GameId { get; set; }

        public string UserId { get; set; }

        public int Health { get; set; }

        public int CurrentRoom { get; set; }

        public int Speed { get; set; }

        public int Weapon { get; set; }

        public int Defense { get; set; }
    }
}
