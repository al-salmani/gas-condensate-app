using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiDemo;

[ApiController]
[Route("api/[controller]")]
public class CondensateFieldsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CondensateFieldsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.CondensateFields.AsNoTracking().ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var field = await _context.CondensateFields.FindAsync(id);
        if (field == null) return NotFound();
        return Ok(field);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CondensateField field)
    {
        _context.CondensateFields.Add(field);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = field.Id }, field);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Operator,Engineer")]
    public async Task<IActionResult> Update(int id, [FromBody] CondensateField updated)
    {
        var existing = await _context.CondensateFields.FindAsync(id);
        if (existing == null) return NotFound();

        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        if (role == "Operator") existing.ProductionRate = updated.ProductionRate;
        else if (role == "Engineer") existing.MaintenanceType = updated.MaintenanceType;
        else if (role == "Admin")
        {
            existing.FieldName = updated.FieldName;
            existing.Latitude = updated.Latitude;
            existing.Longitude = updated.Longitude;
            existing.ProductionRate = updated.ProductionRate;
            existing.Cost = updated.Cost;
            existing.YearOfExtraction = updated.YearOfExtraction;
            existing.MaintenanceType = updated.MaintenanceType;
        }
        else return Forbid();

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var field = await _context.CondensateFields.FindAsync(id);
        if (field == null) return NotFound();

        _context.CondensateFields.Remove(field);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}