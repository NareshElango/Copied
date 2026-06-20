using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One.Data.Context;
using All_In_One.Domain.Entities.Tenant;
using All_In_One.API.DTOs;

namespace All_In_One.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationBranchController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrganizationBranchController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL
        // =========================
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _context.OrganizationBranches
                .Include(b => b.Organization)
                .Include(b => b.Division)
                .Select(b => new OrganizationBranchDto
                {
                    BranchId = b.BranchId,
                    BranchName = b.BranchName,
                    OrganizationId = b.OrganizationId,
                    DivisionId = b.DivisionId,
                    Address = b.Address,
                    Phone = b.Phone,
                    OrganizationName = b.Organization.OrganizationName,
                    DivisionName = b.Division.DivisionName
                })
                .ToListAsync();

            return Ok(data);
        }

        // =========================
        // CREATE
        // =========================
        [HttpPost]
        public async Task<IActionResult> Create(OrganizationBranchDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // FK VALIDATION
            var orgExists = await _context.Organizations
                .AnyAsync(o => o.OrganizationId == dto.OrganizationId);

            var divisionExists = await _context.Divisions
                .AnyAsync(d => d.DivisionId == dto.DivisionId);

            if (!orgExists)
                return BadRequest("Invalid OrganizationId");

            if (!divisionExists)
                return BadRequest("Invalid DivisionId");

            var entity = new OrganizationBranch
            {
                BranchName = dto.BranchName,
                OrganizationId = dto.OrganizationId,
                DivisionId = dto.DivisionId,
                Address = dto.Address,
                Phone = dto.Phone,
                CreatedDate = DateTime.UtcNow,
                IsActive = true,
                IsDeleted = false
            };

            _context.OrganizationBranches.Add(entity);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // =========================
        // UPDATE
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, OrganizationBranchDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var entity = await _context.OrganizationBranches.FindAsync(id);

            if (entity == null)
                return NotFound();

            entity.BranchName = dto.BranchName;
            entity.OrganizationId = dto.OrganizationId;
            entity.DivisionId = dto.DivisionId;
            entity.Address = dto.Address;
            entity.Phone = dto.Phone;

            await _context.SaveChangesAsync();

            return Ok();
        }

        // =========================
        // DELETE
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.OrganizationBranches.FindAsync(id);

            if (entity == null)
                return NotFound();

            _context.OrganizationBranches.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}