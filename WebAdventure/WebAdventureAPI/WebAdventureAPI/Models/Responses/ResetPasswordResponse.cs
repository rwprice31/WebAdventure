
using WebAdventureAPI.Models.Dtos;
namespace WebAdventureAPI.Models.Responses
{
    public class ResetPasswordResponse : Response
    {
        public ResetPasswordResponse()
        {
            StatusText = "Password Reset Successfull!";
            StatusCode = 200;
            Status = true;
        }

        public UserDto User { get; set; }
    }
}
