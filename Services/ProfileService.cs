using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using NiceWixApp.Models;
using NiceWixApp.Data;

namespace NiceWixApp.Services
{
    public class ProfileService : IProfileService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _db;
        private readonly IHttpContextAccessor _http;
        public IUserClaimsPrincipalFactory<ApplicationUser> _principalFactory { get; }
        public ProfileService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager, ApplicationDbContext db, IHttpContextAccessor http, IUserClaimsPrincipalFactory<ApplicationUser> principalFactory)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _db = db;
            _http = http;
            _principalFactory = principalFactory ?? throw new ArgumentNullException(nameof(principalFactory));
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var result = _db.Users.FirstOrDefault(x => x.Id == context.Subject.GetSubjectId());
            var principal = await _userManager.FindByIdAsync(context.Subject.GetSubjectId());
            var claimPrincipal = await _principalFactory.CreateAsync(principal);
            var pic = result.ProfilePictureUrl != null ? result.ProfilePictureUrl : "https://st6808.ispot.cc/media/default-profile.png";
            context.IssuedClaims.AddRange(claimPrincipal.Claims);
                SafeAddClaims(context, "profile_pic", pic)
                .SafeAddClaims(context, IdentityModel.JwtClaimTypes.GivenName, result.FirstName)
                .SafeAddClaims(context, "biz_name", result.BusinessName)
                .SafeAddClaims(context, "lat", result.Lat.ToString())
                 .SafeAddClaims(context, "long", result.Long.ToString())
                  .SafeAddClaims(context, "city", result.City)
                .SafeAddClaims(context, "country", result.Country)
                .SafeAddClaims(context, "iso", result.Iso)
                .SafeAddClaims(context, IdentityModel.JwtClaimTypes.Role, result.ProfileType.ToString());

        }

        public async Task IsActiveAsync(IsActiveContext context)
        {

            var user = await GetUserId(context.Subject.GetSubjectId());
            context.IsActive = _db.Users.Any(x => x.Id == context.Subject.GetSubjectId());

        }

        private ProfileService SafeAddClaims(ProfileDataRequestContext context, string name, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                context.IssuedClaims.Add(new Claim(name, value));
            }
            return this;
        }

        public async Task<ApplicationUser> GetUserId(string username)
        {
            var user = await _userManager.FindByNameAsync(username);

            return user;
        }
    }
}
