using EduQuiz.Domain.Entities.UserAnswer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduQuiz.Infrastructure.Configurations;

public class UserAnswerDbTableConfiguration : IEntityTypeConfiguration<UserAnswerDbTable>
{
    public void Configure(EntityTypeBuilder<UserAnswerDbTable> builder)
    {
        builder.ToTable("UserAnswers");

        builder.Property(sp => sp.SelectedAnswerId)
            .HasColumnType("jsonb")
            .IsRequired(false);
    }
}