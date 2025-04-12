using Microsoft.EntityFrameworkCore;

namespace WebApiDemo
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<CondensateField> CondensateFields => Set<CondensateField>();
        public DbSet<User> Users => Set<User>();
    }
}