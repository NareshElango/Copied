using System.ComponentModel.DataAnnotations;

namespace All_In_One.API.DTOs
{
    public class ActionDto
    {
        public int ActionId { get; set; }

        [Required]
        public string ActionTitle { get; set; } = string.Empty;

        [Required]
        public string ActionDescription { get; set; } = string.Empty;

    }
}