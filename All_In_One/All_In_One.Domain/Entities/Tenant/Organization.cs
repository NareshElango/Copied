using All_In_One.Domain.Common.All_In_One.Domain.Common;
using All_In_One.Domain.Entities.Geography;
using All_In_One.Domain.Entities.Security;
using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Entities.Tenant
{
    public class Organization : BaseEntity
    {
        public int OrganizationId { get; set; }
        public string OrganizationCode { get; set; }
        public string OrganizationName { get; set; }

        public int TenantTypeId { get; set; }
        public TenantType TenantType { get; set; }
        public int CountryId { get; set; }
        public Country Country { get; set; }

        public int StateId { get; set; }
        public State State { get; set; }
        public int DistrictId { get; set; }
        public District District { get; set; }

        public string Email { get; set; }
        public string Phone { get; set; }

        public ICollection<OrganizationBranch> Branches { get; set; }
        public ICollection<User> Users { get; set; }
    }
}
