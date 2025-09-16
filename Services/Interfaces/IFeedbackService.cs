using InternalKnowledgeBase.Api.DTOs;

namespace InternalKnowledgeBase.Api.Services.Interfaces
{
    public interface IFeedbackService
    {
        Task<GenericResponseDto<FeedbackDto>> CreateFeedbackAsync(int userId, CreateFeedbackDto createFeedbackDto);
        Task<GenericResponseDto<IEnumerable<FeedbackDto>>> GetFeedbackByArticleAsync(int articleId);
        Task<GenericResponseDto<IEnumerable<FeedbackDto>>> GetFeedbackByUserAsync(int userId);
        Task<GenericResponseDto<double>> GetAverageRatingAsync(int articleId);
    }
}