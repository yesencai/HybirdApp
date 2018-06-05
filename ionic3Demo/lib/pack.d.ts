// Type definitions for pack.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * 发送请求
 */
declare var CLIENT_SMS : number;

/**
 * 
 */
declare var CLIENT_SMS_USER : number;

/**
 * 
 */
declare var CLIENT_SMS_TYPE : number;

/**
 * 回调
 */
declare var ACK_CLIENT_SMS : number;

/**
 * 
 */
declare var ACK_CLIENT_SMS_SUCCESS : number;

/**
 * 表示不同的失败原因，具体自定
 */
declare var ACK_CLIENT_SMS_ERRORINFO : number;

/**
 * 发送请求
 */
declare var CLIENT_RAGISTER : number;

/**
 * 
 */
declare var CLIENT_RAGISTER_USERNAME : number;

/**
 * 
 */
declare var CLIENT_RAGISTER_PASSWORD : number;

/**
 * 
 */
declare var CLIENT_RAGISTER_SMS : number;

/**
 * 回调
 */
declare var ACK_CLIENT_RAGISTER : number;

/**
 * 
 */
declare var ACK_CLIENT_RAGISTER_SUCCESS : number;

/**
 * 
 */
declare var ACK_CLIENT_RAGISTER_ERRINFO : number;

/**
 * 发送请求
 */
declare var CLIENT_LOGIN : number;

/**
 * 
 */
declare var CLIENT_LOGIN_USERNAME : number;

/**
 * 
 */
declare var CLIENT_LOGIN_PASSWORD : number;

/**
 * 回调
 */
declare var ACK_CLIENT_LOGIN : number;

/**
 * 
 */
declare var ACK_CLIENT_LOGIN_SUCCESS : number;

/**
 * 
 */
declare var ACK_CLIENT_LOGIN_ERRORINFO : number;

/**
 * 发送请求
 */
declare var CLIENT_UPDATEPWD : number;

/**
 * 
 */
declare var CLIENT_UPDATEPWD_OLD : number;

/**
 * 
 */
declare var CLIENT_UPDATEPWD_NEW : number;

/**
 * 回调
 */
declare var ACK_CLIENT_UPDATEPWD : number;

/**
 * 
 */
declare var ACK_CLIENT_UPDATEPWD_SUCCESS : number;

/**
 * 
 */
declare var ACK_CLIENT_UPDATEPWD_ERRORINFO : number;

/**
 * 发送请求
 */
declare var CLIENT_UNPASSWORD : number;

/**
 * 
 */
declare var CLIENT_UNPASSWORD_USERNAME : number;

/**
 * 
 */
declare var CLIENT_UNPASSWORD_SMS : number;

/**
 * 回调
 */
declare var ACK_CLIENT_UNPASSWORD : number;

/**
 * 
 */
declare var ACK_CLIENT_UNPASSWORD_SUCCESS : number;

/**
 * 
 */
declare var ACK_CLIENT_UNPASSWORD_ERRORINFO : number;

/**
 * 6.注销
 */
declare var CLIENT_LOGOFF : number;

/**
 * 服务器返回
 */
declare var ACK_CLIENT_LOGOFF : number;

/**
 * 
 */
declare var ACK_CLIENT_LOGOFF_SUCCESS : number;

/**
 * 
 */
declare var ACK_CLIENT_LOGOFF_ERRORINFO : number;

/**
 * 7. 获取第一级设备及其状态（已绑定的网关、门磁等）
 */
declare var CLIENT_GET_FIRST_DEVICE : number;

/**
 * 服务器回复,多个设备分多次连续回复
 */
declare var ACK_CLIENT_GET_FIRST_DEVICE : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_FIRST_DEVICE_ID : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_FIRST_DEVICE_MODE : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_FIRST_DEVICE_ONLINE : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_FIRST_DEVICE_STAT : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_FIRST_DEVICE_NAME : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_PHONE1 : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_PHONE2 : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_MODE : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_TIME : number;

/**
 * 以下不作用于门磁
 */
declare var ACK_CLIENT_GET_FSECOND_DEVICE_NUMBER : number;

/**
 * 8. 获取第二级设备 及其状态
 */
declare var CLIENT_GET_SECOND_DEVICE : number;

/**
 * 
 */
declare var CLIENT_GET_FIRST_DEVICE_ID : number;

/**
 * 服务器回复,多个设备分多次连续回复
 */
declare var ACK_CLIENT_GET_SECOND_DEVICE : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_SECOND_DEVICE_ID : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_SECOND_DEVICE_MODE : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_SECOND_DEVICE_ONLINE : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_SECOND_DEVICE_STAT : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_SECOND_DEVICE_NAME : number;

/**
 * 9.在服务器的数据库里添加第一级设备
 * 设备先通过无线频段关联到app，app再上报到服务器
 */
declare var CLIENT_ADD_FIRST_DEVICE : number;

/**
 * 网关ID，服务器检查是否已存在该设备，如果存在则在对应用户字段增加用户名，
 * 如果不存在则增加新一条记录，多个用户可以控制同一个第一级设备
 */
declare var CLIENT_ADD_FIRST_DEVICE_ID : number;

/**
 * 
 */
declare var CLIENT_ADD_FIRST_DEVICE_CODE : number;

/**
 * 服务器返回 ACK_DTULOGIN
 */
declare var ACK_CLIENT_ADD_FIRST_DEVICE : number;

/**
 * 
 */
declare var ACK_CLIENT_ADD_FIRST_DEVICE_SUCCESS : number;

/**
 * 
 */
declare var ACK_CLIENT_ADD_FIRST_DEVICE_ERRORINFO : number;

/**
 * 10.添加第二级设备
 */
declare var CLIENT_ADD_SECOND_DEVICE : number;

/**
 * 
 */
declare var CLIENT_ADD_DEVICE_ID : number;

/**
 * 
 */
declare var CLIENT_ADD_SECOND_DEVICE_ID : number;

/**
 * 
 */
declare var CLIENT_ADD_SECOND_DEVICE_CODE : number;

/**
 * 服务器返回
 */
declare var ACK_CLIENT_ADD_SECOND_DEVICE : number;

/**
 * 
 */
declare var ACK_CLIENT_ADD_SECOND_DEVICE_SUCCESS : number;

/**
 * 
 */
declare var ACK_CLIENT_ADD_SECOND_DEVICE_ERRORINFO : number;

/**
 * 11.删除第一级设备
 */
declare var CLIENT_DEL_FIRST_DEVICE : number;

/**
 * 
 */
declare var CLIENT_DEL_FIRST_DEVICE_ID : number;

/**
 * 
 */
declare var CLIENT_DEL_SECOND_DEVICE_WHETHER : number;

/**
 * 服务器返回
 */
declare var ACK_CLIENT_DEL_FIRST_DEVICE : number;

/**
 * 
 */
declare var ACK_CLIENT_DEL_FIRST_DEVICE_SUCCESS : number;

/**
 * 
 */
declare var ACK_CLIENT_DEL_FIRST_DEVICE_ERRORINFO : number;

/**
 * 12.删除第二级设备
 */
declare var CLIENT_DEL_SECOND_DEVICE : number;

/**
 * 
 */
declare var CLIENT_DEL_SECOND_DEVICE_ID : number;

/**
 * 服务器返回
 */
declare var ACK_CLIENT_DEL_SECOND_DEVICE : number;

/**
 * 
 */
declare var ACK_CLIENT_DEL_SECOND_DEVICE_SUCCESS : number;

/**
 * 
 */
declare var ACK_CLIENT_DEL_SECOND_DEVICE_ERRORINFO : number;

/**
 * 13.第一级设备状态汇报到服务器
 * 服务器收到数据，保存到数据库。然后回复成功。有2个表，1是状态表，2是历史记录表
 * 智能网关 状态：外出布防、留守布防、撤防、
 * 门磁水浸 状态：布防、撤防、告警（门开关、水浸）等等
 * 注意：每次传输未必含有所有字段
 */
declare var DEVICE_STAT_FIRST : number;

/**
 * 
 */
declare var DEVICE_STAT_FIRST_DEVICESTAT : number;

/**
 * 
 */
declare var DEVICE_UPDATENOTIFYALARM_PHONE1 : number;

/**
 * 
 */
declare var DEVICE_UPDATENOTIFYALARM_PHONE2 : number;

/**
 * 
 */
declare var DEVICE_UPDATENOTIFYALARM_MODE : number;

/**
 * 
 */
declare var DEVICE_UPDATENOTIFYALARM_TIME : number;

/**
 * 第二级设备无法联网，通过433频段与网关通信，告知网关状态，网关上报到服务器
 */
declare var DEVICE_STAT_SECOND_DEVICEID : number;

/**
 * 
 */
declare var DEVICE_STAT_SECOND_DEVICESTAT : number;

/**
 * 服务器找到状态表更新，并且在历史记录表中增加一行，然后返回
 */
declare var ACK_DEVICE_STAT_FIRST : number;

/**
 * 
 */
declare var ACK_DEVICE_STAT_FIRST_SUCCESS : number;

/**
 * 
 */
declare var ACK_DEVICE_STAT_FIRST_ERRORINFO : number;

/**
 * 14.客户端获取第一级设备状态历史记录
 */
declare var CLIENT_GET_HISTOR_FIRST_DEVICE : number;

/**
 * 
 */
declare var CLIENT_GET_HISTOR_FIRST_DEVICEID : number;

/**
 * 默认为当天，如20180509，每刷新一次增加一天，也可指定，APP自由实现
 */
declare var CLIENT_GET_HISTOR_FIRST_DEVICETIME : number;

/**
 * 服务器返回多条数据，每条数据的内容如下：
 */
declare var ACK_CLIENT_GET_HISTOR_FIRST_DEVICE : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_HISTOR_FIRST_DEVICEID : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_HISTOR_FIRST_HISTORYTIME : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_HISTOR_FIRST_HISTORYDATA : number;

/**
 * 15.客户端获取第二级设备状态历史记录
 */
declare var CLIENT_GET_HISTOR_SECOND_DEVICE : number;

/**
 * 
 */
declare var CLIENT_GET_HISTOR_SECOND_DEVICEID : number;

/**
 * 
 */
declare var CLIENT_GET_HISTOR_SECOND_DEVICETIME : number;

/**
 * 服务器返回多条数据，每条数据的内容如下：
 */
declare var ACK_CLIENT_GET_HISTOR_SECOND_DEVICE : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_HISTOR_SECOND_DEVICEID : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_HISTOR_SECOND_HISTORYTIME : number;

/**
 * 
 */
declare var ACK_CLIENT_GET_HISTOR_SECOND_HISTORYDATA : number;

/**
 * 16.App设置报警通知方式，针对第一级设备的门磁等不一直在线的设备
 * 当开关门时候门磁发送心跳包到服务器，服务器则读取数据库，如果有设置，就下发到设备
 * 注意：此协议不作用于网关和报警主机
 * 本协议用于App与服务器通信，用于设置门磁等
 */
declare var CLIENT_SETNOTIFYALARM : number;

/**
 * 
 */
declare var CLIENT_SETNOTIFYALARM_DEVICEID : number;

/**
 * 
 */
declare var CLIENT_SETNOTIFYALARM_DEFENSE : number;

/**
 * 
 */
declare var CLIENT_SETNOTIFYALARM_PHONE1 : number;

/**
 * 
 */
declare var CLIENT_SETNOTIFYALARM_PHONE2 : number;

/**
 * 
 */
declare var CLIENT_SETNOTIFYALARM_MODE : number;

/**
 * 
 */
declare var CLIENT_SETNOTIFYALARM_TIME : number;

/**
 * 服务器返回
 */
declare var ACK_SETUPDATENOTIFYALARM : number;

/**
 * 
 */
declare var ACK_SETUPDATENOTIFYALARM_SUCCESS : number;

/**
 * 
 */
declare var ACK_SETUPDATENOTIFYALARM_ERRORINFO : number;

/**
 * 17.心跳包，用于检测是否在线，服务器无回复
 */
declare var DEVICE_HEARTBEAT : number;

/**
 * 18.本协议针对报警主机、网关等一直在线的设备，APP\服务器都通过此协议控制设备
 * 控制设备，不通过服务器，但是设备状态改变需要根据协议上报服务器
 * 只有第一级设备能插入sim卡，因此具备发送短信，拨打电话功能
 * 布防场合可以用户自定义：
 */
declare var SET_DEVICE : number;

/**
 * 撤防：Withdrew
 */
declare var SET_DEVICE_DEFENSE : number;

/**
 * 
 */
declare var SET_DEVICE_MODE : number;

/**
 * 
 */
declare var SET_DEVICE_PHONE1 : number;

/**
 * 
 */
declare var SET_DEVICE_PHONE2 : number;

/**
 * 
 */
declare var SET_DEVICE_Interval : number;

/**
 * 
 */
declare var SET_DEVICE_ALARM : number;

/**
 * 
 */
declare var SET_DEVICE_WIFI_SSID : number;

/**
 * 
 */
declare var SET_DEVICE_WIFI_PWD : number;

/**
 * 设备回复
 */
declare var ACK_SET_DEVICE : number;

/**
 * 
 */
declare var ACK_SET_DEVICE_SUCCESS : number;

/**
 * 
 */
declare var ACK_SET_DEVICE_ERRORINFO : number;

/**
 * 19.服务器向设备推送消息或设置
 * 用于服务器向App发送告警通知，上线、下线通知，门磁连线时候对门磁设置新的参数
 */
declare var SERVER_SEND : number;

/**
 * 
 */
declare var SERVER_SEND_DEVICE_ID : number;

/**
 * 
 */
declare var SERVER_SEND_SECOND_DEVICE_ID : number;

/**
 * 
 */
declare var SERVER_SEND_DEVICE_STAT : number;

/**
 * 
 */
declare var SERVER_SEND_DEVICE_DEFENSE : number;

/**
 * APP、设备 回复
 */
declare var ACK_SERVER_SEND : number;

/**
 * 
 */
declare var ACK_SERVER_SEND_SUCCESS : number;

/**
 * 
 */
declare var ACK_SERVER_SEND_ERRORINFO : number;

/**
 * 20.App设置别名等
 */
declare var CLIENT_SET : number;

/**
 * 
 */
declare var CLIENT_SET_DEVICE_ID : number;

/**
 * 
 */
declare var CLIENT_SET_SECOND_DEVICE_ID : number;

/**
 * 
 */
declare var CLIENT_SET_DEVICE_NAME : number;

/**
 * 回复
 */
declare var ACK_CLIENT_SET : number;

/**
 * 
 */
declare var ACK_CLIENT_SET_SUCCESS : number;

/**
 * 
 */
declare var ACK_CLIENT_SET_ERRORINFO : number;
