using Maize.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Maize.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class CompanyAnnouncementController: Controller
    {
        private readonly SqlServerDatabaseContext _context;

        public CompanyAnnouncementController(SqlServerDatabaseContext context)
        {
            _context = context;
        }

        [HttpPost("CreateAnnouncement")]
        public IActionResult CreateAnnouncement([FromBody] CompanyAnnouncement announcement)
        {
            announcement.created_at = DateTime.Now.ToString("dd/MM/yyyy");
            _context.CompanyAnnouncements.Add(announcement);
            _context.SaveChanges();
            return Ok(announcement.id);
        }

        [HttpPost("GetAnnouncements")]
        public IActionResult GetAnnouncements(CompanyAnnouncement_Request request)
        {
            var query = _context.CompanyAnnouncements.AsQueryable();

            if (request.id.HasValue)
                query = query.Where(x => x.id == request.id);

            if (!string.IsNullOrEmpty(request.title))
                query = query.Where(x => x.title == request.title);

            if (!string.IsNullOrEmpty(request.data))
                query = query.Where(x => x.data == request.data);

            if (!string.IsNullOrEmpty(request.created_at))
                query = query.Where(x => x.created_at == request.created_at);

            if (request.author_id.HasValue)
                query = query.Where(x => x.author_id == request.author_id);

            return Ok(query.ToList());
        }

        [HttpPut("UpdateAnnouncement")]
        public IActionResult UpdateAnnouncement([FromBody] CompanyAnnouncement updatedAnnouncement)
        {
            CompanyAnnouncement? announcement = _context.CompanyAnnouncements.FirstOrDefault(x => x.id == updatedAnnouncement.id);

            if (announcement == null)
            {
                return NotFound();
            }

            announcement.title = updatedAnnouncement.title;
            announcement.data = updatedAnnouncement.data;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("DeleteAnnouncement")]
        public IActionResult DeleteAnnouncement([FromBody] short announcementId)
        {
            CompanyAnnouncement? announcement = _context.CompanyAnnouncements.FirstOrDefault(x => x.id == announcementId);

            if (announcement == null)
            {
                return NotFound();
            }

            _context.CompanyAnnouncements.Remove(announcement);
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("GetUserAnnouncements")]
        public IActionResult GetUserAnnouncements([FromBody] short company_announcement_id)
        {
            var query = _context.CompanyAnnouncements.AsQueryable();
            query = query.Where(x => x.id > company_announcement_id);

            return Ok(query.ToList());
        }

        [HttpPost("ReadUserAnnouncement")]
        public IActionResult ReadUserAnnouncement([FromBody] UpdateUserAnnouncements req)
        {
            Users? user = _context.Users.FirstOrDefault(u => u.id == req.userId);

            if (user == null)
            {
                return NotFound();
            }

            if(user.company_announcement_id < req.companyAnnouncementId)
            {
                user.company_announcement_id = req.companyAnnouncementId;
            }

            _context.SaveChanges();

            return Ok(user.company_announcement_id);
        }
    }
}
