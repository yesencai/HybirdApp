// // Type definitions for common.js
// // Project: [LIBRARY_URL_HERE] 
// // Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// // Definitions: https://github.com/borisyankov/DefinitelyTyped


// /**
//  * 解析收到的数据
//  * @param DataStr 
//  * @param FieldID 
//  * @return  
//  */
// declare function getParsingValue(DataStr : any, FieldID : any): string;

// /**
//  * 通过主页面发送字符串数据包，本函数只能在子页面中调用，不能在主页面调用，否则会出错
//  */
// declare function SendStrByParent(DstType : any, DstID : any, StrPack : any): number;


// /**
//  * 对把参数打包成“长度+ID+参数值”的格式
//  */
// declare function MakeParam (ParamID : any, ParamValue : any): string;


// /**
//  * 把数据包ID转换为四位16进制字符串
//  */
// declare function MakeHeader (PackaID : any): string;


// /**
//  * 
//  * @param phoneInput 
//  * @return  
//  */
// declare function isPoneAvailable(phoneInput : any): boolean;

// /**
//  * 解析页面传值函数
//  */
// declare function GetQueryString (name : any): any;


export declare class Common {
    GetQueryString(name : any):any;
    isPoneAvailable(phoneInput : any):boolean
    MakeHeader (PackaID : any): string;
    MakeParam (ParamID : any, ParamValue : any): string;
    SendStrByParent(DstType : any, DstID : any, StrPack : any): number;
    getParsingValue(DataStr : any, FieldID : any): string;
}
