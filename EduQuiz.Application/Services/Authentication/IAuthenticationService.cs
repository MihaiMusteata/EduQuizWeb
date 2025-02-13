using EduQuiz.Application.DTOs.Auth;
using EduQuiz.Application.DTOs.Jwt;
using EduQuiz.Application.DTOs.User;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.Authentication;

public interface IAuthenticationService
{
    Task<IdentityResult> UserSignup(UserSignupDto data);
    Task<LoginResponse> UserLogin(UserLoginDto data);
    Task<LoginResponse> RefreshToken(RefreshTokenDto data);
}