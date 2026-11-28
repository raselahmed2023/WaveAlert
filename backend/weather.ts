export type Place = { id:string; parent:string; bn:string; en:string; lat:number; lon:number };
export const fields = ["temperature_2m","relative_humidity_2m","wind_speed_10m","precipitation","weather_code","is_day"] as const;
export function weatherUrl(place:Place) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({latitude:String(place.lat),longitude:String(place.lon),current:fields.join(","),timeformat:"unixtime",timezone:"Asia/Dhaka"}).toString();
  return url;
}
export function validReading(value:unknown, now = Date.now()) {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string,unknown>;
  return [...fields,"time"].every(key=>typeof data[key]==="number" && Number.isFinite(data[key]))
    && Number(data.time)*1000 > now-3*3600000 && Number(data.time)*1000 <= now+900000;
}
