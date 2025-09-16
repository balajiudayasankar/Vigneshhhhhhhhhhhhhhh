using InternalKnowledgeBase.Api.DTOs;

namespace InternalKnowledgeBase.Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<GenericResponseDto<LoginResponseDto>> LoginAsync(LoginDto loginDto);
        Task<GenericResponseDto<UserDto>> RegisterAsync(RegisterDto registerDto);
        Task<GenericResponseDto> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
        Task<GenericResponseDto<LoginResponseDto>> RefreshTokenAsync(string refreshToken);
        Task<GenericResponseDto> LogoutAsync(int userId);
    }
}