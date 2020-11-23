using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.Models
{
    public class PaymentMethods
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string Amount { get; set; }
        public string PhoneNumber { get; set; }
    }
}
