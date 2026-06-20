using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One.Data.Context;
using All_In_One.Domain.Entities.Security;
using All_In_One.API.DTOs;

namespace All_In_One.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserTypeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserTypeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= GET ALL =================
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _context.UserTypes
                .Select(x => new UserTypeDto
                {
                    UserTypeId = x.UserTypeId,
                    TypeName = x.TypeName
                })
                .ToListAsync();

            return Ok(data);
        }

        // ================= CREATE =================
        [HttpPost]
        public async Task<IActionResult> Create(UserTypeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var exists = await _context.UserTypes
                .AnyAsync(x => x.TypeName.ToLower() == dto.TypeName.ToLower());

            if (exists)
                return BadRequest("UserType already exists");

            var entity = new UserType
            {
                TypeName = dto.TypeName,
                CreatedDate = DateTime.UtcNow,
                IsActive = true,
                IsDeleted = false
            };

            _context.UserTypes.Add(entity);
            await _context.SaveChangesAsync();

            dto.UserTypeId = entity.UserTypeId;

            return Ok(dto);
        }

        // ================= UPDATE =================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UserTypeDto dto)
        {
            var entity = await _context.UserTypes.FindAsync(id);

            if (entity == null)
                return NotFound();

            var exists = await _context.UserTypes
                .AnyAsync(x =>
                    x.TypeName.ToLower() == dto.TypeName.ToLower()
                    && x.UserTypeId != id);

            if (exists)
                return BadRequest("UserType already exists");

            entity.TypeName = dto.TypeName;

            await _context.SaveChangesAsync();

            return Ok();
        }

        // ================= DELETE =================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.UserTypes.FindAsync(id);

            if (entity == null)
                return NotFound();

            _context.UserTypes.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}