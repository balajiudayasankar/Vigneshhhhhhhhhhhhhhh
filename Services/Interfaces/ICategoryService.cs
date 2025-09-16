using InternalKnowledgeBase.Api.DTOs;

namespace InternalKnowledgeBase.Api.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<GenericResponseDto<IEnumerable<CategoryDto>>> GetAllCategoriesAsync();
        Task<GenericResponseDto<IEnumerable<CategoryDto>>> GetActiveCategoriesAsync();
        Task<GenericResponseDto<CategoryDto>> GetCategoryByIdAsync(int categoryId);
        Task<GenericResponseDto<CategoryDto>> CreateCategoryAsync(CreateCategoryDto createCategoryDto);
        Task<GenericResponseDto<CategoryDto>> UpdateCategoryAsync(int categoryId, UpdateCategoryDto updateCategoryDto);
        Task<GenericResponseDto> DeleteCategoryAsync(int categoryId);
    }
}