using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One.Data.Context;
using All_In_One.Domain.Entities.Geography;
using All_In_One.API.DTOs;

namespace All_In_One.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StateController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StateController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL (WITH COUNTRY NAME)
        // =========================
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _context.States
                .Include(s => s.Country) // 🔥 JOIN
                .Select(s => new StateDto
                {
                    StateId = s.StateId,
                    StateName = s.StateName,
                    CountryId = s.CountryId,
                    CountryName = s.Country.CountryName // 🔥 FIX
                })
                .ToListAsync();

            return Ok(data);
        }

        // =========================
        // CREATE
        // =========================
        [HttpPost]
        public async Task<IActionResult> Create(StateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var countryExists = await _context.Countries
                .AnyAsync(c => c.CountryId == dto.CountryId);

            if (!countryExists)
                return BadRequest("Invalid CountryId");

            var state = new State
            {
                StateName = dto.StateName,
                CountryId = dto.CountryId,
                CreatedDate = DateTime.UtcNow,
                IsActive = true,
                IsDeleted = false
            };

            _context.States.Add(state);
            await _context.SaveChangesAsync();

            dto.StateId = state.StateId;

            return Ok(dto);
        }

        // =========================
        // UPDATE
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, StateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var state = await _context.States.FindAsync(id);
            if (state == null) return NotFound();

            state.StateName = dto.StateName;
            state.CountryId = dto.CountryId;

            await _context.SaveChangesAsync();

            return Ok();
        }

        // =========================
        // DELETE
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var state = await _context.States.FindAsync(id);
            if (state == null) return NotFound();

            _context.States.Remove(state);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // =========================
        // GET STATES BY COUNTRY
        // =========================
        [HttpGet("by-country/{countryId}")]
        public async Task<IActionResult> GetByCountry(int countryId)
        {
            var data = await _context.States
                .Where(s => s.CountryId == countryId)
                .Select(s => new StateDto
                {
                    StateId = s.StateId,
                    StateName = s.StateName,
                    CountryId = s.CountryId
                })
                .ToListAsync();

            return Ok(data);
        }
    }
}