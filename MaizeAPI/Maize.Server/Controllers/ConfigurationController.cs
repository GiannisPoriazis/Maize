using Microsoft.AspNetCore.Mvc;
using Maize.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace Maize.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ConfigurationController : Controller
    {
        private readonly SqlServerDatabaseContext _context;

        public ConfigurationController(SqlServerDatabaseContext context)
        {
            _context = context;
        }

        [HttpPost("UpdateAppSettings")]
        public IActionResult UpdateAppSettings([FromBody] AppSettings newAppSettings)
        {
            try
            {
                AppSettings? appSettings = _context.AppSettings.FirstOrDefault(settings => settings.userId == newAppSettings.userId);

                if(appSettings == null && _context.Users.Where(user => user.id == newAppSettings.userId) != null)
                {
                    _context.AppSettings.Add(newAppSettings);
                    _context.SaveChanges();
                }
                else
                {
                    if(newAppSettings.pin != null && newAppSettings.pin != String.Empty)
                        appSettings.pin = newAppSettings.pin;

                    appSettings.language = newAppSettings.language;
                    appSettings.theme = newAppSettings.theme;
                    appSettings.timezone = newAppSettings.timezone;
                    appSettings.fontsize = newAppSettings.fontsize;
                    appSettings.grid_theme = newAppSettings.grid_theme;
                    appSettings.notification_sound = newAppSettings.notification_sound;
                    appSettings.notification_alerts = newAppSettings.notification_alerts;
                    appSettings.lock_screen = newAppSettings.lock_screen;
                    appSettings.lock_screen_timeout = newAppSettings.lock_screen_timeout;
                    _context.SaveChanges();
                }

                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating settings.");
            }
        }

        [HttpPost("UpdateSettings")]
        public IActionResult UpdateSettings([FromBody] SettingsContract newSettings)
        {
            try
            {
                AppSettings? appSettings = _context.AppSettings.FirstOrDefault(settings => settings.userId == newSettings.appSettings!.userId);

                if (appSettings == null && _context.Users.Where(user => user.id == newSettings.appSettings!.userId) != null)
                {
                    _context.AppSettings.Add(newSettings.appSettings!);
                }
                else
                {
                    appSettings.language = newSettings.appSettings!.language;
                    appSettings.theme = newSettings.appSettings.theme;
                    appSettings.timezone = newSettings.appSettings.timezone;
                    appSettings.fontsize = newSettings.appSettings.fontsize;
                    appSettings.grid_theme = newSettings.appSettings.grid_theme;
                    appSettings.notification_sound = newSettings.appSettings.notification_sound;
                    appSettings.notification_alerts = newSettings.appSettings.notification_alerts;
                    appSettings.pin = newSettings.appSettings.pin;
                    appSettings.lock_screen = newSettings.appSettings.lock_screen;
                    appSettings.lock_screen_timeout = newSettings.appSettings.lock_screen_timeout;
                }

                _context.Database.ExecuteSqlRaw("DELETE FROM AdminSettings");
                var sqlQuery = "INSERT INTO AdminSettings (company_type) VALUES (" +
                    "@companyType" +
                    ")";

                _context.Database.ExecuteSqlRaw(sqlQuery,
                    new[]
                    {
                        new SqlParameter("@companyType", newSettings.adminSettings!.company_type)
                    });
                
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating settings.");
            }
        }

        [HttpGet("GetConfiguration/{userId}")]
        public IActionResult GetConfiguration(short userId)
        {
            AppSettings? appSettings = _context.AppSettings.FirstOrDefault(appSettings => appSettings.userId == userId);
            AdminSettings? adminSettings = _context.AdminSettings.FirstOrDefault();

            var responseObject = new
            {
                appSettings = appSettings,
                adminSettings = adminSettings,
                permissions = _context.RolePermissions.ToArray(),
                translations = _context.Translations.ToArray(),
                userRoles = _context.UserRoles.ToArray()
            };

            return Ok(responseObject);
        }
    }
}
