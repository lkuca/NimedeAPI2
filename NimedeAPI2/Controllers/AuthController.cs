using Microsoft.AspNetCore.Mvc;
using NimedeAPI.Modules;


namespace NimedeAPI2.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        // Näide lihtsa in-memory autentimise kohta
        private static List<User> users = new List<User>();

        // Kasutaja registreerimine
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (users.Any(u => u.Username == request.Username))
            {
                return BadRequest("Username already exists.");
            }

            var newUser = new User
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Registered"
            };

            users.Add(newUser);
            return Ok("Registration successful!");
        }

        // Kasutaja sisselogimine
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = users.FirstOrDefault(u => u.Username == request.Username);
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
            // Tühjendage kasutaja sessioon või token (kui kasutasite tokenite süsteemi)
            return Ok("Logout successful!");
        }
    }
}