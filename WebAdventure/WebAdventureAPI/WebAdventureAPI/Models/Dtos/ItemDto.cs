namespace WebAdventureAPI.Models.Dtos
{
    public class ItemDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Descr { get; set; }

        public ItemTypeDto Type { get; set; }

        public int Points { get; set; }
    }
}
