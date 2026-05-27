using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models;

public partial class CarRental_VehicleAddon
{
    [Key]
    public short id { get; set; }

    [MaxLength(50)]
    public string? title { get; set; }

    [MaxLength(50)]
    public string? description { get; set; }

    public short rate { get; set; }

    public short max_quantity { get; set; }
}
