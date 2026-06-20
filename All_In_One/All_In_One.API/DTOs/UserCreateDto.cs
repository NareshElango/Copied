using System.ComponentModel.DataAnnotations;

namespace All_In_One.API.DTOs
{
    public class UserCreateDto
    {
        public string Name { get; set; }
        public int UserTypeId { get; set; }
        public int? OrganizationId { get; set; }
        public int? BranchId { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        //public string Password { get; set; }

        public int RoleId { get; set; }

        public int PermissionId { get; set; } = 1;
    }
}