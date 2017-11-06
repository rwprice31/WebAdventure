using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models;
using WebAdventureAPI.Models.DbModels;

namespace WebAdventureAPI
{
    public class WAContext : IdentityDbContext<WAUser>
    {

        private IConfiguration config;

        public WAContext( ) { }

        public WAContext(DbContextOptions<WAContext> options, IConfiguration config) : base(options)
        {
            this.config = config;
        }

        public DbSet<Game> Game { get; set; }

        public DbSet<Genre> Genre { get; set; }

        public DbSet<Room> Room { get; set; }

        public DbSet<Models.DbModels.Action> Action { get; set; }

        public DbSet<RoomAction> RoomAction { get; set; }

        public DbSet<Monster> Monster { get; set; }

        public DbSet<Item> Item { get; set; }

        public DbSet<Player> Player { get; set; }

        public DbSet<ItemPlayer> ItemPlayer { get; set; }

        public DbSet<Weapon> Weapon { get; set; }

        public DbSet<Health> Health { get; set; }

        public DbSet<Defense> Defense { get; set; }

        public DbSet<Outcome> Outcome { get; set; }

        public DbSet<RoomActionOutcome> RoomActionOutcome { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = config["ConnectionString:WAConnectionString"];

            optionsBuilder.UseSqlServer("Server=tcp:webadventures.database.windows.net,1433;Initial Catalog=webadventures;Persist Security Info=False;User ID=supersecret808;Password=St40ngP4$$w04D;MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
        }
    }
}
