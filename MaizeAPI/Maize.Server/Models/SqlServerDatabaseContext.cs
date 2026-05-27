using Microsoft.EntityFrameworkCore;

namespace Maize.Server.Models
{
    public class SqlServerDatabaseContext : DbContext
    {
        public SqlServerDatabaseContext(DbContextOptions<SqlServerDatabaseContext> options) : base(options)
        {

        }

        public DbSet<Users> Users { get; set; }  
        public DbSet<AppSettings> AppSettings { get; set; }
        public DbSet<AdminSettings> AdminSettings { get; set; }
        public DbSet<RolePermissions> RolePermissions { get; set; }
        public DbSet<Translations> Translations { get; set; }
        public DbSet<UserRoles> UserRoles { get; set; }
        public DbSet<CarRental_Booking> CarRental_Bookings { get; set; }
        public DbSet<CarRental_VehicleType> CarRental_VehicleTypes { get; set; }
        public DbSet<CarRental_Vehicle> CarRental_Vehicles { get; set; }
        public DbSet<CarRental_VehicleModel> CarRental_VehicleModels { get; set; }
        public DbSet<CarRental_VehicleCategory> CarRental_VehicleCategories { get; set; }
        public DbSet<CarRental_Station> CarRental_Stations { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<CompanyAnnouncement> CompanyAnnouncements { get; set; }
        public DbSet<CarRental_SpecialRate> CarRental_SpecialRates { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<ActiveModule> ActiveModules { get; set; }
        public DbSet<CarRental_VehicleAddon> CarRental_VehicleAddons { get; set; }
        public DbSet<CarRental_VehicleAddonConnection> CarRental_VehicleAddonConnections { get; set; }
        public DbSet<CarRental_BookingAddon> CarRental_BookingAddons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AdminSettings>().HasNoKey();
        }
    }
}
