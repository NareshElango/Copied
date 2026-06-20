using System.ComponentModel.DataAnnotations;

namespace All_In_One.API.DTOs
{
    public class TenantTypeDto
    {
        public int TenantTypeId { get; set; }

        [Required(ErrorMessage = "Type Name is required")]
        [StringLength(100)]
        public string TypeName { get; set; }

        public string Description { get; set; }

        // ✅ For table display
        public int OrganizationCount { get; set; }

        // ✅ OPTIONAL (for details page)
        public List<OrganizationDto>? Organizations { get; set; }
    }
}