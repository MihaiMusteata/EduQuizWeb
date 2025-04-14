using EduQuiz.Application.DTOs.Answer;

namespace EduQuiz.API.Requests;

public class CreateSessionRequest
{
    public Guid QuizId { get; set; }
    public bool ShuffleQuestions { get; set; }
    public bool ShuffleAnswers { get; set; }
}

public class StartSessionRequest
{
    public int? NumberOfMinutes { get; set; }
}

public class QuestionRequest
{
    public string Nickname { get; set; }
    public int Index { get; set; }
}

public class SubmitAnswerRequest
{
    public string Nickname { get; set; }
    public AnswerGiven AnswerGiven { get; set; }
}