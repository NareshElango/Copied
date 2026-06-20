using All_In_One.Domain.Common.All_In_One.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Entities.Geography
{
    public class State : BaseEntity
    {
        public int StateId { get; set; }
        public string StateName { get; set; }

        public int CountryId { get; set; }
        public Country Country { get; set; }

        public ICollection<District> Districts { get; set; }
    }
}
