using AutoMapper;
using InternalKnowledgeBase.Api.DTOs;
using InternalKnowledgeBase.Api.Helpers;
using InternalKnowledgeBase.Api.Models;
using InternalKnowledgeBase.Api.Repositories.Interfaces;
using InternalKnowledgeBase.Api.Services.Interfaces;

namespace InternalKnowledgeBase.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly JwtHelper _jwtHelper;

        public AuthService(IUnitOfWork unitOfWork, IMapper mapper, JwtHelper jwtHelper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _jwtHelper = jwtHelper;
        }

        public async Task<GenericResponseDto<LoginResponseDto>> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var user = await _unitOfWork.Users.GetByEmailAsync(loginDto.Email);
                
                if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    return new GenericResponseDto<LoginResponseDto>
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                if (!user.IsActive)
                {
                    return new GenericResponseDto<LoginResponseDto>
                    {
                        Success = false,
                        Message = "Account is inactive"
                    };
                }

                // Update last login date
                user.LastLoginDate = DateTime.UtcNow;
                await _unitOfWork.Users.UpdateAsync(user);
                await _unitOfWork.SaveAsync();

                // Generate tokens
                var token = _jwtHelper.GenerateToken(user);
                var refreshToken = _jwtHelper.GenerateRefreshToken();

                var userDto = _mapper.Map<UserDto>(user);
                userDto.RoleName = user.Role.Name;
                userDto.IsContributor = user.Contributor?.IsApproved == true;

                var response = new LoginResponseDto
                {
                    Token = token,
                    RefreshToken = refreshToken,
                    ExpiresAt = DateTime.UtcNow.AddHours(1),
                    User = userDto
                };

                return new GenericResponseDto<LoginResponseDto>
                {
                    Success = true,
                    Message = "Login successful",
                    Data = response
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<LoginResponseDto>
                {
                    Success = false,
                    Message = "An error occurred during login",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<UserDto>> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                if (await _unitOfWork.Users.EmailExistsAsync(registerDto.Email))
                {
                    return new GenericResponseDto<UserDto>
                    {
                        Success = false,
                        Message = "Email already exists"
                    };
                }

                var user = new User
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Email = registerDto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    Department = registerDto.Department,
                    RoleId = 2, // Default to User role
                    IsActive = true
                };

                await _unitOfWork.Users.AddAsync(user);
                await _unitOfWork.SaveAsync();

                // Reload user with role
                var createdUser = await _unitOfWork.Users.GetUserWithRoleAsync(user.Id);
                var userDto = _mapper.Map<UserDto>(createdUser);
                userDto.RoleName = createdUser?.Role.Name ?? "";

                return new GenericResponseDto<UserDto>
                {
                    Success = true,
                    Message = "Registration successful",
                    Data = userDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<UserDto>
                {
                    Success = false,
                    Message = "An error occurred during registration",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto)
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

                if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
                {
                    return new GenericResponseDto
                    {
                        Success = false,
                        Message = "Current password is incorrect"
                    };
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
                await _unitOfWork.Users.UpdateAsync(user);
                await _unitOfWork.SaveAsync();

                return new GenericResponseDto
                {
                    Success = true,
                    Message = "Password changed successfully"
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto
                {
                    Success = false,
                    Message = "An error occurred while changing password",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<LoginResponseDto>> RefreshTokenAsync(string refreshToken)
        {
            // Implement refresh token logic
            await Task.CompletedTask;
            return new GenericResponseDto<LoginResponseDto>
            {
                Success = false,
                Message = "Refresh token functionality not implemented"
            };
        }

        public async Task<GenericResponseDto> LogoutAsync(int userId)
        {
            // Implement logout logic (e.g., blacklist token)
            await Task.CompletedTask;
            return new GenericResponseDto
            {
                Success = true,
                Message = "Logout successful"
            };
        }
    }
}