using System.ComponentModel.DataAnnotations;

namespace All_In_One.API.DTOs
{
    public class OrganizationBranchDto
    {
        public int BranchId { get; set; }

        [Required(ErrorMessage = "Branch name is required")]
        public string BranchName { get; set; }

        [Required(ErrorMessage = "Organization is required")]
        [Range(1, int.MaxValue)]
        public int OrganizationId { get; set; }

        [Required(ErrorMessage = "Division is required")]
        [Range(1, int.MaxValue)]
        public int DivisionId { get; set; }

        public string? Address { get; set; }
        public string? Phone { get; set; }

        // ✅ OPTIONAL DISPLAY FIELDS (IMPORTANT)
        public string? OrganizationName { get; set; }
        public string? DivisionName { get; set; }
    }
}