namespace All_In_One.API.DTOs
{
    public class RoleDto
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public List<int>? ActionIds { get; set; }
    }
}
