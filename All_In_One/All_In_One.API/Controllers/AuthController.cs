using All_In_One.Domain.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace All_In_One.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] Domain.Models.LoginRequest request)
        {
            // Default static login credentials
            var defaultOrgCode = "AIO001";
            var defaultEmail = "admin@allinone.com";
            var defaultPassword = "Admin@123";

            if (request.OrganizationCode == defaultOrgCode &&
                request.Email == defaultEmail &&
                request.Password == defaultPassword)
            {
                var response = new LoginResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Token = "dummy-token-12345",
                    UserName = "Admin User"
                };

                return Ok(response);
            }

            return Unauthorized(new LoginResponse
            {
                Success = false,
                Message = "Invalid organization code, email, or password"
            });
        }
    }
}