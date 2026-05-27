using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models;

public class CarRental_SpecialRate
{
    [Key]
    public short id { get; set; }

    public short? vehicle_id { get; set; }

    public short? vehicle_model_id { get; set; }

    public short? vehicle_category_id { get; set; }

    public short? vehicle_type_id { get; set; }

    public short? discount { get; set; }

    public short? markup { get; set; }

    public short isPercentage { get; set; }

    [MaxLength(50)]
    public string? start_date { get; set; }

    [MaxLength(50)]
    public string? expiry_date { get; set; }

}

public class CarRental_SpecialRate_Request
{
    public short? id { get; set; }

    public short? vehicle_id { get; set; }

    public short? vehicle_model_id { get; set; }

    public short? vehicle_category_id { get; set; }

    public short? vehicle_type_id { get; set; }

    public short? discount { get; set; }

    public short? markup { get; set; }

    public short? isPercentage { get; set; }

    public string? start_date { get; set; }

    public string? expiry_date { get; set; }
}

public class CarRental_GetVehicleSpecialRates_Request
{
    public string bookingDate { get; set; }
    public CarRental_Vehicle[] vehicles {  get; set; }
}