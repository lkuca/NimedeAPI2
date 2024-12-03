namespace NimedeAPI.Modules
{
    public class NameRequest
    {
        public string Name { get; set; }
        public string Gender { get; set; } // Options: "mees", "naine", "other"
        public string? CustomGender { get; set; }
    }
}
