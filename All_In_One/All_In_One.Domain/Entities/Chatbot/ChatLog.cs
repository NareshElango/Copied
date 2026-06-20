using All_In_One.Domain.Common.All_In_One.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Entities.Chatbot
{
    public class ChatLog : BaseEntity
    {
        public int ChatLogId { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; }

        public string Intent { get; set; }
        public string Response { get; set; }
    }
}
