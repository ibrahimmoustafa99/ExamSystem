﻿public class LoginDTO
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Role { get; set; } = null!; // "Admin" or "Student"
}