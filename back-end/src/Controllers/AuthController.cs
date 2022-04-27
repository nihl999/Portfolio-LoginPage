using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using back_end.Internals;
using back_end.Models.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace back_end.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthControler : Controller
    {
        IUsersRepository fakeDB;
        private readonly IConfiguration configuration;

        public AuthControler(IUsersRepository _fakeDB, IConfiguration _configuration)
        {
            fakeDB = _fakeDB;
            configuration = _configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDTO request)
        {
            User tempUser = new User();
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
            tempUser.Username = request.Username;
            tempUser.PasswordHash = passwordHash;
            tempUser.PasswordSalt = passwordSalt;
            if (fakeDB.GetAll().FirstOrDefault(x => x.Username == tempUser.Username) != null)
                return Ok(Json(new { Response = "Usuario já cadastrado" }));
            fakeDB.Add(tempUser);
            bool saved = await fakeDB.SaveChanges();
            if (saved)
                return Created("", Json(new { Response = "Usuário criado com sucesso!" }));
            return StatusCode(500, Json(new { Response = "Erro no salvamento dos dados" }));

        }

        [HttpPost("login")]
        public async Task<ActionResult<String>> Login(UserDTO request)
        {
            User requestedUser = fakeDB.GetAll().FirstOrDefault(x => x.Username == request.Username);
            if (requestedUser == null)
                return BadRequest("Usuário inexistente");
            if (!VerifyPassword(request.Password, requestedUser.PasswordHash, requestedUser.PasswordSalt))
                return BadRequest("Senha errada");
            string token = CreateToken(requestedUser);
            return Ok(token);
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPassword(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Admin == true ? "Admin" : "User")
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                    configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(10),
                signingCredentials: creds
            );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
    }
}