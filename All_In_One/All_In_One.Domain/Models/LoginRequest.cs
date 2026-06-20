using System;
using System.Collections.Generic;
using System.Text;

namespace All_In_One.Domain.Models
{
    public class LoginRequest
    {
        public string OrganizationCode { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
