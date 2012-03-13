using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SignalR.Hubs;

namespace CanvasSample.Hubs
{
    public class DrawHub : Hub
    {
        public void Send(object message)
        {
            Clients.addMessage(message, Context.ConnectionId);
        }
    }
}