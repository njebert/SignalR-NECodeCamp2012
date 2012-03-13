using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using SignalR.Client.Hubs;
using ThickChat.ViewModels;
using GalaSoft.MvvmLight.Messaging;
using System.Runtime.Remoting.Contexts;

namespace ThickChat
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        IHubProxy chatHub;
        HubConnection connection;

        public MainWindow()
        {
            InitializeComponent();

            this.DataContext = new ChatVM();

            this.Loaded += new RoutedEventHandler(MainWindow_Loaded);
        }

        void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            ReloadServerConnection(server.Text);

            message.Focus();
        }

        private void ReloadServerConnection(string url)
        {
            connection = new HubConnection(url);

            chatHub = connection.CreateProxy("ChatSample.Hubs.ChatHub");

            //chatHub.On("addMessage", data =>
            //    Application.Current.Dispatcher.Invoke(
            //    new Action(delegate()
            //    {
            //        //try
            //        //{
            //        //    if (data != userName)
            //        //    {
            //        //        (this.DataContext as ChatVM).AddMessage(data[1] + ": " + data[0]);
            //        //        MessageContainer.ScrollIntoView(data[1] + ": " + data[0]);
            //        //    }
            //        //}
            //        //catch (Exception e)
            //        //{
            //        //    (this.DataContext as ChatVM).AddMessage(data[0].ToString());
            //        //    MessageContainer.ScrollIntoView(data[0]);
            //        //}
            //    })));

            //Action<string, string> action = new Action<string, string>(AddMessage);

            //chatHub.On("addMesasge", data => action(data, data));
            chatHub.On<string, string, string>("addMessage", (message, user, clientId) =>
            {
                AddMessage(message, user, clientId);
            });

            connection.Start();
            //chatHub.On("addMesasge", data => delegate(){Console.WriteLine("Received data {0}", data)});

            //chatHub.On("addMessage", data => action(data[0], data[1]));

            //Action<string, string>(delegate(string recMessage, string recUserName)
            //{

            //    if (recUserName != userName.Text)
            //    {
            //        (this.DataContext as ChatVM).AddMessage(recUserName + ": " + recMessage);
            //        MessageContainer.ScrollIntoView(recUserName + ": " + recMessage);
            //    }
            //    else
            //    {
            //        (this.DataContext as ChatVM).AddMessage(recMessage);
            //        MessageContainer.ScrollIntoView(recMessage);
            //    }
            //}));

            //chatHub.On("addMessage",
            //    new Action<string, string>(delegate(string recMessage, string recUsername)
            //{

            //}));

        }

        private void AddMessage(string recMessage, string recUsername, string clientId)
        {
            Application.Current.Dispatcher.Invoke(new Action(
                delegate
                {
                    if (connection != null)
                    {
                        if (connection.ConnectionId != clientId)
                        {
                            (this.DataContext as ChatVM).AddMessage(recUsername + ": " + recMessage);
                            MessageContainer.ScrollIntoView(recUsername + ": " + recMessage);
                        }
                        else
                        {
                            (this.DataContext as ChatVM).AddMessage(recMessage);
                            MessageContainer.ScrollIntoView(recMessage);
                        }
                    }
                })
            );

        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            chatHub.Invoke("Send", new object[2] { message.Text, userName.Text });
            message.Text = "";
            message.Focus();
        }

        private void server_LostFocus(object sender, RoutedEventArgs e)
        {
            ReloadServerConnection(server.Text);
        }
    }
}
