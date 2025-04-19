using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiDemo;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    public class CreateUserModel
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Operator";
    }

    public class RoleUpdateModel { public string Role { get; set; } = ""; }
    public class PasswordUpdateModel { public string Password { get; set; } = ""; }

    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users.Select(u => new { u.Id, u.Username, u.Role }).ToListAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> addUser([FromBody] CreateUserModel model)
    {
        if (await _context.Users.AnyAsync(u => u.Username == model.Username))
            return BadRequest("اسم المستخدم موجود بالفعل");

        var user = new User
        {
            Username = model.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
            Role = model.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = user.Id }, new { user.Id, user.Username, user.Role });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] RoleUpdateModel model)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        user.Role = model.Role;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}/password")]
    public async Task<IActionResult> UpdatePassword(int id, [FromBody] PasswordUpdateModel model)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
