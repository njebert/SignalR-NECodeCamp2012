<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="CanvasSample.Index" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
<%--        <script src="Scripts/jquery-1.6.4.min.js" type="text/javascript"></script>
        <script src="Scripts/jquery.signalR.min.js" type="text/javascript"></script>
        <script src="/signalr/hubs" type="text/javascript"></script>--%>
        <script type="text/javascript">
            var mouseDownX = 0;
            var mouseDownY = 0;
            var contained = false;

            function getMousePos(canvas, evt) {
                // get canvas position
                var obj = canvas;
                var top = 0;
                var left = 0;
                while (obj && obj.tagName != 'BODY') {
                    top += obj.offsetTop;
                    left += obj.offsetLeft;
                    obj = obj.offsetParent;
                }

                // return relative mouse position
                var mouseX = evt.clientX - left + window.pageXOffset;
                var mouseY = evt.clientY - top + window.pageYOffset;
                return {
                    x: mouseX,
                    y: mouseY
                };
            }

            $(document).ready(function () {

//                var drawHub = $.connection.drawHub;

//                drawHub.addMessage = function (data, client) {
//                    if (client != $.connection.hub.id) {
//                        context.moveTo(data[0].x, data[0].y);
//                        for (i = 1; i < data.length; i++) {
//                            context.lineTo(data[i].x, data[i].y);
//                        }
//                        context.moveTo(data[data.length - 1].x, data[data.length - 1].y);
//                        context.stroke();
//                    }
//                };


                var canvas = $("#canvas").get(0);
                var context = canvas.getContext("2d");
                var moves = []

                canvas.addEventListener('mousedown', function (evt) {
                    var mousePos = getMousePos(canvas, evt);
                    mouseDownX = mousePos.x;
                    mouseDownY = mousePos.y;
                    context.moveTo(mouseDownX, mouseDownY);
                    $("#points").html("");
                    moves = [];
                    $("#points").append('<li>Start</li>');
                    $("#points").append('<li>' + mouseDownX + ',' + mouseDownY + '</li>');
                    moves.push({ x: mouseDownX, y: mouseDownY });
                    contained = true;
                }, false);

                canvas.addEventListener('mousemove', function (evt) {
                    if (contained) {
                        var movePos = getMousePos(canvas, evt);
                        context.lineTo(movePos.x, movePos.y);
                        mouseDownX = movePos.x;
                        mouseDownY = movePos.y;
                        $("#points").append('<li>' + mouseDownX + ',' + mouseDownY + '</li>');
                        moves.push({ x: mouseDownX, y: mouseDownY });
                    }
                }, false);

                canvas.addEventListener('mouseup', function (evt) {
                    if (contained) {
                        var upPos = getMousePos(canvas, evt);
                        context.moveTo(mouseDownX, mouseDownY);
                        $("#points").append('<li>End</li>');
                        context.lineTo(upPos.x, upPos.y);
                        context.stroke();
                        contained = false;
//                        drawHub.send(moves);
                    }
                }, false);

//                $.connection.hub.start();
            });

        </script>
        <div>
            <canvas style="border: 1px solid black;" id="canvas" width="400" height="400" />
        </div>
        <div>
            <ul id="points">
            </ul>
        </div>
        <div>
            <div id="status">
            </div>
        </div>
    </div>
    </form>
</body>
</html>
