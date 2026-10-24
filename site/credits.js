// DATA AND CREDITS footer on every page (2026-10-17, user: 'do we need to do these for IFS and AIFS (credit them)'): the attribution the
// data licences ask for, shown prominently. ECMWF open data (IFS, AIFS) and ECMWF's archived ensembles (TIGGE): CC BY 4.0, wording from
// apps.ecmwf.int/datasets/licences/general (service based on ECMWF data + source + licence + disclaimer + modification notice);
// Google DeepMind Weather Lab: CC BY 4.0 for past forecasts, live ones under Google's experimental-data terms; Pangu-Weather re-forecasts
// start from ERA5 (Copernicus); observations from the Hong Kong Observatory. Licence wording stays in English on the Chinese pages.
(function () {
  if (document.documentElement.classList.contains("demo")) return;                  // not inside the tour's frames
  var zh = /^zh/.test(document.documentElement.lang || "");
  var css = ".credits{max-width:1060px;margin:28px auto 36px;padding:16px 16px 0;border-top:1px solid var(--line,#d3dbe2);font-size:13px;line-height:1.55;color:var(--mut,#55636f)}"
    + ".credits h2{margin:0 0 6px;font-size:14px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}.credits p{margin:0 0 8px;max-width:none}.credits a{color:inherit}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  var A = function (u, t) { return '<a href="' + u + '" target="_blank" rel="noopener">' + t + "</a>"; };
  var cc = A("https://creativecommons.org/licenses/by/4.0/", "CC BY 4.0");
  var en = [
    "<b>ECMWF</b> (IFS and AIFS ensembles; archived ensembles via TIGGE): This service is based on data and products of the European Centre for Medium-Range Weather Forecasts (ECMWF), "
      + A("https://www.ecmwf.int", "www.ecmwf.int") + ". This ECMWF data is published under a Creative Commons Attribution 4.0 International (" + cc + "). "
      + "Modified here: turned into Hong Kong signal chances, wind estimates and charts. ECMWF does not accept any liability whatsoever for any error or omission in the data, their availability, or for any loss or damage arising from their use.",
    "<b>Google DeepMind</b> Weather Lab cyclone forecasts: past forecasts under " + cc + "; live ones under Google's "
      + A("https://storage.googleapis.com/weathernext-public/terms-of-use.pdf", "experimental-data terms") + " (shown as signal chances only). Modified here as above. Google is not involved in this site.",
    "<b>Pangu-Weather</b> re-forecasts (via WeatherBench 2), started from ERA5: contains modified Copernicus Climate Change Service information.",
    "<b>Hong Kong Observatory</b>: best tracks, tropical cyclone warning signals and station winds used to check and set up the forecasts. The Hong Kong Observatory is the only authority for actual signals; this site is research output and is not endorsed by any of the organisations above."
  ];
  var zhs = "本網站的預測數據來自以下機構，經本網站處理成香港信號機會率等資料；以下各機構並無參與或認可本網站。熱帶氣旋警告信號以香港天文台發出者為準。";
  var f = document.createElement("footer"); f.className = "credits"; f.setAttribute("aria-label", "Data and credits");
  f.innerHTML = "<h2>" + (zh ? "資料來源及鳴謝" : "Data and credits") + "</h2>" + (zh ? "<p>" + zhs + "</p>" : "")
    + en.map(function (s) { return '<p lang="en" translate="no" class="cr">' + s + "</p>"; }).join("");
  var go = function () { document.body.appendChild(f); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
