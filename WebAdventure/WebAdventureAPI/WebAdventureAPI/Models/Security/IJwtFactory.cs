using System.Security.Claims;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Security
{
    public interface IJwtFactory
    {
        ClaimsIdentity GenerateClaimsIdentity(string email, string id);
        Task<string> GenerateEncodedToken(string email, ClaimsIdentity identity);
    }
}