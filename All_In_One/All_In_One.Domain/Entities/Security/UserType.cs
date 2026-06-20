using All_In_One.Domain.Common.All_In_One.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Entities.Security
{
    public class UserType : BaseEntity
    {
        public int UserTypeId { get; set; }
        public string TypeName { get; set; }

        public ICollection<User> Users { get; set; }
    }
}
