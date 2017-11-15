using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAdventureAPI.Models.Dtos;

namespace WebAdventureAPI.Models.Responses.Player
{
    public class PlayerResponse : Response
    {
        public PlayerDto Player { get; set; }

        public PlayerResponse CreatePlayerResponse(PlayerDto player) => new PlayerResponse
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Player Created",
            Player = player
        };

        public PlayerResponse UpdatePlayerResponse(PlayerDto player) => new PlayerResponse
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Player Updated",
            Player = player
        };

        public PlayerResponse GetPlayerResponse(PlayerDto player) => new PlayerResponse
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Player Returned",
            Player = player
        };

        public PlayerResponse DeletePlayerResponse() => new PlayerResponse
        {
            Status = true,
            StatusCode = 201,
            StatusText = "Player Deleted"
        };
    }
}
