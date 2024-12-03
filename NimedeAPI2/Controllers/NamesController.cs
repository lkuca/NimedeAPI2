using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NimedeAPI.Data;
using NimedeAPI.Modules;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("names")]
    public class NamesController : ControllerBase
    {
        private readonly NimedeDbContext _context;

        public NamesController(NimedeDbContext context)
        {
            _context = context;
        }

        // Lisa uus nimi
        [HttpPost("add")]
        public async Task<IActionResult> AddName([FromBody] NameRequest request)
        {
            if (request.Gender == "other" && string.IsNullOrWhiteSpace(request.CustomGender))
            {
                return BadRequest("Custom gender value must be provided when 'other' is selected.");
            }

            var genderValue = request.Gender == "other" ? request.CustomGender : request.Gender;

            var newName = new Name
            {
                Value = request.Name,
                Gender = genderValue,
                Prefix = request.Name.Substring(0, 2).ToUpper(),  // Kahetäheline algus
                UsageCount = 0
            };

            _context.Names.Add(newName);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetName), new { id = newName.Id }, newName);
        }

        // Nimed, mis algavad antud prefiksiga
        [HttpPost("prefix/{prefix}")]
        public async Task<IActionResult> GetNamesByPrefix(string prefix)
        {
            if (prefix.Length != 2)
            {
                return BadRequest("Prefix must be exactly two characters.");
            }

            var names = await _context.Names
                                       .Where(n => n.Prefix == prefix.ToUpper())
                                       .ToListAsync();

            return Ok(names);
        }

        // Populaarsed nimed
        [HttpGet("popular")]
        public async Task<IActionResult> GetPopularNames()
        {
            var popularNames = await _context.Names
                .Where(n => n.UsageCount > 0) // Only names with usage count > 0
                .OrderByDescending(n => n.UsageCount) // Order by UsageCount
                .Take(10) // Top 10
                .ToListAsync();

            return Ok(popularNames);
        }

        // Nime muutmine
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateName(int id, [FromBody] Name updatedName)
        {
            var name = await _context.Names.FindAsync(id);
            if (name == null)
            {
                return NotFound();
            }

            // Update name and gender
            name.Value = updatedName.Value;
            name.Gender = updatedName.Gender;

            // Reset usageCount to 0 when updating
            name.UsageCount = 0;

            await _context.SaveChangesAsync();
            return NoContent();
        }



        // Nime kustutamine
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteName(int id)
        {
            var name = await _context.Names.FindAsync(id);
            if (name == null)
            {
                return NotFound();
            }

            _context.Names.Remove(name);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Nime vaatamine ID järgi
        [HttpGet("{id}")]
        public async Task<IActionResult> GetName(int id)
        {
            var name = await _context.Names.FindAsync(id);
            if (name == null)
            {
                return NotFound();
            }

            return Ok(name);
        }

        // Increment UsageCount when name is clicked
        [HttpPut("{id}/incrementUsage")]
        public async Task<IActionResult> IncrementUsage(int id)
        {
            var name = await _context.Names.FindAsync(id);
            if (name == null)
            {
                return NotFound();
            }

            name.UsageCount++;
            await _context.SaveChangesAsync();
            return Ok(name);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNames()
        {
            var allNames = await _context.Names.ToListAsync();
            return Ok(allNames);
        }

    }
}