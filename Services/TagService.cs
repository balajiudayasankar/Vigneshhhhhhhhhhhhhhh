using AutoMapper;
using InternalKnowledgeBase.Api.DTOs;
using InternalKnowledgeBase.Api.Models;
using InternalKnowledgeBase.Api.Repositories.Interfaces;
using InternalKnowledgeBase.Api.Services.Interfaces;

namespace InternalKnowledgeBase.Api.Services
{
    public class TagService : ITagService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TagService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<GenericResponseDto<IEnumerable<TagDto>>> GetAllTagsAsync()
        {
            try
            {
                var tags = await _unitOfWork.Tags.GetAllAsync();
                var tagDtos = _mapper.Map<IEnumerable<TagDto>>(tags);

                return new GenericResponseDto<IEnumerable<TagDto>>
                {
                    Success = true,
                    Message = "Tags retrieved successfully",
                    Data = tagDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<TagDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving tags",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<TagDto>> GetTagByIdAsync(int tagId)
        {
            try
            {
                var tag = await _unitOfWork.Tags.GetByIdAsync(tagId);
                if (tag == null)
                {
                    return new GenericResponseDto<TagDto>
                    {
                        Success = false,
                        Message = "Tag not found"
                    };
                }

                var tagDto = _mapper.Map<TagDto>(tag);
                return new GenericResponseDto<TagDto>
                {
                    Success = true,
                    Message = "Tag retrieved successfully",
                    Data = tagDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<TagDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the tag",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<TagDto>> CreateTagAsync(CreateTagDto createTagDto)
        {
            try
            {
                // Check if tag name already exists
                var existingTag = await _unitOfWork.Tags.GetTagByNameAsync(createTagDto.Name);
                if (existingTag != null)
                {
                    return new GenericResponseDto<TagDto>
                    {
                        Success = false,
                        Message = "Tag name already exists"
                    };
                }

                var tag = _mapper.Map<Tag>(createTagDto);
                await _unitOfWork.Tags.AddAsync(tag);
                await _unitOfWork.SaveAsync();

                var tagDto = _mapper.Map<TagDto>(tag);
                return new GenericResponseDto<TagDto>
                {
                    Success = true,
                    Message = "Tag created successfully",
                    Data = tagDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<TagDto>
                {
                    Success = false,
                    Message = "An error occurred while creating the tag",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<TagDto>> UpdateTagAsync(int tagId, UpdateTagDto updateTagDto)
        {
            try
            {
                var tag = await _unitOfWork.Tags.GetByIdAsync(tagId);
                if (tag == null)
                {
                    return new GenericResponseDto<TagDto>
                    {
                        Success = false,
                        Message = "Tag not found"
                    };
                }

                // Check if tag name already exists (excluding current tag)
                var existingTag = await _unitOfWork.Tags.GetTagByNameAsync(updateTagDto.Name);
                if (existingTag != null && existingTag.Id != tagId)
                {
                    return new GenericResponseDto<TagDto>
                    {
                        Success = false,
                        Message = "Tag name already exists"
                    };
                }

                _mapper.Map(updateTagDto, tag);
                await _unitOfWork.Tags.UpdateAsync(tag);
                await _unitOfWork.SaveAsync();

                var tagDto = _mapper.Map<TagDto>(tag);
                return new GenericResponseDto<TagDto>
                {
                    Success = true,
                    Message = "Tag updated successfully",
                    Data = tagDto
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<TagDto>
                {
                    Success = false,
                    Message = "An error occurred while updating the tag",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto> DeleteTagAsync(int tagId)
        {
            try
            {
                var tag = await _unitOfWork.Tags.GetByIdAsync(tagId);
                if (tag == null)
                {
                    return new GenericResponseDto
                    {
                        Success = false,
                        Message = "Tag not found"
                    };
                }

                await _unitOfWork.Tags.DeleteAsync(tagId);
                await _unitOfWork.SaveAsync();

                return new GenericResponseDto
                {
                    Success = true,
                    Message = "Tag deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto
                {
                    Success = false,
                    Message = "An error occurred while deleting the tag",
                    Errors = { ex.Message }
                };
            }
        }

        public async Task<GenericResponseDto<IEnumerable<TagDto>>> GetPopularTagsAsync(int count)
        {
            try
            {
                var tags = await _unitOfWork.Tags.GetPopularTagsAsync(count);
                var tagDtos = _mapper.Map<IEnumerable<TagDto>>(tags);

                return new GenericResponseDto<IEnumerable<TagDto>>
                {
                    Success = true,
                    Message = "Popular tags retrieved successfully",
                    Data = tagDtos
                };
            }
            catch (Exception ex)
            {
                return new GenericResponseDto<IEnumerable<TagDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving popular tags",
                    Errors = { ex.Message }
                };
            }
        }
    }
}
