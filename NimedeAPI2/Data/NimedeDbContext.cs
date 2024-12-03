using Microsoft.EntityFrameworkCore;
using NimedeAPI.Modules;
namespace NimedeAPI.Data
{
    public class NimedeDbContext : DbContext
    {
        
            public NimedeDbContext(DbContextOptions<NimedeDbContext> options) : base(options) { }

            public DbSet<Name> Names { get; set; }
            public DbSet<User> Users { get; set; }
        
    }
}
