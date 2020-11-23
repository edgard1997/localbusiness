using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.Models
{
    public class Verification
    {
        public string Id { get; set;  }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Size { get; set; }
        public string Extension { get; set; }
        public byte[] File { get; set; }
        public DateTime Date { get; set; }
    }
}
