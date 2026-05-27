using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models;

public partial class CarRental_VehicleAddonConnection
{
    [Key]
    public short id { get; set; }

    public short addonId { get; set; }
    
    public short vehicleId { get; set; }
}

public partial class CarRental_UpdateVehicleAddonConnection_Request
{
    public short vehicleId { get; set; }
    public List<short>? addonIds { get; set; }
}
