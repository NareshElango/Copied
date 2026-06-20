using System.ComponentModel.DataAnnotations;

namespace All_In_One.API.DTOs
{
    public class StateDto
    {
        public int StateId { get; set; }

        [Required(ErrorMessage = "State name is required")]
        public string StateName { get; set; }

        [Required(ErrorMessage = "Country is required")]
        public int CountryId { get; set; }

        public string? CountryName { get; set; } // 🔥 IMPORTANT
    }
}