using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class CompleteRoomInfoDto
    {
        public RoomDto Room { get; set; }

        public List<ExitDto> Exits { get; set; }

        public MonsterDto Monster { get; set; }

        public ItemDto Item { get; set; }
    }
}
