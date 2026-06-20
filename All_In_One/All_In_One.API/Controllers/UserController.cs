using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One.Data.Context;
using All_In_One.Domain.Entities.Security;
using All_In_One.API.DTOs;


namespace All_In_One.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly ApplicationDbContext _context;


        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }



        // =========================
        // GET USERS
        // =========================
        [HttpGet]
        public async Task<IActionResult> Get()
        {

            var users = await _context.Users
                .Include(x => x.UserType)
                .Include(x => x.Organization)
                .Include(x => x.Branch)
                .Include(x => x.Role)
                .ToListAsync();



            var result = users.Select(u => new UserDto
            {
                UserId = u.UserId,

                Name = u.Name,

                Email = u.Email,

                PhoneNumber = u.PhoneNumber,


                UserTypeId = u.UserTypeId,

                UserTypeName = u.UserType?.TypeName,


                OrganizationId = u.OrganizationId,

                OrganizationName = u.Organization?.OrganizationName,


                BranchId = u.BranchId,

                BranchName = u.Branch?.BranchName,


                RoleId = u.RoleId,

                RoleName = u.Role?.RoleName,


                PermissionId = 1,

                PermissionName = "Default Permission"


            }).ToList();



            return Ok(result);
        }




        // =========================
        // CREATE USER
        // =========================
        [HttpPost]
        public async Task<IActionResult> Create(UserCreateDto dto)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);



            var user = new User
            {
                Name = dto.Name,

                Email = dto.Email,

                PhoneNumber = dto.PhoneNumber,


                UserTypeId = dto.UserTypeId,


                OrganizationId = dto.OrganizationId,

                BranchId = dto.BranchId,


                RoleId = dto.RoleId,


                //PasswordHash =
                //BCrypt.Net.BCrypt.HashPassword(dto.Password),


                CreatedDate = DateTime.UtcNow,

                IsActive = true,

                IsDeleted = false
            };



            _context.Users.Add(user);


            await _context.SaveChangesAsync();



            return Ok(new
            {
                message = "User created successfully"
            });
        }





        // =========================
        // UPDATE USER
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            UserCreateDto dto)
        {

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserId == id);



            if (user == null)
                return NotFound();




            user.Name = dto.Name;

            user.Email = dto.Email;

            user.PhoneNumber = dto.PhoneNumber;


            user.UserTypeId = dto.UserTypeId;


            user.OrganizationId = dto.OrganizationId;

            user.BranchId = dto.BranchId;


            user.RoleId = dto.RoleId;




            //if (!string.IsNullOrWhiteSpace(dto.Password))
            //{
            //    user.PasswordHash =
            //        BCrypt.Net.BCrypt.HashPassword(dto.Password);
            //}




            await _context.SaveChangesAsync();



            return Ok(new
            {
                message = "User updated successfully"
            });

        }





        // =========================
        // DELETE USER
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserId == id);



            if (user == null)
                return NotFound();




            _context.Users.Remove(user);


            await _context.SaveChangesAsync();



            return Ok(new
            {
                message = "User deleted successfully"
            });

        }

    }
}