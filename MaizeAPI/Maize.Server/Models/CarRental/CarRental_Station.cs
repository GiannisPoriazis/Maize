using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models;

public partial class CarRental_Station
{
    [Key]
    public short id { get; set; }

    [MaxLength(50)]
    public string? station_name { get; set; }

    public string? station_address { get; set; }
}

public class CarRental_Station_Request
{
    public short? id { get; set; }

    public string? station_name { get; set; }

    public string? station_address { get; set; }
}