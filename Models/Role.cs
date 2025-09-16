using System.ComponentModel.DataAnnotations;

namespace InternalKnowledgeBase.Api.Models
{
    public class Role : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string Description { get; set; } = string.Empty;
        
        // Navigation properties
        public virtual ICollection<User> Users { get; set; } = new List<User>();
    }
}