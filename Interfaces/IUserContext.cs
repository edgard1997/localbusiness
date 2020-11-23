using System;
using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiceWixApp.Interfaces
{
    public interface IUserContext
    {
        string UserId { get; }
        Task<string> Id_Token { get; }
        Task<string> Access_Token { get; }
        bool IsAuthenticated { get; }
        IPAddress IPAddress { get; }
    }
}
