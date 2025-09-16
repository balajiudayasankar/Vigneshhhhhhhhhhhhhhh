using InternalKnowledgeBase.Api.DTOs;

namespace InternalKnowledgeBase.Api.Services.Interfaces
{
    public interface IContributorService
    {
        Task<GenericResponseDto<ContributorDto>> RequestContributorAccessAsync(int userId, ContributorRequestDto requestDto);
        Task<GenericResponseDto<ContributorDto>> ApproveContributorAsync(int contributorId, int approvedByUserId, ApproveContributorDto approveDto);
        Task<GenericResponseDto<IEnumerable<ContributorDto>>> GetPendingApprovalsAsync();
        Task<GenericResponseDto<IEnumerable<ContributorDto>>> GetApprovedContributorsAsync();
        Task<GenericResponseDto<ContributorDto>> GetContributorByIdAsync(int contributorId);
        Task<GenericResponseDto<ContributorDto>> GetContributorByUserIdAsync(int userId);
    }
}