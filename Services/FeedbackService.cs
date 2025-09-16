using AutoMapper;
using InternalKnowledgeBase.Api.DTOs;
using InternalKnowledgeBase.Api.Models;
using InternalKnowledgeBase.Api.Repositories.Interfaces;
using InternalKnowledgeBase.Api.Services.Interfaces;

namespace InternalKnowledgeBase.Api.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public FeedbackService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<GenericResponseDto<FeedbackDto>> CreateFeedbackAsync(int userId, CreateFeedbackDto createFeedbackDto)
        {
            try
            {
                // Check if user has already provided feedback for this article
                var existingFeedback = await _unitOfWork.Feedbacks.UserHasRatedArticleAsync(userId, createFeedbackDto.ArticleId);
                if (existingFeedback)
                {
                    return new GenericResponseDto<FeedbackDto>
                    {
                        Success = false,
                        Message = "You have already provided feedback for this article"
                    };
                }

                // Check if article exists
                var article = await _unitOfWork.Articles.GetByIdAsync(createFeedbackDto.ArticleId);
                if (article == null)
                {
                    return new GenericResponseDto<FeedbackDto>
                    {
                        Success = false,
                        Message = "Article not found"
                    };
                }

                var feedback = _mapper.Map<Feedback>(createFeedbackDto);
                feedback.UserId = userId;

                await _unitOfWork.Feedbacks.AddAsync(feedback);
                await _unitOfWork.SaveAsync();

                // Reload feedback with related data
                var createdFeedback = await _unitOfWork.Feedbacks.GetByIdAsync(feedback.Id);
                var feedbackDto = _mapper.Map<FeedbackDto>(createdFeedback);

                return new GenericResponseDto<FeedbackDto>
                {
                    Success = true,
                    Message = "Feedback submitted successfully",
                    Data = feedbackDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<FeedbackDto>
                {
                    Success = false,
                    Message = "An error occurred while submitting feedback",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<IEnumerable<FeedbackDto>>> GetFeedbackByArticleAsync(int articleId)
        {
            try
            {
                var feedbacks = await _unitOfWork.Feedbacks.GetFeedbackByArticleAsync(articleId);
                var feedbackDtos = _mapper.Map<IEnumerable<FeedbackDto>>(feedbacks);

                return new GenericResponseDto<IEnumerable<FeedbackDto>>
                {
                    Success = true,
                    Message = "Feedback retrieved successfully",
                    Data = feedbackDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<FeedbackDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving feedback",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<IEnumerable<FeedbackDto>>> GetFeedbackByUserAsync(int userId)
        {
            try
            {
                var feedbacks = await _unitOfWork.Feedbacks.GetFeedbackByUserAsync(userId);
                var feedbackDtos = _mapper.Map<IEnumerable<FeedbackDto>>(feedbacks);

                return new GenericResponseDto<IEnumerable<FeedbackDto>>
                {
                    Success = true,
                    Message = "Feedback retrieved successfully",
                    Data = feedbackDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<FeedbackDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving feedback",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<double>> GetAverageRatingAsync(int articleId)
        {
            try
            {
                var averageRating = await _unitOfWork.Feedbacks.GetAverageRatingAsync(articleId);

                return new GenericResponseDto<double>
                {
                    Success = true,
                    Message = "Average rating retrieved successfully",
                    Data = Math.Round(averageRating, 2)
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<double>
                {
                    Success = false,
                    Message = "An error occurred while retrieving average rating",
                    Errors = { ex.Message }
                };
            }
        }
    }
}
