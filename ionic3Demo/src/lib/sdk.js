/**********************************************/
/* ��������JavaScript�ͻ���SDK����API�ӿڶ��� */
/**********************************************/

/*
  �ӿڵ������̣�

  ��һ��������TOnLogEchoCallback��TOnEventCallback��TOnRecvCallback�����ص�������
  �ڶ���������SdkInit����ʱ��SDK��ʼ����
  ������������SdkStart������SDK����
  ���Ĳ����ȴ��¼��ص��������¼����յ�EV_LoginSuccess ��EV_GetTopicSuccess�¼����Ʒ���ƽ̨�����ӳɹ��ˡ�
  ���岽���Ʒ���ƽ̨���ӳɹ��󣬾Ϳ����������PackSend�����������ݷ����ˡ����յ�������OnRecvCallback�
  
*/
var Paho = require('../lib/paho-mqtt')
var CryptoJS = require('../lib/crypto-js')

export    const EV_Connect             = 1;
export    const EV_Disconnect          = 2;
export    const EV_LoginSuccess        = 3;
export    const EV_LoginFail           = 4;
export    const EV_GetTopicSuccess     = 5;
export    const EV_GetTopicFail        = 6;
export    const EV_ReleaseTopicSuccess = 7;
export    const EV_RecvBeatPack        = 8;

//���¼�ΪEV_Disconnectʱ������
export    const EVDATA_CONN_LOST = "1"; //������
export    const EVDATA_CONN_CLOSE = "2"; //�ͻ��������Ͽ�����

export    const LOGTYPE_INFO  = 0; //��ͨ��ʾ����־
export    const LOGTYPE_ERROR = 1; //������������־

export    const SRCTYPE_SERVER    = 0;     //��Ӧ�÷�������������
export    const SRCTYPE_DEVCLI    = 1;     //�������豸��������

export    const DSTTYPE_SERVER    = 0;     //���͸�Ӧ�÷�����
export    const DSTTYPE_DEVCLI    = 1;     //���͸������豸

var FLogEchoCallBack = null;
var FEventCallBack = null;
var FRecvCallBack = null;
var FDeveloperID = null;
var FCustomData = null;
var FMqttClient = null;

var FHostName = "";
var FHostPort = "";
var FProductKey = "";
var FDeviceName = "";
var FDeviceSecret = "";
var FMqttParamsInited = false;

var FWillDisconnect = false;

var connected = false;


// Things to do as soon as the page loads
//document.getElementById("clientIdInput").value = 'js-utility-' + makeid();

/*��ʾ������Ϣ*/
function echoDebugInfo(ADebugText) {
    alert(ADebugText);
}

/*����������Ϣ*/
function publish(ATopic, AQos, AMessage, ARetain){
    //console.info('Publishing Message: Topic: ', topic, '. QoS: ' + qos + '. Message: ', message);
    var message = new Paho.Message(AMessage);
    message.destinationName = ATopic;
    message.qos = Number(AQos);
    message.retained = ARetain;
    FMqttClient.send(message);
}

/*���ⶩ��*/
function subscribe(ATopic, AQos){
    //console.info('Subscribing to: Topic: ', topic, '. QoS: ', qos);
    FMqttClient.subscribe(ATopic, {qos: Number(AQos)});
}

/*ȡ��ĳ������Ķ���*/
function unsubscribe(ATopic){
    FMqttClient.unsubscribe(ATopic, {
         onSuccess: unsubscribeSuccess,
         onFailure: unsubscribeFailure,
         invocationContext: {topic : ATopic}
     });
}


/*ȡ�����ⶩ�ĳɹ�ʱ�Ļص�����*/
function unsubscribeSuccess(context){
    //console.info('Successfully unsubscribed from ', context.invocationContext.topic);
}

/*ȡ�����ⶩ��ʧ��ʱ�Ļص�����*/
function unsubscribeFailure(context){
    //console.info('Failed to  unsubscribe from ', context.invocationContext.topic);
}

/*�����Ӳ���¼�ɹ�ʱ�Ļص����� */
function onConnect(context) {
    // Once a connection has been made, make a subscription and send a message.
 
    //����Ĭ������
    var mTopic = "/" + FProductKey + "/" + FDeviceName + "/get";
    subscribe(mTopic, 0);

    var msg = "aliyun connect and login Success";
    if (FLogEchoCallBack != null) {
        FLogEchoCallBack(LOGTYPE_INFO, 1, msg);
    } else {
        echoDebugInfo(msg);
    }

    if (FEventCallBack != null) {
        FEventCallBack(EV_LoginSuccess, "");    
        FEventCallBack(EV_GetTopicSuccess, "");  
    }

    //var statusSpan = document.getElementById("connectionStatus");
    //statusSpan.innerHTML = "Connected to: " + context.invocationContext.host + ':' + context.invocationContext.port + context.invocationContext.path + ' as ' + context.invocationContext.clientId;
    connected = true;
}

/*������ʧ��ʱ�Ļص�����*/
function onFail(context) {
    var msg = "aliyun connect fail";
    if (FLogEchoCallBack != null) {
        FLogEchoCallBack(LOGTYPE_INFO, 2, msg);
    } else {
        echoDebugInfo(msg);
    }

    if (FEventCallBack != null) {
        FEventCallBack(EV_LoginFail, "");    
    }
    //var statusSpan = document.getElementById("connectionStatus");
    //statusSpan.innerHTML = "Failed to connect: " + context.errorMessage;
    connected = false;
}

/*�����ӵ���ʱ�Ļص�����*/
function onConnectionLost(responseObject) {
    var msg;

    if (FWillDisconnect == true) {
        msg = "aliyun disconnected";
    } else {
        msg = "aliyun connect fail";
    }
    
    if (FLogEchoCallBack != null) {
        FLogEchoCallBack(LOGTYPE_INFO, 3, msg);
    } else {
        echoDebugInfo(msg);
    }

    if (FEventCallBack != null) {
        if (FWillDisconnect == true) {
            FEventCallBack(EV_Disconnect, EVDATA_CONN_CLOSE); 
        } else {
            FEventCallBack(EV_Disconnect, EVDATA_CONN_LOST); 
        }
    }

    //if (responseObject.errorCode !== 0) {
    //  echoDebugInfo("Connection Lost: " + responseObject.errorMessage);
    //}

    FWillDisconnect = false;
    connected = false;
}

/*���յ���Ϣʱ�Ļص�����*/
function onMessageArrived(message) {
    //echoDebugInfo('Message Recieved: Topic: '+ message.destinationName+ '. Payload: '+ message.payloadString+ '. QoS: '+ message.qos);
    //echoDebugInfo(message);
    if (FRecvCallBack != null) {
        //FRecvCallBack();
        //echoDebugInfo('Message Recieved: Topic: '+ message.destinationName+ '. Payload: '+ message.payloadString+ '. QoS: '+ message.qos)

        //�����Ʒ��͹��������ݰ���ʽ��{"sid":"11122333","did":"1001100008","dty":"1","data":"abcde"}
        var mPayloadString, mSrcID, mDstID, mSrcType, mData, mJsonObject;
        mPayloadString = message.payloadString;

        if (isJSON(mPayloadString)) {
            mJsonObject = JsonStrToObject(mPayloadString);
            mSrcType = mJsonObject.dty;
            mSrcID = mJsonObject.sid;
            mDstID = mJsonObject.did;
            mData = mJsonObject.data;

            if (mDstID == FDeviceName) { //ֻ���������Լ�������
                if (mData.length > 1) {
                    //�����Ʒ����������ݵ�һ���ֽ����ڱ�ʾ�������࣬��˳��ȿ϶�����1��
                    //��1�ֽ���Sʱ��ʾ����һ����ͨ���ַ�����
                    //��1�ֽ���Xʱ��ʾ����һ��ʮ���������ݣ���Ҫת���ٷ���
                    if (mData.charAt(0) == "S") { 
                        mData = mData.substr(1, mData.length-1); //ȥ���1�ֽ�
                        FRecvCallBack(mSrcType, mSrcID, mData);
                    } else {
                        if (mData.charAt(0) == "X") {
                            //Ŀǰ��ʱ������ʮ����������
                        }
                    }
                }
            }
        }
    }
}

/*���Ӳ���¼MQTT������*/
function connect(AHostName, APort, AClientID, APath, AUser, APass, AKeepAlive, ATimeOut, ATls, ACleanSession){
    console.log('connect')

    if(APath.length > 0){
      FMqttClient = new Paho.Client(AHostName, Number(APort), APath, AClientID);
    } else {
      FMqttClient = new Paho.Client(AHostName, Number(APort), AClientID);
    }
    
    // set callback handlers
    FMqttClient.onConnectionLost = onConnectionLost;
    FMqttClient.onMessageArrived = onMessageArrived;


    var options = {
      invocationContext: {host : AHostName, port: APort, path: FMqttClient.path, clientId: AClientID},
      timeout: ATimeOut,
      keepAliveInterval:AKeepAlive,
      cleanSession: ACleanSession,
      useSSL: ATls,
      onSuccess: onConnect,
      onFailure: onFail
    };

    if(AUser.length > 0){
      options.userName = AUser;
    }

    if(APath.length > 0){
      options.password = APass;
    }

    // connect the client
    FMqttClient.connect(options);
}

/*�Ͽ�����*/
function disconnect(){
    //echoDebugInfo('Disconnecting from Server');
    FWillDisconnect = true;
    FMqttClient.disconnect();
    connected = false;
}

/* ��ĳ�����ݽ���HmacSHA1���ܣ��ڵ��ñ�����ǰ�������crypto-js.js����ļ� */
function GetHmacSHA1(Src, Key) {
    var r = CryptoJS.HmacSHA1(Src, Key);

    //���в�Ҫɾ����ɾ���󽫻ᵼ��connect�����޷��������ӡ�
    //������HmacSHA1�������ص�ֵ�����ַ��������Ƕ���������������һ�¾ͱ���ַ����ˡ�
    r = r + ""; 

    return r;
}

/*
��һ���ַ���ת��ΪJSON����
ʹ���������ʱ�������json2.js����ļ�
*/
function JsonStrToObject(AJsonStr) {
    return JSON.parse(AJsonStr);
}

/*
��һ��JSONת��Ϊһ���ַ���
ʹ���������ʱ�������json2.js����ļ�
*/
function JsonObjectToStr(AJsonObj) {
    return JSON.stringify(AJsonObj);
}

/*
�ж�һ�������Ƿ�ΪJSON��ʽ���ַ���
ʹ���������ʱ�������json2.js����ļ�
*/
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj ) {
                return true;
            } else {
                return false;
            }

        } catch(e) {
            return false;
        }
    }
}

/*ȡ��ĳ�����䷶Χ�ڵ��������*/
function RandomInt(n, m){
    var iRnd = Math.floor(Math.random()*(m-n+1)+n);
    return iRnd;
}

//��־��ʾ�ص�����ԭ�Ͷ���(C����)
//������־��ʾʱ���������ᱻ���ã�����������ص������и��ݲ�ͬ����־������־��
//������Ƿ���ʾ������־��Ϣ
//����˵����
//LogType - ��־�����һ������
//LogCode - ��־���룬��һ������
//LogText - ��־��Ϣ����һ���ַ���
//typedef void TOnLogEchoCallback(int16 LogType, int16 LogCode, char * LogText);

//�¼���ʾ�ص�����ԭ�Ͷ���(C����)
//�����ֵ�¼�ɹ�������Ͽ������������¼�ʱ�Ļص�����
//����˵����
//
//����˵����
//   ����¼�ɹ�ʱ����ǰʹ�õĿͻ���ID�Ż�ͨ������ص��������������
//EventType - �¼������һ������
//EventData - ������ݣ���ͬ���¼�����в�ͬ�����ݣ���һ���ַ���
//typedef void TOnEventCallback(int16 EventType, void * EventData);

//Ӧ�ò����ݽ��ջص�����ԭ�Ͷ���(C����)
//�����յ�Ӧ�÷������������ͻ����豸���͹�����Ӧ�ò�����ʱ����������ᱻ����
//����˵����
//SrcType       - ����Դ���0-��Ӧ�÷������������ģ�1-�������豸��������
//SrcID         - ����ԴID����������Դ��Ӧ�÷�����ʱ�������Ӧ�÷�������ID�š���һ���ַ���
//                ��������Դ���豸ʱ��������豸��ID�š�SrcID��һ���ַ�������󳤶���19���ֽڡ�
//PackData      - �����յ���Ӧ�ò�͸�����ݣ���һ���ַ���
//typedef void TOnRecvCallback(char SrcType, char * SrcID, char * PackData);

//�������ܣ�SDK��ʼ��
//�����嵥��
//    LogEchoCallBack - ��־��ʾ�ص�������������־ʱ��ͨ������ص������������룬����������ص������о����Ƿ������ʾ��
//    EventCallBack - �����ֵ�¼�ɹ�����¼ʧ�ܡ�������ߵ��¼�ʱ��ͨ������ص���������֪ͨ��
//    RecvBackBack - Ӧ�����ݽ��ջص�������
//    DeveloperID - ������ע��ţ���һ����󳤶�Ϊ19���ֽڵ��ַ�����
//    CustomData - ���õ��Զ����������һ��ʹ��JSON��ʽ�ַ���������Ҫʹ���ض���ID�Ž��е�¼ʱ������ͨ������������롣
//�� �� ֵ������ֵ��һ��������������ֵΪ0ʱ����ʾ�ɹ�������ֵ�Ǵ�����롣
//          ������ֵ��Ϊ0ʱ��ʾ���󣬾��������Ϣ����ͨ����־�¼�����ȷ����
//��������
//
//����˵����
//
export const SdkInit = function (LogEchoCallBack, EventCallBack, RecvCallBack, DeveloperID, CustomData)
{
    FLogEchoCallBack = LogEchoCallBack;
    FEventCallBack = EventCallBack;
    FRecvCallBack = RecvCallBack;
    FDeveloperID = DeveloperID;
    FCustomData = CustomData;

    if (isJSON(FCustomData)) {
        var mJsonObj = JsonStrToObject(FCustomData);
        FHostName = mJsonObj.HostName;
        FHostPort = mJsonObj.HostPort;
        FProductKey = mJsonObj.productKey;
        FDeviceName = mJsonObj.deviceName;
        FDeviceSecret = mJsonObj.deviceSecret;
        if (FHostName != null && FHostPort != null && FProductKey != null && FDeviceName != null && FDeviceSecret != null) {
            FMqttParamsInited = true;
        }
    }
    return 0;
}

//�������ܣ���SDK���Ʒ���ƽ̨���ӹ���
//�����嵥��
//�� �� ֵ������ֵ��һ������������ֵ��Ϊ0ʱ��ʾ������ֵΪ�����롣
//��������
//1 - MQTT ����û�����ú�
//����˵����
//    �������ķ���ֵֻ���������õĽ�������ܱ�ʾƽ̨�����Ƿ�ɹ���ƽ̨�����Ƿ�ɹ�Ҫ���¼��ص�������
export const SdkStart = function ()
{ 
    var iRet = 0;
    if (FMqttParamsInited == true) {
        var iTimeStamp = RandomInt(1, 1000000);
        var mClientID = "12345";
        var mAliClientID = mClientID + "|securemode=2,signmethod=hmacsha1,timestamp=" + iTimeStamp + "|";
        var mUser = FDeviceName + "&" + FProductKey;
      
        var mPassSrc = "clientId" + mClientID + "deviceName" + FDeviceName + "productKey" + FProductKey + "timestamp" + iTimeStamp;
        var mPassKey = FDeviceSecret;
        var mPassEnc = GetHmacSHA1(mPassSrc, mPassKey);
        
        connect(FHostName, FHostPort, mAliClientID, "/wss", mUser, mPassEnc, 60, 3, true, true);
    } else {
        iRet = 1;
        echoDebugInfo("MQTT Params not init.")
    }
    return iRet;
  
}

//�������ܣ�ֹͣSDK���Ʒ���ƽ̨���ӹ���
//�����嵥��
//�� �� ֵ������ֵ��һ�����ڻ����0������������0ʱ��ʾ��������������ֵ��ʾ����
//��������
//
//����˵����
//
function SdkStop()
{
    disconnect();
    return 0;
}

//�������ܣ����Ͷ���������ʽ��Ӧ�����ݰ�
//�����嵥��
//    DstType       - ���������0-��������Ӧ�÷�������1-�������������豸��ͻ���
//    DstID         - ������ID���������������Ӧ�÷�����ʱ�������Ӧ�÷�������ID�š�
//                    ��������������豸��ͻ���ʱ��������豸��ͻ��˵�ID�š�
//                    DstID��һ���ַ�������󳤶���19���ֽڡ�
//    BinData       - ����Ҫ���͵�Ӧ�ò�͸�����ݣ���һ�������ƶ�������ֽ������ܳ���8192�ֽڡ�
//    BinSize       - BinData���ֽ�����
//�� �� ֵ������ֵ��һ�����ڻ����0������������0ʱ��ʾ��������������ֵ��ʾ����
//��������
//
//����˵����
//1���й�JavaScript����������������֪ʶ�뿴���������ַ
//   http://blog.csdn.net/myweishanli/article/details/22997863
//2�������������������׼���������ǰ�����Ȱ�Ҫ���͵����ݰ�ȫ��ת��Ϊ16��������
function SdkSendBin(DstType, DstID, BinData, BinSize)
{

    return 0;
}

//�������ܣ������ַ�����ʽ��Ӧ�����ݰ�
//�����嵥��
//    DstType       - ���������0-��������Ӧ�÷�������1-�������������豸��ͻ���
//    DstID         - ������ID���������������Ӧ�÷�����ʱ�������Ӧ�÷�������ID�š�
//                    ��������������豸��ͻ���ʱ��������豸��ͻ��˵�ID�š�
//                    DstID��һ���ַ�������󳤶���19���ֽڡ�
//    StrPack       - ����Ҫ���͵�Ӧ�ò�͸�����ݣ���һ���ַ���������ֽ������ܳ���8192�ֽڡ�
//�� �� ֵ������ֵ��һ�����ڻ����0������������0ʱ��ʾ��������������ֵ��ʾ����
//��������
//
//����˵����
//
export const SdkSendStr = function(DstType, DstID, StrPack)
{
    var mDstID = DstID;
    if (DstType == DSTTYPE_SERVER && DstID == "") {
        mDstID = "S1001000101";
    }
    var mJsonStr = '{"sid":"' + FDeviceName + '","did":"' + DstID + '","dty":"' + DstType + '","data":"S' + StrPack + '"}';
    var mTopic = "/" + FProductKey + "/" + FDeviceName + "/update";
    //publish(ATopic, AQos, AMessage, ARetain)
    publish(mTopic, 0, mJsonStr, false);
    //echoDebugInfo("topic: " + mTopic + ", msg: " + mJsonStr);
    return 0;
}


