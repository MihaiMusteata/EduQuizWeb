using EduQuiz.Domain.Entities.User;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EduQuiz.Infrastructure;

public class EduQuizDbContext : IdentityDbContext<UserData>
{
    public EduQuizDbContext()
    {
    }
    
    public EduQuizDbContext(DbContextOptions<EduQuizDbContext> options) : base(options)
    {
    }
    
    public DbSet<UserData> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}