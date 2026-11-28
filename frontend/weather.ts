import { weatherUrl, validReading } from "../backend/weather.js";
import type { Place } from "../backend/weather.js";
type Current = {time:number;temperature_2m:number;weather_code:number;is_day:number;precipitation:number;relative_humidity_2m:number;wind_speed_10m:number};
const names = {
 clear:["পরিষ্কার আকাশ","Clear sky"], partial:["আংশিক মেঘলা","Partly cloudy"], cloud:["মেঘাচ্ছন্ন","Overcast"],
 fog:["কুয়াশা","Fog"], drizzle:["গুঁড়ি গুঁড়ি বৃষ্টি","Drizzle"], rain:["বৃষ্টি","Rain"], snow:["তুষারপাত","Snow"],
 storm:["বজ্রঝড়","Thunderstorm"], unknown:["আবহাওয়ার তথ্য","Weather conditions"]
};
export function skyType(code:number):keyof typeof names {
  if(code===0)return "clear";
  if(code===1||code===2)return "partial";
  if(code===3)return "cloud";
  if(code===45||code===48)return "fog";
  if([51,53,55,56,57].includes(code))return "drizzle";
  if([61,63,65,66,67,80,81,82].includes(code))return "rain";
  if([71,73,75,77,85,86].includes(code))return "snow";
  if([95,96,99].includes(code))return "storm";
  return "unknown";
}
let catalogue:Place[]|undefined;
let dispose=()=>{};
export function mountWeather(root:HTMLElement, locale:"en"|"bn"){
  dispose();
  const lifecycle=new AbortController();
  let request:AbortController|undefined;
  let interval:ReturnType<typeof setInterval>|undefined;
  dispose=()=>{lifecycle.abort();request?.abort();clearInterval(interval);};
  const t=(bn:string,en:string)=>locale==="bn"?bn:en;
  const label=(p:Place)=>p[locale];
  const digits=new Intl.NumberFormat(locale==="bn"?"bn-BD":"en-BD",{maximumFractionDigits:1});
  const clock=new Intl.DateTimeFormat(locale==="bn"?"bn-BD":"en-GB",{timeZone:"Asia/Dhaka",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});
  root.innerHTML=`<section class="weather" data-sky="unknown"><div class="atmosphere" aria-hidden="true"><i class="orb"></i><i class="cloud c1"></i><i class="cloud c2"></i><i class="fall"></i></div><div class="forecast"><h1>${t("আপনার এলাকার আবহাওয়া","Weather in your area")}</h1><div class="pickers"></div><div class="reading" aria-live="polite"></div><button type="button" class="refresh">${t("হালনাগাদ করুন","Refresh weather")}</button><small><a href="https://open-meteo.com/">Open-Meteo</a> · ${t("মডেলভিত্তিক আবহাওয়া","Model-based weather")}</small></div></section>`;
  const section=root.querySelector<HTMLElement>(".weather")!,pickers=root.querySelector<HTMLElement>(".pickers")!,reading=root.querySelector<HTMLElement>(".reading")!;
  const button=root.querySelector<HTMLButtonElement>(".refresh")!;
  let selected:Place|undefined;
  async function refresh(){
    request?.abort();
    const active=new AbortController();request=active;
    button.disabled=true;section.dataset.sky="unknown";delete section.dataset.night;
    reading.textContent=t("আবহাওয়া লোড হচ্ছে…","Loading weather…");
    const place=selected;
    if(!place)return;
    try{
      let c:Current;
      try {
        const result=await fetch("/api/weather?place="+encodeURIComponent(place.id),{signal:active.signal,cache:"no-store"});
        if(!result.ok)throw new Error();
        const payload=await result.json();
        if(payload.place!==place.id || !validReading(payload.current))throw new Error();
        c=payload.current;
      }catch(error){
        if(active.signal.aborted)throw error;
        const direct=await fetch(weatherUrl(place),{signal:AbortSignal.any([active.signal,AbortSignal.timeout(10000)])});
        if(!direct.ok)throw new Error();
        const {current}=await direct.json();
        if(!validReading(current))throw new Error();
        c=current;
      }
      const sky=skyType(c.weather_code);
      if(active.signal.aborted)return;
      section.dataset.sky=sky;section.dataset.night=String(!c.is_day);
      reading.replaceChildren();
      const heading=document.createElement("h2");heading.textContent=label(place);
      const temp=document.createElement("strong");temp.textContent=digits.format(c.temperature_2m)+"°C";
      const condition=document.createElement("p");condition.textContent=names[sky][locale==="bn"?0:1];
      const details=document.createElement("div");details.className="wxmetrics";
      for(const [name,value] of [[t("আর্দ্রতা","Humidity"),digits.format(c.relative_humidity_2m)+"%"],[t("বাতাস","Wind"),digits.format(c.wind_speed_10m)+t(" কিমি/ঘণ্টা"," km/h")],[t("বৃষ্টিপাত","Precipitation"),digits.format(c.precipitation)+t(" মিমি"," mm")]]){
        const metric=document.createElement("div");const title=document.createElement("small");title.textContent=name;const amount=document.createElement("b");amount.textContent=value;metric.append(title,amount);details.append(metric);
      }
      const stamp=document.createElement("small");stamp.textContent=t("তথ্যের সময় · ","Conditions at · ")+clock.format(c.time*1000)+t(" (বাংলাদেশ সময়)"," (Dhaka time)");
      reading.append(heading,temp,condition,details,stamp);
    }catch{if(!active.signal.aborted)reading.textContent=label(place)+" · "+t("বর্তমান আবহাওয়া পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।","Current weather is unavailable. Please retry.");}
    finally{if(!active.signal.aborted)button.disabled=false;}
  }
  async function init(){
    button.disabled=true;
    try{
      if(!catalogue){const response=await fetch("/api/locations",{signal:lifecycle.signal});if(!response.ok)throw new Error();catalogue=await response.json();}
      if(lifecycle.signal.aborted||!catalogue)return;
      const list=catalogue;
      const find=(id:string|null)=>list.find(p=>p.id===id);
      function select(place:Place,focus?:number){
        selected=place;localStorage.setItem("wave-weather-place",place.id);
        const chain:Place[]=[place];let parent=find(place.parent);
        while(parent){chain.unshift(parent);parent=find(parent.parent);}
        pickers.replaceChildren();
        [t("বিভাগ","Division"),t("জেলা","District"),t("উপজেলা","Upazila")].forEach((name,level)=>{
          const group=document.createElement("label");group.textContent=name;
          const select=document.createElement("select");const ancestor=chain[level-1];
          const children=list.filter(p=>p.parent===(level===0?"":ancestor?.id)).sort((a,b)=>label(a).localeCompare(label(b),locale));
          if(level)select.add(new Option(t("ঐচ্ছিক","Optional"),""));
          for(const child of children)select.add(new Option(label(child),child.id));
          select.value=chain[level]?.id??"";select.disabled=!children.length;
          select.onchange=()=>{const next=find(select.value)||ancestor;if(next)choose(next,level);};
          group.append(select);pickers.append(group);if(focus===level)select.focus();
        });
      }
      function choose(place:Place,focus?:number){select(place,focus);void refresh();}
      choose(find(localStorage.getItem("wave-weather-place"))||list.find(p=>p.en==="Dhaka"&&!p.parent)||list[0]);
      button.onclick=refresh;
      interval=setInterval(()=>{if(!document.hidden)void refresh();},15*60*1000);
    }catch{if(!lifecycle.signal.aborted){reading.textContent=t("এলাকার তালিকা পাওয়া যায়নি।","Location directory unavailable.");button.disabled=false;button.onclick=init;}}
  }
  void init();
}
