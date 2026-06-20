using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One.Data.Context;
using All_In_One.Domain.Entities.Geography;
using All_In_One.API.DTOs;

namespace All_In_One.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DistrictController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DistrictController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL
        // =========================
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _context.Districts
                .Select(d => new DistrictDto
                {
                    DistrictId = d.DistrictId,
                    DistrictName = d.DistrictName,
                    StateId = d.StateId
                })
                .ToListAsync();

            return Ok(data);
        }

        // =========================
        // CREATE
        // =========================
        [HttpPost]
        public async Task<IActionResult> Create(DistrictDto dto)
        {
            // 🔥 DTO VALIDATION
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // 🔥 FK VALIDATION (State must exist)
            var stateExists = await _context.States
                .AnyAsync(s => s.StateId == dto.StateId);

            if (!stateExists)
                return BadRequest("Invalid StateId");

            var district = new District
            {
                DistrictName = dto.DistrictName,
                StateId = dto.StateId,

                // If BaseEntity has required fields
                CreatedDate = DateTime.UtcNow,
                IsActive = true,
                IsDeleted = false
            };

            _context.Districts.Add(district);
            await _context.SaveChangesAsync();

            dto.DistrictId = district.DistrictId;

            return Ok(dto);
        }

        // =========================
        // UPDATE
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, DistrictDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var district = await _context.Districts.FindAsync(id);

            if (district == null)
                return NotFound();

            var stateExists = await _context.States
                .AnyAsync(s => s.StateId == dto.StateId);

            if (!stateExists)
                return BadRequest("Invalid StateId");

            district.DistrictName = dto.DistrictName;
            district.StateId = dto.StateId;

            await _context.SaveChangesAsync();

            return Ok();
        }

        // =========================
        // DELETE
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var district = await _context.Districts.FindAsync(id);

            if (district == null)
                return NotFound();

            _context.Districts.Remove(district);
            await _context.SaveChangesAsync();

            return Ok();
        }
    
    // =========================
// GET BY STATE ID
// =========================
[HttpGet("by-state/{stateId}")]
        public async Task<IActionResult> GetByState(int stateId)
        {
            var data = await _context.Districts
                .Where(d => d.StateId == stateId)
                .Select(d => new DistrictDto
                {
                    DistrictId = d.DistrictId,
                    DistrictName = d.DistrictName,
                    StateId = d.StateId
                })
                .ToListAsync();

            return Ok(data);
        }
    }
}