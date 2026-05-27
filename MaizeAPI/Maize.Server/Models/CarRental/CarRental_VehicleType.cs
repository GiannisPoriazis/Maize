using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models
{
    public partial class CarRental_VehicleType
    {
        [Key]
        public short id { get; set; }

        [MaxLength(50)]
        public string? description { get; set; }
    }

    public class CarRental_VehicleType_Request
    {
        public short? id { get; set; }
        public string? description { get; set; }
    }
}
