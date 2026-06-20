using System.ComponentModel.DataAnnotations;

namespace All_In_One.API.DTOs
{
    public class UserRoleDto
    {
        public int UserRoleId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "User is required")]
        public int UserId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Role is required")]
        public int RoleId { get; set; }

        // 🔥 Display fields
        public string UserName { get; set; }
        public string RoleName { get; set; }
    }
}