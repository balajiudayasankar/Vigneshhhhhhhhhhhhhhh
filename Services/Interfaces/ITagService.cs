using InternalKnowledgeBase.Api.DTOs;

namespace InternalKnowledgeBase.Api.Services.Interfaces
{
    public interface ITagService
    {
        Task<GenericResponseDto<IEnumerable<TagDto>>> GetAllTagsAsync();
        Task<GenericResponseDto<TagDto>> GetTagByIdAsync(int tagId);
        Task<GenericResponseDto<TagDto>> CreateTagAsync(CreateTagDto createTagDto);
        Task<GenericResponseDto<TagDto>> UpdateTagAsync(int tagId, UpdateTagDto updateTagDto);
        Task<GenericResponseDto> DeleteTagAsync(int tagId);
        Task<GenericResponseDto<IEnumerable<TagDto>>> GetPopularTagsAsync(int count);
    }
}