import { weatherUrl, validReading } from "./weather.js";
import type { Place } from "./weather.js";
// Build embeds the small location directory and compiled browser assets.
declare const locations: Place[];
declare const assets: Record<string,[string,string]>;
const index = new Map(locations.map(p=>[p.id,p]));
const readings = new Map<string,{expires:number;data:unknown}>();
const json=(value:unknown,status=200,cache="no-store")=>Response.json(value,{status,headers:{"cache-control":cache}});
export default {
  async fetch(request:Request) {
    const url=new URL(request.url);
    if(request.method!=="GET") return new Response(null,{status:405,headers:{Allow:"GET"}});
    if(url.pathname==="/api/locations") return json(locations,200,"public, max-age=86400");
    if(url.pathname==="/api/weather"){
      const place=index.get(url.searchParams.get("place")??"");
      if(!place)return json({error:"unknown_location"},400);
      const cached=readings.get(place.id);
      if(cached && cached.expires>Date.now())return json(cached.data,200,"public, max-age=120");
      try{
        const response=await fetch(weatherUrl(place),{signal:AbortSignal.timeout(9000)});
        if(!response.ok) throw new Error("provider");
        const {current}=await response.json() as {current:Record<string,number>};
        if(!validReading(current)) throw new Error("reading");
        const data={place:place.id,current};
        readings.set(place.id,{expires:Date.now()+300000,data});
        return json(data,200,"public, max-age=120");
      }catch{return json({error:"weather_unavailable"},503);}
    }
    const asset=assets[url.pathname.replace(/\/$/,"")||"/"];
    if(!asset)return new Response("Not found",{status:404});
    return new Response(asset[1],{headers:{"content-type":asset[0],"cache-control":"no-cache","x-content-type-options":"nosniff"}});
  }
};
