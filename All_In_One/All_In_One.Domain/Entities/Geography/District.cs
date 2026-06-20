using All_In_One.Domain.Common.All_In_One.Domain.Common;
using All_In_One.Domain.Entities.Tenant;
using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Entities.Geography
{
    public class District : BaseEntity
    {
        public int DistrictId { get; set; }
        public string DistrictName { get; set; }

        public int StateId { get; set; }
        public State State { get; set; }

        public ICollection<Division> Divisions { get; set; }
        public ICollection<Organization> Organizations { get; set; }

    }
}
