using All_In_One.API.DTOs;
using All_In_One.Data.Context;
using All_In_One.Domain.Entities.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace All_In_One.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ActionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= GET ALL =================

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.Actions
                .OrderBy(x => x.ActionId)
                .Select(x => new
                {
                    actionId = x.ActionId,
                    actionTitle = x.ActionTitle,
                    actionDescription = x.ActionDescription
                })
                .ToListAsync();

            return Ok(data);
        }

        // ================= GET BY ID =================

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _context.Actions
                .Where(x => x.ActionId == id)
                .Select(x => new
                {
                    actionId = x.ActionId,
                    actionTitle = x.ActionTitle,
                    actionDescription = x.ActionDescription
                })
                .FirstOrDefaultAsync();

            if (data == null)
                return NotFound();

            return Ok(data);
        }

        // ================= CREATE =================

        [HttpPost]
        public async Task<IActionResult> Create(ActionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool exists = await _context.Actions.AnyAsync(x =>
                x.ActionTitle.ToLower() ==
                dto.ActionTitle.ToLower());

            if (exists)
            {
                return BadRequest(new
                {
                    message = "Action already exists"
                });
            }

            var action = new Actions
            {
                ActionTitle = dto.ActionTitle,
                ActionDescription = dto.ActionDescription
            };

            _context.Actions.Add(action);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Action created successfully"
            });
        }

        // ================= UPDATE =================

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            ActionDto dto)
        {
            var action = await _context.Actions
                .FirstOrDefaultAsync(x => x.ActionId == id);

            if (action == null)
                return NotFound();

            bool duplicate = await _context.Actions.AnyAsync(x =>
                x.ActionId != id &&
                x.ActionTitle.ToLower() ==
                dto.ActionTitle.ToLower());

            if (duplicate)
            {
                return BadRequest(new
                {
                    message = "Action already exists"
                });
            }

            action.ActionTitle = dto.ActionTitle;
            action.ActionDescription = dto.ActionDescription;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Action updated successfully"
            });
        }

        // ================= DELETE =================

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var action = await _context.Actions
                .FirstOrDefaultAsync(x => x.ActionId == id);

            if (action == null)
                return NotFound();

            _context.Actions.Remove(action);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Action deleted successfully"
            });
        }
    }
}