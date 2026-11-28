import http from "node:http";
import worker from "../dist/server/index.js";
const port=Number(process.env.PORT || 8080);
http.createServer(async(req,res)=>{
  try{
    const result=await worker.fetch(new Request(new URL(req.url,"http://localhost"),{method:req.method}));
    res.writeHead(result.status,Object.fromEntries(result.headers));
    res.end(Buffer.from(await result.arrayBuffer()));
  }catch{res.writeHead(500);res.end();}
}).listen(port,()=>console.log(`WaveAlert listening on http://localhost:${port}`));
