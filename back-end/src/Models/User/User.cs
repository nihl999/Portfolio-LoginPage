namespace back_end.Models.User
{
    public class User
    {
        public int Id;
        public string Username { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public bool Admin = false;
    }
}