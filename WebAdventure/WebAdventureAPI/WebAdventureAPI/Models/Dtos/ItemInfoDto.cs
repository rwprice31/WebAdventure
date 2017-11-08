using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class ItemInfoDto
    {
        public int ItemId { get; set; }

        public string Name { get; set; }

        public string Descr { get; set; }

        public int DefenseId { get; set; }

        public int DefensePoints { get; set; }

        public int HealthId { get; set; }

        public int HealthPoints { get; set; }

        public int WeaponId { get; set; }

        public int MinDamage { get; set; }

        public int MaxDamage { get; set; }
    }
}
