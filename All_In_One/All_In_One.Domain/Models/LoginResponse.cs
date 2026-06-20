using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Models
{
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
    }
}
