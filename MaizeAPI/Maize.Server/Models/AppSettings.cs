using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models
{
    public class AppSettings
    {
        [Key]
        public short userId { get; set; }
        [MaxLength(5)]
        public string? language { get; set; }
        public short fontsize { get; set; }
        public short theme { get; set; }
        public short timezone { get; set; }
        public short grid_theme { get; set; }
        public short notification_sound { get; set; }
        public short notification_alerts { get; set; }
        [MaxLength(6)]
        public string? pin { get; set; }
        public short lock_screen { get; set; }
        public short lock_screen_timeout { get; set; }

    }
}
