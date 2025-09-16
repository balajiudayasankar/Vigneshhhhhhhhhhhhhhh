using System.ComponentModel.DataAnnotations;

namespace InternalKnowledgeBase.Api.Models
{
    public class Category : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string Color { get; set; } = "#007bff";
        
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
    }
}