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

    [HttpPost("sign-up")]
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
        if (result.IsLogin)
        {
            SetAuthCookies(result);
            return Ok("Login Successful");
        }

        return BadRequest("Login Failed");
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        var jwtToken = Request.Cookies["jwtToken"];

        if (string.IsNullOrEmpty(refreshToken) || string.IsNullOrEmpty(jwtToken))
        {
            return BadRequest("Token Refresh Failed");
        }

        var result = await _authenticationService.RefreshToken(new RefreshTokenDto
        {
            JwtToken = jwtToken,
            RefreshToken = refreshToken
        });

        if (!result.IsLogin) return BadRequest("Token Refresh Failed");

        SetAuthCookies(result);
        return Ok("Token Refresh Successful");
    }

    private void SetAuthCookies(LoginResponse result)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            Secure = true
        };

        Response.Cookies.Append("refreshToken", result.RefreshToken, cookieOptions);
        Response.Cookies.Append("jwtToken", result.JwtToken, cookieOptions);
    }
}