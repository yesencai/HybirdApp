// Type definitions for sdk.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * 接口调用流程：
 * 
 * 第一步：根据TOnLogEchoCallback、TOnEventCallback、TOnRecvCallback创建回调函数。
 * 第二步：调用SdkInit函数时行SDK初始化。
 * 第三步：调用SdkStart函数启动SDK服务。
 * 第四步：等待事件回调函数的事件，收到EV_LoginSuccess 和EV_GetTopicSuccess事件后，云服务平台就连接成功了。
 * 第五步：云服务平台连接成功后，就可以随意调用PackSend函数进行数据发送了。接收的数据在OnRecvCallback里。
 */
declare var EV_Connect : number;

/**
 * 
 */
declare var EV_Disconnect : number;

/**
 * 
 */
declare var EV_LoginSuccess : number;

/**
 * 
 */
declare var EV_LoginFail : number;

/**
 * 
 */
declare var EV_GetTopicSuccess : number;

/**
 * 
 */
declare var EV_GetTopicFail : number;

/**
 * 
 */
declare var EV_ReleaseTopicSuccess : number;

/**
 * 
 */
declare var EV_RecvBeatPack : number;

/**
 * 当事件为EV_Disconnect时的数据
 */
declare var EVDATA_CONN_LOST : string;

/**
 * 
 */
declare var EVDATA_CONN_CLOSE : string;

/**
 * 
 */
declare var LOGTYPE_INFO : number;

/**
 * 
 */
declare var LOGTYPE_ERROR : number;

/**
 * 
 */
declare var SRCTYPE_SERVER : number;

/**
 * 
 */
declare var SRCTYPE_DEVCLI : number;

/**
 * 
 */
declare var DSTTYPE_SERVER : number;

/**
 * 当服务器是使用普通的设备来实现时填写2，
 * 当服务器是使用消息队列来实现时填写0
 */
declare var DSTTYPE_DEVCLI : number;

/**
 * 
 */
declare var FMqttClient : {
		
	/**
	 * 
	 */
	onConnectionLost : /* onConnectionLost */ any;
		
	/**
	 * 
	 */
	onMessageArrived : /* onMessageArrived */ any;
}

/**
 * 
 */
declare var FHostName : string;

/**
 * 
 */
declare var FHostPort : string;

/**
 * 
 */
declare var FProductKey : string;

/**
 * 
 */
declare var FDeviceName : string;

/**
 * 
 */
declare var FDeviceSecret : string;

/**
 * 
 */
declare var FMqttParamsInited : boolean;

/**
 * echoDebugInfo('Disconnecting from Server');
 */
declare var FWillDisconnect : boolean;

/**
 * var statusSpan = document.getElementById("connectionStatus");
 * statusSpan.innerHTML = "Failed to connect: " + context.errorMessage;
 */
declare var connected : boolean;

/**
 * 显示调试信息
 * @param ADebugText 
 */
declare function echoDebugInfo(ADebugText : string): void;

/**
 * 发送主题消息
 * @param ATopic 
 * @param AQos 
 * @param AMessage 
 * @param ARetain 
 */
declare function publish(ATopic : string, AQos : number, AMessage : string, ARetain : boolean): void;

/**
 * 主题订阅
 * @param ATopic 
 * @param AQos 
 */
declare function subscribe(ATopic : string, AQos : number): void;

/**
 * 取消某个主题的订阅
 * @param ATopic 
 */
declare function unsubscribe(ATopic : any): void;

/**
 * 取消主题订阅成功时的回调函数
 * @param context 
 */
declare function unsubscribeSuccess(context : any): void;

/**
 * 取消主题订阅失败时的回调函数
 * @param context 
 */
declare function unsubscribeFailure(context : any): void;

/**
 * 当连接并登录成功时的回调函数
 * @param context 
 */
declare function onConnect(context : any): void;

/**
 * 当连接失败时的回调函数
 * @param context 
 */
declare function onFail(context : any): void;

/**
 * 当连接掉线时的回调函数
 * @param responseObject 
 */
declare function onConnectionLost(responseObject : any): void;

/**
 * 当收到消息时的回调函数
 * @param message 
 */
declare function onMessageArrived(message : any): void;

/**
 * 连接并登录MQTT服务器
 * @param AHostName 
 * @param APort 
 * @param AClientID 
 * @param APath 
 * @param AUser 
 * @param APass 
 * @param AKeepAlive 
 * @param ATimeOut 
 * @param ATls 
 * @param ACleanSession 
 */
declare function connect(AHostName : string, APort : string, AClientID : string, APath : string, AUser : string, APass : string, AKeepAlive : number, ATimeOut : number, ATls : boolean, ACleanSession : boolean): void;

/**
 * 断开连接
 */
declare function disconnect(): void;

/**
 * 对某个数据进行HmacSHA1加密，在调用本函数前必须加载crypto-js.js这个文件
 */
declare function GetHmacSHA1(Src : string, Key : string): string;



/**
 * 把一个字符串转换为JSON对象
 * 使用这个函数时必须加载json2.js这个文件
 */
declare function JsonStrToObject(AJsonStr : any): any;

/**
 * 把一个JSON转换为一个字符串
 * 使用这个函数时必须加载json2.js这个文件
 */
declare function JsonObjectToStr(AJsonObj : any): string;

/**
 * 判断一个变量是否为JSON格式的字符串
 * 使用这个函数时必须加载json2.js这个文件
 * @param str 
 * @return  
 */
declare function isJSON(str : any): boolean;

/**
 * 取得某个区间范围内的随机整数
 */
declare function RandomInt(n : number, m : number): number;


/**
 * 函数功能：SDK初始化
 * 参数清单：
 *     LogEchoCallBack - 日志显示回调函数，当有日志时，通过这个回调函数进行输入，可以在这个回调函数中决定是否进行显示。
 *     EventCallBack - 当出现登录成功、登录失败、网络掉线等事件时，通过这个回调函数进行通知。
 *     RecvBackBack - 应用数据接收回调函数。
 *     DeveloperID - 开发者注册号，是一个最大长度为19个字节的字符串。
 *     CustomData - 备用的自定义参数，是一个使用JSON格式字符串。当需要使用特定的ID号进行登录时，可以通过这个参数传入。
 * 返 回 值：返回值是一个整数，当返回值为0时，表示成功，其它值是错误代码。
 *           当返回值不为0时表示错误，具体错误信息可以通过日志事件代码确定。
 * 错误代码表：
 * 
 * 其它说明：
 */
declare function SdkInit(LogEchoCallBack : any, EventCallBack : any, RecvCallBack : any, DeveloperID : any, CustomData : any): number;



/**
 * 函数功能：启动SDK的云服务平台连接功能
 * 参数清单：
 * 返 回 值：返回值是一个整数，返回值不为0时表示错误，其值为错误码。
 * 错误代码表：
 * 1 - MQTT 参数没有设置好
 * 其它说明：
 *     本函数的返回值只代表函数调用的结果，不能表示平台连接是否成功。平台连接是否成功要看事件回调函数。
 */
declare function SdkStart (): number;


/**
 * 函数功能：停止SDK的云服务平台连接功能
 * 参数清单：
 * 返 回 值：返回值是一个大于或等于0的整数，返回0时表示调用正常，其它值表示错误。
 * 错误代码表：
 * 
 * 其它说明：
 */
declare function SdkStop (): number;


/**
 * 2、本函数在向物联网套件发送数据前，会先把要发送的数据包全部转换为16进制数据
 */
declare function SdkSendBin (DstType : any, DstID : any, BinData : any, BinSize : any): number;



/**
 * 函数功能：发送字符串形式的应用数据包
 * 参数清单：
 *     DstType       - 接收者类别，0-接收者是应用服务器；1-接收者是其它设备或客户端
 *     DstID         - 接收者ID，当接收者类别是应用服务器时，这个是应用服务器的ID号，如果输入为空，将使用默认的ID号。
 *                     当接收者类别是设备或客户端时，这个是设备或客户端的ID号。
 *                     DstID是一个字符串，最大长度是19个字节。
 *     StrPack       - 本次要发送的应用层透明数据，是一个字符串，最大字节数不能超过8192字节。
 * 返 回 值：返回值是一个大于或等于0的整数，返回0时表示调用正常，其它值表示错误。
 * 错误代码表：
 * 
 * 其它说明：
 */
declare function SdkSendStr(DstType : any, DstID : any, StrPack : any): number;
