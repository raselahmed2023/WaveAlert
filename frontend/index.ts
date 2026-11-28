import { messages, DEFAULT_LOCALE } from "./messages.js";
import { stages, roles, nextStage } from "./workflow.js";
import type { Stage, Role } from "./workflow.js";
let locale: "bn" | "en" = localStorage.getItem("wave-language") === "en" ? "en" : DEFAULT_LOCALE;
const t = (bn:string,en:string) => locale === "bn" ? bn : en;
const app = document.querySelector<HTMLElement>("#app")!;
const routes = [["/","হোম","Home"],["/alerts","সতর্কতা","Alerts"],["/disasters","দুর্যোগ","Hazards"],["/map","এলাকা","Areas"],["/shelters","আশ্রয়","Shelters"],["/emergency","সাহায্য","Assistance"],["/resources","তথ্যসূত্র","Resources"],["/workspace","কর্মক্ষেত্র","Workspace"]];
const areas = [["কুড়িগ্রাম","Kurigram"],["রাজশাহী","Rajshahi"],["পঞ্চগড়","Panchagarh"]];
const hazards = [["বন্যা","Flood"],["খরা","Drought"],["শৈত্যপ্রবাহ","Cold wave"]];
const notes = [["নদীর পানি বৃদ্ধির নমুনা প্রতিবেদন।","Sample report of rising river levels."],["কম বৃষ্টির নমুনা পর্যবেক্ষণ।","Sample observation of low rainfall."],["তাপমাত্রা কমার নমুনা পর্যবেক্ষণ।","Sample observation of falling temperatures."]];
const stateLabels = [["জমা হয়েছে","Submitted"],["যাচাই হয়েছে","Verified"],["দায়িত্ব দেওয়া হয়েছে","Assigned"],["সহায়তা চলছে","In progress"],["সহায়তা দেওয়া হয়েছে","Assisted"],["সম্পন্ন","Closed"]];
const roleNames = [["স্বেচ্ছাসেবক","Volunteer"],["উদ্ধার সমন্বয়কারী","Rescue Coordinator"],["এনজিও","NGO"],["সরকারি কর্তৃপক্ষ","Government Authority"],["সুপার অ্যাডমিন","Super Admin"]];
const tr=(pair:string[])=>pair[locale==="bn"?0:1];
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
type Entry={id:string,area:number,hazard:number,detail:string,kind:string,stage:Stage,assignee?:string};
const key="wave-drill-cases-v1";
function entries():Entry[]{return JSON.parse(localStorage.getItem(key)??"[]");}
const opts=(items:string[][],selected:number)=>items.map((p,i)=>`<option value="${i}" ${i===selected?"selected":""}>${tr(p)}</option>`).join("");
let district=-1, role:Role="RESCUE_COORDINATOR",receipt="";
const filter=()=>`<label>${t("জেলা","District")}<select id="district"><option value="-1">${t("সব জেলা","All districts")}</option>${opts(areas,district)}</select></label>`;
function cards(){return '<div class="cards">'+areas.map((a,i)=>district!==-1&&district!==i?"":`<article><small>${tr(a)}</small><h2>${tr(hazards[i])}</h2><div class="badge">${t("মহড়ার বুলেটিন","Drill bulletin")}</div><p>${tr(notes[i])}</p><a href="/emergency?area=${i}">${t("নমুনা প্রতিবেদন দিন","File a drill report")} →</a></article>`).join("")+'</div>';}
function emergency(){const i=Number(new URLSearchParams(location.search).get("area")??0);return `<h1>${t("সহায়তা ও প্রতিবেদন","Assistance and reports")}</h1><p>${t("শুধু কাল্পনিক তথ্য দিন। অনুরোধ এই ব্রাউজারেই থাকবে।","Use fictional details. Requests stay in this browser.")}</p><form id="report"><label>${t("ধরন","Type")}<select name="kind"><option value="sos">SOS</option><option value="report">${t("স্থানীয় প্রতিবেদন","Community report")}</option></select></label><label>${t("জেলা","District")}<select name="area">${opts(areas,i)}</select></label><label>${t("দুর্যোগ","Hazard")}<select name="hazard">${opts(hazards,i)}</select></label><label>${t("কী ঘটেছে?","What happened?")}<textarea name="detail" required maxlength="500" rows="3"></textarea></label><button>${t("মহড়ার অনুরোধ জমা দিন","Submit drill request")}</button></form><output aria-live="polite">${receipt?t("জমা হয়েছে","Received")+" · "+esc(receipt):""}</output><a href="/workspace">${t("অনুরোধের অগ্রগতি দেখুন","Track drill requests")}</a>`;}
function workspace(){return `<h1>${t("মহড়ার কর্মক্ষেত্র","Response workspace")}</h1><p>${t("একই ডিভাইসে ভূমিকা বদলে মহড়া চালান।","Switch roles on this device to rehearse a response.")}</p><label>${t("মহড়ার ভূমিকা","Practice role")}<select id="role">${opts(roleNames,roles.indexOf(role))}</select></label>`+ (entries().length?entries().reverse().map(e=>{
const next=nextStage(e.stage,role);
return `<article><small>${esc(e.id)} · ${e.kind==="sos"?"SOS":t("প্রতিবেদন","Report")}</small><h2>${tr(areas[e.area])} · ${tr(hazards[e.hazard])}</h2><p>${esc(e.detail)}</p><p>${tr(stateLabels[stages.indexOf(e.stage)])}${e.assignee?" · "+esc(e.assignee):""}</p>${next?`<form class="advance" data-id="${esc(e.id)}">${next==="assigned"?`<label>${t("স্বেচ্ছাসেবকের ছদ্মনাম","Volunteer alias")}<input name="alias" maxlength="40" required></label>`:""}<button>${t("পরবর্তী ধাপ","Move to")} · ${tr(stateLabels[stages.indexOf(next)])}</button></form>`:""}</article>`;}).join(""):`<p class="panel">${t("এখনো কোনো অনুরোধ নেই।","No drill requests yet.")} <a href="/emergency">${t("অনুরোধ তৈরি করুন","Create a request")}</a></p>`);}
function render(){
const path=location.pathname.replace(/\/$/,"")||"/";
document.documentElement.lang=locale;
const lang=document.querySelector<HTMLButtonElement>("#lang")!;lang.textContent=t("English","বাংলা");lang.lang=t("en","bn");
document.querySelector("nav")!.innerHTML=routes.map(([url,bn,en])=>`<a href="${url}" ${path===url?'aria-current="page"':""}>${t(bn,en)}</a>`).join("");
let body="";
if(path==="/") body=`<section class="hero"><h1>${t("আপনার এলাকার দুর্যোগ পরিস্থিতি","Your district’s hazard outlook")}</h1><p>${t("বন্যা, খরা ও শৈত্যপ্রবাহের নমুনা বার্তা দেখুন এবং স্থানীয় সহায়তা সমন্বয়ের মহড়া দিন।","Explore flood, drought and cold-wave bulletins and practise coordinating local assistance.")}</p><a class="cta" href="/emergency">${t("সাহায্যের অনুরোধ","Request assistance")} →</a></section><h2>${t("জেলার বুলেটিন","District bulletins")}</h2>`+filter()+cards();
else if(["/alerts","/disasters","/map"].includes(path))body=`<h1>${t(...(routes.find(r=>r[0]===path)!.slice(1) as [string,string]))}</h1>`+filter()+cards();
else if(path==="/emergency")body=emergency();
else if(path==="/workspace")body=workspace();
else if(path==="/shelters")body=`<h1>${t("আশ্রয়কেন্দ্র","Shelters")}</h1><p class="panel">${t("এখনো কোনো যাচাইকৃত আশ্রয়কেন্দ্র যুক্ত হয়নি।","No verified shelters have been added yet.")}</p>`;
else if(path==="/resources")body=`<h1>${t("তথ্যসূত্র","Information sources")}</h1><article><a href="https://ffwc.gov.bd/">${t("বন্যা পূর্বাভাস ও সতর্কীকরণ কেন্দ্র","Flood Forecasting and Warning Centre")}</a></article><article><a href="https://bmd.gov.bd/">${t("বাংলাদেশ আবহাওয়া অধিদপ্তর","Bangladesh Meteorological Department")}</a></article>`;
else body='<h1>404</h1><a href="/">WaveAlert</a>';
app.innerHTML=`<div class="notice">${messages[locale].demo} · ${t("বাস্তব সাহায্য পাঠানো হয় না","No emergency dispatch")}</div>`+body;
document.querySelector("footer")!.textContent=t("WaveAlert · বাংলাদেশ","WaveAlert · Bangladesh");
document.querySelector("#district")?.addEventListener("change",e=>{district=Number((e.target as HTMLSelectElement).value);render();document.querySelector<HTMLElement>("#district")?.focus();});
document.querySelector("#role")?.addEventListener("change",e=>{role=roles[Number((e.target as HTMLSelectElement).value)];render();document.querySelector<HTMLElement>("#role")?.focus();});
}
document.querySelector("#lang")!.addEventListener("click",()=>{locale=locale==="bn"?"en":"bn";localStorage.setItem("wave-language",locale);render();});
app.addEventListener("submit",event=>{
event.preventDefault();const form=event.target as HTMLFormElement,data=new FormData(form),all=entries();
if(form.id==="report"){const detail=String(data.get("detail")).trim();if(!detail)return;
receipt=crypto.randomUUID().slice(0,8).toUpperCase();all.push({id:receipt,kind:String(data.get("kind")),area:Number(data.get("area")),hazard:Number(data.get("hazard")),detail,stage:"submitted"});}
else {const entry=all.find(e=>e.id===form.dataset.id);if(!entry)return;const next=nextStage(entry.stage,role);if(!next)return;if(next==="assigned"){const alias=String(data.get("alias")??"").trim();if(!alias)return;entry.assignee=alias;}entry.stage=next;}
localStorage.setItem(key,JSON.stringify(all));render();
});
window.addEventListener("storage",render);render();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{ /* Online use remains available. */ });
