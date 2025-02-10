using EduQuiz.Application.DTOs.AuthDto;
using EduQuiz.Application.DTOs.JwtDto;
using EduQuiz.Application.DTOs.UserDTO;
using EduQuiz.Application.Services.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace EduQuiz.API.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationService _authenticationService;

    public AuthenticationController(IAuthenticationService authenticationService)
    {
        _authenticationService = authenticationService;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup(UserSignupDto data)
    {
        var result = await _authenticationService.UserSignup(data);
        if (result.Succeeded)
        {
            return Ok("Signup Successful");
        }

        return BadRequest("Signup Failed");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto data)
    {
        var result = await _authenticationService.UserLogin(data);
        if (!result.IsLogin) return BadRequest("Login Failed");
        SetAuthCookies(result.RefreshToken);
        return Ok(new { result.JwtToken });
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken(RefreshTokenRequest request)
    {
        var refreshToken = Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(refreshToken) || string.IsNullOrEmpty(request.JwtToken))
        {
            return BadRequest("Token Refresh Failed");
        }

        var result = await _authenticationService.RefreshToken(new RefreshTokenDto
        {
            JwtToken = request.JwtToken,
            RefreshToken = refreshToken
        });

        if (!result.IsLogin) return BadRequest("Token Refresh Failed");

        SetAuthCookies(result.RefreshToken);
        return Ok(new { result.JwtToken });
    }

    private void SetAuthCookies(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            Secure = true
        };

        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }
}