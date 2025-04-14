using EduQuiz.Domain.Entities.SessionParticipant;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduQuiz.Infrastructure.Configurations;

public class SessionParticipantDbTableConfiguration : IEntityTypeConfiguration<SessionParticipantDbTable>
{
    public void Configure(EntityTypeBuilder<SessionParticipantDbTable> builder)
    {
        builder.ToTable("SessionParticipants");

        builder.Property(sp => sp.OrderedQuestionIds)
            .HasColumnType("jsonb")
            .IsRequired(false);
    }
}