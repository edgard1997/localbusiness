using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace NiceWixApp.ViewModels
{

    public class GetInsight
    {
        public string VisitCount { get; set; }
        public string ReviewsCount { get; set; }

    }

    public class GetAlbum
    {
        public string UserId { get; set; }
        public int Skip { get; set; }
    }

    public class OwnedAlbum
    {
        public int Skip { get; set; }
        public int Pages { get; set; }
        public int TotalPhotos { get; set; }
        public List<OwnedPhoto> CurrentPhotos { get; set; }
    }

    public class OwnedPhoto
    {
        public string Title { get; set; }
        public string Price { get; set; }
        public bool HasPrice { get; set; }
        public string PhotoUrl { get; set; }
        public string PhotoId { get; set; }
    }
    public class AddPhoto
    {
        public string Title { get; set; }
        public string Price { get; set; }
        public bool HasPrice { get; set; }
        public IFormFile Photo { get; set; }
        public string UserId { get; set; }
    }

    public class EditPhoto
    {
        public string Title { get; set; }
        public string Price { get; set; }
        public bool HasPrice { get; set; }
        public string UserId { get; set; }
        public string PhotoId { get; set; }
    }

}
