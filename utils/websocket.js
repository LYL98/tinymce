let url;
switch (process.env.NODE_ENV) {
  case "development":
    url = "ws://10.10.58.30:5600/api";
    break;
  case "test":
    url = "wss://test.hoppolink.com:9090/websocket/api";
    break;
  default:
    // url = "wss://www.hoppolink.com/api";
    url = "wss://kube.hoppolink.com/ecoweb";

    break;
}
const WSS_URL = `${url}/socketServer/${localStorage.getItem("userId")}`;
let Socket = "";
let setIntervalWesocketPush = null;
/** 建立连接 */
export function createSocket() {
  if (!Socket) {
    console.log("建立websocket连接");
    Socket = new WebSocket(WSS_URL);
    Socket.onopen = onopenWS;
    Socket.onmessage = onmessageWS;
    Socket.onerror = onerrorWS;
    Socket.onclose = oncloseWS;
  } else {
    console.log("websocket已连接");
  }
}
/** 打开WS之后发送心跳 */
export function onopenWS() {
  sendPing(); // 发送心跳
}
/** 连接失败重连 */
export function onerrorWS() {
  clearInterval(setIntervalWesocketPush);
  Socket.close();
  createSocket(); // 重连
}
/** WS数据接收统一处理 */
export function onmessageWS(e) {
  window.dispatchEvent(
    new CustomEvent("onmessageWS", {
      detail: {
        data: e
      }
    })
  );
}
/** 关闭WS */
export function oncloseWS() {
  clearInterval(setIntervalWesocketPush);
  // Socket.close()
  // Socket = ''
  console.log("websocket已断开");
}
/** 发送心跳 */
export function sendPing() {
  Socket.send("");
  setIntervalWesocketPush = setInterval(() => {
    let data = [{ type: "ping" }];
    Socket.send(JSON.stringify(data));
  }, 60000);
}
