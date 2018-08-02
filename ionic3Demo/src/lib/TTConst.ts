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

import { Injectable } from '@angular/core';
import { Platform, ToastController, App } from 'ionic-angular';

@Injectable()
export class TTConst {

  //1、获取验证码
  /*发送请求*/
  CLIENT_SMS: number = 0x1012;
  CLIENT_SMS_USER: number = 1; // 用户名(手机号)
  CLIENT_SMS_TYPE: number = 2; // 验证码用途，是一个整数， 1表示用于新用户注册 2表示用于忘记密码时的密码恢复。
  /*回调*/
  ACK_CLIENT_SMS: number = 0x2012;
  ACK_CLIENT_SMS_SUCCESS: number = 1; //发送结果，参数值是一个整数。成功时，参数的值是0，                                            //非0值时表示失败，其值是错误代码，不同的错误代码
  //表示不同的失败原因，具体自定
  ACK_CLIENT_SMS_ERRORINFO: number = 2; //结果描述，成功则是验证码，失败则是失败原因

  //2、注册
  /*发送请求*/
  CLIENT_RAGISTER: number = 0x1001;
  CLIENT_RAGISTER_USERNAME: number = 1; // 使用手机，手机则发送短信验证码
  CLIENT_RAGISTER_PASSWORD: number = 2;
  CLIENT_RAGISTER_SMS: number = 3; // 验证码
  /*回调*/
  ACK_CLIENT_RAGISTER: number = 0x2001;
  ACK_CLIENT_RAGISTER_SUCCESS: number = 1;
  ACK_CLIENT_RAGISTER_ERRINFO: number = 2; // 失败原因，比如用户名已经存在，验证码不正确，该手机号错误，该手机号已经注册，等

  //3、登录，需要加密
  /*发送请求*/
  CLIENT_LOGIN: number = 0x1002;
  CLIENT_LOGIN_USERNAME: number = 1; // 用户名
  CLIENT_LOGIN_PASSWORD: number = 2; // 密码
  /*回调*/
  ACK_CLIENT_LOGIN: number = 0x2002;
  ACK_CLIENT_LOGIN_SUCCESS: number = 1; // 1: number =成功，0: number =失败
  ACK_CLIENT_LOGIN_ERRORINFO: number = 2; // 失败的原因

  // 4.修改密码  需要先登录
  /*发送请求*/
  CLIENT_UPDATEPWD: number = 0x1003;
  CLIENT_UPDATEPWD_OLD: number = 1; // 当前密码
  CLIENT_UPDATEPWD_NEW: number = 2; // 新密码
  /*回调*/
  ACK_CLIENT_UPDATEPWD: number = 0x2003;
  ACK_CLIENT_UPDATEPWD_SUCCESS: number = 1;
  ACK_CLIENT_UPDATEPWD_ERRORINFO: number = 2;

  // 5.密码重置 需要邮箱或者短信验证
  /*发送请求*/
  CLIENT_UNPASSWORD: number = 0x1004;
  CLIENT_UNPASSWORD_USERNAME: number = 1;
  CLIENT_UNPASSWORD_SMS: number = 2;
  /*回调*/
  ACK_CLIENT_UNPASSWORD: number = 0x2004;
  ACK_CLIENT_UNPASSWORD_SUCCESS: number = 1;
  ACK_CLIENT_UNPASSWORD_ERRORINFO: number = 2;

  // 6.注销
  CLIENT_LOGOFF: number = 0x1005;
  // 服务器返回
  ACK_CLIENT_LOGOFF: number = 0x2005;
  ACK_CLIENT_LOGOFF_SUCCESS: number = 1;
  ACK_CLIENT_LOGOFF_ERRORINFO: number = 2;

  // 7. 获取第一级设备及其状态（已绑定的网关、门磁等）
  CLIENT_GET_FIRST_DEVICE: number = 0x1006;
  // 服务器回复,多个设备分多次连续回复
  ACK_CLIENT_GET_FIRST_DEVICE: number = 0x2006;
  ACK_CLIENT_GET_FIRST_DEVICE_ID = 1; // 网关名称，唯一识别号
  ACK_CLIENT_GET_FIRST_DEVICE_MODE = 2; // 模式，GPRS 或 WIFI
  ACK_CLIENT_GET_FIRST_DEVICE_ONLINE = 3; // 在线状态
  ACK_CLIENT_GET_FIRST_DEVICE_STAT = 4; // 外出布防\留守布防\撤防等
  ACK_CLIENT_GET_FIRST_DEVICE_ALARMSTAT = 5; // 开关门、告警、等
  ACK_CLIENT_GET_FIRST_DEVICE_NAME = 6; // 别名，自定义名
  ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_PHONE1 = 7; // 电话1
  ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_PHONE2 = 8; // 电话2
  ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_MODE = 9; // 优先通知方式
  ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_TIME = 10; // 再次通知间隔时间
  ACK_CLIENT_GET_FSECOND_DEVICE_NUMBER = 11; // 下挂的第二级设备数量
  ACK_CLIENT_GET_FSECOND_DEVICE_AREA = 12; // 位置

   // 8. 获取第二级设备 及其状态，App->服务器
   CLIENT_GET_SECOND_DEVICE = 0x1007;
   CLIENT_GET_FIRST_DEVICE_ID = 1; // 网关名称，根据第一级设备ID找到下挂的第二级设备
   // 服务器回复,多个设备分多次连续回复
   ACK_CLIENT_GET_SECOND_DEVICE = 0x2007;
   ACK_CLIENT_GET_SECOND_DEVICE_ID = 1;
   ACK_CLIENT_GET_SECOND_DEVICE_ONLINE = 2;
   ACK_CLIENT_GET_SECOND_DEVICE_NAME = 3;
   ACK_CLIENT_GET_SECOND_DEVICE_AREA = 4;
   ACK_CLIENT_GET_SECOND_DEVICE_STAT = 5; // 布防或撤防
   ACK_CLIENT_GET_SECOND_DEVICE_ALARMSTAT = 5; // 开关门
   ACK_CLIENT_GET_SECOND_DEVICE_TYPE = 6; // 探头或者遥控器


  // 9.在服务器的数据库里添加第一级设备
  // 设备先通过无线频段关联到app，app再上报到服务器
  CLIENT_ADD_FIRST_DEVICE: number = 0x1008;
  // 网关ID，服务器检查是否已存在该设备，如果存在则在对应用户字段增加用户名，
  // 如果不存在则增加新一条记录，多个用户可以控制同一个第一级设备
  CLIENT_ADD_FIRST_DEVICE_ID: number = 1;
  CLIENT_ADD_FIRST_DEVICE_CODE: number = 2; // 添加码，出厂印在设备上或者在配对时设备告知app
  // 服务器返回 ACK_DTULOGIN
  ACK_CLIENT_ADD_FIRST_DEVICE: number = 0x2008;
  ACK_CLIENT_ADD_FIRST_DEVICE_SUCCESS: number = 1;
  ACK_CLIENT_ADD_FIRST_DEVICE_ERRORINFO: number = 2;

  // 10.添加第二级设备
  CLIENT_ADD_SECOND_DEVICE = 0x1009;
  CLIENT_ADD_DEVICE_TOTAL = 1; // 总条数
  CLIENT_ADD_DEVICE_NUM = 2; // 第几条
  CLIENT_ADD_DEVICE_ID = 3; // 网关ID，第二级设备只能挂在唯一一个第一级设备下
  CLIENT_ADD_SECOND_DEVICE_ID = 4; // 设备ID
  CLIENT_ADD_SECOND_DEVICE_TYPE = 5; // 0 遥控器，1 探头
  CLIENT_ADD_SECOND_DEVICE_NAME = 6; // 名字
  CLIENT_ADD_SECOND_DEVICE_ADDR = 7; // 场景
  // 服务器/设备（网关）返回
  ACK_CLIENT_ADD_SECOND_DEVICE = 0x2009;
  ACK_CLIENT_ADD_SECOND_DEVICE_SUCCESS = 1;
  ACK_CLIENT_ADD_SECOND_DEVICE_ERRORINFO = 2;
  ACK_CLIENT_ADD_SECOND_DEVICE_NUM = 3;


  // 11.删除第一级设备
  CLIENT_DEL_FIRST_DEVICE: number = 0x100A;
  CLIENT_DEL_FIRST_DEVICE_ID: number = 1;
  CLIENT_DEL_SECOND_DEVICE_WHETHER: number = 2; // 是否同时解除关联该设备下的第二级设备，0表示保留，1表示删除
  // 服务器返回
  ACK_CLIENT_DEL_FIRST_DEVICE: number = 0x200A;
  ACK_CLIENT_DEL_FIRST_DEVICE_SUCCESS: number = 1;
  ACK_CLIENT_DEL_FIRST_DEVICE_ERRORINFO: number = 2;

  // 12.删除第二级设备
  CLIENT_DEL_SECOND_DEVICE: number = 0x100B;
  CLIENT_DEL_SECOND_DEVICE_ID: number = 1;
  // 服务器返回
  ACK_CLIENT_DEL_SECOND_DEVICE: number = 0x200B;
  ACK_CLIENT_DEL_SECOND_DEVICE_SUCCESS: number = 1;
  ACK_CLIENT_DEL_SECOND_DEVICE_ERRORINFO: number = 2;

// 12.第一级设备状态汇报到服务器
  // 服务器收到数据，保存到数据库。然后回复成功。
  // 注意：每次传输未必含有所有字段
  DEVICE_STAT_FIRST:number = 0x100C;
  DEVICE_STAT_FIRST_DEVICESTAT = 1; // 布防状态
  // 具体内容如下：
  // 这条对所有设备都有效，撤防是0，在家是1，外出是2 紧急报警是3（报警主机只能通过0撤防来取消报警状态）
  
  DEVICE_STAT_FIRST_ALARMSTAT = 2; // 各种告警状态
  // 电压低：5
  // 电压正常：6
  // 停电：7
  // 来电：8
  // 告警触发： 9
  // 告警消除： 10 （布防状态不变）
  // 一般触发：11
  // 探头闭合（比如门磁关门）：12
  // 如需要继续往下扩展
  // 第二级设备无法联网，通过433频段与网关通信，告知网关状态，网关上报到服务器
  DEVICE_UPDATENOTIFYALARM_PHONE1 = 3; // 优先电话
  DEVICE_UPDATENOTIFYALARM_PHONE2 = 4; // 次要电话
  DEVICE_UPDATENOTIFYALARM_MODE = 5; // 优先通知方式，短信或者电话
  DEVICE_UPDATENOTIFYALARM_TIME = 6; // 设置再次通知间隔时长或不再通知，单位秒
  DEVICE_STAT_SECOND_DEVICEID = 7; // 第二级设备ID
  DEVICE_STAT_SECOND_DEVICESTAT = 8; // 第二级设备状态，第二级布防就只有一种，没有外出在家的区别，代号1
  DEVICE_STAT_SECOND_ALARMSTAT = 9; // 告警状态，开关门等
  // 电压低：5
  // 电压正常：6
  // 停电：7
  // 来电：8
  // 告警触发： 9
  // 告警消除： 10 （布防状态不变）
  // 一般触发：11
  // 探头闭合（比如门磁关门）：12
  // 如需要继续往下扩展
  // 服务器返回
  ACK_DEVICE_STAT_FIRST : number = 0x200C;
  ACK_DEVICE_STAT_FIRST_SUCCESS = 1;
  ACK_DEVICE_STAT_FIRST_ERRORINFO = 2;


   // 14.客户端获取第一级设备状态历史记录，App->服务器
   CLIENT_GET_HISTOR_FIRST_DEVICE:number = 0x100D;
   CLIENT_GET_HISTOR_FIRST_DEVICEID = 1;
   CLIENT_GET_HISTOR_FIRST_DEVICETIME = 2; // 默认为当天，格式20180509，也可指定，APP自由实现
   CLIENT_GET_HISTOR_FIRST_DEVICENUM = 3; // 1表示最近10条记录，2表示第11到20条记录，以此类推
   // 服务器返回多条数据，每条数据的内容如下：
   ACK_CLIENT_GET_HISTOR_FIRST_DEVICE :number = 0x200D;
   ACK_CLIENT_GET_HISTOR_FIRST_DEVICEID = 1;
   ACK_CLIENT_GET_HISTOR_FIRST_HISTORYTIME = 2; // 历史数据发生的时间
   ACK_CLIENT_GET_HISTOR_FIRST_HISTORYDATA = 3; // 历史数据的内容
 

  // 15.客户端获取第二级设备状态历史记录
  CLIENT_GET_HISTOR_SECOND_DEVICE: number = 0x100E;
  CLIENT_GET_HISTOR_SECOND_DEVICEID: number = 1;
  CLIENT_GET_HISTOR_SECOND_DEVICETIME: number = 2;
  CLIENT_GET_HISTOR_SECOND_DEVICENUM = 3; // 1表示最近10条记录，2表示第11到20条记录，以此类推
  // 服务器返回多条数据，每条数据的内容如下：
  ACK_CLIENT_GET_HISTOR_SECOND_DEVICE: number = 0x200E;
  ACK_CLIENT_GET_HISTOR_SECOND_DEVICEID: number = 1;
  ACK_CLIENT_GET_HISTOR_SECOND_HISTORYTIME: number = 2; // 历史数据发生的时间
  ACK_CLIENT_GET_HISTOR_SECOND_HISTORYDATA: number = 3; // 历史数据的内容

  // 16.App设置报警通知方式，针对第一级设备的门磁等不一直在线的设备
  // 当开关门时候门磁发送心跳包到服务器，服务器则读取数据库，如果有设置，就下发到设备
  // 注意：此协议不作用于网关和报警主机
  // 本协议用于App与服务器通信，用于设置门磁等
  CLIENT_SETNOTIFYALARM: number = 0x100F;
  CLIENT_SETNOTIFYALARM_DEVICEID: number = 1;
  CLIENT_SETNOTIFYALARM_DEFENSE: number = 2; // 设置布防撤防   Defense、Withdrew
  CLIENT_SETNOTIFYALARM_PHONE1: number = 3;
  CLIENT_SETNOTIFYALARM_PHONE2: number = 4; // 允许设置两个通知电话，第一个优先
  CLIENT_SETNOTIFYALARM_MODE: number = 5; // 优先通知方式，短信或者电话   RMode_SMS\RMode_Call
  CLIENT_SETNOTIFYALARM_TIME: number = 6; // 设置再次通知间隔时长或不再通知，单位秒
  // 服务器返回
  ACK_SETUPDATENOTIFYALARM: number = 0x200F;
  ACK_SETUPDATENOTIFYALARM_SUCCESS: number = 1;
  ACK_SETUPDATENOTIFYALARM_ERRORINFO: number = 2;

  // 17.心跳包，用于检测是否在线，服务器无回复
  DEVICE_HEARTBEAT: number = 0x1011;


  // 18.本协议针对报警主机、网关等一直在线的设备，APP\服务器都通过此协议控制设备
  // 控制设备，不通过服务器，但是设备状态改变需要根据协议上报服务器
  // 只有第一级设备能插入sim卡，因此具备发送短信，拨打电话功能
  // 布防场合可以用户自定义：
  SET_DEVICE: number = 0x1013;
  // 布防和撤防，布防：Defense_XXX //此处XXX就是用户自定义的内容，如室内，室外，客厅，仓库等
  // 撤防：Withdrew
  SET_DEVICE_DEFENSE: number = 1;
  SET_DEVICE_MODE = 2; // 优先方式：电话1，短信0
  SET_DEVICE_PHONE1 = 3; // 优先报警电话
  SET_DEVICE_PHONE2 = 4; // 次选报警电话
  SET_DEVICE_Interval = 5; // 报警间隔： 单位分钟
  SET_SECOND_DEVICE_ID = 6; // 第二级设备ID （设置第二级设备布防驻防需要线使用这一条）
  SET_SECOND_DEVICE_DEFENSE = 7; // 撤防是0，布防是1

  // 设备回复
  ACK_SET_DEVICE: number = 0x2013;
  ACK_SET_DEVICE_SUCCESS: number = 1; // 设置成功回复1，失败回复0
  ACK_SET_DEVICE_ERRORINFO: number = 2;

  // 19.服务器向设备推送消息或设置
  // 用于服务器向App发送告警通知，上线、下线通知，门磁连线时候对门磁设置新的参数
  SERVER_SEND: number = 0x1014;
  SERVER_SEND_DEVICE_ID: number = 1; // 第一级告警设备ID
  SERVER_SEND_SECOND_DEVICE_ID: number = 2; // 第二级告警设备ID
  SERVER_SEND_DEVICE_STAT: number = 3;
  SERVER_SEND_DEVICE_DEFENSE: number = 4; // 设置布防撤防   Defense、Withdrew
  // APP、设备 回复
  ACK_SERVER_SEND: number = 0x2014;
  ACK_SERVER_SEND_SUCCESS: number = 1; // 设置成功回复1，失败回复0
  ACK_SERVER_SEND_ERRORINFO: number = 2;

   // 20.App设置别名等，App->服务器
   CLIENT_SET = 0x1015;
   CLIENT_SET_DEVICE_ID = 1; // 第一级告警设备ID
   CLIENT_SET_SECOND_DEVICE_ID = 2; // 第二级告警设备ID
   CLIENT_SET_DEVICE_IDd = 3; // 修改设备ID
   CLIENT_SET_DEVICE_NAME = 4; // 用户设置的别名
   CLIENT_SET_DEVICE_AREA = 5; // 地址、场景
   CLIENT_SET_SECOND_DEVICE_TYPE = 6; // 修改类型是 遥控器或探头
   // 服务器回复
   ACK_CLIENT_SET = 0x2015;
   ACK_CLIENT_SET_SUCCESS = 1; // 设置成功回复1，失败回复0
   ACK_CLIENT_SET_ERRORINFO = 2;
 
  //21.获取第2级设备ID（唯一码）
  //当第一级设备与第2级设备配对，第一级设备把第二级设备id发送到手机app，app获得后确认无误，则利用第9条协议添加设备
  DEVICE_SEND_ID = 0x1016;
  DEVICE_SEND_SECONDDEVICEID = 1;//第2级设备ID
  //app回复
  ACK_DEVICE_SEND_ID = 0x2016;
  ACK_DEVICE_SEND_ID_SUCCESS = 1;
  ACK_DEVICE_SEND_ID_ERRORINFO = 2;
  //22.网关进入学习模式
  CLIENT_SECDEV_LEARN = 0x1017;
  CLIENT_SECDEV_LEARN_TIME = 1; // 学习模式持续的时间 单位秒
  CLIENT_SECDEV_LEARN_CONTROL = 2; // 一般探头为0，遥控器为1
  //网关回复
  ACK_CLIENT_SECDEV_LEARN = 0x2017;
  ACK_CLIENT_SECDEV_LEARN_SUCCESS = 1;
  ACK_CLIENT_SECDEV_LEARN_ERRORINFO = 2;
  // 23.App发送指令到服务器停止拨打电话、App发送指令到gprs模块停止拨打电话，App->服务器
  CLIENT_STOP_CALL = 0x1018;
  CLIENT_STOP_CALL_DEVICEID = 1; // 触发打电话的设备 id
  // 服务器回复
  ACK_CLIENT_STOP_CALL = 0x2018;
  ACK_CLIENT_STOP_CALL_SUCCESS = 1;
  ACK_CLIENT_STOP_CALL_ERRORINFO = 2;

  // 24.充值，App->服务器
  CLIENT_CHARGE = 0x1019;
  CLIENT_CHARGE_USERNAME = 1;
  // 服务器回复
  ACK_CLIENT_CHARGE = 0x2019 ;
  ACK_CLIENT_CHARGE_SUCCESS = 1;
  ACK_CLIENT_CHARGE_ERRORINFO = 2; // 成功就是带二维码或者字符串，失败就是
  // 25.App进入学习模式添加第1级设备
  CLIENT_LEARN = 0x101A; // 命令持续20秒，20秒内设备触发指令则把设备ID发送到APP，否则服务器无回复
  // 服务器回复
  ACK_CLIENT_LEARN = 0x201A;
  ACK_CLIENT_LEARN_DEVICEID = 1; // 设备ID，有可能有多个，通常只有一个

  // 26.App发送该指令进行测试，设备收到后使得设备蜂鸣器响
  CLIENT_LEARN_TEST = 0x101B; // 25条协议回复了设备ID，app根据设备id发送此指令使得设备蜂鸣器响，再根据情况添加设备
  /****************通知名字 *********************/

  TT_LOGIN_NOTIFICATION_NAME: any = 'TT_LOGIN'//登录成功通知
  TT_REGISTED_NOTIFICATION_NAME: any = 'TT_REGISTED'//注册成功通知
  TT_CHAGEPASSWORD_NOTIFICATION_NAME: any = 'TT_CHANGEPASSWORD'//修改密码成功通知
  TT_EXIT_NOTIFICATION_NAME: any = 'TT_EXIT'//退出登录成功通知
  TT_RESETPASSWORD_NOTIFICATION_NAME: any = 'TT_RESETPASSWORD'//重置密码成功通知
  TT_ADDNORMALDEVECE_NOTIFICATION_NAME: any = 'TT_ADDNORMALDEVECE'//绑定普通设备成功
  TT_GETDEVICELIST_NOTIFICATION_NAME: any = 'TT_GETDEVICELIST'//获取设备列表成功
  TT_REMOVEDEVICE_NOTIFICATION_NAME: any = 'TT_REMOVEDEVICE'//删除设备列表
  TT_HOMEPROTECTION_NOTIFICATION_NAME: any = 'TT_HOMEPROTECTION'//在家布防
  TT_OUTPROTECTION_NOTIFICATION_NAME: any = 'TT_HOMEPROTECTION'//外出布防
  TT_SECODEDEVICEREMOAVAL_NOTIFICATION_NAME: any = 'TT_SECODEDEVICEREMOAVAL_NOTIFICATION'//子设备布防侧方

  TT_MQTTCONNET_NOTIFICATION_NAME: any = 'TT_MQTTCONNET'//删除设备列表
  TT_GETDEVICEHISTORYLIST_NOTIFICATION_NAME: any = 'TT_GETDEVICEHISTORYLIST'//删除设备列表
  TT_CHANGEREMARKE_NOTIFICATION_NAME: any = 'TT_CHANGEREMARKE'//修改备注
  TT_ADDALARM_NOTIFICATION_NAME: any = 'TT_ADDALARM'//添加预警
  TT_DEVICEOFFLINE_NOTIFICATION_NAME: any = 'TT_DEVICEOFFLINE'//添加预警
  TT_SECONDARYDEVICELIST_NOTIFICATION_NAME: any = 'TT_SECONDARYDEVICELIST'//获取二级设备列表
  TT_GETSECONDARYDEVICEID_NOTIFICATION_NAME: any = 'TT_GETSECONDARYDEVICEID'//获取二级设备ID
  TT_ADDGETSECONDARYDEVICE_NOTIFICATION_NAME: any = 'TT_ADDGETSECONDARYDEVICE'//添加二级设备
  TT_DELETEGETSECONDARYDEVICE_NOTIFICATION_NAME: any = 'TT_DELETEGETSECONDARYDEVICE'//删除二级设备
  TT_ADDDEVICEGOTOLEARNING_NOTIFICATION_NAME : any = 'TT_ADDDEVICEGOTOLEARNING'//进入学习状态
  TT_STOPCALL_NAME : any = 'TT_STOPCALL_NAME'//停止拨打电话
  TT_CLLPHONE_NOTIFICATION_NAME : any = 'TT_CLLPHONE_NOTIFICATION_NAME'//进入学习状态

  TT_AddDeviceNotification : any = 'TT_AddDeviceNotification'//添加设备通知
  TT_CancelPoliceNotification : any = 'TT_CancelPoliceNotification'//取消报警

}
