<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="ChatSample.Index" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Chat Sample</title>
<%--    <script src="Scripts/jquery-1.6.4.min.js" type="text/javascript"></script>
    <script src="Scripts/jquery.signalR.min.js" type="text/javascript"></script>
    <script src="/signalr/hubs" type="text/javascript"></script>--%>
    <link href="styles.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <div id="messages">
        </div>
        <div style="clear: both;" />
        <div>
            <input type="text" id="msg" />
            <input value="Submit!" type="button" id="broadcast" />
        </div>
        <div style="clear: both;" />
        <div>
            User Name:
            <input type="text" id="user" value="Thin Client" />
        </div>

<%--                <script type="text/javascript">
            $(function () {
                var chat = $.connection.chatHub;

                chat.addMessage = function (message) {
                    $('#messages').append('<div><p>' + message + '</p></div>');
                };

                $('#broadcast').click(function () {
                    chat.send($('#msg').val());
                });

                $.connection.hub.start();
            });
        </script>--%>
        <%--        <script type="text/javascript">
            $(function () {
                var chat = $.connection.chatHub;

                chat.addMessage = function (message, clientId) {
                    if ($.connection.hub.id != clientId) {
                        $('#messages').append('<div><p>' + clientId + ' says: ' + message + '</p></div>');
                    } else {
                        $('#messages').append('<div><p>' + message + '</p></div>');
                    }
                    $('#messages').scrollTop($('#messages').scrollTop() + 500);
                };

                $('#broadcast').click(function () {
                    chat.send($('#msg').val());
                    $('#msg').val('');
                    $('#msg').focus();
                    $('#messages').scrollTop($('#messages').scrollTop() + 500);
                });

                $.connection.hub.start();
                $('#msg').focus();
            });
        </script>--%>
<%--       <script type="text/javascript">
            var userName;
            $(function () {
                var chat = $.connection.chatHub;
                username = $('#user').val();

                chat.addMessage = function (message, client, clientId) {
                    if ($.connection.hub.id != clientId) {
                        $('#messages').append('<div><p>' + client + ' says: ' + message + '</p></div>');
                    } else {
                        $('#messages').append('<div><p>' + message + '</p></div>');
                    }
                    $('#messages').scrollTop($('#messages').scrollTop() + 500);
                };

                $('#broadcast').click(function () {
                    chat.send($('#msg').val(), username);
                    $('#msg').val('');
                    $('#msg').focus();
                    $('#messages').scrollTop($('#messages').scrollTop() + 500);
                });

                $('#user').keyup(function () {
                    username = $('#user').val();
                });

                $.connection.hub.start();

                $('#msg').focus();
            });
        </script>--%>
    </div>
    </form>
</body>
</html>
