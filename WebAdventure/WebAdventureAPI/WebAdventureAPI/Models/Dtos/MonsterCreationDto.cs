namespace WebAdventureAPI.Models.Dtos
{
    public class MonsterCreationDto
    {
        public string Name { get; set; }

        public string Descr { get; set; }

        public int Health { get; set; }

        public int MinDamage { get; set; }

        public int MaxDamage { get; set; }

        public int Speed { get; set; }

        public string AttackDescr { get; set; }
    }
}
