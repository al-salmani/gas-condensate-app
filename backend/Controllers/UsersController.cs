using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiDemo;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
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

    public class RoleUpdateModel { public string Role { get; set; } = ""; }
    public class PasswordUpdateModel { public string Password { get; set; } = ""; }
}