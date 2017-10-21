using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models;

namespace WebAdventureAPI
{
    public class WAContext : IdentityDbContext<WAUser>
    {
        public WAContext(DbContextOptions<WAContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }
}
