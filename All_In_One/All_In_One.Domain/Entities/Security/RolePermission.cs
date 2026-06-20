using All_In_One.Domain.Common.All_In_One.Domain.Common;

namespace All_In_One.Domain.Entities.Security
{
    public class RolePermission : BaseEntity
    {
        public int RolePermissionId { get; set; }

        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;

        public int PermissionId { get; set; }
        public Permission Permission { get; set; } = null!;
    }
}