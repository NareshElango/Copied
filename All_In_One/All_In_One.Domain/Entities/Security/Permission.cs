using All_In_One.Domain.Common.All_In_One.Domain.Common;

namespace All_In_One.Domain.Entities.Security
{
    public class Permission : BaseEntity
    {
        public int PermissionId { get; set; }
        public string PermissionName { get; set; } = null!;

        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}