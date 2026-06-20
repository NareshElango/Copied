using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One.Data.Context;
using All_In_One.Domain.Entities.Security;
using All_In_One.API.DTOs;

namespace All_In_One.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RoleController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL ROLES
        // =========================
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var roles = await _context.Roles
                .Include(r => r.ActionRoles)
                .ThenInclude(ar => ar.Action)
                .Select(r => new
                {
                    roleId = r.RoleId,
                    roleName = r.RoleName,

                    actionIds = r.ActionRoles
                        .Select(x => x.ActionId)
                        .ToList(),

                    actions = r.ActionRoles
                        .Select(x => new
                        {
                            actionId = x.ActionId,
                            actionTitle = x.Action.ActionTitle
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(roles);
        }

        // =========================
        // CREATE ROLE
        // =========================
        [HttpPost]
        public async Task<IActionResult> Create(RoleDto dto)
        {
            var role = new Role
            {
                RoleName = dto.RoleName
            };

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            if (dto.ActionIds != null && dto.ActionIds.Any())
            {
                foreach (var actionId in dto.ActionIds)
                {
                    _context.ActionRoles.Add(new ActionRole
                    {
                        RoleId = role.RoleId,
                        ActionId = actionId
                    });
                }

                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Role created successfully"
            });
        }

        // =========================
        // UPDATE ROLE
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RoleDto dto)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
                return NotFound();

            role.RoleName = dto.RoleName;

            // remove old mappings
            var oldMappings = _context.ActionRoles
                .Where(x => x.RoleId == id);

            _context.ActionRoles.RemoveRange(oldMappings);

            // add new mappings
            if (dto.ActionIds != null && dto.ActionIds.Any())
            {
                foreach (var actionId in dto.ActionIds)
                {
                    _context.ActionRoles.Add(new ActionRole
                    {
                        RoleId = id,
                        ActionId = actionId
                    });
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Role updated successfully"
            });
        }

        // =========================
        // DELETE ROLE
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
                return NotFound();

            var mappings = _context.ActionRoles
                .Where(x => x.RoleId == id);

            _context.ActionRoles.RemoveRange(mappings);

            _context.Roles.Remove(role);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Role deleted successfully"
            });
        }
    }
}