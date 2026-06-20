using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One.Data.Context;
using All_In_One.Domain.Entities.Security;
using All_In_One.API.DTOs;

namespace All_In_One.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserRoleController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL
        // =========================
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _context.UserRoles
                .Include(x => x.User)
                .Include(x => x.Role)
                .Select(x => new UserRoleDto
                {
                    UserRoleId = x.UserRoleId,
                    UserId = x.UserId,
                    RoleId = x.RoleId,
                    UserName = x.User.Name,
                    RoleName = x.Role.RoleName
                })
                .ToListAsync();

            return Ok(data);
        }

        // =========================
        // CREATE
        // =========================
        [HttpPost]
        public async Task<IActionResult> Create(UserRoleDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // 🔥 Validate User
            var userExists = await _context.Users
                .AnyAsync(u => u.UserId == dto.UserId);

            if (!userExists)
                return BadRequest("Invalid UserId");

            // 🔥 Validate Role
            var roleExists = await _context.Roles
                .AnyAsync(r => r.RoleId == dto.RoleId);

            if (!roleExists)
                return BadRequest("Invalid RoleId");

            // 🔥 Prevent duplicate mapping
            var exists = await _context.UserRoles
                .AnyAsync(x => x.UserId == dto.UserId && x.RoleId == dto.RoleId);

            if (exists)
                return BadRequest("User already has this role");

            var entity = new UserRole
            {
                UserId = dto.UserId,
                RoleId = dto.RoleId,
                CreatedDate = DateTime.UtcNow,
                IsActive = true,
                IsDeleted = false
            };

            _context.UserRoles.Add(entity);
            await _context.SaveChangesAsync();

            dto.UserRoleId = entity.UserRoleId;

            return Ok(dto);
        }

        // =========================
        // UPDATE
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UserRoleDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var entity = await _context.UserRoles.FindAsync(id);
            if (entity == null)
                return NotFound();

            entity.UserId = dto.UserId;
            entity.RoleId = dto.RoleId;

            await _context.SaveChangesAsync();

            return Ok();
        }

        // =========================
        // DELETE
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.UserRoles.FindAsync(id);
            if (entity == null)
                return NotFound();

            _context.UserRoles.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}