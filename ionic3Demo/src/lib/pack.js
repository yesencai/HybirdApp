/**********************************************/
/*             通讯数据包定义文件             */
/**********************************************/

/* 注册协议：底层MQTT协议，上层用16进制数字字符协议
 总体格式：指令 + 空格 + 内容
 指令：4字节16进制字符
 内容：由多个字段组合而成，每个字段的格式：长度4B+字段代码2B+内容
 长度4B是16进制字符，例如004E，等于2+内容的长度
 字段代码2B是16进制字符，例如05
 多字段首尾相接，字段没有先后顺序，也可以缺少几个字段。
*/

//1、获取验证码
/*发送请求*/
export const CLIENT_SMS = 0x1012;
export const CLIENT_SMS_USER = 1; // 用户名(手机号)
export const CLIENT_SMS_TYPE = 2; // 验证码用途，是一个整数， 1表示用于新用户注册 2表示用于忘记密码时的密码恢复。
/*回调*/
export const ACK_CLIENT_SMS = 0x2002;
export const ACK_CLIENT_SMS_SUCCESS = 1; //发送结果，参数值是一个整数。成功时，参数的值是0，                                            //非0值时表示失败，其值是错误代码，不同的错误代码
//表示不同的失败原因，具体自定
export const ACK_CLIENT_SMS_ERRORINFO = 2; //结果描述，成功则是验证码，失败则是失败原因

//2、注册
/*发送请求*/
export const CLIENT_RAGISTER = $1001;
export const CLIENT_RAGISTER_USERNAME = 1; // 使用手机，手机则发送短信验证码
export const CLIENT_RAGISTER_PASSWORD = 2;
export const CLIENT_RAGISTER_SMS = 3; // 验证码
/*回调*/
export const ACK_CLIENT_RAGISTER = $2001;
export const ACK_CLIENT_RAGISTER_SUCCESS = 1;
export const ACK_CLIENT_RAGISTER_ERRINFO = 2; // 失败原因，比如用户名已经存在，验证码不正确，该手机号错误，该手机号已经注册，等

//3、登录，需要加密
/*发送请求*/
export const CLIENT_LOGIN = $1002;
export const CLIENT_LOGIN_USERNAME = 1; // 用户名
export const CLIENT_LOGIN_PASSWORD = 2; // 密码
/*回调*/
export const ACK_CLIENT_LOGIN = $2002;
export const ACK_CLIENT_LOGIN_SUCCESS = 1; // 1=成功，0=失败
export const ACK_CLIENT_LOGIN_ERRORINFO = 2; // 失败的原因

// 4.修改密码  需要先登录
/*发送请求*/
export const CLIENT_UPDATEPWD = $1003;
export const CLIENT_UPDATEPWD_OLD = 1; // 当前密码
export const CLIENT_UPDATEPWD_NEW = 2; // 新密码
/*回调*/
export const ACK_CLIENT_UPDATEPWD = $2003;
export const ACK_CLIENT_UPDATEPWD_SUCCESS = 1;
export const ACK_CLIENT_UPDATEPWD_ERRORINFO = 2;

// 5.密码重置 需要邮箱或者短信验证
/*发送请求*/
export const CLIENT_UNPASSWORD = $1004;
export const CLIENT_UNPASSWORD_USERNAME = 1;
export const CLIENT_UNPASSWORD_SMS = 2;
/*回调*/
export const ACK_CLIENT_UNPASSWORD = $2004;
export const ACK_CLIENT_UNPASSWORD_SUCCESS = 1;
export const ACK_CLIENT_UNPASSWORD_ERRORINFO = 2;

// 6.注销
export const CLIENT_LOGOFF = $1005;
// 服务器返回
export const ACK_CLIENT_LOGOFF = $2005;
export const ACK_CLIENT_LOGOFF_SUCCESS = 1;
export const ACK_CLIENT_LOGOFF_ERRORINFO = 2;

// 7. 获取第一级设备及其状态（已绑定的网关、门磁等）
export const CLIENT_GET_FIRST_DEVICE = $1006;
// 服务器回复,多个设备分多次连续回复
export const ACK_CLIENT_GET_FIRST_DEVICE = $2006;
export const ACK_CLIENT_GET_FIRST_DEVICE_ID = 1; // 网关名称，唯一识别号
export const ACK_CLIENT_GET_FIRST_DEVICE_MODE = 2; // 模式，GPRS 或 WIFI
export const ACK_CLIENT_GET_FIRST_DEVICE_ONLINE = 3; // 在线状态
export const ACK_CLIENT_GET_FIRST_DEVICE_STAT = 4; // 外出布防\留守布防\撤防\告警等
export const ACK_CLIENT_GET_FIRST_DEVICE_NAME = 5; // 别名，自定义名
export const ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_PHONE1 = 6;
export const ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_PHONE2 = 7;
export const ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_MODE = 8;
export const ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_TIME = 9;
// 以下不作用于门磁
export const ACK_CLIENT_GET_FSECOND_DEVICE_NUMBER = 10; // 下挂的第二级设备数量

// 8. 获取第二级设备 及其状态
export const CLIENT_GET_SECOND_DEVICE = $1007;
export const CLIENT_GET_FIRST_DEVICE_ID = 1; // 网关名称，根据第一级设备ID找到下挂的第二级设备
// 服务器回复,多个设备分多次连续回复
export const ACK_CLIENT_GET_SECOND_DEVICE = $2007;
export const ACK_CLIENT_GET_SECOND_DEVICE_ID = 1;
export const ACK_CLIENT_GET_SECOND_DEVICE_MODE = 2;
export const ACK_CLIENT_GET_SECOND_DEVICE_ONLINE = 3;
export const ACK_CLIENT_GET_SECOND_DEVICE_STAT = 4;
export const ACK_CLIENT_GET_SECOND_DEVICE_NAME = 5;

// 9.在服务器的数据库里添加第一级设备
// 设备先通过无线频段关联到app，app再上报到服务器
export const CLIENT_ADD_FIRST_DEVICE = $1008;
// 网关ID，服务器检查是否已存在该设备，如果存在则在对应用户字段增加用户名，
// 如果不存在则增加新一条记录，多个用户可以控制同一个第一级设备
export const CLIENT_ADD_FIRST_DEVICE_ID = 1;
export const CLIENT_ADD_FIRST_DEVICE_CODE = 2; // 添加码，出厂印在设备上或者在配对时设备告知app
// 服务器返回 ACK_DTULOGIN
export const ACK_CLIENT_ADD_FIRST_DEVICE = $2008;
export const ACK_CLIENT_ADD_FIRST_DEVICE_SUCCESS = 1;
export const ACK_CLIENT_ADD_FIRST_DEVICE_ERRORINFO = 2;

// 10.添加第二级设备
export const CLIENT_ADD_SECOND_DEVICE = $1009;
export const CLIENT_ADD_DEVICE_ID = 1; // 网关ID，第二级设备只能挂在唯一一个第一级设备下
export const CLIENT_ADD_SECOND_DEVICE_ID = 2; // 设备ID
export const CLIENT_ADD_SECOND_DEVICE_CODE = 3; // 添加码
// 服务器返回
export const ACK_CLIENT_ADD_SECOND_DEVICE = $2009;
export const ACK_CLIENT_ADD_SECOND_DEVICE_SUCCESS = 1;
export const ACK_CLIENT_ADD_SECOND_DEVICE_ERRORINFO = 2;

// 11.删除第一级设备
export const CLIENT_DEL_FIRST_DEVICE = $100A;
export const CLIENT_DEL_FIRST_DEVICE_ID = 1;
export const CLIENT_DEL_SECOND_DEVICE_WHETHER = 2; // 是否同时解除关联该设备下的第二级设备，0表示保留，1表示删除
// 服务器返回
export const ACK_CLIENT_DEL_FIRST_DEVICE = $200A;
export const ACK_CLIENT_DEL_FIRST_DEVICE_SUCCESS = 1;
export const ACK_CLIENT_DEL_FIRST_DEVICE_ERRORINFO = 2;

// 12.删除第二级设备
export const CLIENT_DEL_SECOND_DEVICE = $100B;
export const CLIENT_DEL_SECOND_DEVICE_ID = 1;
// 服务器返回
export const ACK_CLIENT_DEL_SECOND_DEVICE = $200B;
export const ACK_CLIENT_DEL_SECOND_DEVICE_SUCCESS = 1;
export const ACK_CLIENT_DEL_SECOND_DEVICE_ERRORINFO = 2;

// 13.第一级设备状态汇报到服务器
// 服务器收到数据，保存到数据库。然后回复成功。有2个表，1是状态表，2是历史记录表
// 智能网关 状态：外出布防、留守布防、撤防、
// 门磁水浸 状态：布防、撤防、告警（门开关、水浸）等等
// 注意：每次传输未必含有所有字段
export const DEVICE_STAT_FIRST = $100C;
export const DEVICE_STAT_FIRST_DEVICESTAT = 1;
// 第一级设备状态，内容根据第18条协议 // 电压低：LowP，根据内容，如果是触发的告警等需要服务器推送到App
export const DEVICE_UPDATENOTIFYALARM_PHONE1 = 2; // 优先电话
export const DEVICE_UPDATENOTIFYALARM_PHONE2 = 3; // 次要电话
export const DEVICE_UPDATENOTIFYALARM_MODE = 4; // 优先通知方式，短信或者电话
export const DEVICE_UPDATENOTIFYALARM_TIME = 5; // 设置再次通知间隔时长或不再通知，单位秒

// 第二级设备无法联网，通过433频段与网关通信，告知网关状态，网关上报到服务器
export const DEVICE_STAT_SECOND_DEVICEID = 6; // 第二级设备ID
export const DEVICE_STAT_SECOND_DEVICESTAT = 7; // 第二级设备状态
// 服务器找到状态表更新，并且在历史记录表中增加一行，然后返回
export const ACK_DEVICE_STAT_FIRST = $200C;
export const ACK_DEVICE_STAT_FIRST_SUCCESS = 1;
export const ACK_DEVICE_STAT_FIRST_ERRORINFO = 2;

// 14.客户端获取第一级设备状态历史记录
export const CLIENT_GET_HISTOR_FIRST_DEVICE = $100D;
export const CLIENT_GET_HISTOR_FIRST_DEVICEID = 1;
// 默认为当天，如20180509，每刷新一次增加一天，也可指定，APP自由实现
export const CLIENT_GET_HISTOR_FIRST_DEVICETIME = 2;
// 服务器返回多条数据，每条数据的内容如下：
export const ACK_CLIENT_GET_HISTOR_FIRST_DEVICE = $200D;
export const ACK_CLIENT_GET_HISTOR_FIRST_DEVICEID = 1;
export const ACK_CLIENT_GET_HISTOR_FIRST_HISTORYTIME = 2; // 历史数据发生的时间
export const ACK_CLIENT_GET_HISTOR_FIRST_HISTORYDATA = 3; // 历史数据的内容

// 15.客户端获取第二级设备状态历史记录
export const CLIENT_GET_HISTOR_SECOND_DEVICE = $100E;
export const CLIENT_GET_HISTOR_SECOND_DEVICEID = 1;
export const CLIENT_GET_HISTOR_SECOND_DEVICETIME = 2;
// 服务器返回多条数据，每条数据的内容如下：
export const ACK_CLIENT_GET_HISTOR_SECOND_DEVICE = $200E;
export const ACK_CLIENT_GET_HISTOR_SECOND_DEVICEID = 1;
export const ACK_CLIENT_GET_HISTOR_SECOND_HISTORYTIME = 2; // 历史数据发生的时间
export const ACK_CLIENT_GET_HISTOR_SECOND_HISTORYDATA = 3; // 历史数据的内容

// 16.App设置报警通知方式，针对第一级设备的门磁等不一直在线的设备
// 当开关门时候门磁发送心跳包到服务器，服务器则读取数据库，如果有设置，就下发到设备
// 注意：此协议不作用于网关和报警主机
// 本协议用于App与服务器通信，用于设置门磁等
export const CLIENT_SETNOTIFYALARM = $100F;
export const CLIENT_SETNOTIFYALARM_DEVICEID = 1;
export const CLIENT_SETNOTIFYALARM_DEFENSE = 2; // 设置布防撤防   Defense、Withdrew
export const CLIENT_SETNOTIFYALARM_PHONE1 = 3;
export const CLIENT_SETNOTIFYALARM_PHONE2 = 4; // 允许设置两个通知电话，第一个优先
export const CLIENT_SETNOTIFYALARM_MODE = 5; // 优先通知方式，短信或者电话   RMode_SMS\RMode_Call
export const CLIENT_SETNOTIFYALARM_TIME = 6; // 设置再次通知间隔时长或不再通知，单位秒
// 服务器返回
export const ACK_SETUPDATENOTIFYALARM = $200F;
export const ACK_SETUPDATENOTIFYALARM_SUCCESS = 1;
export const ACK_SETUPDATENOTIFYALARM_ERRORINFO = 2;

// 17.心跳包，用于检测是否在线，服务器无回复
export const DEVICE_HEARTBEAT = $1011;


// 18.本协议针对报警主机、网关等一直在线的设备，APP\服务器都通过此协议控制设备
// 控制设备，不通过服务器，但是设备状态改变需要根据协议上报服务器
// 只有第一级设备能插入sim卡，因此具备发送短信，拨打电话功能
// 布防场合可以用户自定义：
export const SET_DEVICE = $1013;
// 布防和撤防，布防：Defense_XXX //此处XXX就是用户自定义的内容，如室内，室外，客厅，仓库等
// 撤防：Withdrew
export const SET_DEVICE_DEFENSE = 1;
export const SET_DEVICE_MODE = 2; // 优先方式：SMS\Call
export const SET_DEVICE_PHONE1 = 3;
export const SET_DEVICE_PHONE2 = 4; // 报警电话
export const SET_DEVICE_Interval = 5; // 报警间隔： 数字，单位秒，如300 即 5分钟
export const SET_DEVICE_ALARM = 6; // 一键告警 1为触发告警，0为取消告警（布防状态不变）
export const SET_DEVICE_WIFI_SSID = 7; // app与设备配对后发送给设备wifi名
export const SET_DEVICE_WIFI_PWD = 8; // wifi密码
// 设备回复
export const ACK_SET_DEVICE = $2013;
export const ACK_SET_DEVICE_SUCCESS = 1; // 设置成功回复1，失败回复0
export const ACK_SET_DEVICE_ERRORINFO = 2;

// 19.服务器向设备推送消息或设置
// 用于服务器向App发送告警通知，上线、下线通知，门磁连线时候对门磁设置新的参数
export const SERVER_SEND = $1014;
export const SERVER_SEND_DEVICE_ID = 1; // 第一级告警设备ID
export const SERVER_SEND_SECOND_DEVICE_ID = 2; // 第二级告警设备ID
export const SERVER_SEND_DEVICE_STAT = 3;
export const SERVER_SEND_DEVICE_DEFENSE = 4; // 设置布防撤防   Defense、Withdrew
// APP、设备 回复
export const ACK_SERVER_SEND = $2014;
export const ACK_SERVER_SEND_SUCCESS = 1; // 设置成功回复1，失败回复0
export const ACK_SERVER_SEND_ERRORINFO = 2;

// 20.App设置别名等
export const CLIENT_SET = $1015;
export const CLIENT_SET_DEVICE_ID = 1; // 第一级告警设备ID
export const CLIENT_SET_SECOND_DEVICE_ID = 2; // 第一级告警设备ID
export const CLIENT_SET_DEVICE_NAME = 3; // 用户设置的别名
// 回复
export const ACK_CLIENT_SET = $2015;
export const ACK_CLIENT_SET_SUCCESS = 1; // 设置成功回复1，失败回复0
export const ACK_CLIENT_SET_ERRORINFO = 2;

