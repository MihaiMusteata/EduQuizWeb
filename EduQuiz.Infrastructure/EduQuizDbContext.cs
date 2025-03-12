using EduQuiz.Domain.Entities.Answer;
using EduQuiz.Domain.Entities.Flashcard;
using EduQuiz.Domain.Entities.FlashcardDeck;
using EduQuiz.Domain.Entities.Question;
using EduQuiz.Domain.Entities.Quiz;
using EduQuiz.Domain.Entities.User;
using EduQuiz.Infrastructure.Extensions;
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
    public DbSet<QuizDbTable> Quizzes { get; set; }
    public DbSet<QuestionDbTable> Questions { get; set; }
    public DbSet<AnswerDbTable> Answers { get; set; }
    public DbSet<FlashcardDeckDbTable> FlashcardDecks { get; set; }
    public DbSet<FlashcardDbTable> Flashcards { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyQuizRelationships();
    }
}