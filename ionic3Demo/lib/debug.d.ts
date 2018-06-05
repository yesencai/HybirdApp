// Type definitions for debug.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * 日志发送函数脚本文件
 */
export declare var LogServerConnected : boolean;

/**
 * 
 */
declare interface DebugLogInit {
		
	/**
	 * 
	 * @return  
	 */
	new (): DebugLogInit;
}


/**
 * 
 * @param info 
 */
declare function writeToScreen(info : string): void;

/**
 * 
 * @param evt 
 */
declare function onLogOpen(evt : any): void;

/**
 * 
 * @param evt 
 */
declare function onLogClose(evt : any): void;

/**
 * 
 * @param evt 
 */
declare function onLogMessage(evt : any): void;

/**
 * 
 * @param evt 
 */
declare function onLogError(evt : any): void;

/**
 * 
 */
declare interface SendLogText {
		
	/**
	 * 
	 * @param message 
	 * @return  
	 */
	new (message : any): SendLogText;
}


/**
 * 
 */
declare namespace websocket{
		
	/**
	 * 
	 * @param evt 
	 */
	function onopen(evt : any): void;
		
	/**
	 * 
	 * @param evt 
	 */
	function onclose(evt : any): void;
		
	/**
	 * 
	 * @param evt 
	 */
	function onmessage(evt : any): void;
		
	/**
	 * 
	 * @param evt 
	 */
	function onerror(evt : any): void;
}
