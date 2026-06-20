using System.ComponentModel.DataAnnotations;

namespace All_In_One.API.DTOs
{
    public class DivisionDto
    {
        public int DivisionId { get; set; }

        [Required(ErrorMessage = "Division name is required")]
        [StringLength(100, ErrorMessage = "Max 100 characters")]
        public string DivisionName { get; set; }

        [Required(ErrorMessage = "District is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid DistrictId")]
        public int DistrictId { get; set; }
        public string? DistrictName { get; set; }
    
}
}