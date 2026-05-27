using Microsoft.AspNetCore.Mvc;
using Maize.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Maize.Server.Services;
using System.Data;

namespace Maize.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ModuleController : ControllerBase
    {
        private readonly SqlServerDatabaseContext _dbContext;

        public ModuleController(SqlServerDatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("GetModules")]
        public IActionResult GetModules()
        {
            return Ok(_dbContext.Modules.ToList());
        }

        [HttpGet("GetActiveModules")]
        public IActionResult GetActiveModules()
        {
            return Ok(_dbContext.ActiveModules.ToList());
        }

        [HttpPost("ActivateModule")]
        public IActionResult ActivateModule([FromBody] ActiveModule req)
        {
            Module? module = _dbContext.Modules.FirstOrDefault(x => x.id == req.module_id);

            if(module == null)
            {
                return NotFound();
            }

            ActiveModule newActivatedModule = new ActiveModule
            {
                module_id = module.id,
                activated_by = req.activated_by
            };

            _dbContext.ActiveModules.Add(newActivatedModule);
            _dbContext.SaveChanges();

            return Ok();
        }

        [HttpPost("DeactivateModule")]
        public IActionResult DeactivateModule([FromBody] short moduleId)
        {
            ActiveModule? activeModule = _dbContext.ActiveModules.FirstOrDefault(x => x.module_id == moduleId);

            if (activeModule == null)
            {
                return NotFound();
            }

            _dbContext.ActiveModules.Remove(activeModule);
            _dbContext.SaveChanges();

            return Ok();
        }
    }
}
