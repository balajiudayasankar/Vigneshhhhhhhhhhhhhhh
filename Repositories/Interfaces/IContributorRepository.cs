using InternalKnowledgeBase.Api.Models;

namespace InternalKnowledgeBase.Api.Repositories.Interfaces
{
    public interface IContributorRepository : IGenericRepository<Contributor>
    {
        Task<Contributor?> GetByUserIdAsync(int userId);
        Task<IEnumerable<Contributor>> GetPendingApprovalsAsync();
        Task<IEnumerable<Contributor>> GetApprovedContributorsAsync();
        Task<Contributor?> GetContributorWithUserAsync(int contributorId);
    }
}