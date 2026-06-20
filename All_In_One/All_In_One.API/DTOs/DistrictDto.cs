using System.ComponentModel.DataAnnotations;

namespace All_In_One.API.DTOs
{
    public class DistrictDto
    {
        public int DistrictId { get; set; }

        [Required(ErrorMessage = "District name is required")]
        [StringLength(100, ErrorMessage = "Max 100 characters")]
        public string DistrictName { get; set; }

        [Required(ErrorMessage = "State is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid StateId")]
        public int StateId { get; set; }
    }
}