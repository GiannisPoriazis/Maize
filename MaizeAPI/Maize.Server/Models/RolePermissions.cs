using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models
{
    public class RolePermissions
    {
        [Key]
        public short id { get; set; }

        [MaxLength(50)]
        public string? name { get; set; }

        public short roleId { get; set; }
    }
}
