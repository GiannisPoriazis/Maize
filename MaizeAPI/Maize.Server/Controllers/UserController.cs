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
    public class UserController : Controller
    {
        private readonly SqlServerDatabaseContext _context;
        private readonly short[] _defaultRoles = [1,2];

        public UserController(SqlServerDatabaseContext context)
        {
            _context = context;
        }

        [HttpPost("CreateUser/{informUser}")]
        public IActionResult CreateUser([FromBody] Users user, bool informUser)
        {
            if(!informUser)
            {
                user.reset_token = null;
                _context.Users.Add(user);
                _context.SaveChanges();
                return Ok();
            }

            string emailContent = $"Hi {user.first_name},<br>Here is your Maize account credentials:<br>Username: {user.username}<br>Password: {user.password}";

            if (!EmailService.SendEmail(user.email!, "New Maize account", emailContent, true))
            {
                return StatusCode(500);
            }

            user.reset_token = null;
            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok();
        }

        [HttpGet("FindUsers/{keyword}")]
        public IActionResult FindUsers(string? keyword)
        {
            if (keyword == "all")
            {
                return Ok(_context.Users.ToArray());
            }

            Users[] found = _context.Users.Where(
                user => user.first_name.ToLower().Contains(keyword.ToLower()) || 
                user.last_name.ToLower().Contains(keyword.ToLower()) || 
                user.username.ToLower().Contains(keyword.ToLower()) || 
                user.email.ToLower().Contains(keyword.ToLower())).ToArray();

            if(found.Length == 0)
            {
                return NotFound();
            }

            return Ok(found);
        }

        [HttpPost("GetUsers")]
        public IActionResult GetUsers(Users_Request request)
        {
            var query = _context.Users.AsQueryable();

            if (request.id.HasValue)
                query = query.Where(x => x.id == request.id);

            if (!string.IsNullOrEmpty(request.username))
                query = query.Where(x => x.username == request.username);

            if (!string.IsNullOrEmpty(request.email))
                query = query.Where(x => x.email == request.email);

            if (!string.IsNullOrEmpty(request.first_name))
                query = query.Where(x => x.first_name == request.first_name);

            if (!string.IsNullOrEmpty(request.last_name))
                query = query.Where(x => x.last_name == request.last_name);

            if (request.role.HasValue)
                query = query.Where(x => x.role == request.role);

            return Ok(query.ToList());
        }

        [HttpPost("UpdateUser")]
        public IActionResult UpdateUser([FromBody] Users updatedUser)
        {
            Users? user = _context.Users.FirstOrDefault(u => u.id == updatedUser.id);

            if(user == null)
            {
                return NotFound();
            }

            user.email = updatedUser.email;
            user.first_name = updatedUser.first_name;
            user.last_name = updatedUser.last_name;
            user.password = updatedUser.password;
            user.username = updatedUser.username;
            user.role = updatedUser.role;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("DeleteUser")]
        public IActionResult DeleteUser([FromBody] short userId)
        {
            Users? user = _context.Users.FirstOrDefault(u => u.id == userId);

            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            _context.SaveChanges();

            return Ok();
        }

        [HttpGet("ValidatePin/{userId}/{pin}")]
        public IActionResult ValidatePin(short userId, string pin)
        {
            AppSettings? appSettings = _context.AppSettings.FirstOrDefault(settings => settings.userId == userId && settings.pin == pin);

            if (appSettings == null)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpGet("GetUserRolePermissions")]
        public IActionResult GetUserRolePermissions()
        {
            return Ok(_context.RolePermissions.ToList());
        }

        [HttpGet("GetUserRoles")]
        public IActionResult GetUserRoles()
        {
            return Ok(_context.UserRoles.ToList());
        }

        [HttpPost("CreateUserRole")]
        public IActionResult CreateUserRole([FromBody] UserRolePermissions userRole)
        {
            // Create a new UserRoles entity
            UserRoles role = new UserRoles()
            {
                name = userRole.name
            };

            // Add the role to the context and save to generate the ID
            _context.UserRoles.Add(role);
            _context.SaveChanges(); // Ensures role.id is populated

            // Now, add role permissions using the generated role.id
            foreach (string permission in userRole.permissions)
            {
                RolePermissions rolePermission = new RolePermissions()
                {
                    roleId = role.id, // Now role.id has a valid value
                    name = permission
                };

                _context.RolePermissions.Add(rolePermission);
            }

            // Save changes for role permissions
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("UpdateUserRole")]
        public IActionResult UpdateUserRole([FromBody] UserRolePermissions userRole)
        {
            if (_defaultRoles.Contains(userRole.id))
                return BadRequest("Cannot update default role.");
            
            UserRoles? role = _context.UserRoles.FirstOrDefault(x => x.id == userRole.id);

            if (role == null)
                return NotFound();

            role.name = userRole.name;

            List<RolePermissions> dbPermissions = _context.RolePermissions.Where(x => x.roleId == role.id).ToList();
            List<RolePermissions> permissionsToRemove = new List<RolePermissions>();
            foreach (RolePermissions dbPermission in dbPermissions)
            {
                if (userRole.permissions.Contains(dbPermission.name))
                    userRole.permissions.Remove(dbPermission.name);
                else
                    permissionsToRemove.Add(dbPermission);
            }

            _context.RolePermissions.RemoveRange(permissionsToRemove);

            foreach (string userRolePermission in userRole.permissions)
            {
                _context.RolePermissions.Add(new RolePermissions {
                    name = userRolePermission,
                    roleId = userRole.id
                });
            }

            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("DeleteUserRole")]
        public IActionResult DeleteUserRole([FromBody] short id)
        {
            if (_defaultRoles.Contains(id))
                return BadRequest("Cannot delete default role.");

            UserRoles ? role = _context.UserRoles.FirstOrDefault(x => x.id == id);

            if (role == null)
                return NotFound();

            _context.Remove(role);
            List<RolePermissions> dbPermissions = _context.RolePermissions.Where(x => x.roleId == role.id).ToList();

            _context.RolePermissions.RemoveRange(dbPermissions);
            _context.SaveChanges();

            return Ok();
        }
    }
}
