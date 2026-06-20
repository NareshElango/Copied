using All_In_One.Domain.Common.All_In_One.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Entities.Geography
{
    public class Division : BaseEntity
    {
        public int DivisionId { get; set; }
        public string DivisionName { get; set; }

        public int DistrictId { get; set; }
        public District District { get; set; }
    }
}
