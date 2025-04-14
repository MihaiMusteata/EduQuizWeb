using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.FlashcardDeck;
using EduQuiz.Domain.Entities.Quiz;
using EduQuiz.Domain.Entities.QuizSession;
using EduQuiz.Domain.Entities.SessionParticipant;
using EduQuiz.Domain.Entities.UserAnswer;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Domain.Entities.User;

public class UserData : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }

    [InverseProperty("User")] public ICollection<QuizDbTable> Quizzes { get; set; }

    [InverseProperty("User")] public ICollection<FlashcardDeckDbTable> FlashcardDecks { get; set; }

    [InverseProperty("HostUser")] public List<QuizSessionDbTable> SessionsHosted { get; set; }

    [InverseProperty("User")] public List<SessionParticipantDbTable> SessionsParticipated { get; set; }

    [InverseProperty("User")] public List<UserAnswerDbTable> AnswersGiven { get; set; }
}