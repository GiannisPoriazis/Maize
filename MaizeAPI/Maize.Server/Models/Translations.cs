using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models
{
    public class Translations
    {
        [Key]
        public short id { get; set; }

        [MaxLength(50)]
        public string? translationKey { get; set; }

        [MaxLength(100)]
        public string? en { get; set; }

        [MaxLength(100)]
        public string? el { get; set; }
    }
}