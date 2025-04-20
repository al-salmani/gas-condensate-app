using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;


var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", builder =>
    {
        builder.WithOrigins("http://localhost:4200", "http://frontend:80")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

// JWT Auth
var config = builder.Configuration;
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = config["Jwt:Issuer"],
        ValidAudience = config["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"] ?? "supersecurekey123")),
        RoleClaimType = ClaimTypes.Role,        
        NameClaimType = ClaimTypes.Name       
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();
app.UseCors("AllowAngularApp");

app.UseAuthentication();  // 👈 يجب أن يأتي قبل UseAuthorization
app.UseAuthorization();

app.MapControllers();
app.Run();
