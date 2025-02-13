using Microsoft.AspNetCore.Mvc;

namespace EduQuiz.API.Controllers;

public class BaseController : ControllerBase
{
    protected string GetUserIdFromJwt()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");
        if (userIdClaim is null)
            throw new Exception("User Id not found in JWT token");

        return userIdClaim.Value;
    }
}