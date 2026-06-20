using System.ComponentModel.DataAnnotations;

namespace All_In_One.API.DTOs
{
    public class OrganizationCreateDto
    {
        [Required]
        public string OrganizationCode { get; set; }

        [Required]
        public string OrganizationName { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "TenantType is required")]
        public int TenantTypeId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Country is required")]
        public int CountryId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "State is required")]
        public int StateId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "District is required")]
        public int DistrictId { get; set; }

        public string? Email { get; set; }

        public string? Phone { get; set; }
    }
}