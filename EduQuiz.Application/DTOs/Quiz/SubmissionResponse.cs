using EduQuiz.Application.DTOs.Question;

namespace EduQuiz.Application.DTOs.Quiz;

public class SubmissionResponse
{
    public float FinalGrade {get; set;}
    public List<QuestionDto> Questions { get; set; }
}