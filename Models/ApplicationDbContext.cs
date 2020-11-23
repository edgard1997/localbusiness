using NiceWixApp.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        public DbSet<Amenities> Amenities { get; set; }
        public DbSet<UsersAmenities> UsersAmenities { get; set; }
        public DbSet<DaysOfTheWeek> DaysOfTheWeek { get; set; }
        public DbSet<UsersHours> UsersHours { get; set; }
        public DbSet<PaymentMethods> PaymentMethods { get; set; }
        public DbSet<Verification> Verifications { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<ReviewImage> ReviewsImages { get; set; }
        public DbSet<Report> Reports { get; set; }

    }
}
