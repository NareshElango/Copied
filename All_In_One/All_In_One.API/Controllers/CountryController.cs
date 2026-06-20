using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One.Data.Context;
using All_In_One.Domain.Entities.Geography;
using All_In_One.API.DTOs;
namespace All_In_One.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CountryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET ALL
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _context.Countries
                .Select(c => new CountryDto
                {
                    CountryId = c.CountryId,
                    CountryName = c.CountryName
                })
                .ToListAsync();

            return Ok(data);
        }

        // CREATE
        [HttpPost]
        public async Task<IActionResult> Create(CountryDto dto)
        {
            var country = new Country
            {
                CountryName = dto.CountryName
            };

            _context.Countries.Add(country);
            await _context.SaveChangesAsync();

            dto.CountryId = country.CountryId;

            return Ok(dto);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CountryDto dto)
        {
            var country = await _context.Countries.FindAsync(id);

            if (country == null)
                return NotFound();

            country.CountryName = dto.CountryName;

            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var country = await _context.Countries.FindAsync(id);

            if (country == null)
                return NotFound();

            _context.Countries.Remove(country);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}