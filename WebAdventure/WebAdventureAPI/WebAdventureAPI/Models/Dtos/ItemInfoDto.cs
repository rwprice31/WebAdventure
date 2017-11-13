﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAdventureAPI.Models.Dtos
{
    public class ItemInfoDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Descr { get; set; }

        public string Type { get; set; }

        public int Points { get; set; }
    }
}