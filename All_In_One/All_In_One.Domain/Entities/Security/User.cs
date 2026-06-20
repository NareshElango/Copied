using All_In_One.Domain.Common.All_In_One.Domain.Common;
using All_In_One.Domain.Entities.Tenant;

namespace All_In_One.Domain.Entities.Security
{
    public class User : BaseEntity
    {
        public int UserId { get; set; }


        public int? OrganizationId { get; set; }
        public Organization? Organization { get; set; }


        public int? BranchId { get; set; }
        public OrganizationBranch? Branch { get; set; }


        public int UserTypeId { get; set; }
        public UserType UserType { get; set; } = null!;


        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;


        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        //public string PasswordHash { get; set; } = string.Empty;


        public bool IsEmailVerified { get; set; }

        public bool IsPhoneVerified { get; set; }
    }
}