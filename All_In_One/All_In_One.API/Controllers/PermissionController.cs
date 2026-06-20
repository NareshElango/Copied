using All_In_One.API.DTOs;
using All_In_One.Data.Context;
using All_In_One.Domain.Entities.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace All_In_One.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermissionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PermissionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= GET ALL =================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var permissions = await _context.Permissions
                .Select(x => new PermissionDto
                {
                    PermissionId = x.PermissionId,
                    PermissionName = x.PermissionName
                })
                .ToListAsync();

            return Ok(permissions);
        }

        // ================= GET BY ID =================
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var permission = await _context.Permissions
                .Where(x => x.PermissionId == id)
                .Select(x => new PermissionDto
                {
                    PermissionId = x.PermissionId,
                    PermissionName = x.PermissionName
                })
                .FirstOrDefaultAsync();

            if (permission == null)
                return NotFound(new { message = "Permission not found" });

            return Ok(permission);
        }

        // ================= CREATE =================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PermissionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var permission = new Permission
            {
                PermissionName = dto.PermissionName
            };

            _context.Permissions.Add(permission);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Permission created successfully" });
        }

        // ================= UPDATE =================
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] PermissionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var permission = await _context.Permissions.FindAsync(id);

            if (permission == null)
                return NotFound(new { message = "Permission not found" });

            permission.PermissionName = dto.PermissionName;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Permission updated successfully" });
        }

        // ================= DELETE =================
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var permission = await _context.Permissions.FindAsync(id);

            if (permission == null)
                return NotFound(new { message = "Permission not found" });

            _context.Permissions.Remove(permission);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Permission deleted successfully" });
        }
    }
}