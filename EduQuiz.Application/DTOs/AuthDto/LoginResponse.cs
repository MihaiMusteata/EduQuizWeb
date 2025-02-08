namespace EduQuiz.Application.DTOs.AuthDto;

public class LoginResponse
{
    public bool IsLogin { get; set; } = false;
    public string JwtToken { get; set; }
    public string RefreshToken { get; set; }
}