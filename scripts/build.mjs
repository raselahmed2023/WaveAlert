import { mkdir,readFile,writeFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
const read=path=>readFile(path,"utf8");
const compile=async path=>stripTypeScriptTypes(await read(path));
const assets={};
const html=await read("frontend/index.html");
for(const path of ["/","/alerts","/disasters","/map","/emergency","/workspace","/resources","/shelters"])
  assets[path]=["text/html; charset=utf-8",html];
for(const name of ["index","messages","workflow","weather"])
  assets["/"+name+".js"]=["text/javascript; charset=utf-8",(await compile("frontend/"+name+".ts")).replace("../backend/weather.js","/provider.js")];
assets["/style.css"]=["text/css; charset=utf-8",await read("frontend/style.css")];
assets["/sw.js"]=["text/javascript; charset=utf-8",await read("frontend/sw.js")];
const locations=JSON.parse(await read("backend/locations.json"));
const weather=await compile("backend/weather.ts");
assets["/provider.js"]=["text/javascript; charset=utf-8",weather];
const worker=(await compile("backend/worker.ts")).replace(/^import .*?from "\.\/weather.js";?$/m,"");
await mkdir("dist/server",{recursive:true});
await writeFile("dist/server/index.js",`const locations=${JSON.stringify(locations)};\nconst assets=${JSON.stringify(assets)};\n${weather}\n${worker}`);
