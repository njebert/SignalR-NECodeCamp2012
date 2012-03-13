using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SignalR.Hubs;

namespace DistributeSample.Hubs
{
    public class Chat : Hub
    {
        public void Send(string message)
        {
            Clients.addMessage(message);
        }
    }
}