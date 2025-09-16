using AutoMapper;
using InternalKnowledgeBase.Api.DTOs;
using InternalKnowledgeBase.Api.Models;
using InternalKnowledgeBase.Api.Repositories.Interfaces;
using InternalKnowledgeBase.Api.Services.Interfaces;

namespace InternalKnowledgeBase.Api.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<GenericResponseDto<IEnumerable<UserDto>>> GetAllUsersAsync()
        {
            try
            {
                var users = await _unitOfWork.Users.GetAllAsync();
                var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);

                return new GenericResponseDto<IEnumerable<UserDto>>
                {
                    Success = true,
                    Message = "Users retrieved successfully",
                    Data = userDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<UserDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving users",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<UserDto>> GetUserByIdAsync(int userId)
        {
            try
            {
                var user = await _unitOfWork.Users.GetUserWithRoleAsync(userId);
                if (user == null)
                {
                    return new GenericResponseDto<UserDto>
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                var userDto = _mapper.Map<UserDto>(user);
                userDto.RoleName = user.Role.Name;
                userDto.IsContributor = user.Contributor?.IsApproved == true;

                return new GenericResponseDto<UserDto>
                {
                    Success = true,
                    Message = "User retrieved successfully",
                    Data = userDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<UserDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the user",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<UserDto>> CreateUserAsync(CreateUserDto createUserDto)
        {
            try
            {
                // Check if email already exists
                if (await _unitOfWork.Users.EmailExistsAsync(createUserDto.Email))
                {
                    return new GenericResponseDto<UserDto>
                    {
                        Success = false,
                        Message = "Email already exists"
                    };
                }

                var user = _mapper.Map<User>(createUserDto);
                user.IsActive = true;

                await _unitOfWork.Users.AddAsync(user);
                await _unitOfWork.SaveAsync();

                // Reload user with role
                var createdUser = await _unitOfWork.Users.GetUserWithRoleAsync(user.Id);
                var userDto = _mapper.Map<UserDto>(createdUser);
                userDto.RoleName = createdUser?.Role.Name ?? "";

                return new GenericResponseDto<UserDto>
                {
                    Success = true,
                    Message = "User created successfully",
                    Data = userDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<UserDto>
                {
                    Success = false,
                    Message = "An error occurred while creating the user",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<UserDto>> UpdateUserAsync(int userId, UpdateUserDto updateUserDto)
        {
            try
            {
                var user = await _unitOfWork.Users.GetUserWithRoleAsync(userId);
                if (user == null)
                {
                    return new GenericResponseDto<UserDto>
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                _mapper.Map(updateUserDto, user);
                await _unitOfWork.Users.UpdateAsync(user);
                await _unitOfWork.SaveAsync();

                // Reload user with role
                var updatedUser = await _unitOfWork.Users.GetUserWithRoleAsync(userId);
                var userDto = _mapper.Map<UserDto>(updatedUser);
                userDto.RoleName = updatedUser?.Role.Name ?? "";
                userDto.IsContributor = updatedUser?.Contributor?.IsApproved == true;

                return new GenericResponseDto<UserDto>
                {
                    Success = true,
                    Message = "User updated successfully",
                    Data = userDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<UserDto>
                {
                    Success = false,
                    Message = "An error occurred while updating the user",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto> DeleteUserAsync(int userId)
        {
            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(userId);
                if (user == null)
                {
                    return new GenericResponseDto
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                await _unitOfWork.Users.DeleteAsync(userId);
                await _unitOfWork.SaveAsync();

                return new GenericResponseDto
                {
                    Success = true,
                    Message = "User deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto
                {
                    Success = false,
                    Message = "An error occurred while deleting the user",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<IEnumerable<UserDto>>> GetUsersByRoleAsync(int roleId)
        {
            try
            {
                var users = await _unitOfWork.Users.GetUsersByRoleAsync(roleId);
                var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);

                return new GenericResponseDto<IEnumerable<UserDto>>
                {
                    Success = true,
                    Message = "Users retrieved successfully",
                    Data = userDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<UserDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving users by role",
                    Errors = { ex.Message }
                };
            }
        }
    }
}
