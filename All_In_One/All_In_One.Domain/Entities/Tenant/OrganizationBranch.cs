using All_In_One.Domain.Common.All_In_One.Domain.Common;
using All_In_One.Domain.Entities.Geography;
using All_In_One.Domain.Entities.Security;
using All_In_One.Domain.Entities.Tenant;

public class OrganizationBranch : BaseEntity
{
    public int BranchId { get; set; }

    public int OrganizationId { get; set; }
    public Organization? Organization { get; set; }

    public string BranchName { get; set; } = string.Empty;

    public int DivisionId { get; set; }
    public Division? Division { get; set; }

    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;

    public ICollection<User> Users { get; set; } = new List<User>();
}