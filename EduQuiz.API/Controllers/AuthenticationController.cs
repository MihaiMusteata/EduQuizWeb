using EduQuiz.Application.DTOs.UserDTO;
using EduQuiz.Application.Services.Authentication;
using Microsoft.AspNetCore.Mvc;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

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
        if (result == SignInResult.Success)
        {
            return Ok("Login Successful");
        }

        return BadRequest("Login Failed");
    }
    
}