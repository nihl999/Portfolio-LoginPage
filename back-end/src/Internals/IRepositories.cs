using back_end.Models.User;

namespace back_end.Internals
{
    public interface IRepository<TEntity>
    {
        public TEntity Get(int entityId);
        public ICollection<TEntity> GetAll();
        public bool Add(TEntity entity);
        public bool Remove(TEntity entity);
        public bool Update(int entityId, TEntity entity);
        public bool RemoveById(int entityId);
    }
    public interface IUsersRepository : IRepository<User>
    {
        public Task<bool> SaveChanges();
    }


}