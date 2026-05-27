using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models;

public class CarRental_Vehicle
{
    [Key]
    public short id { get; set; }

    [MaxLength(10)]
    public string? registration { get; set; }

    public short model_id { get; set; }

    [MaxLength(17)]
    public string? vin { get; set; }

    public short? year { get; set; }

    public short? cc { get; set; }

    [MaxLength(10)]
    public string? color { get; set; }

    public short? gears { get; set; }

    public int mileage { get; set; }

    public short pool_type { get; set; }

    public short state { get; set; }

    [MaxLength(50)]
    public string? insurance_company { get; set; }

    public string? insurance_expiry { get; set; }

    public decimal daily_rate { get; set; }
    public short passengers { get; set; }
    public short air_condition { get; set; }
    public short doors { get; set; }
    public short radio { get; set; }
    public short gps { get; set; }
    public short touch_screen { get; set; }
    public short parking_camera { get; set; }
    public short usb { get; set; }
    public short bluetooth { get; set; }
    public short mirrorlink { get; set; }
    public short license_required { get; set; }
    public short driver_minimum_age { get; set; }
}

public class CarRental_VehicleUpsert_Request
{
    public CarRental_Vehicle vehicle { get; set; }
    public List<short> addonIds { get; set; }
}

public class CarRental_Vehicle_Request
{
    public short? id { get; set; }

    public string? registration { get; set; }

    public short? model_id { get; set; }

    public string? vin { get; set; }

    public short? year { get; set; }

    public short? cc { get; set; }

    public string? color { get; set; }

    public short? gears { get; set; }

    public int? mileage { get; set; }

    public short? pool_type { get; set; }

    public short? state { get; set; }

    public string? insurance_company { get; set; }

    public string? insurance_expiry { get; set; }

    public decimal? daily_rate { get; set; }
}