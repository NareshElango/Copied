using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One.Data.Context;
using All_In_One.Domain.Entities.Geography;
using All_In_One.API.DTOs;

namespace All_In_One.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DivisionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DivisionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL
        // =========================
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _context.Divisions
                .Include(d => d.District)
                .Select(d => new DivisionDto
                {
                    DivisionId = d.DivisionId,
                    DivisionName = d.DivisionName,
                    DistrictId = d.DistrictId,
                    DistrictName = d.District.DistrictName
                })
                .ToListAsync();

            return Ok(data);
        }

        // =========================
        // CREATE
        // =========================
        [HttpPost]
        public async Task<IActionResult> Create(DivisionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // 🔥 FK validation (District must exist)
            var districtExists = await _context.Districts
                .AnyAsync(d => d.DistrictId == dto.DistrictId);

            if (!districtExists)
                return BadRequest("Invalid DistrictId");

            var division = new Division
            {
                DivisionName = dto.DivisionName,
                DistrictId = dto.DistrictId,

                // BaseEntity fields (if exist)
                CreatedDate = DateTime.UtcNow,
                IsActive = true,
                IsDeleted = false
            };

            _context.Divisions.Add(division);
            await _context.SaveChangesAsync();

            dto.DivisionId = division.DivisionId;

            return Ok(dto);
        }

        // =========================
        // UPDATE
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, DivisionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var division = await _context.Divisions.FindAsync(id);

            if (division == null)
                return NotFound();

            var districtExists = await _context.Districts
                .AnyAsync(d => d.DistrictId == dto.DistrictId);

            if (!districtExists)
                return BadRequest("Invalid DistrictId");

            division.DivisionName = dto.DivisionName;
            division.DistrictId = dto.DistrictId;

            await _context.SaveChangesAsync();

            return Ok();
        }

        // =========================
        // DELETE
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var division = await _context.Divisions.FindAsync(id);

            if (division == null)
                return NotFound();

            _context.Divisions.Remove(division);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}