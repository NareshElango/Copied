namespace All_In_One.API.DTOs
{
    public class UserDto
    {
        public int UserId { get; set; }

        public string Name { get; set; }

        public int UserTypeId { get; set; }
        public string UserTypeName { get; set; }

        public int? OrganizationId { get; set; }
        public string OrganizationName { get; set; }

        public int? BranchId { get; set; }
        public string BranchName { get; set; }

        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public int RoleId { get; set; }
        public string RoleName { get; set; }

        public int PermissionId { get; set; }
        public string PermissionName { get; set; }
    }
}