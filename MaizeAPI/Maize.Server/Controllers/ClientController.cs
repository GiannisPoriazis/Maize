using Maize.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace Maize.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ClientController : Controller
    {
        private readonly SqlServerDatabaseContext _context;

        public ClientController(SqlServerDatabaseContext context)
        {
            _context = context;
        }

        [HttpPost("CreateClient")]
        public IActionResult CreateClient([FromBody] Client client)
        {
            client.created_at = DateTime.Now.ToString("dd/MM/yyyy");
            _context.Clients.Add(client);
            _context.SaveChanges();
            return Ok(client.id);
        }

        [HttpPost("GetClients")]
        public IActionResult GetClients(Client_Request request)
        {
            var query = _context.Clients.AsQueryable();

            if (request.id.HasValue)
                query = query.Where(x => x.id == request.id);

            if (!string.IsNullOrEmpty(request.first_name))
                query = query.Where(x => x.first_name == request.first_name);

            if (!string.IsNullOrEmpty(request.last_name))
                query = query.Where(x => x.last_name == request.last_name);

            if (!string.IsNullOrEmpty(request.email))
                query = query.Where(x => x.email == request.email);

            if (!string.IsNullOrEmpty(request.taxId))
                query = query.Where(x => x.taxId == request.taxId);

            if (!string.IsNullOrEmpty(request.mobile_phone))
                query = query.Where(x => x.mobile_phone == request.mobile_phone);

            if (!string.IsNullOrEmpty(request.birth_date))
                query = query.Where(x => x.birth_date == request.birth_date);

            return Ok(query.ToList());
        }

        [HttpGet("FindClients/{keyword}")]
        public IActionResult FindClients(string? keyword)
        {
            if (keyword == "all")
            {
                return Ok(_context.Clients.ToArray());
            }

            Client[] found = _context.Clients.Where(
                client => client.first_name.ToLower().Contains(keyword.ToLower()) ||
                client.last_name.ToLower().Contains(keyword.ToLower()) ||
                client.mobile_phone.Contains(keyword) ||
                client.taxId.Contains(keyword) ||
                client.birth_date.Contains(keyword) ||
                client.email.ToLower().Contains(keyword.ToLower())).ToArray();

            if (found.Length == 0)
            {
                return NotFound();
            }

            return Ok(found);
        }

        [HttpPut("UpdateClient")]
        public IActionResult UpdateClient([FromBody] Client updatedClient)
        {
            Client? client = _context.Clients.FirstOrDefault(x => x.id == updatedClient.id);

            if (client == null)
            {
                return NotFound();
            }

            client.first_name = updatedClient.first_name;
            client.last_name = updatedClient.last_name;
            client.email = updatedClient.email;
            client.taxId = updatedClient.taxId;
            client.birth_date = updatedClient.birth_date;
            client.mobile_phone = updatedClient.mobile_phone;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("DeleteClient")]
        public IActionResult DeleteClient([FromBody] short clientId)
        {
            Client? client = _context.Clients.FirstOrDefault(x => x.id == clientId);

            if (client == null)
            {
                return NotFound();
            }

            _context.Clients.Remove(client);
            _context.SaveChanges();

            return Ok();
        }

        [HttpGet("GetClientsLineChartData")]
        public IActionResult GetClientsLineChartData()
        {
            var previousYearQuery = _context.Clients.AsEnumerable();

            DateTime dateFrom = new DateTime(DateTime.Now.Year - 1, 1, 1);
            DateTime dateTo = new DateTime(DateTime.Now.Year - 1, 12, 31);

            previousYearQuery = previousYearQuery.Where(client =>
                DateTime.ParseExact(client.created_at, "dd/MM/yyyy", CultureInfo.InvariantCulture) <= dateTo);

            GetCarRentalRevenueLineChartDataListItem previousYear = new GetCarRentalRevenueLineChartDataListItem();
            previousYear.key = (DateTime.Now.Year - 1).ToString();
            previousYear.value = previousYearQuery.Count();

            var currentYearQuery = _context.Clients.AsEnumerable();

            dateFrom = new DateTime(DateTime.Now.Year, 1, 1);
            dateTo = new DateTime(DateTime.Now.Year, 12, 31);

            currentYearQuery = currentYearQuery.Where(client =>
                DateTime.ParseExact(client.created_at, "dd/MM/yyyy", CultureInfo.InvariantCulture) <= dateTo);

            GetCarRentalRevenueLineChartDataListItem currentYear = new GetCarRentalRevenueLineChartDataListItem();
            currentYear.key = DateTime.Now.Year.ToString();
            currentYear.value = currentYearQuery.Count();

            GetCarRentalRevenueLineChartData_Response result = new GetCarRentalRevenueLineChartData_Response();
            result.data = [previousYear, currentYear];

            return Ok(result);
        }
    }
}
