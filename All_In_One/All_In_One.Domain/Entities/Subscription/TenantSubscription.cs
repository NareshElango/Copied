using All_In_One.Domain.Common.All_In_One.Domain.Common;
using All_In_One.Domain.Entities.Tenant;
using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Entities.Subscription
{
    public class TenantSubscription : BaseEntity
    {
        public int TenantSubscriptionId { get; set; }

        public int OrganizationId { get; set; }
        public Organization? Organization { get; set; }

        public int SubscriptionPlanId { get; set; }
        public SubscriptionPlan? SubscriptionPlan { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public bool IsSubscribed { get; set; }
    }
}
