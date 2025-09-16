using InternalKnowledgeBase.Api.DTOs;

namespace InternalKnowledgeBase.Api.Services.Interfaces
{
    public interface IUserService
    {
        Task<GenericResponseDto<IEnumerable<UserDto>>> GetAllUsersAsync();
        Task<GenericResponseDto<UserDto>> GetUserByIdAsync(int userId);
        Task<GenericResponseDto<UserDto>> CreateUserAsync(CreateUserDto createUserDto);
        Task<GenericResponseDto<UserDto>> UpdateUserAsync(int userId, UpdateUserDto updateUserDto);
        Task<GenericResponseDto> DeleteUserAsync(int userId);
        Task<GenericResponseDto<IEnumerable<UserDto>>> GetUsersByRoleAsync(int roleId);
    }
}