using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace WebApiDemo
{
    public class TokenService
    {
        private readonly IConfiguration _config;
        public TokenService(IConfiguration config) => _config = config;

        public string CreateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("username", user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("role", user.Role)  // ← هذا يجعل ASP.NET Core يتعرف على [Authorize(Roles = "...")]

            };


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "supersecurekey123"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);



            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"] ?? "FAISAL",
                audience: _config["Jwt:Audience"] ?? "FAISAL",
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            //return new JwtSecurityTokenHandler().WriteToken(token);
        
                    // طباعة التوكن
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            Console.WriteLine("Generated Token: " + tokenString);

            return tokenString;
        
        }
    }
}