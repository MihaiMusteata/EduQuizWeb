using EduQuiz.Application.DTOs.UserDTO;
using EduQuiz.Domain.Entities.User;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.Authentication;

public class AuthenticationService: IAuthenticationService
{
    private readonly UserManager<UserData> _userManager;

    public AuthenticationService(UserManager<UserData> userManager)
    {
        _userManager = userManager;
    }

    public Task<IdentityResult> UserSignup(UserSignupDto data)
    {
        var user = new UserData
        {
            FirstName = data.FirstName,
            LastName = data.LastName,
            Email = data.Email,
            UserName = data.Email
        };

        return _userManager.CreateAsync(user, data.Password);
    }
}