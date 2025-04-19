using Microsoft.AspNetCore.Mvc;
using WebApiDemo;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginModel model)
    {
        var existing = _context.Users.FirstOrDefault(x => x.Username == model.Username);
        if (existing == null || !BCrypt.Net.BCrypt.Verify(model.Password, existing.PasswordHash))
            return Unauthorized();

        var token = _tokenService.CreateToken(existing);
        return Ok(new { 
		token
		});
    }
}

public class LoginModel
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}