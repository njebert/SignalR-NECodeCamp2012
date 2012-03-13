<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="SquareShooter.Index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Square Shooter</title>
    <script src="Scripts/jquery-1.6.4.min.js" type="text/javascript"></script>
    <script src="Scripts/squareshooter.js" type="text/javascript"></script>
    <script src="Scripts/jquery.signalR.min.js" type="text/javascript"></script>

</head>
<body>
    <form id="form1" runat="server">
    <div>
        <canvas style="position: relative" id="shooter" width="640" height="640"></canvas>
    </div>
    </form>
        <script type="text/javascript">
            $(function () {
                var game = new SquareShooter.Game($('#shooter').get(0));
            });
    </script>
</body>
</html>
