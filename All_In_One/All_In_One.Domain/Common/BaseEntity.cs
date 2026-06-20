using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Common
{
    namespace All_In_One.Domain.Common
    {
        public abstract class BaseEntity
        {
            public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
            public bool IsActive { get; set; } = true;
            public bool IsDeleted { get; set; } = false;
        }
    }
}
