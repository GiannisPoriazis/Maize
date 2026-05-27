using System.ComponentModel.DataAnnotations;

namespace Maize.Server.Models;

public partial class CarRental_Booking
{
    [Key]
    public short id { get; set; }

    public short client_id { get; set; }

    public short vehicle_id { get; set; }

    public string? date_from { get; set; }

    public string? date_to { get; set; }

    public string? time_from { get; set; }

    public string? time_to { get; set; }

    public short? checkout { get; set; }

    public short? checkin { get; set; }

    public decimal total_price { get; set; }

    public short billing_type { get; set; }

    public string? billing_name { get; set; }

    public string? billing_tax { get; set; }

    public string? billing_country { get; set; }

    public short discount { get; set; }

    public short vat {  get; set; }
}

public class CarRental_Booking_Request
{
    public short? id { get; set; }

    public short? client_id { get; set; }

    public short? vehicle_id { get; set; }

    public string? date_from { get; set; }

    public string? date_to { get; set; }

    public short? checkout { get; set; }

    public short? checkin { get; set; }

    public decimal? total_price { get; set; }

    public short? billing_type { get; set; }

    public string? billing_name { get; set; }

    public string? billing_tax { get; set; }

    public string? billing_country { get; set; }

    public short? discount { get; set; }

    public short? vat { get; set; }
}

public class CarRental_CreateBooking_Request
{
    public CarRental_Booking booking { get; set; }
    public List<CarRental_BookingAddon> addons { get; set; }
}

public class GetBookingsLineChartData_Response
{
    public IEnumerable<ChartDataListItem> data { get; set; }
}

public class ChartDataListItem
{
    public string? key { get; set; }
    public int value { get; set; }
}

public class GetCarRentalRevenueLineChartData_Response
{
    public IEnumerable<GetCarRentalRevenueLineChartDataListItem> data { get; set; }
}

public class GetCarRentalRevenueLineChartDataListItem
{
    public string? key { get; set; }
    public decimal value { get; set; }
}
