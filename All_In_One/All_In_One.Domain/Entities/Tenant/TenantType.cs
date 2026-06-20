using All_In_One.Domain.Common.All_In_One.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Entities.Tenant
{
    public class TenantType : BaseEntity
    {
        public int TenantTypeId { get; set; }
        public string TypeName { get; set; }
        public string Description { get; set; }

        public ICollection<Organization> Organizations { get; set; }
    }
}
