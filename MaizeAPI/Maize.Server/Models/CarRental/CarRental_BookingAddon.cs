using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models;

public partial class CarRental_BookingAddon
{
    [Key]
    public short id { get; set; }

    public short booking_id { get; set; }

    public short addon_id { get; set; }
    
    public short quantity { get; set; }
}