using Maize.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace Maize.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CarRental_BookingEngineController : Controller
    {
        private readonly SqlServerDatabaseContext _context;

        public CarRental_BookingEngineController(SqlServerDatabaseContext context)
        {
            _context = context;
        }

        [HttpGet("HasBookingEngineModule")]
        public IActionResult HasBookingEngineModule()
        {
           if(_context.ActiveModules.FirstOrDefault(x => x.module_id == 1) != null)
            return Ok(true);

            return Ok(false);
        }

        [HttpGet("GetStations")]
        public IActionResult GetStations()
        {
            return Ok(_context.CarRental_Stations.ToList());
        }

        [HttpPost("GetAvailableVehicleSpecialRates")]
        public IActionResult GetAvailableVehicleSpecialRates([FromBody] CarRental_GetVehicleSpecialRates_Request req)
        {
            DateTime startDate = DateTime.ParseExact(req.bookingDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            foreach (var vehicle in req.vehicles)
            {
                CarRental_Vehicle updatedVehicle = CarRental_BookingController.GetBookingVehicleSpecialRates(_context, vehicle, startDate);
                vehicle.daily_rate = updatedVehicle.daily_rate;
            }

            return Ok(req.vehicles);
        }

        [HttpPost("GetVehicles")]
        public IActionResult GetVehicles(CarRental_Vehicle_Request request)
        {
            var query = _context.CarRental_Vehicles.AsEnumerable();

            if (request.id.HasValue)
                query = query.Where(x => x.id == request.id);

            if (!string.IsNullOrEmpty(request.registration))
                query = query.Where(x => x.registration == request.registration);

            if (request.model_id.HasValue)
                query = query.Where(x => x.model_id == request.model_id);

            if (!string.IsNullOrEmpty(request.vin))
                query = query.Where(x => x.vin == request.vin);

            if (request.year.HasValue)
                query = query.Where(x => x.year == request.year);

            if (request.cc.HasValue)
                query = query.Where(x => x.cc == request.cc);

            if (!string.IsNullOrEmpty(request.color))
                query = query.Where(x => x.color == request.color);

            if (request.gears.HasValue)
                query = query.Where(x => x.gears == request.gears);

            if (request.mileage.HasValue)
                query = query.Where(x => x.mileage == request.mileage);

            if (request.pool_type.HasValue)
                query = query.Where(x => x.pool_type == request.pool_type);

            if (request.state.HasValue)
                query = query.Where(x => x.state == request.state);

            if (!string.IsNullOrEmpty(request.insurance_company))
                query = query.Where(x => x.insurance_company == request.insurance_company);

            if (!string.IsNullOrEmpty(request.insurance_expiry))
                query = query.Where(x => x.insurance_expiry == request.insurance_expiry);

            if (request.daily_rate.HasValue)
                query = query.Where(x => x.daily_rate == request.daily_rate);

            return Ok(query.ToList());
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

        [HttpPost("GetVehicleModels")]
        public IActionResult GetVehicleModels(CarRental_VehicleModel_Request request)
        {
            var query = _context.CarRental_VehicleModels.AsEnumerable();

            if (request.id.HasValue)
                query = query.Where(x => x.id == request.id);

            if (!string.IsNullOrEmpty(request.description))
                query = query.Where(x => x.description == request.description);

            if (request.vehicle_category_id.HasValue)
                query = query.Where(x => x.vehicle_category_id == request.vehicle_category_id);

            return Ok(query.ToList());
        }
    }
}

