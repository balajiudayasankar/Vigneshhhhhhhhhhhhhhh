using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternalKnowledgeBase.Api.Models
{
    public class Contributor : BaseEntity
    {
        // Foreign Keys
        public int UserId { get; set; }
        
        [StringLength(500)]
        public string ProofDocument { get; set; } = string.Empty;
        
        public bool IsApproved { get; set; } = false;
        
        public DateTime? ApprovedDate { get; set; }
        
        public int? ApprovedByUserId { get; set; }
        
        [StringLength(1000)]
        public string ApprovalNotes { get; set; } = string.Empty;
        
        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
        
        [ForeignKey("ApprovedByUserId")]
        public virtual User? ApprovedByUser { get; set; }
        
        public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
    }
}