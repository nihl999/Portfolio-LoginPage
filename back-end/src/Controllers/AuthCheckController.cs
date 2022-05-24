using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
[Route("check-auth")]
[Authorize]
public class AuthCheckController : ControllerBase
{
    [HttpGet("anonymous")]
    [AllowAnonymous]
    public async Task<ActionResult> noAuthentication()
    {
        return Ok();
    }

    [HttpGet("normal")]
    [Authorize(Roles = "User,Admin")]
    public async Task<ActionResult> UserAuthentication()
    {
        return Ok(User?.Identity?.Name);
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> AdminAuthentication()
    {
        var userRoles = User?.Claims.Where(c => c.Type == ClaimTypes.Role).ToList()
        .Select(c => c.Value).ToList();

        var jsonReturn = new
        {
            name = User?.Identity?.Name,
            roles = userRoles
        };
        return Ok(jsonReturn);
    }

    [HttpGet("social")]
    [Authorize(Roles = "Social")]
    public async Task<ActionResult> SocialAuthentication()
    {
        var jsonReturn = new
        {
            name = User?.Identity?.Name,
            roles = User?.FindAll(ClaimTypes.Role)
        };
        return Ok(jsonReturn);
    }
}