using EduQuiz.Application.Services.Authentication;
using EduQuiz.Domain.Entities.User;
using EduQuiz.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddLogging();

builder.Services.AddDbContext<EduQuizDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentity<UserData, IdentityRole>()
    .AddEntityFrameworkStores<EduQuizDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();