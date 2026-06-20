using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One.Data.Context;
using All_In_One.Domain.Entities.Tenant;
using All_In_One.API.DTOs;

namespace All_In_One.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TenantTypeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TenantTypeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL (LIGHTWEIGHT)
        // =========================
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _context.TenantTypes
                .Select(t => new TenantTypeDto
                {
                    TenantTypeId = t.TenantTypeId,
                    TypeName = t.TypeName,
                    Description = t.Description,
                    OrganizationCount = t.Organizations.Count()
                })
                .ToListAsync();

            return Ok(data);
        }

        // =========================
        // GET BY ID (WITH ORGANIZATIONS)
        // =========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _context.TenantTypes
                .Include(t => t.Organizations)
                .Where(t => t.TenantTypeId == id)
                .Select(t => new TenantTypeDto
                {
                    TenantTypeId = t.TenantTypeId,
                    TypeName = t.TypeName,
                    Description = t.Description,

                    OrganizationCount = t.Organizations.Count(),

                    Organizations = t.Organizations.Select(o => new OrganizationDto
                    {
                        OrganizationId = o.OrganizationId,
                        OrganizationCode = o.OrganizationCode,
                        OrganizationName = o.OrganizationName,
                        TenantTypeId = o.TenantTypeId,
                        DistrictId = o.DistrictId,
                        Email = o.Email,
                        Phone = o.Phone,

                        TenantTypeName = t.TypeName,
                        DistrictName = o.District.DistrictName
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (data == null)
                return NotFound();

            return Ok(data);
        }

        // =========================
        // CREATE
        // =========================
        [HttpPost]
        public async Task<IActionResult> Create(TenantTypeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var entity = new TenantType
            {
                TypeName = dto.TypeName,
                Description = dto.Description,
                CreatedDate = DateTime.UtcNow,
                IsActive = true,
                IsDeleted = false
            };

            _context.TenantTypes.Add(entity);
            await _context.SaveChangesAsync();

            dto.TenantTypeId = entity.TenantTypeId;

            return Ok(dto);
        }

        // =========================
        // UPDATE
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TenantTypeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var entity = await _context.TenantTypes.FindAsync(id);

            if (entity == null)
                return NotFound();

            entity.TypeName = dto.TypeName;
            entity.Description = dto.Description;

            await _context.SaveChangesAsync();

            return Ok();
        }

        // =========================
        // DELETE
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.TenantTypes.FindAsync(id);

            if (entity == null)
                return NotFound();

            _context.TenantTypes.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}