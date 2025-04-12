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

    [HttpPost("register")]
    public IActionResult Register(User user)
    {
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
        _context.Users.Add(user);
        _context.SaveChanges();
        return Ok();
    }

    [HttpPost("login")]
    public IActionResult Login(User user)
    {
        var existing = _context.Users.FirstOrDefault(x => x.Username == user.Username);
        if (existing == null || !BCrypt.Net.BCrypt.Verify(user.PasswordHash, existing.PasswordHash))
            return Unauthorized();

        var token = _tokenService.CreateToken(existing);
        return Ok(new { token });
    }
}