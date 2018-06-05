/**********************************************/
/*             日志发送函数脚本文件           */
/**********************************************/
var LogServerConnected = false;

function DebugLogInit() { 
    var LogServerIP = "192.168.2.102"; //日志接收服务器的IP地址
    var LogServerPort = "81"; //日志接收服务器的端口号
    var wsUri ="ws://" + LogServerIP + ":" + LogServerPort;

    websocket = new WebSocket(wsUri); 
    websocket.onopen = function(evt) { 
        onLogOpen(evt) 
    }; 
    websocket.onclose = function(evt) { 
        onLogClose(evt) 
    }; 
    websocket.onmessage = function(evt) { 
        onLogMessage(evt) 
    }; 
    websocket.onerror = function(evt) { 
        onLogError(evt) 
    }; 
} 

function writeToScreen(info)
{

} 

function onLogOpen(evt) { 
    writeToScreen("CONNECTED"); 
    LogServerConnected = true;
}  

function onLogClose(evt) { 
    writeToScreen("DISCONNECTED"); 
    LogServerConnected = false;
}  

function onLogMessage(evt) { 
    writeToScreen('<span style="color: blue;">RESPONSE: '+ evt.data+'</span>'); 
}  

function onLogError(evt) { 
    writeToScreen('<span style="color: red;">ERROR:</span> '+ evt.data); 
    LogServerConnected = false;
}  

export const SendLogText = function(message) { 
    var d = encodeURI("日志：" + message);
    if (LogServerConnected == true) {
        writeToScreen("SENT: " + d);  
        websocket.send(d); 
    } else {
        //alert("日志服务器没有连接，无法发送日志");
    }
}  
 


