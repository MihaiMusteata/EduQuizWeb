using EduQuiz.Domain.Entities.Question;
using EduQuiz.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduQuiz.Infrastructure.Configurations;

public class QuestionDbTableConfiguration : IEntityTypeConfiguration<QuestionDbTable>
{
    public void Configure(EntityTypeBuilder<QuestionDbTable> builder)
    {
        builder.ToTable("Questions");

        builder.HasKey(q => q.Id);

        builder.Property(q => q.Text).IsRequired().HasMaxLength(200);

        builder.Property(q => q.Type)
            .IsRequired()
            .HasConversion(
                v => v.Value,
                v => QuestionType.FromString(v)
            );

        builder.HasOne(q => q.Quiz)
            .WithMany(q => q.Questions)
            .HasForeignKey(q => q.QuizId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(q => q.Answers)
            .WithOne(a => a.Question)
            .HasForeignKey(a => a.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}