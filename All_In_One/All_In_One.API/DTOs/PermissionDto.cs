using System.ComponentModel.DataAnnotations;

namespace All_In_One.API.DTOs
{
    public class PermissionDto
    {
        public int PermissionId { get; set; }

        [Required(ErrorMessage = "Permission Name is required")]
        [StringLength(100)]
        public string PermissionName { get; set; }
    }
}