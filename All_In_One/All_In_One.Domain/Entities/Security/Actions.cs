using All_In_One.Domain.Common.All_In_One.Domain.Common;

namespace All_In_One.Domain.Entities.Security
{
    public class Actions : BaseEntity
    {
        public int ActionId { get; set; }

        public string ActionTitle { get; set; } = string.Empty;

        public string ActionDescription { get; set; } = string.Empty;

        public ICollection<ActionRole> ActionRoles { get; set; }
       = new List<ActionRole>();
    }
}