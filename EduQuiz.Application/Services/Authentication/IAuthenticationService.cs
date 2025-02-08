using EduQuiz.Application.DTOs.AuthDto;
using EduQuiz.Application.DTOs.JwtDto;
using EduQuiz.Application.DTOs.UserDTO;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.Authentication;

public interface IAuthenticationService
{
    Task<IdentityResult> UserSignup(UserSignupDto data);
    Task<LoginResponse> UserLogin(UserLoginDto data);
    Task<LoginResponse> RefreshToken(RefreshTokenDto data);
}