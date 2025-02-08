using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using EduQuiz.Application.DTOs.AuthDto;
using EduQuiz.Application.DTOs.JwtDto;
using EduQuiz.Application.DTOs.UserDTO;
using EduQuiz.Domain.Entities.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EduQuiz.Application.Services.Authentication;

public class AuthenticationService : IAuthenticationService
{
    private readonly UserManager<UserData> _userManager;
    private readonly IConfiguration _configuration;
    private readonly int _refreshTokenExpirationDays;
    private readonly int _accessTokenExpirationMinutes;

    public AuthenticationService(UserManager<UserData> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
        _refreshTokenExpirationDays = int.Parse(_configuration["JwtSettings:RefreshTokenExpirationDays"]);
        _accessTokenExpirationMinutes = int.Parse(_configuration["JwtSettings:AccessTokenExpirationMinutes"]);
    }

    public async Task<IdentityResult> UserSignup(UserSignupDto data)
    {
        if (await _userManager.FindByEmailAsync(data.Email) is not null)
            return IdentityResult.Failed(new IdentityError { Description = "Email already in use." });

        var user = new UserData
        {
            FirstName = data.FirstName,
            LastName = data.LastName,
            Email = data.Email,
            UserName = $"{data.FirstName}{data.LastName}"
        };

        return await _userManager.CreateAsync(user, data.Password);
    }

    public async Task<LoginResponse> UserLogin(UserLoginDto data)
    {
        var user = await _userManager.FindByEmailAsync(data.Email);
        if (user is null || !await _userManager.CheckPasswordAsync(user, data.Password))
            return new LoginResponse();

        return await GenerateLoginResponse(user);
    }

    public async Task<LoginResponse> RefreshToken(RefreshTokenDto data)
    {
        var principal = GetTokenPrincipal(data.JwtToken);
        if (principal?.Identity?.Name is null)
            return new LoginResponse();

        var user = await _userManager.FindByNameAsync(principal.Identity.Name);
        if (user is null || user.RefreshToken != data.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return new LoginResponse();

        return await GenerateLoginResponse(user);
    }

    private async Task<LoginResponse> GenerateLoginResponse(UserData user)
    {
        var response = new LoginResponse
        {
            IsLogin = true,
            JwtToken = await GenerateJwtToken(user),
            RefreshToken = GenerateRefreshToken()
        };

        user.RefreshToken = response.RefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_refreshTokenExpirationDays);
        await _userManager.UpdateAsync(user);

        return response;
    }

    private async Task<string> GenerateJwtToken(UserData user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.UserName)
        };

        var token = new JwtSecurityToken(
            _configuration["JwtSettings:Issuer"],
            _configuration["JwtSettings:Audience"],
            claims,
            expires: DateTime.UtcNow.AddMinutes(_accessTokenExpirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private ClaimsPrincipal? GetTokenPrincipal(string token)
    {
        try
        {
            var validation = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = false,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidAudience = _configuration["JwtSettings:Audience"],
                IssuerSigningKey =
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]))
            };

            return new JwtSecurityTokenHandler().ValidateToken(token, validation, out _);
        }
        catch
        {
            return null;
        }
    }
}