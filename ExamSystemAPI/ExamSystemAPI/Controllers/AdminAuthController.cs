using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class AdminAuthController : ControllerBase
{
    private readonly ExamSystemContext _context;
    private readonly JwtService _jwt;

    public AdminAuthController(ExamSystemContext context, JwtService jwt)
    {
        _context = context;
        _jwt = jwt;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO dto)
    {
        if (await _context.Admins.AnyAsync(a => a.Email == dto.Email))
            return BadRequest("Email already exists.");

        var admin = new Admin
        {
            Name = dto.Name,
            Email = dto.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _context.Admins.Add(admin);
        await _context.SaveChangesAsync();

        return Ok("Admin registered.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO dto)
    {
        var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email);
        if (admin == null || !BCrypt.Net.BCrypt.Verify(dto.Password, admin.Password))
            return Unauthorized("Invalid credentials.");

        var token = _jwt.GenerateToken(admin.Email, "Admin", admin.Id);
        return Ok(new { token });
    }
}
