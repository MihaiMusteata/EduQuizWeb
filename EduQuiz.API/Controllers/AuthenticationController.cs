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
    
}