namespace InternalKnowledgeBase.Api.DTOs
{
    public class ContributorDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string ProofDocument { get; set; } = string.Empty;
        public bool IsApproved { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string ApprovedByUserName { get; set; } = string.Empty;
        public string ApprovalNotes { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
    }

    public class ContributorRequestDto
    {
        public string ProofDocument { get; set; } = string.Empty;
    }

    public class ApproveContributorDto
    {
        public bool IsApproved { get; set; }
        public string ApprovalNotes { get; set; } = string.Empty;
    }
}