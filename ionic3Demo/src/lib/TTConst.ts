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
  ACK_CLIENT_GET_FIRST_DEVICE_ID: number = 1; // 网关名称，唯一识别号
  ACK_CLIENT_GET_FIRST_DEVICE_MODE: number = 2; // 模式，GPRS 或 WIFI
  ACK_CLIENT_GET_FIRST_DEVICE_ONLINE: number = 3; // 在线状态
  ACK_CLIENT_GET_FIRST_DEVICE_STAT: number = 4; // 外出布防\留守布防\撤防\告警等
  ACK_CLIENT_GET_FIRST_DEVICE_NAME: number = 5; // 别名，自定义名
  ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_PHONE1: number = 6;
  ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_PHONE2: number = 7;
  ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_MODE: number = 8;
  ACK_CLIENT_GET_FIRST_DEVICE_NOTIFYALARM_TIME: number = 9;
  // 以下不作用于门磁
  ACK_CLIENT_GET_FSECOND_DEVICE_NUMBER: number = 10; // 下挂的第二级设备数量

  // 8. 获取第二级设备 及其状态
  CLIENT_GET_SECOND_DEVICE: number = 0x1007;
  CLIENT_GET_FIRST_DEVICE_ID: number = 1; // 网关名称，根据第一级设备ID找到下挂的第二级设备
  // 服务器回复,多个设备分多次连续回复
  ACK_CLIENT_GET_SECOND_DEVICE: number = 0x2007;
  ACK_CLIENT_GET_SECOND_DEVICE_ID: number = 1;
  ACK_CLIENT_GET_SECOND_DEVICE_MODE: number = 2;
  ACK_CLIENT_GET_SECOND_DEVICE_ONLINE: number = 3;
  ACK_CLIENT_GET_SECOND_DEVICE_STAT: number = 4;
  ACK_CLIENT_GET_SECOND_DEVICE_NAME: number = 5;

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
  CLIENT_ADD_SECOND_DEVICE: number = 0x1009;
  CLIENT_ADD_DEVICE_ID: number = 1; // 网关ID，第二级设备只能挂在唯一一个第一级设备下
  CLIENT_ADD_SECOND_DEVICE_ID: number = 2; // 设备ID
  CLIENT_ADD_SECOND_DEVICE_CODE: number = 3; // 添加码
  // 服务器返回
  ACK_CLIENT_ADD_SECOND_DEVICE: number = 0x2009;
  ACK_CLIENT_ADD_SECOND_DEVICE_SUCCESS: number = 1;
  ACK_CLIENT_ADD_SECOND_DEVICE_ERRORINFO: number = 2;

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

  // 13.第一级设备状态汇报到服务器
  // 服务器收到数据，保存到数据库。然后回复成功。有2个表，1是状态表，2是历史记录表
  // 智能网关 状态：外出布防、留守布防、撤防、
  // 门磁水浸 状态：布防、撤防、告警（门开关、水浸）等等
  // 注意：每次传输未必含有所有字段
  DEVICE_STAT_FIRST: number = 0x100C;
  DEVICE_STAT_FIRST_DEVICESTAT: number = 1;
  // 第一级设备状态，内容根据第18条协议 // 电压低：LowP，根据内容，如果是触发的告警等需要服务器推送到App
  DEVICE_UPDATENOTIFYALARM_PHONE1: number = 2; // 优先电话
  DEVICE_UPDATENOTIFYALARM_PHONE2: number = 3; // 次要电话
  DEVICE_UPDATENOTIFYALARM_MODE: number = 4; // 优先通知方式，短信或者电话
  DEVICE_UPDATENOTIFYALARM_TIME: number = 5; // 设置再次通知间隔时长或不再通知，单位秒

  // 第二级设备无法联网，通过433频段与网关通信，告知网关状态，网关上报到服务器
  DEVICE_STAT_SECOND_DEVICEID: number = 6; // 第二级设备ID
  DEVICE_STAT_SECOND_DEVICESTAT: number = 7; // 第二级设备状态
  // 服务器找到状态表更新，并且在历史记录表中增加一行，然后返回
  ACK_DEVICE_STAT_FIRST: number = 0x200C;
  ACK_DEVICE_STAT_FIRST_SUCCESS: number = 1;
  ACK_DEVICE_STAT_FIRST_ERRORINFO: number = 2;

  // 14.客户端获取第一级设备状态历史记录
  CLIENT_GET_HISTOR_FIRST_DEVICE: number = 0x100D;
  CLIENT_GET_HISTOR_FIRST_DEVICEID: number = 1;
  // 默认为当天，如20180509，每刷新一次增加一天，也可指定，APP自由实现
  CLIENT_GET_HISTOR_FIRST_DEVICETIME: number = 2;
  // 服务器返回多条数据，每条数据的内容如下：
  ACK_CLIENT_GET_HISTOR_FIRST_DEVICE: number = 0x200D;
  ACK_CLIENT_GET_HISTOR_FIRST_DEVICEID: number = 1;
  ACK_CLIENT_GET_HISTOR_FIRST_HISTORYTIME: number = 2; // 历史数据发生的时间
  ACK_CLIENT_GET_HISTOR_FIRST_HISTORYDATA: number = 3; // 历史数据的内容

  // 15.客户端获取第二级设备状态历史记录
  CLIENT_GET_HISTOR_SECOND_DEVICE: number = 0x100E;
  CLIENT_GET_HISTOR_SECOND_DEVICEID: number = 1;
  CLIENT_GET_HISTOR_SECOND_DEVICETIME: number = 2;
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
  SET_DEVICE_MODE: number = 2; // 优先方式：SMS\Call
  SET_DEVICE_PHONE1: number = 3;
  SET_DEVICE_PHONE2: number = 4; // 报警电话
  SET_DEVICE_Interval: number = 5; // 报警间隔： 数字，单位秒，如300 即 5分钟
  SET_DEVICE_ALARM: number = 6; // 一键告警 1为触发告警，0为取消告警（布防状态不变）
  SET_DEVICE_WIFI_SSID: number = 7; // app与设备配对后发送给设备wifi名
  SET_DEVICE_WIFI_PWD: number = 8; // wifi密码
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

  // 20.App设置别名等
  CLIENT_SET: number = 0x1015;
  CLIENT_SET_DEVICE_ID: number = 1; // 第一级告警设备ID
  CLIENT_SET_SECOND_DEVICE_ID: number = 2; // 第一级告警设备ID
  CLIENT_SET_DEVICE_NAME: number = 3; // 用户设置的别名
  // 回复
  ACK_CLIENT_SET: number = 0x2015;
  ACK_CLIENT_SET_SUCCESS: number = 1; // 设置成功回复1，失败回复0
  ACK_CLIENT_SET_ERRORINFO: number = 2;

  /****************通知名字 *********************/

  TT_LOGIN_NOTIFICATION_NAME :any = 'TT_LOGIN'//登录成功通知
  TT_REGISTED_NOTIFICATION_NAME :any = 'TT_REGISTED'//注册成功通知
  TT_CHAGEPASSWORD_NOTIFICATION_NAME :any = 'TT_CHANGEPASSWORD'//修改密码成功通知
  TT_EXIT_NOTIFICATION_NAME :any = 'TT_EXIT'//退出登录成功通知
  TT_RESETPASSWORD_NOTIFICATION_NAME :any = 'TT_RESETPASSWORD'//重置密码成功通知
  TT_ADDNORMALDEVECE_NOTIFICATION_NAME :any = 'TT_ADDNORMALDEVECE'//绑定普通设备成功
  TT_GETDEVICELIST_NOTIFICATION_NAME :any = 'TT_GETDEVICELIST'//获取设备列表成功


}
