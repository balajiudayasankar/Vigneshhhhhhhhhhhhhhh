using AutoMapper;
using InternalKnowledgeBase.Api.DTOs;
using InternalKnowledgeBase.Api.Helpers;
using InternalKnowledgeBase.Api.Models;
using InternalKnowledgeBase.Api.Repositories.Interfaces;
using InternalKnowledgeBase.Api.Services.Interfaces;

namespace InternalKnowledgeBase.Api.Services
{
    public class ContributorService : IContributorService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly EmailNotificationService _emailService;

        public ContributorService(IUnitOfWork unitOfWork, IMapper mapper, EmailNotificationService emailService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _emailService = emailService;
        }

        public async Task<GenericResponseDto<ContributorDto>> RequestContributorAccessAsync(int userId, ContributorRequestDto requestDto)
        {
            try
            {
                // Check if user already has a contributor request
                var existingContributor = await _unitOfWork.Contributors.GetByUserIdAsync(userId);
                if (existingContributor != null)
                {
                    return new GenericResponseDto<ContributorDto>
                    {
                        Success = false,
                        Message = "Contributor request already exists"
                    };
                }

                var contributor = new Contributor
                {
                    UserId = userId,
                    ProofDocument = requestDto.ProofDocument,
                    IsApproved = false
                };

                await _unitOfWork.Contributors.AddAsync(contributor);
                await _unitOfWork.SaveAsync();

                // Reload contributor with user details
                var createdContributor = await _unitOfWork.Contributors.GetContributorWithUserAsync(contributor.Id);
                var contributorDto = _mapper.Map<ContributorDto>(createdContributor);

                return new GenericResponseDto<ContributorDto>
                {
                    Success = true,
                    Message = "Contributor request submitted successfully",
                    Data = contributorDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<ContributorDto>
                {
                    Success = false,
                    Message = "An error occurred while submitting contributor request",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<ContributorDto>> ApproveContributorAsync(int contributorId, int approvedByUserId, ApproveContributorDto approveDto)
        {
            try
            {
                var contributor = await _unitOfWork.Contributors.GetContributorWithUserAsync(contributorId);
                if (contributor == null)
                {
                    return new GenericResponseDto<ContributorDto>
                    {
                        Success = false,
                        Message = "Contributor not found"
                    };
                }

                contributor.IsApproved = approveDto.IsApproved;
                contributor.ApprovedDate = DateTime.UtcNow;
                contributor.ApprovedByUserId = approvedByUserId;
                contributor.ApprovalNotes = approveDto.ApprovalNotes;

                await _unitOfWork.Contributors.UpdateAsync(contributor);
                await _unitOfWork.SaveAsync();

                // Send notification email
                if (contributor.User != null)
                {
                    await _emailService.SendContributorApprovalEmailAsync(
                        contributor.User.Email,
                        $"{contributor.User.FirstName} {contributor.User.LastName}",
                        approveDto.IsApproved,
                        approveDto.ApprovalNotes
                    );
                }

                var contributorDto = _mapper.Map<ContributorDto>(contributor);
                return new GenericResponseDto<ContributorDto>
                {
                    Success = true,
                    Message = $"Contributor {(approveDto.IsApproved ? "approved" : "rejected")} successfully",
                    Data = contributorDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<ContributorDto>
                {
                    Success = false,
                    Message = "An error occurred while processing contributor approval",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<IEnumerable<ContributorDto>>> GetPendingApprovalsAsync()
        {
            try
            {
                var contributors = await _unitOfWork.Contributors.GetPendingApprovalsAsync();
                var contributorDtos = _mapper.Map<IEnumerable<ContributorDto>>(contributors);

                return new GenericResponseDto<IEnumerable<ContributorDto>>
                {
                    Success = true,
                    Message = "Pending approvals retrieved successfully",
                    Data = contributorDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<ContributorDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving pending approvals",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<IEnumerable<ContributorDto>>> GetApprovedContributorsAsync()
        {
            try
            {
                var contributors = await _unitOfWork.Contributors.GetApprovedContributorsAsync();
                var contributorDtos = _mapper.Map<IEnumerable<ContributorDto>>(contributors);

                return new GenericResponseDto<IEnumerable<ContributorDto>>
                {
                    Success = true,
                    Message = "Approved contributors retrieved successfully",
                    Data = contributorDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<ContributorDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving approved contributors",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<ContributorDto>> GetContributorByIdAsync(int contributorId)
        {
            try
            {
                var contributor = await _unitOfWork.Contributors.GetContributorWithUserAsync(contributorId);
                if (contributor == null)
                {
                    return new GenericResponseDto<ContributorDto>
                    {
                        Success = false,
                        Message = "Contributor not found"
                    };
                }

                var contributorDto = _mapper.Map<ContributorDto>(contributor);
                return new GenericResponseDto<ContributorDto>
                {
                    Success = true,
                    Message = "Contributor retrieved successfully",
                    Data = contributorDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<ContributorDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the contributor",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<ContributorDto>> GetContributorByUserIdAsync(int userId)
        {
            try
            {
                var contributor = await _unitOfWork.Contributors.GetByUserIdAsync(userId);
                if (contributor == null)
                {
                    return new GenericResponseDto<ContributorDto>
                    {
                        Success = false,
                        Message = "Contributor not found"
                    };
                }

                var contributorDto = _mapper.Map<ContributorDto>(contributor);
                return new GenericResponseDto<ContributorDto>
                {
                    Success = true,
                    Message = "Contributor retrieved successfully",
                    Data = contributorDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<ContributorDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the contributor",
                    Errors = { ex.Message }
                };
            }
        }
    }
}
