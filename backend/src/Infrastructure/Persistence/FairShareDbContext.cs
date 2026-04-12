using FairShareApp.Backend.Domain.Ledger;
using Microsoft.EntityFrameworkCore;

namespace FairShareApp.Backend.Infrastructure.Persistence;

public sealed class FairShareDbContext : DbContext
{
    public FairShareDbContext(DbContextOptions<FairShareDbContext> options)
        : base(options)
    {
    }

    public DbSet<LedgerEntry> LedgerEntries => Set<LedgerEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<LedgerEntry>(entity =>
        {
            entity.ToTable("ledger_entries");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Amount).HasPrecision(18, 2);
            entity.Property(x => x.EntryType).HasConversion<string>();
            entity.Property(x => x.OccurredAt).IsRequired();
        });
    }
}
