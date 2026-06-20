using All_In_One.Domain.Common.All_In_One.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Entities.Subscription
{
    public class SubscriptionPlan : BaseEntity
    {
        public int SubscriptionPlanId { get; set; }

        public string PlanName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationInDays { get; set; }
        public string Description { get; set; } = string.Empty;

        public ICollection<TenantSubscription> TenantSubscriptions { get; set; } = new List<TenantSubscription>();
    }
}
