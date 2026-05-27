using Maize.Server.Models;
using Maize.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Maize.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly SqlServerDatabaseContext _dbContext;
        private readonly IConfiguration _configuration;
        private static Random random = new Random();

        public AuthenticationController(SqlServerDatabaseContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        [HttpPost("AuthenticateUser")]
        public IActionResult AuthenticateUser([FromBody] AuthenticateUserRequest req)
        {
            Users? user;

            try
            {
                user = _dbContext.Users.FirstOrDefault(user => user.username == req.username && user.password == req.password);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            if (user == null)
            {
                return NotFound();
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["TokenSecretKey"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[] {}),
                Expires = DateTime.UtcNow.AddHours(8),
                Issuer = _configuration["TokenIssuer"],
                Audience = _configuration["TokenAudience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            
            var responseData = new
            {
                user = user,
                token = tokenString
            };

            return Ok(responseData);
        }

        [HttpGet("ResetPasswordRequest/{email}")]
        public IActionResult ResetPasswordRequest(string email)
        {
            Users? user = _dbContext.Users.FirstOrDefault(user => user.email == email);

            if (user == null)
            {
                return NotFound();
            }

            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; 

            user.reset_token = new string(Enumerable.Repeat(chars, 16)
                .Select(s => s[random.Next(s.Length)]).ToArray());

            string redirectUrl = "http://localhost:4200/";
            string emailContent = $"Please visit the following link to reset your password: {redirectUrl}password_reset/{user.reset_token}";

            if(!EmailService.SendEmail(email, "You have requested to reset your password", emailContent, false))
            {
                return StatusCode(500);
            }

            _dbContext.SaveChanges();
            return Ok();
        }

        [HttpGet("ResetPassword/{token}/{password}")]
        public IActionResult ResetPassword(string token, string password)
        {
            Users? user = _dbContext.Users.FirstOrDefault(user => user.reset_token == token);

            if (user == null)
            {
                return NotFound();
            }

            user.reset_token = null;
            user.password = password;
            _dbContext.SaveChanges();

            return Ok();
        }
    }
}
