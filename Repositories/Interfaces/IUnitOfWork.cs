namespace InternalKnowledgeBase.Api.Repositories.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        IContributorRepository Contributors { get; }
        IArticleRepository Articles { get; }
        ICategoryRepository Categories { get; }
        ITagRepository Tags { get; }
        IFeedbackRepository Feedbacks { get; }
        
        Task<int> SaveAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}