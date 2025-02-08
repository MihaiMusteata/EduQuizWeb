using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Domain.Entities.User;

public class UserData : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }
}