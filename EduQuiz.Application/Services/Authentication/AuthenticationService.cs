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

    public async Task<IdentityResult> UserSignup(UserSignupDto data)
    {
        var user = new UserData
        {
            FirstName = data.FirstName,
            LastName = data.LastName,
            Email = data.Email,
            UserName = data.Email
        };

        return await _userManager.CreateAsync(user, data.Password);
    }

    public async Task<SignInResult> UserLogin(UserLoginDto data)
    {
        var user = await _userManager.FindByEmailAsync(data.Email);
        if (user != null && await _userManager.CheckPasswordAsync(user, data.Password))
        {
            return SignInResult.Success;
        }
        
        return SignInResult.Failed;
    }
}