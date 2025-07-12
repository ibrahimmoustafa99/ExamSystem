using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ExamSystemContext _context;
    private readonly JwtService _jwt;

    public AuthController(ExamSystemContext context, JwtService jwt)
    {
        _context = context;
        _jwt = jwt;
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO dto)
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        if (dto.Role.ToLower() == "admin")
        {
            if (await _context.Admins.AnyAsync(a => a.Email == dto.Email))
                return BadRequest(new { message = "Email already registered." });

            var admin = new Admin
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = hashedPassword
            };

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful." });
        }
        else if (dto.Role.ToLower() == "student")
        {
            if (await _context.Students.AnyAsync(s => s.Email == dto.Email))
                return BadRequest(new { message = "Email already registered." });

            var student = new Student
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = hashedPassword
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful." });
        }

        return BadRequest(new { message = "Invalid role." });
    }



    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO dto)
    {
        if (dto.Role.ToLower() == "admin")
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email);
            if (admin == null || !BCrypt.Net.BCrypt.Verify(dto.Password, admin.Password))
                return Unauthorized("Invalid credentials.");

            var token = _jwt.GenerateToken(admin.Email, "Admin", admin.Id);
            return Ok(new { token, role = "Admin", name = admin.Name, id = admin.Id });
        }
        else if (dto.Role.ToLower() == "student")
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.Email == dto.Email);
            if (student == null || !BCrypt.Net.BCrypt.Verify(dto.Password, student.Password))
                return Unauthorized("Invalid credentials.");

            var token = _jwt.GenerateToken(student.Email, "Student", student.Id);
            return Ok(new { token, role = "Student", name = student.Name, id = student.Id });
        }

        return BadRequest("Invalid role.");
    }
}
