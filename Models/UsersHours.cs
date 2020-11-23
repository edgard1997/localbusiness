using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.Models
{
    public class UsersHours
    {
        public string Id { get; set; }
        public int DayId { get; set; }
        public string UserId { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public bool IsOpened { get; set; }

    }
}
