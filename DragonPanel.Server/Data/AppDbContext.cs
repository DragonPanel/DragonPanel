using DragonPanel.Core.Data;
using DragonPanel.Server.Auth.Model;
using DragonPanel.Server.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Options;

namespace DragonPanel.Server.Data;

public sealed class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Session> Sessions { get; set; } = null!;

    private readonly DatabaseOptions _configuration;

    public AppDbContext(DbContextOptions<AppDbContext> options, IOptions<DatabaseOptions> configuration) : base(options)
    {
        _configuration = configuration.Value;
        ChangeTracker.StateChanged += OnEntityStateChanged;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder
            .UseNpgsql(GetDbConnectionString())
            .UseSnakeCaseNamingConvention();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        ConfigureBaseEntities(modelBuilder);

        modelBuilder.Entity<Session>()
            .HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .IsRequired();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }

    private void OnEntityStateChanged(object? sender, EntityStateChangedEventArgs e)
    {
        if (e is { NewState: EntityState.Modified, Entry.Entity: BaseEntity entity })
        {
            entity.UpdatedAt = DateTime.UtcNow;
        }
    }

    private void ConfigureBaseEntities(ModelBuilder modelBuilder)
    {
        var entitiesWithDate = modelBuilder.Model.GetEntityTypes()
            .Where(type => type.ClrType.IsSubclassOf(typeof(BaseEntity)))
            .ToList();

        foreach (var entity in entitiesWithDate)
        {
            modelBuilder.Entity(entity.ClrType)
                .Property("CreatedAt")
                .HasDefaultValueSql("NOW()");

            modelBuilder.Entity(entity.ClrType)
                .Property("UpdatedAt")
                .HasDefaultValueSql("NOW()");
        }
    }

    private string GetDbConnectionString()
    {
        string connectionString = "";

        var host = _configuration.Host;
        var port = _configuration.Port ?? "5432";
        var username = _configuration.Username;
        var password = _configuration.Password;
        var database = _configuration.Database;

        connectionString += $"Host={host};Username={username}";
        connectionString += $";Port={port}";

        if (password is not null)
        {
            connectionString += $";Password={password}";
        }

        if (database is not null)
        {
            connectionString += $";Database={database}";
        }

        return connectionString;
    }
}