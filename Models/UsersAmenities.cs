using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.Models
{
    public class UsersAmenities
    {
        public string Id { get; set; }
        public int AmenitieId { get; set; }
        public string UserId { get; set; }
        public bool IsChecked { get; set; }
    }
}
