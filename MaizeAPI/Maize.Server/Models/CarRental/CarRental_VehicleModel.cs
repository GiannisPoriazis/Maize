using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models;

public partial class CarRental_VehicleModel
{
    [Key]
    public short id { get; set; }

    [MaxLength(50)]
    public string? description { get; set; }

    public short vehicle_category_id { get; set; }
}

public class CarRental_VehicleModel_Request
{
    public short? id { get; set; }

    public string? description { get; set; }

    public short? vehicle_category_id { get; set; }
}
