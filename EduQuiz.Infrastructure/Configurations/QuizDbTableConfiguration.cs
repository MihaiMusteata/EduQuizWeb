using EduQuiz.Domain.Entities.Quiz;
using EduQuiz.Domain.ValueObjects.Visibility;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduQuiz.Infrastructure.Configurations;

public class QuizDbTableConfiguration : IEntityTypeConfiguration<QuizDbTable>
{
    public void Configure(EntityTypeBuilder<QuizDbTable> builder)
    {
        builder.ToTable("Quizzes");

        builder.HasKey(q => q.Id);

        builder.Property(q => q.Id)
            .ValueGeneratedOnAdd();

        builder.Property(q => q.Title)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(q => q.CreatedAt)
            .IsRequired();

        builder.Property(q => q.Visibility)
            .IsRequired()
            .HasConversion(
                v => v.Value,
                v => Visibility.FromString(v)
            );

        builder.HasMany(q => q.Questions)
            .WithOne(q => q.Quiz)
            .HasForeignKey(q => q.QuizId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(q => q.User)
            .WithMany(u => u.Quizzes)
            .HasForeignKey(q => q.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}