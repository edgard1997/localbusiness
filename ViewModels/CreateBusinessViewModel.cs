using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.ViewModels
{
    public class CreateBusinessViewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Code { get; set; }
        public string Iso { get; set; }
        public string IdCardNumber { get; set; }
        public string BusinessName { get; set; }
        public int BusinessType { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public double Lat { get; set; }
        public double Long { get; set; }
    }
}
