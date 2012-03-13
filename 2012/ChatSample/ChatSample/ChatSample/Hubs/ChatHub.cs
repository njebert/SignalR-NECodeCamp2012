using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SignalR.Hubs;

namespace ChatSample.Hubs
{
    public class ChatHub : Hub
    {
        //public void Send(string message)
        //{
        //    Clients.addMessage(message, Context.ConnectionId);
        //    //Clients[Context.ConnectionId].addMessage(message, Context.ConnectionId);    
        //}

        //public void Send(string message, string user)
        //{
        //    Clients.addMessage(message, user, Context.ConnectionId);
        //}
    }
}