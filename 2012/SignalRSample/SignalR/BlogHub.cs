using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SignalR.Hubs;

namespace SignalRSample.SignalR
{
    [HubName("blogHub")]
    public class BlogHub : Hub
    {
        public void Send(string message, string sessionId)
        {
            Clients.addMessage(message, sessionId);
        }
    }
}