using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class StudentAuthController : ControllerBase
{
    private readonly ExamSystemContext _context;
    private readonly JwtService _jwt;

    public StudentAuthController(ExamSystemContext context, JwtService jwt)
    {
        _context = context;
        _jwt = jwt;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO dto)
    {
        if (await _context.Students.AnyAsync(s => s.Email == dto.Email))
            return BadRequest("Email already exists.");

        var student = new Student
        {
            Name = dto.Name,
            Email = dto.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        return Ok("Student registered.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO dto)
    {
        var student = await _context.Students.FirstOrDefaultAsync(s => s.Email == dto.Email);
        if (student == null || !BCrypt.Net.BCrypt.Verify(dto.Password, student.Password))
            return Unauthorized("Invalid credentials.");

        var token = _jwt.GenerateToken(student.Email, "Student", student.Id);
        return Ok(new { token });
    }
}
