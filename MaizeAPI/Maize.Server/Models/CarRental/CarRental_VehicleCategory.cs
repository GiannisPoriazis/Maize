using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models;

public partial class CarRental_VehicleCategory
{
    [Key]
    public short id { get; set; }

    [MaxLength(50)]
    public string? description { get; set; }

    public short vehicle_type_id { get; set; }
}

public partial class CarRental_VehicleCategory_Request
{
    public short? id { get; set; }

    public string? description { get; set; }

    public short? vehicle_type_id { get; set; }
}