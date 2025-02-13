namespace EduQuiz.Application.DTOs.Jwt;

public class RefreshTokenDto
{
    public string JwtToken { get; set; }
    public string RefreshToken { get; set; }
}