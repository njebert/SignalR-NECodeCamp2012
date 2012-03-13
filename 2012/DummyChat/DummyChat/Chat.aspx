<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Chat.aspx.cs" Inherits="DummyChat.Chat" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Dummy Chat Sample</title>
    <script src="Scripts/jquery-1.7.1.min.js" type="text/javascript"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <input type="text" id="msg" /><input id="submit" value="submit" type="button" />
                <div id="messages">
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $('#submit').click(function () {
                var mes = $('#msg').val();
                var jsonText = JSON.stringify({ message: mes });

                $.ajax({
                    type: "POST",
                    url: "Chat.aspx/SendMessage",
                    data: jsonText,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                        // Replace the div's content with the page method's return.
                        //$("#messages").append(msg.d);
                    }
                });
            });
            var date = new Date();
            date.setSeconds(date.getSeconds() - 5);

            GetUpdates(date);

        });

        function GetUpdates(time) {
            var jsonText = JSON.stringify({ date: time });
            $.ajax({
                type: "POST",
                url: "Chat.aspx/GetMessage",
                data: jsonText,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    // Replace the div's content with the page method's return.
                    if (msg.d != null) {
                        $("#messages").append('<div>' + msg.d + '</div>');
                    }
                    
                }
            });
            setTimeout(function () {
                var date = new Date();
                date.setSeconds(date.getSeconds() - 5);
                GetUpdates(date);
            }, 5000);
        }

    </script>
    </form>
</body>
</html>
