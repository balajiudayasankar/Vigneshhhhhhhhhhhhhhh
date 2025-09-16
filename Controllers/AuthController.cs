using InternalKnowledgeBase.Api.DTOs;
using InternalKnowledgeBase.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InternalKnowledgeBase.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<GenericResponseDto<LoginResponseDto>>> Login(LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<ActionResult<GenericResponseDto<UserDto>>> Register(RegisterDto registerDto)
        {
            var result = await _authService.RegisterAsync(registerDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult<GenericResponseDto>> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            var result = await _authService.ChangePasswordAsync(userId, changePasswordDto);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<GenericResponseDto<LoginResponseDto>>> RefreshToken([FromBody] string refreshToken)
        {
            var result = await _authService.RefreshTokenAsync(refreshToken);
            
            if (!result.Success)
                return BadRequest(result);
            
            return Ok(result);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult<GenericResponseDto>> Logout()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            var result = await _authService.LogoutAsync(userId);
            
            return Ok(result);
        }
    }
}