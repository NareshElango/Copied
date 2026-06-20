using All_In_One.Domain.Common.All_In_One.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Entities.Geography
{
    public class Country : BaseEntity
    {
        public int CountryId { get; set; }
        public string CountryName { get; set; }

        public ICollection<State> States { get; set; }
    }
}
