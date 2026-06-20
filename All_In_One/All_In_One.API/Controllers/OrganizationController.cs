using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One.Data.Context;
using All_In_One.Domain.Entities.Tenant;
using All_In_One.API.DTOs;

namespace All_In_One.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrganizationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==================================
        // GET ALL
        // ==================================
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _context.Organizations
                .Include(o => o.TenantType)
                .Include(o => o.Country)
                .Include(o => o.State)
                .Include(o => o.District)
                .Select(o => new OrganizationDto
                {
                    OrganizationId = o.OrganizationId,
                    OrganizationCode = o.OrganizationCode,
                    OrganizationName = o.OrganizationName,

                    TenantTypeId = o.TenantTypeId,
                    CountryId = o.CountryId,
                    StateId = o.StateId,
                    DistrictId = o.DistrictId,

                    Email = o.Email,
                    Phone = o.Phone,

                    TenantTypeName = o.TenantType != null
                        ? o.TenantType.TypeName
                        : "",

                    CountryName = o.Country != null
                        ? o.Country.CountryName
                        : "",

                    StateName = o.State != null
                        ? o.State.StateName
                        : "",

                    DistrictName = o.District != null
                        ? o.District.DistrictName
                        : ""
                })
                .ToListAsync();

            return Ok(data);
        }

        // ==================================
        // GET BY ID
        // ==================================
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var organization = await _context.Organizations
                .Include(o => o.TenantType)
                .Include(o => o.Country)
                .Include(o => o.State)
                .Include(o => o.District)
                .Where(o => o.OrganizationId == id)
                .Select(o => new OrganizationDto
                {
                    OrganizationId = o.OrganizationId,
                    OrganizationCode = o.OrganizationCode,
                    OrganizationName = o.OrganizationName,

                    TenantTypeId = o.TenantTypeId,
                    CountryId = o.CountryId,
                    StateId = o.StateId,
                    DistrictId = o.DistrictId,

                    Email = o.Email,
                    Phone = o.Phone,

                    TenantTypeName = o.TenantType.TypeName,
                    CountryName = o.Country.CountryName,
                    StateName = o.State.StateName,
                    DistrictName = o.District.DistrictName
                })
                .FirstOrDefaultAsync();

            if (organization == null)
                return NotFound();

            return Ok(organization);
        }

        // ==================================
        // CREATE
        // ==================================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrganizationCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool tenantExists = await _context.TenantTypes
                .AnyAsync(x => x.TenantTypeId == dto.TenantTypeId);

            if (!tenantExists)
                return BadRequest("Invalid Tenant Type");

            bool countryExists = await _context.Countries
                .AnyAsync(x => x.CountryId == dto.CountryId);

            if (!countryExists)
                return BadRequest("Invalid Country");

            bool stateExists = await _context.States
                .AnyAsync(x => x.StateId == dto.StateId);

            if (!stateExists)
                return BadRequest("Invalid State");

            bool districtExists = await _context.Districts
                .AnyAsync(x => x.DistrictId == dto.DistrictId);

            if (!districtExists)
                return BadRequest("Invalid District");

            var entity = new Organization
            {
                OrganizationCode = dto.OrganizationCode,
                OrganizationName = dto.OrganizationName,

                TenantTypeId = dto.TenantTypeId,
                CountryId = dto.CountryId,
                StateId = dto.StateId,
                DistrictId = dto.DistrictId,

                Email = dto.Email,
                Phone = dto.Phone,

                CreatedDate = DateTime.UtcNow,
                IsActive = true,
                IsDeleted = false
            };

            _context.Organizations.Add(entity);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Organization created successfully",
                data = entity
            });
        }

        // ==================================
        // UPDATE
        // ==================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] OrganizationCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var entity = await _context.Organizations
                .FirstOrDefaultAsync(x => x.OrganizationId == id);

            if (entity == null)
                return NotFound();

            entity.OrganizationCode = dto.OrganizationCode;
            entity.OrganizationName = dto.OrganizationName;

            entity.TenantTypeId = dto.TenantTypeId;
            entity.CountryId = dto.CountryId;
            entity.StateId = dto.StateId;
            entity.DistrictId = dto.DistrictId;

            entity.Email = dto.Email;
            entity.Phone = dto.Phone;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Organization updated successfully"
            });
        }

        // ==================================
        // DELETE
        // ==================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.Organizations
                .FirstOrDefaultAsync(x => x.OrganizationId == id);

            if (entity == null)
                return NotFound();

            _context.Organizations.Remove(entity);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Organization deleted successfully"
            });
        }
    }
}