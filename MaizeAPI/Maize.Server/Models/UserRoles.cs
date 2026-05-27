using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models
{
    public class UserRoles
    {
        [Key]
        public short id { get; set; }

        [MaxLength(50)]
        public string? name { get; set; }
    }

    public class UserRolePermissions
    {
        public short id { get; set; }
        public string? name { get; set; }
        public List<string>? permissions { get; set; }
    }
}
