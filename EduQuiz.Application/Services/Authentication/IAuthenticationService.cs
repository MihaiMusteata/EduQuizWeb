using EduQuiz.Application.DTOs.UserDTO;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.Authentication;

public interface IAuthenticationService
{
    Task<IdentityResult> UserSignup(UserSignupDto data);
    Task<SignInResult> UserLogin(UserLoginDto data);
}