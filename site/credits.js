(function () {
  if (document.documentElement.classList.contains("demo")) return;
  var zh = /^zh/.test(document.documentElement.lang || "");
  var css = ".credits{max-width:1060px;margin:28px auto 36px;padding:0 16px;border-top:0;font-size:13px;line-height:1.5;color:var(--mut,#5a6168)}"
    + ".credits h2{margin:0 0 8px;padding-top:12px;border-top:1px solid var(--ink,#14171a);font-size:15px;font-weight:700;letter-spacing:0;text-transform:none;color:var(--ink,#14171a)}.credits p{margin:0 0 8px;max-width:78ch}.credits a{color:inherit}.credits summary{cursor:pointer;color:var(--link,#0a55a3);margin:4px 0 8px}.credits details[open] summary{margin-bottom:8px}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  var A = function (u, t) { return '<a href="' + u + '" target="_blank" rel="noopener">' + t + "</a>"; };
  var cc = A("https://creativecommons.org/licenses/by/4.0/", "CC BY 4.0");
  var en = [
    "The ECMWF forecasts are the IFS and AIFS ensembles and the archived ensembles from TIGGE. This service is based on data and products of the European Centre for Medium-Range Weather Forecasts (ECMWF), "
      + A("https://www.ecmwf.int", "www.ecmwf.int") + ". This ECMWF data is published under a Creative Commons Attribution 4.0 International (" + cc + "). "
      + "They are modified here into Hong Kong signal chances, wind estimates and charts. ECMWF does not accept any liability whatsoever for any error or omission in the data, their availability, or for any loss or damage arising from their use.",
    "Past Google DeepMind Weather Lab cyclone forecasts are used under " + cc + ". Live ones are used under Google's "
      + A("https://storage.googleapis.com/weathernext-public/terms-of-use.pdf", "experimental-data terms") + " and are shown as signal chances only. They are modified here in the same way. Google is not involved in this site.",
    "The Pangu-Weather re-forecasts come from WeatherBench 2 and start from ERA5. Contains modified Copernicus Climate Change Service information.",
    "ERA5 is used for past storms before 2008. Contains modified Copernicus Climate Change Service information (2026). Neither the European Commission nor ECMWF is responsible for any use that may be made of the Copernicus information or data it contains.",
    "The NOAA Global Ensemble Forecast System (GEFS) Re-forecast was accessed in 2026 from " + A("https://registry.opendata.aws/noaa-gefs-reforecast", "registry.opendata.aws/noaa-gefs-reforecast") + ". It is modified here in the same way. NOAA is not involved in this site.",
    "Station winds for some storms before 2008 come from the tables in Chinese Wikipedia's articles (" + A("https://zh.wikipedia.org", "zh.wikipedia.org") + "), by Wikipedia's contributors, under " + A("https://creativecommons.org/licenses/by-sa/4.0/", "CC BY-SA 4.0") + ".",
    "The Hong Kong Observatory's best tracks, warning signals and station winds were used to check and set up the forecasts. The signal shown as in force on the forecast page is read from HKO's open data on <a href=\"https://data.gov.hk/en/\">DATA.GOV.HK</a> and used under the DATA.GOV.HK terms, and the data belong to the Government of the Hong Kong SAR. The Hong Kong Observatory is the only authority for actual signals. This site is research output and is not endorsed by any of the organisations above."
  ];
  var zhs = "本網站使用以下機構提供的預報數據，推算香港天文台發出各號熱帶氣旋警告信號的機會，並製作相關圖表。這些機構均未參與本網站的製作，亦不代表認可本網站。所有熱帶氣旋警告信號均以香港天文台的正式公布為準。";
  var f = document.createElement("footer"); f.className = "credits"; f.setAttribute("aria-label", "Data and credits");
  var P = function (s) { return '<p lang="en" translate="no" class="cr">' + s + "</p>"; };
  var sum = zh ? "<p>" + zhs + "時間均為香港時間。</p>"
    : "<p>Times are Hong Kong time. Data come from ECMWF, Google DeepMind, NOAA, Copernicus and the Hong Kong Observatory. This site is research output and is not endorsed by any of them.</p>";
  var open1 = "This service is based on data and products of the European Centre for Medium-Range Weather Forecasts (ECMWF), "
    + A("https://www.ecmwf.int", "www.ecmwf.int") + ". Contains modified Copernicus Climate Change Service information (2026).";
  f.innerHTML = "<h2>" + (zh ? "資料來源及鳴謝" : "Data and credits") + "</h2>" + sum + P(open1)
    + "<details><summary>" + (zh ? "其他鳴謝及授權" : "More credits and licences") + "</summary>" + [en[0], en[2], en[3], en[1], en[4], en[5], en[6]].map(P).join("") + "</details>";
  var go = function () { var w = document.querySelector(".wrap"), mw = w ? getComputedStyle(w).maxWidth : "";
    if (/px$/.test(mw)) { f.style.maxWidth = mw; f.style.paddingLeft = f.style.paddingRight = "16px" } document.body.appendChild(f); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
