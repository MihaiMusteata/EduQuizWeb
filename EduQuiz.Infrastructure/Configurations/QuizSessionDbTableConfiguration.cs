using EduQuiz.Domain.Entities.QuizSession;
using EduQuiz.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduQuiz.Infrastructure.Configurations;

public class QuizSessionDbTableConfiguration : IEntityTypeConfiguration<QuizSessionDbTable>
{
    public void Configure(EntityTypeBuilder<QuizSessionDbTable> builder)
    {
        builder.ToTable("QuizSessions");

        builder.HasKey(qs => qs.Id);

        builder.Property(q => q.Id)
            .ValueGeneratedOnAdd();

        builder.Property(q => q.Status)
            .IsRequired()
            .HasConversion(
                s => s.Value,
                s => QuizSessionStatus.FromString(s)
            );
        
        builder.HasOne(q => q.Quiz)
            .WithMany(quiz => quiz.Sessions)
            .HasForeignKey(q => q.QuizId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(q => q.HostUser)
            .WithMany(u => u.SessionsHosted)
            .HasForeignKey(q => q.HostUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}