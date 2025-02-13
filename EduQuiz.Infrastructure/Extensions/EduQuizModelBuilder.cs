using EduQuiz.Domain.Entities.Question;
using EduQuiz.Domain.Entities.Quiz;
using Microsoft.EntityFrameworkCore;

namespace EduQuiz.Infrastructure.Extensions;

public static class EduQuizModelBuilder
{
    public static void ApplyQuizRelationships(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<QuizDbTable>()
            .HasMany(q => q.Questions)
            .WithOne(q => q.Quiz)
            .HasForeignKey(q => q.QuizId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<QuestionDbTable>()
            .HasMany(q => q.Answers)
            .WithOne(a => a.Question)
            .HasForeignKey(a => a.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<QuizDbTable>()
            .HasOne(q => q.User)
            .WithMany(u => u.Quizzes)
            .HasForeignKey(q => q.UserId)
            .OnDelete(DeleteBehavior.Restrict);
     }
}