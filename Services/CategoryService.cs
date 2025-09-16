using AutoMapper;
using InternalKnowledgeBase.Api.DTOs;
using InternalKnowledgeBase.Api.Models;
using InternalKnowledgeBase.Api.Repositories.Interfaces;
using InternalKnowledgeBase.Api.Services.Interfaces;

namespace InternalKnowledgeBase.Api.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<GenericResponseDto<IEnumerable<CategoryDto>>> GetAllCategoriesAsync()
        {
            try
            {
                var categories = await _unitOfWork.Categories.GetAllAsync();
                var categoryDtos = _mapper.Map<IEnumerable<CategoryDto>>(categories);

                return new GenericResponseDto<IEnumerable<CategoryDto>>
                {
                    Success = true,
                    Message = "Categories retrieved successfully",
                    Data = categoryDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<CategoryDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving categories",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<IEnumerable<CategoryDto>>> GetActiveCategoriesAsync()
        {
            try
            {
                var categories = await _unitOfWork.Categories.GetActiveCategoriesAsync();
                var categoryDtos = _mapper.Map<IEnumerable<CategoryDto>>(categories);

                return new GenericResponseDto<IEnumerable<CategoryDto>>
                {
                    Success = true,
                    Message = "Active categories retrieved successfully",
                    Data = categoryDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<CategoryDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving active categories",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<CategoryDto>> GetCategoryByIdAsync(int categoryId)
        {
            try
            {
                var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
                if (category == null)
                {
                    return new GenericResponseDto<CategoryDto>
                    {
                        Success = false,
                        Message = "Category not found"
                    };
                }

                var categoryDto = _mapper.Map<CategoryDto>(category);
                return new GenericResponseDto<CategoryDto>
                {
                    Success = true,
                    Message = "Category retrieved successfully",
                    Data = categoryDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<CategoryDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the category",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<CategoryDto>> CreateCategoryAsync(CreateCategoryDto createCategoryDto)
        {
            try
            {
                // Check if category name already exists
                var existingCategory = await _unitOfWork.Categories.GetCategoryByNameAsync(createCategoryDto.Name);
                if (existingCategory != null)
                {
                    return new GenericResponseDto<CategoryDto>
                    {
                        Success = false,
                        Message = "Category name already exists"
                    };
                }

                var category = _mapper.Map<Category>(createCategoryDto);
                await _unitOfWork.Categories.AddAsync(category);
                await _unitOfWork.SaveAsync();

                var categoryDto = _mapper.Map<CategoryDto>(category);
                return new GenericResponseDto<CategoryDto>
                {
                    Success = true,
                    Message = "Category created successfully",
                    Data = categoryDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<CategoryDto>
                {
                    Success = false,
                    Message = "An error occurred while creating the category",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<CategoryDto>> UpdateCategoryAsync(int categoryId, UpdateCategoryDto updateCategoryDto)
        {
            try
            {
                var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
                if (category == null)
                {
                    return new GenericResponseDto<CategoryDto>
                    {
                        Success = false,
                        Message = "Category not found"
                    };
                }

                // Check if category name already exists (excluding current category)
                var existingCategory = await _unitOfWork.Categories.GetCategoryByNameAsync(updateCategoryDto.Name);
                if (existingCategory != null && existingCategory.Id != categoryId)
                {
                    return new GenericResponseDto<CategoryDto>
                    {
                        Success = false,
                        Message = "Category name already exists"
                    };
                }

                _mapper.Map(updateCategoryDto, category);
                await _unitOfWork.Categories.UpdateAsync(category);
                await _unitOfWork.SaveAsync();

                var categoryDto = _mapper.Map<CategoryDto>(category);
                return new GenericResponseDto<CategoryDto>
                {
                    Success = true,
                    Message = "Category updated successfully",
                    Data = categoryDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<CategoryDto>
                {
                    Success = false,
                    Message = "An error occurred while updating the category",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto> DeleteCategoryAsync(int categoryId)
        {
            try
            {
                var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
                if (category == null)
                {
                    return new GenericResponseDto
                    {
                        Success = false,
                        Message = "Category not found"
                    };
                }

                // Check if category has articles
                var hasArticles = await _unitOfWork.Categories.CategoryHasArticlesAsync(categoryId);
                if (hasArticles)
                {
                    return new GenericResponseDto
                    {
                        Success = false,
                        Message = "Cannot delete category that has articles"
                    };
                }

                await _unitOfWork.Categories.DeleteAsync(categoryId);
                await _unitOfWork.SaveAsync();

                return new GenericResponseDto
                {
                    Success = true,
                    Message = "Category deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto
                {
                    Success = false,
                    Message = "An error occurred while deleting the category",
                    Errors = { ex.Message }
                };
            }
        }
    }
}
