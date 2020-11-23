using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.ViewModels
{
    public class UserGetDetails
    {
        public string UserId { get; set; }
        public string ProfilePictureUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Code { get; set; }
        public string Iso { get; set; }
    }

    public class UserPostDetails
    {
        public string UserId { get; set; }
        public IFormFile Picture { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Code { get; set; }
        public string Iso { get; set; }
    }

    public class UserPostDetails2
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Code { get; set; }
        public string Iso { get; set; }
    }


    public class ChangePassword
    {
        public string UserId { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string NewPassordConfirmation { get; set; }
       
    }

    public class Verify
    {
        public string UserId { get; set; }
        public IFormFile IdCard { get; set; }
        public IFormFile LegalDocument { get; set; }
      
    }

    public class AboutBusiness
    {
        public string UserId { get; set; }
        public string Text { get; set; }
       
    }

    public class OpeningHours
    {
        public string UserId { get; set; }
        public List<OpenHour> Hours { get; set; }
    }

    public class OpenHour
    {
        public int DayId { get; set; }
        public string Day { get; set; }
        public bool IsOpened { get; set; }
        public string From { get; set; }
        public string To { get; set; }

        public string UserId { get; set; }

    }

    public class DeleteBusiness
    {
        public string UserId { get; set; }

    }

    public class SubscriptionDetails
    {
        public string UserId { get; set; }
        public string Amount { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string PaymentCode { get; set; }
        public List<PaymentMethod> Methods { get; set; }
    }

    public class PaymentMethod
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
    }

    public class Synopsis
    {
        public string UserId { get; set; }
        public List<BizService> Services { get; set; }
  
    }

    public class BizService
    {
        public int AmenitieId { get; set; }
        public string Name { get; set; }
        public bool Checked { get; set; }
    }

}
