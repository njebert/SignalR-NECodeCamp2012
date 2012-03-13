using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Web.Script.Services;

namespace DummyChat
{
    public partial class Chat : System.Web.UI.Page
    {
        public static List<Entry> messages = new List<Entry>();

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static void SendMessage(string message)
        {
            messages.Add(new Entry() { Message = message, Date = DateTime.Now });
            //return message;
        }

        [WebMethod(EnableSession = false)]
        [ScriptMethod] 
        public static string GetMessage(string date)
        {
            DateTime clientTime = DateTime.Parse(date);
            List<Entry> newList = messages.Where(entry => entry.Date > clientTime).ToList();
            if (newList.Count > 0)
            {
                return newList.FirstOrDefault().Message;
            }
            else
            {
                return "";
            }
            
        }
    }
    public class Entry
    {
        public string Message { get; set; }
        public DateTime Date { get; set; }

        public Entry()
        {
        }
    }
}