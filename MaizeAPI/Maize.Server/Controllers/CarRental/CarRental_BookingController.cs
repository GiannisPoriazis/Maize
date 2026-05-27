using Azure.Core;
using Maize.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Globalization;

namespace Maize.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class CarRental_BookingController : Controller
    {
        private readonly SqlServerDatabaseContext _context;

        public CarRental_BookingController(SqlServerDatabaseContext context)
        {
            _context = context;
        }

        [HttpPost("CreateBooking")]
        public IActionResult CreateBooking([FromBody] CarRental_CreateBooking_Request booking_request)
        {
            DateTime bookingFrom = DateTime.ParseExact(booking_request.booking.date_from, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            DateTime bookingTo = DateTime.ParseExact(booking_request.booking.date_to, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            TimeSpan booking_days = bookingTo - bookingFrom;

            decimal dailyRate = GetBookingVehicleSpecialRates(_context, _context.CarRental_Vehicles.AsNoTracking().FirstOrDefault(x => x.id == booking_request.booking.vehicle_id)!, bookingFrom).daily_rate;
            decimal cost = booking_days.Days * dailyRate;
            decimal addonsCost = 0;

            foreach (CarRental_BookingAddon addon in booking_request.addons)
            {
                CarRental_VehicleAddon addonData = _context.CarRental_VehicleAddons.AsNoTracking().FirstOrDefault(x => x.id == addon.addon_id)!;
                addonsCost += addonData.rate * addon.quantity;
            }

            cost = cost - cost * booking_request.booking.discount / 100;
            cost += addonsCost;
            booking_request.booking.total_price = cost + cost * booking_request.booking.vat / 100;

            _context.CarRental_Bookings.Add(booking_request.booking);
            _context.SaveChanges();

            foreach(CarRental_BookingAddon addon in booking_request.addons)
            {
                addon.booking_id = booking_request.booking.id;                
            }

            _context.CarRental_BookingAddons.AddRange(booking_request.addons);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPost("GetBookings")]
        public IActionResult GetBookings(CarRental_Booking_Request request)
        {
            var query = _context.CarRental_Bookings.AsEnumerable();

            if (request.id.HasValue)
                query = query.Where(b => b.id == request.id);

            if (request.client_id.HasValue)
                query = query.Where(b => b.client_id == request.client_id);

            if (request.vehicle_id.HasValue)
                query = query.Where(b => b.vehicle_id == request.vehicle_id);

            if (!string.IsNullOrEmpty(request.date_from) && !string.IsNullOrEmpty(request.date_to))
            {
                DateTime requestDateFrom = DateTime.ParseExact(request.date_from, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime requestDateTo = DateTime.ParseExact(request.date_to, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                query = query.Where(b =>
                    DateTime.ParseExact(b.date_from, "dd/MM/yyyy", CultureInfo.InvariantCulture) <= requestDateTo &&
                    DateTime.ParseExact(b.date_to, "dd/MM/yyyy", CultureInfo.InvariantCulture) >= requestDateFrom);
            }
            else if (!string.IsNullOrEmpty(request.date_from))
            {
                DateTime requestDateFrom = DateTime.ParseExact(request.date_from, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                query = query.Where(b =>
                    DateTime.ParseExact(b.date_to, "dd/MM/yyyy", CultureInfo.InvariantCulture) >= requestDateFrom);
            }
            else if (!string.IsNullOrEmpty(request.date_to))
            {
                DateTime requestDateTo = DateTime.ParseExact(request.date_to, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                query = query.Where(b =>
                    DateTime.ParseExact(b.date_from, "dd/MM/yyyy", CultureInfo.InvariantCulture) <= requestDateTo);
            }

            if (request.checkout.HasValue)
                query = query.Where(b => b.checkout == request.checkout);

            if (request.checkin.HasValue)
                query = query.Where(b => b.checkin == request.checkin);

            if (request.total_price.HasValue)
                query = query.Where(b => b.total_price == request.total_price);

            if (request.billing_type.HasValue)
                query = query.Where(b => b.billing_type == request.billing_type);

            if (!string.IsNullOrEmpty(request.billing_name))
                query = query.Where(b => b.billing_name == request.billing_name);

            if (!string.IsNullOrEmpty(request.billing_tax))
                query = query.Where(b => b.billing_tax == request.billing_tax);

            if (!string.IsNullOrEmpty(request.billing_country))
                query = query.Where(b => b.billing_country == request.billing_country);

            if (request.discount.HasValue)
                query = query.Where(b => b.discount == request.discount);

            if (request.vat.HasValue)
                query = query.Where(b => b.vat == request.vat);

            return Ok(query.ToList());
        }

        [HttpGet("FindBookings/{keyword}")]
        public IActionResult FindBookings(string? keyword)
        {
            if (keyword == "*")
            {
                return Ok(_context.CarRental_Bookings.ToArray());
            }

            CarRental_Booking[] found = _context.CarRental_Bookings.Where(
                booking => booking.billing_name.ToLower().Contains(keyword.ToLower()) ||
                booking.billing_tax.ToLower().Contains(keyword.ToLower())).ToArray();

            if (found.Length == 0)
            {
                return NotFound();
            }

            return Ok(found);
        }

        [HttpPut("UpdateBooking")]
        public IActionResult UpdateBooking([FromBody] CarRental_Booking update)
        {
            CarRental_Booking? booking = _context.CarRental_Bookings.FirstOrDefault(x => x.id == update.id);

            if (booking == null)
            {
                return NotFound();
            }

            booking.client_id = update.client_id;
            booking.vehicle_id = update.vehicle_id;
            booking.date_from = update.date_from;
            booking.date_to = update.date_to;
            booking.time_from = update.time_from;
            booking.time_to = update.time_to;
            booking.checkout = update.checkout;
            booking.checkin = update.checkin;
            booking.total_price = update.total_price;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("DeleteBooking")]
        public IActionResult DeleteBooking([FromBody] short bookingId)
        {
            CarRental_Booking? booking = _context.CarRental_Bookings.FirstOrDefault(x => x.id == bookingId);

            if (booking == null)
            {
                return NotFound();
            }

            _context.CarRental_Bookings.Remove(booking);
            _context.SaveChanges();

            return Ok();
        }

        [HttpGet("GetBookingsLineChartData")]
        public IActionResult GetBookingsLineChartData()
        {
            var previousYearQuery = _context.CarRental_Bookings.AsEnumerable();

            DateTime dateFrom = new DateTime(DateTime.Now.Year - 1, 1, 1);
            DateTime dateTo = new DateTime(DateTime.Now.Year - 1, 12, 31);

            previousYearQuery = previousYearQuery.Where(b =>
                DateTime.ParseExact(b.date_from, "dd/MM/yyyy", CultureInfo.InvariantCulture) <= dateTo &&
                DateTime.ParseExact(b.date_to, "dd/MM/yyyy", CultureInfo.InvariantCulture) >= dateFrom);

            ChartDataListItem previousYear = new ChartDataListItem();
            previousYear.key = (DateTime.Now.Year - 1).ToString();
            previousYear.value = previousYearQuery.Count();

            var currentYearQuery = _context.CarRental_Bookings.AsEnumerable();

            dateFrom = new DateTime(DateTime.Now.Year, 1, 1);
            dateTo = new DateTime(DateTime.Now.Year, 12, 31);

            currentYearQuery = currentYearQuery.Where(b =>
                DateTime.ParseExact(b.date_from, "dd/MM/yyyy", CultureInfo.InvariantCulture) <= dateTo &&
                DateTime.ParseExact(b.date_to, "dd/MM/yyyy", CultureInfo.InvariantCulture) >= dateFrom);

            ChartDataListItem currentYear = new ChartDataListItem();
            currentYear.key = DateTime.Now.Year.ToString();
            currentYear.value = currentYearQuery.Count();

            GetBookingsLineChartData_Response result = new GetBookingsLineChartData_Response();
            result.data = [previousYear, currentYear];

            return Ok(result);
        }

        [HttpGet("GetCarRentalRevenueLineChartData")]
        public IActionResult GetCarRentalRevenueLineChartData()
        {
            var previousYearQuery = _context.CarRental_Bookings.AsEnumerable();

            DateTime dateFrom = new DateTime(DateTime.Now.Year - 1, 1, 1);
            DateTime dateTo = new DateTime(DateTime.Now.Year - 1, 12, 31);

            previousYearQuery = previousYearQuery.Where(b =>
                DateTime.ParseExact(b.date_from, "dd/MM/yyyy", CultureInfo.InvariantCulture) <= dateTo &&
                DateTime.ParseExact(b.date_to, "dd/MM/yyyy", CultureInfo.InvariantCulture) >= dateFrom);

            GetCarRentalRevenueLineChartDataListItem previousYear = new GetCarRentalRevenueLineChartDataListItem();
            previousYear.key = (DateTime.Now.Year - 1).ToString();
            previousYear.value = previousYearQuery.ToList().Sum(booking => booking.total_price);

            var currentYearQuery = _context.CarRental_Bookings.AsEnumerable();

            dateFrom = new DateTime(DateTime.Now.Year, 1, 1);
            dateTo = new DateTime(DateTime.Now.Year, 12, 31);

            currentYearQuery = currentYearQuery.Where(b =>
                DateTime.ParseExact(b.date_from, "dd/MM/yyyy", CultureInfo.InvariantCulture) <= dateTo &&
                DateTime.ParseExact(b.date_to, "dd/MM/yyyy", CultureInfo.InvariantCulture) >= dateFrom);

            GetCarRentalRevenueLineChartDataListItem currentYear = new GetCarRentalRevenueLineChartDataListItem();
            currentYear.key = DateTime.Now.Year.ToString();
            currentYear.value = currentYearQuery.ToList().Sum(booking => booking.total_price);

            GetCarRentalRevenueLineChartData_Response result = new GetCarRentalRevenueLineChartData_Response();
            result.data = [previousYear, currentYear];

            return Ok(result);
        }

        [HttpPost("GetAvailableVehicleSpecialRates")]
        public IActionResult GetAvailableVehicleSpecialRates([FromBody] CarRental_GetVehicleSpecialRates_Request req)
        {
            DateTime startDate = DateTime.ParseExact(req.bookingDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            foreach (var vehicle in req.vehicles)
            {
                CarRental_Vehicle updatedVehicle = GetBookingVehicleSpecialRates(_context, vehicle, startDate);
                vehicle.daily_rate = updatedVehicle.daily_rate;
            }

            return Ok(req.vehicles);
        }

        public static CarRental_Vehicle GetBookingVehicleSpecialRates(SqlServerDatabaseContext _context, CarRental_Vehicle vehicle, DateTime startDate)
        {
            var rates = _context.CarRental_SpecialRates.ToList();
            var vehicleModels = _context.CarRental_VehicleModels.ToList();
            var vehicleCategories = _context.CarRental_VehicleCategories.ToList();

            var modelCategoryMap = vehicleModels.ToDictionary(m => m.id, m => m.vehicle_category_id);
            var categoryTypeMap = vehicleCategories.ToDictionary(c => c.id, c => c.vehicle_type_id);

            foreach (var rate in rates)
            {
                if (!IsRateValid(rate, startDate))
                    continue;

                if (rate.vehicle_id == vehicle.id ||
                    (rate.vehicle_model_id.HasValue && rate.vehicle_model_id == vehicle.model_id) ||
                    (rate.vehicle_category_id.HasValue && modelCategoryMap.TryGetValue(vehicle.model_id, out var categoryId) && categoryId == rate.vehicle_category_id) ||
                    (rate.vehicle_type_id.HasValue && modelCategoryMap.TryGetValue(vehicle.model_id, out categoryId) && categoryTypeMap.TryGetValue(categoryId, out var typeId) && typeId == rate.vehicle_type_id))
                {
                    ApplyRate(vehicle, rate);
                }
            }

            return vehicle;
        }

        public static bool IsRateValid(CarRental_SpecialRate rate, DateTime startDate)
        {
            if (string.IsNullOrEmpty(rate.start_date))
                return true;

            DateTime rateStartDate = DateTime.ParseExact(rate.start_date, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(rate.expiry_date))
            {
                DateTime rateExpiryDate = DateTime.ParseExact(rate.expiry_date, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                return startDate >= rateStartDate && startDate <= rateExpiryDate;
            }

            return startDate >= rateStartDate;
        }

        public static void ApplyRate(CarRental_Vehicle vehicle, CarRental_SpecialRate rate)
        {
            if (rate.discount.HasValue)
            {
                vehicle.daily_rate -= Convert.ToBoolean(rate.isPercentage) ? vehicle.daily_rate * rate.discount.Value / 100 : rate.discount.Value;
            }
            else if (rate.markup.HasValue)
            {
                vehicle.daily_rate += Convert.ToBoolean(rate.isPercentage) ? vehicle.daily_rate * rate.markup.Value / 100 : rate.markup.Value;
            }
        }
    }
}
