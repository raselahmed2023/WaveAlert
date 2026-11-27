const hazards = { cold: "শৈত্যপ্রবাহ", flood: "বন্যা", drought: "খরা" };
const bulletins = [
  { hazard: "cold", district: "পঞ্চগড়", title: "তাপমাত্রা কমার সম্ভাবনা", summary: "এই কাল্পনিক বুলেটিনে রাতের তাপমাত্রা কমে যাওয়ার একটি পরিস্থিতি দেখানো হয়েছে।" },
  { hazard: "flood", district: "কুড়িগ্রাম", title: "নদীর পানি বৃদ্ধি", summary: "এই কাল্পনিক বুলেটিনে নদীতীরবর্তী নিচু এলাকায় পানি বাড়ার একটি পরিস্থিতি দেখানো হয়েছে।" },
  { hazard: "drought", district: "নওগাঁ", title: "দীর্ঘ সময় বৃষ্টির ঘাটতি", summary: "এই কাল্পনিক বুলেটিনে বৃষ্টির অভাবে কৃষিজমির মাটি শুকিয়ে যাওয়ার একটি পরিস্থিতি দেখানো হয়েছে।" }
];

const hazardSelect = document.querySelector("#hazard");
const districtSelect = document.querySelector("#district");
const template = document.querySelector("#bulletin");
const results = document.querySelector("#results");
const numberFormat = new Intl.NumberFormat("bn-BD");

for (const [value, label] of Object.entries(hazards)) {
  hazardSelect.add(new Option(label, value));
}
for (const district of [...new Set(bulletins.map(item => item.district))].sort((a, b) => a.localeCompare(b, "bn"))) {
  districtSelect.add(new Option(district, district));
}

function render() {
  const matches = bulletins.filter(item =>
    (!hazardSelect.value || item.hazard === hazardSelect.value) &&
    (!districtSelect.value || item.district === districtSelect.value)
  );
  results.replaceChildren();
  for (const item of matches) {
    const card = template.content.firstElementChild.cloneNode(true);
    card.dataset.hazard = item.hazard;
    card.querySelector(".type").textContent = hazards[item.hazard];
    card.querySelector("h2").textContent = item.title;
    card.querySelector(".place").textContent = item.district + " জেলা";
    card.querySelector(".summary").textContent = item.summary;
    results.append(card);
  }
  document.querySelector("#status").textContent = matches.length
    ? numberFormat.format(matches.length) + "টি নমুনা বুলেটিন"
    : "এই জেলা ও দুর্যোগের ধরনের জন্য কোনো নমুনা বুলেটিন নেই।";
}

hazardSelect.addEventListener("change", render);
districtSelect.addEventListener("change", render);
document.querySelector("#reset").addEventListener("click", () => {
  hazardSelect.value = "";
  districtSelect.value = "";
  render();
});
render();
