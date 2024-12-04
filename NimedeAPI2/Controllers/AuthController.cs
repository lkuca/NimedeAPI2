using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Linq;
using System.Threading.Tasks;
using NimedeAPI.Modules;
using NimedeAPI.Data;

namespace NimedeAPI2.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly NimedeDbContext _context;

        // Constructor to inject the DbContext
        public AuthController(NimedeDbContext context)
        {
            _context = context;
        }

        // Kasutaja registreerimine
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Check if the username already exists in the database
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (existingUser != null)
            {
                return BadRequest("Username already exists.");
            }

            // Create new user and hash the password
            var newUser = new User
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Registered"
            };

            // Add the new user to the database
            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync(); // Save the changes to the database

            return Ok("Registration successful!");
        }

        // Kasutaja sisselogimine
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Find the user by username
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized("Invalid username or password.");
            }

            return Ok("Login successful!");
        }

        // Kasutaja väljalogimine
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Logic to clear session or invalidate token if required
            return Ok("Logout successful!");
        }
    }
}
