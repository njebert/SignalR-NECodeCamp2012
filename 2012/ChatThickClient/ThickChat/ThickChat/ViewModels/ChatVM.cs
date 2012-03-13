using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Messaging;
using System.Windows.Threading;
using System.Windows;
using System.Collections.ObjectModel;

namespace ThickChat.ViewModels
{
    public class ChatVM : ViewModelBase
    {
        private ObservableCollection<string> _messages;
        public ObservableCollection<string> Messages
        {
            get
            {
                if (_messages == null)
                {
                    _messages = new ObservableCollection<string>();
                }
                return _messages;
            }
            set
            {
                _messages = value;
                RaisePropertyChanged("Messages");
            }
        }

        public void AddMessage(string message)
        {
            this.Messages.Add(message);
            RaisePropertyChanged("Messages");
        }

        public ChatVM()
        {
            this.Messages = new ObservableCollection<string>() { "Nick was here.", "An me as well" };
            RegisterMessages();
        }

        private void RegisterMessages()
        {
            //Messenger.Default.Register<string>(this,
            //    delegate(string message)
            //    {
            //        Application.Current.Dispatcher.Invoke(new Action(delegate
            //        {
            //            this.Messages.Add(message);
            //            RaisePropertyChanged("Messages");
            //        }));
            //    });
            //Messenger.Default.Register<object[]>(this, delegate(object[] obj)
            //{
            //    Application.Current.Dispatcher.Invoke(new Action(delegate
            //    {
            //        this.Messages.Add((string)obj[0]);
            //        RaisePropertyChanged("Messages");

            //    }), obj);                
            //});
        }
    }
}
