using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models
{
    public class Users
    {
        [Key]
        public short id { get; set; }

        [MaxLength(50)]
        public string? username { get; set; }

        [MaxLength(16)]
        public string? password { get; set; }

        public string? email { get; set; }

        [MaxLength(50)]
        public string? first_name { get; set; }

        [MaxLength(50)]
        public string? last_name { get; set; }

        [MaxLength(16)]
        public string? reset_token { get; set; }

        public short role { get; set; }
        
        public short company_announcement_id { get; set; }
    }

    public class Users_Request
    {
        public short? id { get; set; }

        public string? username { get; set; }

        public string? email { get; set; }

        public string? first_name { get; set; }

        public string? last_name { get; set; }

        public short? role { get; set; }

        public short? company_announcement_id { get; set; }
    }

    public class AuthenticateUserRequest
    {
        public string? username { get; set; }
        public string? password { get; set; }
    }
}