using All_In_One.Domain.Common.All_In_One.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Entities.Chatbot
{
    public class ChatCommand : BaseEntity
    {
        public int ChatCommandId { get; set; }
        public string Intent { get; set; }
        public string Url { get; set; }
        public string Permission { get; set; }

        public int? TenantTypeId { get; set; }
    }
}
