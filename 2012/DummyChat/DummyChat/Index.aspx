<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="DummyChat.Index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Dummy Chat Sample</title>
    <script src="Scripts/jquery-1.7.1.min.js" type="text/javascript"></script>

</head>
<body>
    <form id="form1" runat="server">
    <div>
        <div id="messages">
        </div>
        <input type="text" id="msg" /><input id="submit" value="submit" type="button" />
    </div>
    <script type="text/javascript">
        $(function () {
            $('#submit').click(function () {
                $.ajax({
                    type: "POST",
                    url: "Index.aspx/SendMessage",
                    data: "{" + $('#msg').val() + "}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                        // Replace the div's content with the page method's return.
                        $("#messages").append(msg.d);
                    }
                });
            });
        });
    </script>
    </form>
</body>
</html>
