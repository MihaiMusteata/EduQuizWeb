namespace EduQuiz.Application.DTOs.JwtDto;

public class RefreshTokenDto
{
    public string JwtToken { get; set; }
    public string RefreshToken { get; set; }
}