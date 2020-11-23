using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.ViewModels
{
    public class CreateDeliveryManViewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Code { get; set; }
        public string Iso { get; set; }
        public string IdCardNumber { get; set; }
        public IFormFile IdCardFront { get; set; }
        public IFormFile IdCardBack { get; set; }
        public string Password { get; set; }
    }
}
