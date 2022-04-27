using back_end.Models.User;

namespace back_end.Internals
{
    public class UsersRepository : IUsersRepository
    {
        List<User> allUsers = new List<User>();

        public UsersRepository()
        {
            if (!File.Exists(@"resources/Users.csv"))
            {
                using (var writer = File.CreateText(@"resources/Users.csv"))
                {
                    writer.WriteLine("ID;NOME_USUARIO;SENHA_HASH;SENHA_SALT;ADMIN");
                }
            }
            else
            {
                try
                {
                    using (var reader = new StreamReader(File.OpenRead(@"resources/Users.csv")))
                    {

                        List<User> tempUsers = new List<User>();
                        reader.ReadLine();
                        while (!reader.EndOfStream)
                        {
                            var line = reader.ReadLine();
                            var values = line.Split(';');
                            if (values.Length != 5)
                            {
                                Console.WriteLine("CSV incompativel! Faltam dados.");
                                throw new ArgumentException();
                            }
                            User tempUser = new User();
                            tempUser.Id = int.Parse(values[0]);
                            tempUser.Username = values[1];
                            tempUser.PasswordHash = System.Convert.FromBase64String(values[2]);
                            tempUser.PasswordSalt = System.Convert.FromBase64String(values[3]);
                            tempUser.Admin = bool.Parse(values[4]);

                            tempUsers.Add(tempUser);
                        }
                        tempUsers.Sort((x, y) => x.Id.CompareTo(y.Id));
                        allUsers = tempUsers;
                    }
                }
                catch (Exception)
                {

                }
            }
        }


        public User Get(int entityId)
        {
            return allUsers.Find(user => user.Id == entityId);
        }
        public ICollection<User> GetAll()
        {
            return allUsers;
        }
        public bool Add(User entity)
        {
            if (allUsers.Contains(entity))
                return false;
            allUsers.Add(entity);
            return true;
        }
        public bool Remove(User entity)
        {
            if (!allUsers.Contains(entity))
                return false;
            allUsers.Remove(entity);
            return true;
        }
        public bool Update(int entityId, User entity)
        {
            User user = allUsers.Find(user => user.Id == entityId);
            if (user != null)
            {
                user = entity;
                return true;
            }
            return false;
        }
        public bool RemoveById(int entityId)
        {
            User user = allUsers.Find(user => user.Id == entityId);
            if (user == null)
                return false;
            allUsers.Remove(user);
            return true;
        }
        public async Task<bool> SaveChanges()
        {
            try
            {
                using (var writer = File.CreateText(@"resources/Users.csv"))
                {
                    writer.WriteLine("ID;NOME_USUARIO;SENHA_HASH;SENHA_SALT;ADMIN");
                    foreach (User user in allUsers)
                    {
                        writer.WriteLine($"{user.Id};{user.Username};{System.Convert.ToBase64String(user.PasswordHash)};{System.Convert.ToBase64String(user.PasswordSalt)};{user.Admin}");
                    }
                }
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }
    }
}


// public UsersRepository()
//     {
//         try
//         {

//         }
//         catch (Exception) { }