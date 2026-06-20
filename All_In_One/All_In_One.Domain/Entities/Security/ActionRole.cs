using All_In_One.Domain.Common;
using All_In_One.Domain.Common.All_In_One.Domain.Common;

namespace All_In_One.Domain.Entities.Security
{
    public class ActionRole : BaseEntity
    {
        public int ActionId { get; set; }
        public Actions Action { get; set; }

        public int RoleId { get; set; }
        public Role Role { get; set; }

    }
}