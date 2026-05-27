using Maize.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Maize.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class CarRental_VehicleController : Controller
    {
        private readonly SqlServerDatabaseContext _context;

        public CarRental_VehicleController(SqlServerDatabaseContext context)
        {
            _context = context;
        }

        [HttpPost("GetVehicleTypes")]
        public IActionResult GetVehicleTypes(CarRental_VehicleType_Request request)
        {
            var query = _context.CarRental_VehicleTypes.AsQueryable();

            if (request.id.HasValue)
                query = query.Where(x => x.id == request.id);

            if (!string.IsNullOrEmpty(request.description))
                query = query.Where(x => x.description == request.description);

            return Ok(query.ToList());
        }

        [HttpPost("GetVehicleSpecialRates")]
        public IActionResult GetVehicleSpecialRates(CarRental_SpecialRate_Request request)
        {
            var query = _context.CarRental_SpecialRates.AsQueryable();

            if (request.id.HasValue)
                query = query.Where(x => x.id == request.id);

            if (!string.IsNullOrEmpty(request.start_date))
                query = query.Where(x => x.start_date == request.start_date);

            if (!string.IsNullOrEmpty(request.expiry_date))
                query = query.Where(x => x.expiry_date == request.expiry_date);

            if (request.vehicle_id.HasValue)
                query = query.Where(x => x.vehicle_id == request.vehicle_id);

            if (request.vehicle_model_id.HasValue)
                query = query.Where(x => x.vehicle_model_id == request.vehicle_model_id);

            if (request.vehicle_category_id.HasValue)
                query = query.Where(x => x.vehicle_category_id == request.vehicle_category_id);

            if (request.vehicle_type_id.HasValue)
                query = query.Where(x => x.vehicle_type_id == request.vehicle_type_id);

            return Ok(query.ToList());
        }

        [HttpPost("GetVehicleCategories")]
        public IActionResult GetVehicleCategories(CarRental_VehicleCategory_Request request)
        {
            var query = _context.CarRental_VehicleCategories.AsEnumerable();

            if (request.id.HasValue)
                query = query.Where(x => x.id == request.id);

            if (!string.IsNullOrEmpty(request.description))
                query = query.Where(x => x.description == request.description);

            if (request.vehicle_type_id.HasValue)
                query = query.Where(x => x.vehicle_type_id == request.vehicle_type_id);

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

        [HttpPost("CreateVehicleSpecialRate")]
        public IActionResult CreateVehicleSpecialRate([FromBody] CarRental_SpecialRate rate)
        {
            _context.CarRental_SpecialRates.Add(rate);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPost("CreateVehicleType")]
        public IActionResult CreateVehicleType([FromBody] CarRental_VehicleType type)
        {
            _context.CarRental_VehicleTypes.Add(type);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPost("CreateVehicleCategory")]
        public IActionResult CreateVehicleCategory([FromBody] CarRental_VehicleCategory category)
        {
            _context.CarRental_VehicleCategories.Add(category);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPost("CreateVehicleModel")]
        public IActionResult CreateVehicleModel([FromBody] CarRental_VehicleModel model)
        {
            _context.CarRental_VehicleModels.Add(model);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPost("CreateVehicle")]
        public IActionResult CreateVehicle([FromBody] CarRental_VehicleUpsert_Request vehicleUpsert)
        {
            _context.CarRental_Vehicles.Add(vehicleUpsert.vehicle);
            _context.SaveChanges();

            CarRental_UpdateVehicleAddonConnection_Request req = new CarRental_UpdateVehicleAddonConnection_Request
            {
                vehicleId = vehicleUpsert.vehicle.id,
                addonIds = vehicleUpsert.addonIds
            };

            UpdateVehicleAddonConnections(req);
            return Ok();
        }

        [HttpPost("UpdateVehicleSpecialRate")]
        public IActionResult UpdateVehicleSpecialRate([FromBody] CarRental_SpecialRate update)
        {
            CarRental_SpecialRate? rate = _context.CarRental_SpecialRates.FirstOrDefault(x => x.id == update.id);

            if (rate == null)
            {
                return NotFound();
            }

            rate.discount = update.discount;
            rate.markup = update.markup;
            rate.isPercentage = update.isPercentage;
            rate.start_date = update.start_date;
            rate.expiry_date = update.expiry_date;
            rate.vehicle_id = update.vehicle_id;
            rate.vehicle_model_id = update.vehicle_model_id;
            rate.vehicle_type_id = update.vehicle_type_id;
            rate.vehicle_category_id = update.vehicle_category_id;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("UpdateVehicleType")]
        public IActionResult UpdateVehicleType([FromBody] CarRental_VehicleType update)
        {
            CarRental_VehicleType? type = _context.CarRental_VehicleTypes.FirstOrDefault(x => x.id == update.id);

            if (type == null)
            {
                return NotFound();
            }

            type.description = update.description;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("UpdateVehicleCategory")]
        public IActionResult UpdateVehicleCategory([FromBody] CarRental_VehicleCategory update)
        {
            CarRental_VehicleCategory? category = _context.CarRental_VehicleCategories.FirstOrDefault(x => x.id == update.id);

            if (category == null)
            {
                return NotFound();
            }

            category.description = update.description;
            category.vehicle_type_id = update.vehicle_type_id;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("UpdateVehicleModel")]
        public IActionResult UpdateVehicleModel([FromBody] CarRental_VehicleModel update)
        {
            CarRental_VehicleModel? model = _context.CarRental_VehicleModels.FirstOrDefault(x => x.id == update.id);

            if (model == null)
            {
                return NotFound();
            }

            model.description = update.description;
            model.vehicle_category_id = update.vehicle_category_id;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("UpdateVehicle")]
        public IActionResult UpdateVehicle([FromBody] CarRental_VehicleUpsert_Request update)
        {
            CarRental_Vehicle? vehicle = _context.CarRental_Vehicles.FirstOrDefault(x => x.id == update.vehicle.id);

            if (vehicle == null)
            {
                return NotFound();
            }

            vehicle.registration = update.vehicle.registration;
            vehicle.model_id = update.vehicle.model_id;
            vehicle.vin = update.vehicle.vin;
            vehicle.year = update.vehicle.year;
            vehicle.cc = update.vehicle.cc;
            vehicle.color = update.vehicle.color;
            vehicle.gears = update.vehicle.gears;
            vehicle.mileage = update.vehicle.mileage;
            vehicle.pool_type = update.vehicle.pool_type;
            vehicle.state = update.vehicle.state;
            vehicle.insurance_company = update.vehicle.insurance_company;
            vehicle.insurance_expiry = update.vehicle.insurance_expiry;
            vehicle.daily_rate = update.vehicle.daily_rate;
            vehicle.passengers = update.vehicle.passengers;
            vehicle.air_condition = update.vehicle.air_condition;
            vehicle.doors = update.vehicle.doors;
            vehicle.radio = update.vehicle.radio;
            vehicle.gps = update.vehicle.gps;
            vehicle.touch_screen = update.vehicle.touch_screen;
            vehicle.parking_camera = update.vehicle.parking_camera;
            vehicle.usb = update.vehicle.usb;
            vehicle.bluetooth = update.vehicle.bluetooth;
            vehicle.mirrorlink = update.vehicle.mirrorlink;
            vehicle.license_required = update.vehicle.license_required;
            vehicle.driver_minimum_age = update.vehicle.driver_minimum_age;
            _context.SaveChanges();

            CarRental_UpdateVehicleAddonConnection_Request req = new CarRental_UpdateVehicleAddonConnection_Request
            {
                vehicleId = vehicle.id,
                addonIds = update.addonIds
            };

            UpdateVehicleAddonConnections(req);

            return Ok();
        }

        [HttpPost("DeleteVehicleSpecialRate")]
        public IActionResult DeleteVehicleSpecialRate([FromBody] short rateId)
        {
            CarRental_SpecialRate? rate = _context.CarRental_SpecialRates.FirstOrDefault(x => x.id == rateId);

            if (rate == null)
            {
                return NotFound();
            }

            _context.CarRental_SpecialRates.Remove(rate);
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("DeleteVehicleType")]
        public IActionResult DeleteVehicleType([FromBody] short typeId)
        {
            CarRental_VehicleType? type = _context.CarRental_VehicleTypes.FirstOrDefault(x => x.id == typeId);

            if (type == null)
            {
                return NotFound();
            }

            _context.CarRental_VehicleTypes.Remove(type);
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("DeleteVehicleCategory")]
        public IActionResult DeleteVehicleCategory([FromBody] short categoryId)
        {
            CarRental_VehicleCategory? category = _context.CarRental_VehicleCategories.FirstOrDefault(x => x.id == categoryId);

            if (category == null)
            {
                return NotFound();
            }

            _context.CarRental_VehicleCategories.Remove(category);
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("DeleteVehicleModel")]
        public IActionResult DeleteVehicleModel([FromBody] short modelId)
        {
            CarRental_VehicleModel? model = _context.CarRental_VehicleModels.FirstOrDefault(x => x.id == modelId);

            if (model == null)
            {
                return NotFound();
            }

            _context.CarRental_VehicleModels.Remove(model);
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("DeleteVehicle")]
        public IActionResult DeleteVehicle([FromBody] short vehicleId)
        {
            CarRental_Vehicle? vehicle = _context.CarRental_Vehicles.FirstOrDefault(x => x.id == vehicleId);

            if (vehicle == null)
            {
                return NotFound();
            }

            _context.CarRental_Vehicles.Remove(vehicle);
            _context.SaveChanges();

            return Ok();
        }

        [HttpGet("FindVehicles/{keyword}")]
        public IActionResult FindVehicles(string? keyword)
        {
            if (keyword == "all")
            {
                return Ok(_context.CarRental_Vehicles.ToArray());
            }

            CarRental_Vehicle[] found = _context.CarRental_Vehicles.Where(
                vehicle => vehicle.registration.ToLower().Contains(keyword.ToLower()) ||
                vehicle.vin.ToLower().Contains(keyword.ToLower())).ToArray();

            if (found.Length == 0)
            {
                return NotFound();
            }

            return Ok(found);
        }

        [HttpPost("CreateStation")]
        public IActionResult CreateStation([FromBody] CarRental_Station station)
        {
            _context.CarRental_Stations.Add(station);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPost("GetStations")]
        public IActionResult GetStations(CarRental_Station_Request request)
        {
            var query = _context.CarRental_Stations.AsQueryable();

            if (request.id.HasValue)
                query = query.Where(x => x.id == request.id);

            if (!string.IsNullOrEmpty(request.station_name))
                query = query.Where(x => x.station_name == request.station_name);

            if (!string.IsNullOrEmpty(request.station_address))
                query = query.Where(x => x.station_address == request.station_address);

            return Ok(query.ToList());
        }

        [HttpGet("FindStations/{keyword}")]
        public IActionResult FindStations(string? keyword)
        {
            if (keyword == "*")
            {
                return Ok(_context.CarRental_Stations.ToArray());
            }

            CarRental_Station[] found = _context.CarRental_Stations.Where(
                station => station.station_name!.ToLower().Contains(keyword!.ToLower()) ||
                station.station_address!.ToLower().Contains(keyword!.ToLower())).ToArray();

            if (found.Length == 0)
            {
                return NotFound();
            }

            return Ok(found);
        }

        [HttpPut("UpdateStation")]
        public IActionResult UpdateStation([FromBody] CarRental_Station update)
        {
            CarRental_Station? station = _context.CarRental_Stations.FirstOrDefault(x => x.id == update.id);

            if (station == null)
            {
                return NotFound();
            }

            station.station_name = update.station_name;
            station.station_address = update.station_address;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("DeleteStation")]
        public IActionResult DeleteStation([FromBody] short stationId)
        {
            CarRental_Station? station = _context.CarRental_Stations.FirstOrDefault(x => x.id == stationId);

            if (station == null)
            {
                return NotFound();
            }

            _context.CarRental_Stations.Remove(station);
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("DeleteVehicleAddon")]
        public IActionResult DeleteVehicleAddon([FromBody] short addonId)
        {
            CarRental_VehicleAddon? addon = _context.CarRental_VehicleAddons.FirstOrDefault(x => x.id == addonId);

            if (addon == null)
            {
                return NotFound();
            }

            _context.CarRental_VehicleAddons.Remove(addon);
            _context.SaveChanges();

            return Ok();
        }

        [HttpPut("UpdateVehicleAddon")]
        public IActionResult UpdateVehicleAddon([FromBody] CarRental_VehicleAddon update)
        {
            CarRental_VehicleAddon? addon = _context.CarRental_VehicleAddons.FirstOrDefault(x => x.id == update.id);

            if (addon == null)
            {
                return NotFound();
            }

            addon.title = update.title;
            addon.description = update.description;
            addon.max_quantity = update.max_quantity;
            addon.rate = update.rate;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("CreateVehicleAddon")]
        public IActionResult CreateVehicleAddon([FromBody] CarRental_VehicleAddon addon)
        {
            _context.CarRental_VehicleAddons.Add(addon);
            _context.SaveChanges();
            return Ok();
        }

        [HttpGet("GetVehicleAddons")]
        public IActionResult GetVehicleAddons()
        {
            return Ok(_context.CarRental_VehicleAddons.ToList());
        }

        public void UpdateVehicleAddonConnections(CarRental_UpdateVehicleAddonConnection_Request update)
        {
            List<CarRental_VehicleAddonConnection> activeAddons = _context.CarRental_VehicleAddonConnections.Where(x => x.vehicleId == update.vehicleId).ToList();
            List<CarRental_VehicleAddonConnection> addonsToRemove = new List<CarRental_VehicleAddonConnection>();

            foreach (CarRental_VehicleAddonConnection vehicleAddon in activeAddons)
            {
                if(update.addonIds.Contains(vehicleAddon.addonId))
                    update.addonIds.Remove(vehicleAddon.addonId);
                else
                    addonsToRemove.Add(vehicleAddon);
            }

            _context.CarRental_VehicleAddonConnections.RemoveRange(addonsToRemove);

            foreach(short id in update.addonIds)
            {
                _context.CarRental_VehicleAddonConnections.Add(new CarRental_VehicleAddonConnection
                {
                    vehicleId = update.vehicleId,
                    addonId = id
                });
            }

            _context.SaveChanges();
        }

        [HttpGet("FindVehicleAddonConnections/{vehicleId}")]
        public IActionResult FindVehicleAddonConnections(short vehicleId)
        {
            return Ok(_context.CarRental_VehicleAddonConnections.Where(x => x.vehicleId == vehicleId).ToList());
        }
    }
}
