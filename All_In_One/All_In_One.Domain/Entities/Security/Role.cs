using All_In_One.Domain.Common.All_In_One.Domain.Common;

namespace All_In_One.Domain.Entities.Security
{
    public class Role : BaseEntity
    {
        public int RoleId { get; set; }

        public string RoleName { get; set; } = null!;

        public ICollection<UserRole> UserRoles { get; set; }
            = new List<UserRole>();

        public ICollection<RolePermission> RolePermissions { get; set; }
            = new List<RolePermission>();

        public ICollection<ActionRole> ActionRoles { get; set; }
            = new List<ActionRole>();
    }   
}