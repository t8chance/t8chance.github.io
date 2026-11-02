(function(){
"use strict";
const STORM={"Champi":"薔琵","Chanthu":"燦都","Dianmu":"電母","Fanapi":"凡亞比","Jebi":"飛燕","Mawar":"瑪娃","Megi":"鮎魚","Mujigae":"彩虹","Neoguri":"浣熊","Nock-Ten":"洛坦","Pabuk":"帕布","Rammasun":"威馬遜","Rumbia":"溫比亞","Sarika":"莎莉嘉","Soudelor":"蘇迪羅","Trami":"潭美","Yinxing":"銀杏","Barijat":"百里嘉","Bebinca":"貝碧嘉","Cempaka":"查帕卡","Chaba":"暹芭","Danas":"丹娜絲","Doksuri":"杜蘇芮","Ewiniar":"艾雲尼","Fengshen":"風神","Fung-wong":"鳳凰","Fung-Wong":"鳳凰","Goni":"天鵝","Hagupit":"黑格比","Haima":"海馬","Hato":"天鴿","Higos":"海高斯","Kai-Tak":"啟德","Kajiki":"劍魚","Kalmaegi":"海鷗","Kammuri":"北冕","Khanun":"卡努","Koinu":"小犬","Kompasu":"圓規","Koppu":"巨爵","Linfa":"蓮花","Lionrock":"獅子山","Lupit":"盧碧","Ma-On":"馬鞍","Maliksi":"馬力斯","Mangkhut":"山竹","Matmo":"麥德姆","Maysak":"美莎克","Merbok":"苗柏","Mitag":"米娜","Molave":"莫拉菲","Mulan":"木蘭","Nalgae":"尼格","Nangka":"浪卡","Nesat":"納沙","Nida":"妮妲","Nongfa":"藍湖","Noul":"紅霞","Nuri":"鸚鵡","Pakhar":"帕卡","Podul":"楊柳","Ragasa":"樺加沙","Roke":"洛克","Saola":"蘇拉","Saudel":"沙德爾","Sinlaku":"森拉克","Son-Tinh":"山神","Talim":"泰利","Tapah":"塔巴","Toraji":"桃芝","Usagi":"天兔","Utor":"尤特","Vicente":"韋森特","Wipha":"韋帕","Wutip":"蝴蝶","Yagi":"摩羯","Yutu":"玉兔"};
const NO={"1":"一號","3":"三號","8":"八號","9":"九號","10":"十號"};
const MON={Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
const MONF={January:1,February:2,March:3,April:4,May:5,June:6,July:7,August:8,September:9,October:10,November:11,December:12};
const DOW={Mon:"一",Tue:"二",Wed:"三",Thu:"四",Fri:"五",Sat:"六",Sun:"日"};
const ST={"Cheung Chau":"長洲","Chek Lap Kok":"赤鱲角","Kai Tak":"啟德","Lau Fau Shan":"流浮山","Sai Kung":"西貢","Sha Tin":"沙田","Ta Kwu Ling":"打鼓嶺","Tsing Yi":"青衣"};
const WI={"very strong":"甚強","light":"輕微","fresh":"清勁","strong":"強","extreme":"極強"};
const M3="(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)", DW="(Mon|Tue|Wed|Thu|Fri|Sat|Sun)";
const SN=Object.keys(STORM).sort((a,b)=>b.length-a.length).map(s=>s.replace(/[-]/g,"\\-")).join("|");
const RE_SY=new RegExp("\\b("+SN+") (\\d{4})\\b","g"), RE_S=new RegExp("\\b("+SN+")\\b","g");
function G(s){
 s=s.replace(/\bHKO No\.[\s\u00a0](\d+) on (.+)$/,(m,n,dt)=>`天文台於${dt}發出${NO[n]}信號`).replace(/\bno HKO signal\b/g,"天文台沒有發出信號");
 s=s.replace(/\bUnnamed (storm|depression) \((\w{3})\) (\d{4})/g,(m,k,M,y)=>`${y}年${MON[M]||M}月的未命名熱帶${k==="storm"?"風暴":"低氣壓"}`)
    .replace(/\bUnnamed (storm|depression)\b/g,(m,k)=>`未命名熱帶${k==="storm"?"風暴":"低氣壓"}`)
    .replace(/\bTyphoon (\w[\w-]*)/g,"颱風$1").replace(RE_SY,(m,n,y)=>`${STORM[n]}（${y}）`).replace(RE_S,(m,n)=>STORM[n])
    .replace(new RegExp(DW+" (\\d{1,2}) "+M3+"\\b","g"),(m,d,n,M)=>`${MON[M]}月${n}日（${DOW[d]}）`)
    .replace(new RegExp("\\b(\\d{1,2}) "+M3+" (\\d{4})\\b","g"),(m,n,M,y)=>`${y}年${MON[M]}月${n}日`)
    .replace(new RegExp("\\b(\\d{1,2})–(\\d{1,2}) "+M3+"\\b","g"),(m,a,b,M)=>`${MON[M]}月${a}至${b}日`)
    .replace(new RegExp("\\b(\\d{1,2}) "+M3+"–(\\d{1,2}) "+M3+"\\b","g"),(m,a,M,b,N)=>`${MON[M]}月${a}日至${MON[N]}月${b}日`)
    .replace(new RegExp("\\b(\\d{1,2}) "+M3+"\\b","g"),(m,n,M)=>`${MON[M]}月${n}日`)
    .replace(new RegExp("\\b"+M3+" (\\d{4})\\b","g"),(m,M,y)=>`${y}年${MON[M]}月`)
    .replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})\b/g,(m,M,y)=>`${y}年${MONF[M]}月`)
    .replace(new RegExp(DW+" (\\d{1,2})\\b","g"),(m,d,n)=>`${n}日（${DOW[d]}）`)
    .replace(/\bNo\.[\s\u00a0](8) and (9)\b/g,"八號及九號").replace(/\bNo\.[\s\u00a0](10|1|3|8|9)\b/g,(m,n)=>NO[n])
    .replace(/\bHKT\b/g,"香港時間").replace(/\bHK time\b/g,"香港時間").replace(/ → /g," 至 ");
 for(const k in ST) s=s.split(k).join(ST[k]);
 s=s.replace(/\(F(\d+) or less\)/g,"（$1級或以下）").replace(/≤\s?F(\d+)/g,"$1級或以下").replace(/\bF(\d+)–(\d+)\b/g,"$1至$2級").replace(/\bF(\d+)\b/g,"$1級")
    .replace(/(\d)\s?km\/h\b/g,"$1 公里/小時").replace(/(\d)\s?km\b/g,"$1 公里").replace(/(\d)[\s\u00a0]h\b/g,"$1 小時");
 s=zt(s).replace(SAMEDAY,"$1 $2 至 $3").replace(/ \((\d+(?:至\d+)?級(?:或以下)?)\)/g,"（$1）").replace(/ （/g,"（");
 return s}
const wib=b=>WI[b]||b;
const wref=s=>s.replace(/^(\S+) (\d{4}) \((\d+)\)$/,(m,n,y,v)=>`${y}年${STORM[n]||n}（${v}）`);
const SAMEDAY=/(\d+月\d+日(?:（.）)?) ?(\d\d:\d\d) 至 \1 ?(\d\d:\d\d)/g, cl=s=>s.replace(SAMEDAY,"$1 $2 至 $3");
function zt(s,mark){const u=mark===false?"":" UTC";
 return s.replace(/\b(\d{1,2}) (\d{2})Z–(\d{1,2}) (\d{2})Z\b/g,(m,a,b,c,d)=>`${+a}日${b}時至${+c}日${d}時${u}`)
  .replace(/\b(\d{1,2})-(\d{1,2}) (\d{2}:\d{2})Z\b/g,(m,M,d,t)=>`${+M}月${+d}日${t}${u}`)
  .replace(/\b(\d{1,2})\/(\d{2}:\d{2})Z\b/g,(m,d,t)=>`${+d}日${t}${u}`)
  .replace(/(\d+月\d+日) (\d{2})Z\b/g,(m,a,h)=>`${a} ${h}時${u}`)
  .replace(/\b(\d{1,2}) (\d{2}:\d{2})Z\b/g,(m,d,t)=>`${+d}日${t}${u}`)
  .replace(/\b(\d{1,2}) (\d{2})Z\b/g,(m,d,h)=>`${+d}日${h}時${u}`)}
const EX=new Map(Object.entries({
 "Hong Kong typhoon signal forecasts":"香港熱帶氣旋警告信號預測","How to read the forecasts":"使用指南","How good is it?":"預報表現","Open the forecasts":"查看預報",
 "New here? Take the tour":"第一次使用？查看使用指南","Forecasts":"預報","Tour":"使用指南","Show":"顯示","Today":"最新預報","Past storms":"過往熱帶氣旋","Run":"選擇預報","Forecast":"預報模式",
 "ECMWF physics (IFS)":"ECMWF 物理模式（IFS）","ECMWF AI (AIFS)":"ECMWF 人工智能模式（AIFS）",
 "ECMWF and Google DeepMind ensemble forecasts turned into Hong Kong signal chances. Research output — the Hong Kong Observatory is the only authority for actual signals.":"本網站根據歐洲中期預報中心（ECMWF）及 Google DeepMind 的集合預報，由電腦自動估算香港各熱帶氣旋警告信號的機會率，不經人手修訂，只供研究參考。熱帶氣旋警告信號以香港天文台發出的為準。",
 "Highest signal a majority gives":"過半數集合成員預測的最高信號","Highest signal":"最高信號","none":"沒有","no majority":"未達過半數","Gale stations":"烈風","Storm force":"暴風","Hurricane force":"颶風","Forecast, at any time from this run onward":"預測（整個預報期內）","Reference stations reaching gale force":"達烈風程度的參考測風站","Reference stations reaching storm force":"達暴風程度的參考測風站","Reference stations reaching hurricane force":"達颶風程度的參考測風站",
 "Station":"測風站","Gale chance":"烈風機會率","Wind guide, km/h":"風速參考值（公里每小時）","HKO":"天文台","What do these numbers mean?":"如何解讀這些數字？",
 "HKO actually issued":"天文台實際發出的最高信號","Timeline · Hong Kong time":"時間線（香港時間）","forecast, median start → median end":"預測時段：成員開始及結束時間的中位數",
 "deterministic run":"高解像度預報","Deterministic run":"高解像度預報","control run":"控制預報","Control run":"控制預報","faded: fewer than half the members":"淡色：不足半數成員",
 "Numbers per signal":"各級信號詳細數據","members":"集合成員","starts":"開始","ends":"結束","hours":"時數","deterministic":"高解像度預報","not issued":"沒有發出","main period":"主要時段","other periods":"其他時段",
 "Map":"地圖","zoom to Hong Kong":"放大香港範圍","zoom out":"顯示整個區域","Zoom in":"放大","Zoom out":"縮小","Move west":"向西移","Move north":"向北移","Move south":"向南移","Move east":"向東移","Back to the starting view":"還原地圖範圍","Move and zoom the map":"移動及縮放地圖","Forecast map":"預報地圖","The buttons under the map zoom in and out (+ −), move it (← ↑ ↓ →) and bring back the starting view (↺).":"地圖下方的按鈕可用來放大或縮小地圖（+ −）、移動地圖（← ↑ ↓ →）及還原地圖範圍（↺）。","▶ all members":"▶ 播放全部成員","❚❚ pause":"❚❚ 暫停","within 150 km only":"只顯示進入香港 150 公里範圍的預測路徑","▶ play":"▶ 播放",
 "← Back to all members":"← 返回全部成員","Expected path of the storm":"熱帶氣旋預測路徑","no signal":"無需發出信號","The line is ECMWF's main forecast of the storm's path.":"線條為 ECMWF 高解像度預報的熱帶氣旋路徑。","The line is the control run of ECMWF's AI model.":"線條為 ECMWF 人工智能模式控制預報的熱帶氣旋路徑。","The line is this forecast's path of the storm.":"線條為這次預報的熱帶氣旋路徑。","The line and the shaded area come from ECMWF's physics model, because Google DeepMind does not make a main forecast.":"由於 Google DeepMind 沒有高解像度預報，線條及陰影範圍均取自 ECMWF 物理模式的預報。","Its colour shows the signal expected in Hong Kong as the storm passes.":"線條顏色代表熱帶氣旋經過時香港預料需要發出的信號。","The dots mark the centre at 08:00 Hong Kong time each day.":"圓點標示每日上午 8 時（香港時間）熱帶氣旋中心的位置。","The shaded area is where seven of every ten of ECMWF's computer forecasts put the centre of the storm.":"陰影範圍涵蓋 ECMWF 七成電腦預報所預測的熱帶氣旋中心位置。","The shaded area is where seven of every ten of the AI model's computer forecasts put the centre of the storm.":"陰影範圍涵蓋 ECMWF 人工智能模式七成電腦預報所預測的熱帶氣旋中心位置。","Signal along each track":"路徑顏色代表該成員推算的警告信號","another storm of the same member":"同一預報中的其他熱帶氣旋","other tropical cyclones in the same forecast":"同一預報中的其他熱帶氣旋",
 "a signal counts at chance ≥ 0.30 (No. 10: ≥ 0.40)":"推算信號的最低機會率門檻：30%（十號：40%）","Tap or click a line to follow one member.":"按任何一條路徑，可單獨顯示該成員。",
 "Expected signal":"預測信號","Wind index":"風力指數","Station guide":"測風站預報","ensemble-mean wind index":"集合平均風力指數","Sequence:":"順序（UTC）：",
 "dashed = observed":"虛線為實況","gale stations":"烈風測風站","Gale":"烈風","Storm":"暴風","Hurricane":"颶風","Expected wind, km/h":"風速參考值（公里每小時）","HKO, km/h":"天文台實測（公里每小時）",
 "Difference, km/h":"相差（公里每小時）","Gale, storm and hurricane are each station's chances.":"烈風、暴風及颶風三欄為各測風站的機會率。",
 "Station numbers are not ready for this run yet.":"這次預報的測風站數據尚未完成。","Days are UTC · numbers only, no model files":"UTC 為協調世界時，即香港時間減八小時 · 只提供數字，不含模式檔案",
 "Lines:":"路徑：","Deterministic run:":"高解像度預報：","Control run:":"控制預報：","Members.":"集合成員：","Deterministic run.":"高解像度預報：","Control run.":"控制預報：","The times.":"時間：",
 "Gale stations.":"烈風測風站：","Storm and hurricane force":"暴風及颶風","Stations":"各測風站風速參考值","HKO issued":"天文台發出","Hong Kong":"香港","no member":"沒有成員",
 "probability for this member":"該成員的機會率","wind index (km/h)":"風力指數（公里每小時）","— Hong Kong wind index (right axis, km/h)":"— 香港風力指數（右軸，公里每小時）",
 "- - what HKO actually issued":"- - 天文台實際發出","- - observed wind index (HKO station winds)":"- - 實測風力指數（天文台測風站風速）","light":"輕微","fresh":"清勁","strong":"強","very strong":"甚強","extreme":"極強",
 "below 53 km/h":"每小時 53 公里以下","signal":"信號","pages":"頁面","storm":"熱帶氣旋","run":"起報時間","HKO's highest signal":"天文台最高信號",
 "1. the highest signal HKO issued for the storm":"一、天文台曾發出的最高信號","2. the storm":"二、熱帶氣旋","3. the run (start time, UTC)":"三、起報時間（協調世界時）",
 "the forecasts that exist for this run -- each is its own system, judged on its own past":"這個起報時間可選的模式；各模式分開驗證",
 "timeline of forecast and actual signals":"預測及實際信號時間線","ECMWF's main forecast, made once in finer detail than the members, shown on its own: track, time bar, charts":"單獨顯示 ECMWF 的高解像度預報：路徑、時間軸及圖表",
 "back to every member of this run":"返回這次預報的全部成員","play this member's storm through time":"播放該成員的熱帶氣旋路徑","time along this member's track":"該成員路徑上的時間","animation speed":"播放速度",
 "the wind index averaged over all ensemble members, hour by hour":"所有集合成員每小時的平均風力指數","Most threatening member":"對香港影響最大的成員",
 "Chances of signals No. 3, 8 and 10 for Hong Kong":"香港天文台有多大機會發出三號、八號及十號信號？","Worked out from each new forecast by ECMWF and Google DeepMind, and updated every 6 hours.":"根據 ECMWF 及 Google DeepMind 最新電腦預報推算，每 6 小時更新。",
 "This is a research project. Only the Hong Kong Observatory issues the real signals.":"本網站僅供研究參考，並非香港天文台官方預報。熱帶氣旋警告信號均由香港天文台決定是否發出。","The forecast page opens on Google DeepMind's newest forecast when it has a storm near Hong Kong, and on ECMWF's physics forecast otherwise.":"如 Google DeepMind 最新預報顯示有熱帶氣旋接近香港，頁面會優先採用該預報；否則採用 ECMWF 物理模式的預報。","Google DeepMind's forecasts from the last 16 days show the chances but not the paths, because of Google's terms of use. For those, the map shows the paths of ECMWF's physics forecast made within 12 hours, if there is one.":"根據 Google 使用條款，過去 16 日內的 Google DeepMind 預報只會顯示信號發出機會，不會顯示路徑。相關地圖會改為顯示起報時間相差不超過 12 小時的 ECMWF 物理模式預報路徑（如有）。","The buttons below switch between the forecasts made for that run. For recent runs these are ECMWF's physics model (IFS), ECMWF's AI model (AIFS) and Google DeepMind's AI model. For older storms the site uses ECMWF's archived forecasts (2007–2024) and Pangu-Weather (2018–2022).":"下方按鈕可切換同一起報時間的不同預報。近期預報包括 ECMWF 物理模式（IFS）、ECMWF 人工智能模式（AIFS）及 Google DeepMind 人工智能模式。較早的熱帶氣旋則採用 ECMWF 存檔預報（2007–2024 年）及盤古氣象（2018–2022 年）。","No. 9 marks a member that comes close to No. 10 without reaching it. This site gives no separate chance for No. 9.":"九號信號代表預測接近十號信號水平，但尚未達到十號信號的程度。本網站不會另外推算九號信號的發出機會。","MET WARN is an unofficial Hong Kong weather channel. It posts how likely it thinks HKO is to raise a signal.":"MET WARN 是香港一個非官方天氣資訊頻道，會公布其估計天文台發出各熱帶氣旋警告信號的機會率。","Each of its forecasts for the storms of 2025 and 2026 was compared with what HKO did and with this site's chance from the newest forecast out before the post, which is Google DeepMind's when it had the storm and ECMWF's physics forecast otherwise.":"本網站把 MET WARN 在 2025 年及 2026 年公布的各次熱帶氣旋預測，與天文台實際發出的信號作比較，同時採用本網站在 MET WARN 公布前的最新預報進行比較。若 Google DeepMind 當時已追蹤該熱帶氣旋，便採用其預報，否則採用 ECMWF 物理模式預報。","If this site's chance falls inside MET WARN's range, both made the same call. If not, whichever was nearer to what HKO did counts as closer. None of these storms were used to build this site.":"若本網站推算的機會率落在 MET WARN 公布的機會率區間內，則視為兩者判斷相同；否則按哪一方較接近天文台實際發出的信號作比較。這些熱帶氣旋個案均未用於建立或調校本網站的預測方法。","Research output. The Hong Kong Observatory is the only authority for actual signals.":"本網站只供研究參考，熱帶氣旋警告信號以香港天文台發出的為準。","Start the tour":"開始導覽","On the page":"跳至章節",
 "Answer":"預報結果","Timeline":"時間線","Charts":"圖表","Text":"說明","Short":"精簡","Full":"詳細","Choose today or a past storm":"選擇最新預報或過往熱帶氣旋","Read the answer":"如何閱讀預報結果","What the forecast says":"如何閱讀預報結果","Summary":"預報結果","Forecast at a glance":"預報結果",
 "The headline is the highest signal that more than half of the 50 or so forecast runs reach.":"大字顯示約 50 個集合成員中，過半數預測會達到的最高信號。",
 "Each forecast is run about 50 times, and each run is called a member. The headline gives the highest signal that more than half of the members reach, and when it starts and ends in Hong Kong time. The line under the headline shows when this site issued these chances. Each bar counts the members that reach that signal or a higher one.":"每次預報約有 50 個集合成員。大字顯示過半數成員預測會達到的最高信號，以及預計生效及取消時間（香港時間）。下方列出該次預報的發布時間。每條橫條顯示預測達到該級或更高級別信號的集合成員比例。",
 "Below that you can see how many of HKO's eight reference stations get gale, storm or hurricane force winds. For a past storm, HKO's own record is shown beside it.":"再下方顯示天文台八個參考測風站中，預計有多少個會錄得烈風、暴風或颶風。過往個案亦會列出天文台的實際紀錄。",
 "When each signal is up":"各信號預計何時生效","Bars show when each signal starts and ends, in Hong Kong time.":"橫條顯示各級信號預計生效及取消的時間（香港時間）。",
 "Each bar is one signal, in Hong Kong time. The solid part runs from the middle start time to the middle end time of the members. The pale part shows the spread, from when the earliest tenth of the members start to when the latest tenth end.":"每條橫條顯示該級信號預計生效及取消的時間（香港時間）。深色部分由各成員預計生效時間的中位數延伸至取消時間的中位數。淺色部分顯示成員之間的時間差異，由最早一成成員的開始時間延伸至最遲一成成員的結束時間。",
 "The thin line is the deterministic run, ECMWF's single main forecast. HKO's real signals run along the top.":"細線標示高解像度預報的信號時段，最上方則顯示天文台實際發出的信號。",
 "Every line is one member":"每條線代表一個集合成員","Each line is one member's storm path. Its colour shows the signal that member expects along the way.":"每條線顯示一個集合成員預測的熱帶氣旋路徑，顏色顯示該成員預測香港天文台需要發出的信號。",
 "The thick black dashed line is the deterministic run (the control run in ECMWF's AI model). For past storms, the black dashed line with dots is where the storm really went. The circles mark distances from Hong Kong.":"粗黑虛線代表高解像度預報（ECMWF 人工智能模式則為控制預報）。過往熱帶氣旋的實際路徑以帶圓點的黑色虛線顯示。以香港為中心的圓圈則用來標示與香港的距離。",
 "Watch all members move":"播放熱帶氣旋預測路徑","Watch how far the storms spread out, and whether they close in on Hong Kong.":"播放時可觀察各成員預測的位置如何隨時間分散，以及熱帶氣旋會否移近香港。",
 "Follow one member":"查看單一集合成員","Click a line to see that member on its own. Its colours show when it expects each signal.":"點選任何一條路徑，即可單獨查看該成員的預測。路徑顏色會隨預測信號級別而改變。",
 "Click any line to see that member on its own, and where its storm is at every hour.":"點選任何一條路徑，即可單獨查看該集合成員，以及熱帶氣旋每小時的預測位置。",
 "Zoom in on the eight stations":"查看香港八個參考測風站","In this run Cheung Chau reaches F12.":"今次預報顯示，長洲風力可達 12 級。","Compare each station with HKO":"比較預測與實測風速",
 "Check how good it is":"預報有多準確？","For every storm of 2025 and 2026 it sets this site's chance of each signal beside MET WARN's forecast and what HKO raised.":"2025 及 2026 年每個熱帶氣旋，本網站各信號的機會率均與 MET WARN 的預測及天文台實際發出的信號並列比較。",
 "Read today's forecast":"查看最新預報","Close":"關閉","How much text":"說明詳略","more pages":"其他頁面","Picture, full size":"查看原尺寸圖片",
 "The answer cards for Typhoon Ragasa: No. 10 from 37 of 50 members, beside HKO's actual No. 10":"樺加沙預報：37／50 個集合成員預測十號信號，旁邊顯示天文台實際發出的十號信號",
 "The run picker: year, storm and run menus, and the forecast buttons":"選擇預報：熱帶氣旋及起報時間選單，以及模式按鈕","The answer cards":"預報結果",
 "Timeline with bars for No. 3, No. 8 and No. 10 under HKO's own signals":"時間線：三號、八號及十號的預測時段，上面是天文台實際發出的信號",
 "Station table with chances, expected wind, HKO's recorded wind and the difference":"測風站表：機會率、風速參考值、天文台實測及兩者差距",
 "How good is it?: this site's chance beside MET WARN's forecast and what HKO raised":"預報表現：本網站的機會率與 MET WARN 的預測及天文台實際發出的信號並列",
 "The real forecast map: Ragasa 2025, ECMWF run of 21 Sep 12Z; every member's track coloured by the signal it expects":"互動預報地圖：樺加沙（2025），ECMWF 9月21日 12時 UTC 起報；各成員路徑按預測信號上色",
 "The real forecast map: Ragasa 2025, ECMWF run of 21 Sep 12Z, every member playing":"互動預報地圖：樺加沙（2025），ECMWF 9月21日 12時 UTC 起報，播放全部成員",
 "The real forecast map: one member of the Ragasa run on its own, its player running":"互動預報地圖：單獨播放樺加沙預報中的一個成員",
 "The real forecast map zoomed on Hong Kong: the eight stations coloured by expected wind, with their Beaufort forces":"放大至香港的互動預報地圖：八個測風站按預計風力上色，並標示蒲福氏風級",
 "What would you like to see?":"想查看哪一類預報？","Today's forecast":"最新預報","Open today's forecast":"查看最新預報","A past storm":"歷史熱帶氣旋預報","Open Ragasa":"查看樺加沙預報","The newest run.":"查看最新一輪的預報結果。",
 "Starts with Typhoon Ragasa in 2025, when HKO issued No. 10. You can then pick any other storm since 2008.":"首先以 2025 年超強颱風樺加沙為例，當時天文台曾發出十號颶風信號。進入預報頁面後，你亦可選擇其他自 2008 年起的熱帶氣旋個案。",
 "← back to the forecasts":"← 返回預報","Signals":"信號","Signals: this site and MET WARN, storm by storm":"信號：本網站與 MET WARN 比較","Signal":"信號",
 "MET WARN, an unofficial Hong Kong weather channel, posts how likely it thinks HKO is to raise a signal. Below is every such forecast for the storms of 2025 and 2026, next to this site's chance at the same moment and what HKO actually did. These storms were not used to set up this site.":"MET WARN 是香港一個非官方天氣資訊頻道，會公布天文台發出不同熱帶氣旋警告信號的預測機會率。本頁整理了 MET WARN 在 2025 年及 2026 年部分熱帶氣旋個案中公布的預測，並與本網站在相應時間可取得的預報及天文台最終發出的警告信號作比較。這些熱帶氣旋個案並未用於建立或調校本網站的預測方法。",
 "MET WARN gives a range, for example \"high\" = 80–89%. If this site's chance is inside that range, it is the same call. If it is outside, the side nearer to what HKO did is closer.":"MET WARN 以機會率區間表達預測，例如「高」代表 80% 至 89%。如果本網站的預測值落在同一區間，便歸類為「相同機會率區間」；否則，會根據信號最終有否發出，比較哪一方的預測值較接近實際結果。由於兩者的預報時間及方法可能不同，以下比較只反映所列個案的結果，不宜單憑個別個案判斷哪一方整體較準確。",
 "this site closer":"本網站較接近實際結果","· this run looks 6 days ahead (ECMWF runs its 06Z and 18Z ensemble to 144 h)":"· 本次預報只涵蓋未來 6 日（ECMWF 在 06 時及 18 時（UTC）的集合預報只計算至 144 小時）","This update looks 6 days ahead.":"本次更新只涵蓋未來 6 日。","Until 19 Oct 2026 this site ran ECMWF's physics ensemble only at 00Z and 12Z (at 06Z and 18Z ECMWF runs it 6 days ahead only).":"2026 年 10 月 19 日前，本網站只採用 ECMWF 物理模式在 00 時及 12 時（UTC）的集合預報（ECMWF 在 06 時及 18 時的集合預報只計算未來 6 日）。","Google DeepMind had no track for this storm yet":"Google DeepMind 當時仍未追蹤這個熱帶氣旋","With Google DeepMind chosen, the chance is worked out the same way from Google DeepMind's Weather Lab cyclone forecast (50 versions), using its newest run that started at least 13 hours before the post, the same age as the ECMWF one. Where Google DeepMind had no track for the storm yet, it is marked not available.":"選擇 Google DeepMind 時，機會率以同樣方法，由 Google DeepMind Weather Lab 熱帶氣旋預報（50 個集合成員）推算，採用 MET WARN 發帖前最少 13 小時起報的最新一次預報，與 ECMWF 預報的時效相同。若 Google DeepMind 當時仍未追蹤該熱帶氣旋，則標示為未能提供。","MET WARN closer":"MET WARN 較接近實際結果","same call":"落在相同機會率區間","waiting for this site":"待本網站補上","not compared":"不作比較",
 "Question":"預測項目","MET WARN said":"MET WARN 預測","This site said":"本網站預測","HKO raised it?":"天文台最終有否發出？","Who was closer":"哪個預測較接近實際結果？","This site":"本網站","MET WARN":"MET WARN",
 "medium":"中等","high":"高","medium-low":"中低","very high":"極高","low":"低","medium-high":"中高","Yes":"有","No":"沒有","–":"–","All":"全部",
 "this site does not forecast No. 9":"本網站未有提供九號信號的獨立機會率","this storm's forecasts are being added":"預報資料整理中",
 "How many of HKO's 8 reference stations had gale winds, against what HKO recorded.":"預測達到烈風程度的參考測風站數目，與天文台實際錄得的數目比較。",
 "ECMWF AI":"ECMWF 人工智能","Pangu-Weather":"盤古氣象","Old ECMWF":"ECMWF 存檔預報","runs":"次預報","exactly right":"完全吻合","stations off on average":"個測風站（平均相差）",
 "Each circle = runs with the same pair of numbers; bigger = more runs. On the dashed line = same as HKO. Hover or tap a dot for details.":"每個圓圈代表數字相同的預報，圓圈愈大，預報愈多；落在虛線上即與天文台相同。把滑鼠移到圓點上或按圓點可看詳情。",
 "Storm peaks":"各熱帶氣旋的最高風力指數","Period":"時期","Since Aug 2021":"2021年8月起","2004 to Jul 2021":"2004年至2021年7月","storms":"個熱帶氣旋","too low on average":"平均偏低","too high on average":"平均偏高","typical miss":"一般誤差",
 "Each dot = one storm's highest wind index. On the dashed line = same as observed; above = too high, below = too low. Hover or tap a dot for details.":"每點代表一個熱帶氣旋的最高風力指數；落在虛線上即與實測相同，虛線以上偏高，以下偏低。把滑鼠移到圓點上或按圓點可看詳情。",
 "Since Aug 2021 against HKO's station winds; 2004–2021 against the peaks HKCOC published.":"2021年8月起與天文台測風站風速比較；2004至2021年與 HKCOC 公布的最高值比較。",
 "stations with gale, HKO":"實際錄得烈風的測風站數目（天文台）","stations with gale, this site (middle version)":"預測達到烈風程度的測風站數目（本網站，中位成員）",
 "observed peak, from HKO's station winds (km/h)":"實測最高值（根據天文台測風站風速，公里/小時）","peak this site estimates (km/h)":"本網站估計的最高值（公里/小時）","this site against HKO's record":"本網站與天文台紀錄比較",
 "F7 or less":"7級或以下","Click a station to see the spread of possible winds there.":"按測風站可查看該處可能風力的分佈。","Estimated wind":"估計風力","Along this path: estimated wind at Hong Kong's reference stations":"沿這條路徑：香港各參考測風站的估計風力","Along this path: how it compares with past storms":"沿這條路徑：與歷來熱帶氣旋比較","Storm ranking":"熱帶氣旋排名","Ranking":"排名","See it in the storm ranking":"在熱帶氣旋排名中查看","not available":"未能提供","All forecasts":"全部預報","Old ECMWF":"ECMWF 存檔預報","ECMWF runs its physics ensemble to full range only at 00Z and 12Z.":"歐洲中期天氣預報中心只在 00Z 及 12Z 運行完整的物理模式集合預報。","Nearest run with it:":"最接近的可用起報時間：","not available for this run time":"此起報時間沒有該模式的預報","Not available":"未能提供","No storm in Google DeepMind's forecast comes within 800 km of Hong Kong. It follows only storms that have already formed, so a storm that forms later will not show here; the ECMWF forecasts include those.":"Google DeepMind 的預報中沒有熱帶氣旋進入香港 800 公里範圍。DeepMind 只預報已經形成的熱帶氣旋，稍後才形成的熱帶氣旋不會在此顯示；ECMWF 的預報則包括這類熱帶氣旋。","DeepMind had no storm near Hong Kong to follow in this run. It only forecasts storms that have already formed, so this is not a forecast of no threat.":"DeepMind 這次預報沒有追蹤香港附近的熱帶氣旋。DeepMind 只預報已經形成的熱帶氣旋，所以這並不表示沒有威脅。","not available (DeepMind had no storm near Hong Kong to follow)":"未能提供（DeepMind 沒有追蹤香港附近的熱帶氣旋）","Storm and hurricane counts use HKO's maximum hourly mean winds; the station table uses the highest 10-minute mean.":"暴風及颶風測風站數目根據天文台公布的最高每小時平均風速；測風站表則採用最高十分鐘平均風速。","experimental":"試驗性質","Read each station":"查看各測風站的風力預測","The thin line is ECMWF's single main forecast, called the deterministic run (the control run in ECMWF's AI model). Google DeepMind's forecast has no such line. For past storms, the signals HKO actually issued are shown along the top.":"細線顯示 ECMWF 物理模式的高解像度預報，即單一主要預報（ECMWF 人工智能模式則為控制預報）。Google DeepMind 的預報沒有這條線。過往個案則會在最上方顯示天文台實際發出的信號。","peaks of all members":"各成員最高值","peak wind index (km/h)":"最高風力指數（公里每小時）","— wind index (right axis)":"— 風力指數（右軸）","HKO observed":"天文台實測","Run to run · members giving each signal":"歷次預報 · 預測各級信號的集合成員數目","- - half of the members":"- - 半數集合成員","HKO No. 3 or higher up":"天文台三號或以上信號生效","Each dot is one run; click a dot to open that run.":"每一點代表一次預報，按下即可開啟該次預報。","Old ECMWF (physics)":"ECMWF 存檔預報（物理模式）","click a bar to see its tracks":"按柱可顯示相關路徑","Run to run · chance of each signal":"歷次預報 · 各級信號的機會率","Basic":"簡易","See the details →":"查看詳情 →","Advanced":"進階","Expert":"專業","No storm near Hong Kong":"香港附近沒有熱帶氣旋","No tropical cyclone is forecast to come within 800 km of Hong Kong.":"預測沒有熱帶氣旋進入香港 800 公里範圍。","No signal expected":"預測無需發出信號","How the chance changed with each new forecast":"歷次預報中各級信號發出機會的變化","Each dot is one forecast; click a dot to open it.":"每一點代表一次預報，按下即可開啟。","Each line is one possible path; its colour shows the signal expected along it.":"地圖上的線條顯示熱帶氣旋可能的移動路徑，顏色則顯示各位置對應的預測信號。","▶ play":"▶ 播放","Chances of tropical cyclone warning signals for Hong Kong, from computer forecasts. Research output — the Hong Kong Observatory is the only authority for actual signals.":"根據電腦預報推算的香港熱帶氣旋警告信號機會率。此為研究結果，熱帶氣旋警告信號以香港天文台發出者為準。","Signal expected along each path":"路徑上各位置的預測信號","signal expected along each path":"路徑上各位置的預測信號","Start the tour: which page?":"開始導覽：想了解哪個版本？","Signal chances and the possible paths":"各級信號的機會率及熱帶氣旋可能路徑","Everything, incl. stations and each forecast model":"全部資料，包括測風站及各個預報模式","1. How likely is No. 3, No. 8 or No. 10?":"1. 發出三號、八號或十號信號的機會有多大？","The headline tells you whether HKO is likely to issue a signal within the forecast's 15 days (6 days for ECMWF's physics runs at 06 and 18 UTC), and which one.":"頁面頂部顯示未來 15 日內，香港天文台是否可能需要發出熱帶氣旋警告信號，以及最有可能發出的信號級別。ECMWF 物理模式於協調世界時 06 時及 18 時起報的預報則只涵蓋 6 日。","The three bars show the chance that HKO issues No. 3, No. 8 and No. 10. Each percentage is the share of about 50 computer forecasts in which HKO would need to issue that signal or a higher one.":"三條橫條分別顯示預測發出三號、八號及十號信號的機會。百分比反映約 50 組電腦預報中，有多少組預測香港天文台需要發出該級別或以上的熱帶氣旋警告信號。","Under the bars you can see when the signal is expected to start and end, and how close ECMWF's main forecast brings the storm to Hong Kong.":"橫條下方亦會顯示信號預計生效及取消的時間，以及 ECMWF 高解像度預報中熱帶氣旋最接近香港時的距離。","Under the bars you can see when the signal is expected to start and end, and how close ECMWF's main forecast brings the storm to Hong Kong. When No. 3 or higher is expected, a map below shows that path.":"橫條下方亦會顯示信號預計生效及取消的時間，以及 ECMWF 高解像度預報中熱帶氣旋最接近香港時的距離。如預料需要發出三號或更高信號，下方會附有地圖顯示該路徑。","2. Is it getting more likely?":"2. 發出信號的機會是否正在上升？","A new forecast comes out every 6 hours, and each dot is the chance that one forecast gave for a signal. If the line rises to the right, that signal is getting more likely.":"每 6 小時更新一次預報，圖上每個點代表該次預報推算的信號發出機會。曲線向右上升，表示發出該信號的機會正在增加。","3. Where the storm may go":"3. 熱帶氣旋可能的路徑","Each line is one possible path of the storm. Its colour shows the signal expected in Hong Kong as the storm passes, grey for No. 1 and then the colours of No. 3, No. 8, No. 9 and No. 10. When the lines are close together the forecasts agree, and when they spread out they do not.":"地圖上的線條顯示熱帶氣旋的可能移動路徑。線條以不同顏色區分熱帶氣旋移至各個位置時，預計香港天文台需要發出的信號：灰色為一號信號，其餘依次為三號、八號、九號及十號信號。路徑越集中，代表各集合成員的預測越一致；越分散，則代表熱帶氣旋的路向越不確定。","4. Watch it move":"4. 播放路徑動畫","Press ▶ play to watch every possible path move forward in time.":"按「▶ 播放」，即可觀看熱帶氣旋沿預測路徑移動。","5. Want more detail?":"5. 想了解更多？","2. Want more detail?":"2. 想了解更多？","Press “See the details” under the answer. It shows how the chance has changed with each new forecast and where the storm may go.":"點擊預測結果下方的「查看詳情」，即可查看歷次預報中，發出信號的機會如何變化，以及熱帶氣旋的可能移動路徑。","For the reference stations and each forecast model, pick Expert at the top of the page.":"如想查看參考測風站及不同預報模式的詳細資料，可在頁面頂部選擇「專業」模式。","Pick Expert at the top of the forecast page to see the eight reference stations, each forecast model and all the numbers.":"在預報頁面頂部選擇「專業」模式，即可查看八個參考測風站的風力預測，並使用更多預報模式及查看詳細數據。","The forecast":"預測結果","When":"時間","Trend":"趨勢","Member charts":"集合成員圖表","Gale force":"烈風","Reference stations, forecast (any time from this run)":"參考測風站預測風力（整個預報期內）","Reference stations, recorded by HKO":"天文台參考測風站實測風力","Each line is one possible path; its colour shows the signal expected along it. Click a line to see how windy Hong Kong gets along it.":"地圖上的線條顯示熱帶氣旋可能的移動路徑，顏色則顯示各位置對應的預測信號。點選路徑，即可查看香港的預測風力。","← All paths":"← 返回全部路徑","Along this path: how windy Hong Kong gets":"沿這條路徑：香港的風勢","Along this path the storm stays more than 800 km from Hong Kong.":"沿這條路徑，熱帶氣旋與香港保持 800 公里以上距離。","The Hong Kong wind index is one number for how windy Hong Kong is overall: an unofficial index from HKCOC, a weighted average of the 10-minute winds and gusts at 20 Hong Kong Observatory stations, in km/h. The thin lines show the highest index Hong Kong had in some past storms, for comparison.":"香港風力指數以一個數值表示全港整體風勢：由 HKCOC 提出的非官方指數，以天文台 20 個測風站的十分鐘平均風速及陣風加權平均計算，單位為公里/小時。圖中細線標示香港在數個過往熱帶氣旋期間錄得的最高指數，以作比較。","† HKCOC's published peak (older index)":"† HKCOC 公布的最高值（舊版指數）","Wind at Hong Kong's reference stations":"香港參考測風站的風力","HKO recorded":"天文台實測","No signal":"沒有信號","Google DeepMind (AI)":"Google DeepMind（人工智能）","(CC BY 4.0), turned into Hong Kong signal chances here":"（CC BY 4.0），本網站據此推算香港信號機會率","· data:":"· 資料：","Ideas":"意見","Ideas & suggestions":"意見與建議","Got an idea? Hoist it.":"有好主意？掛起來吧。","Something you would like to see, something that confused you, a storm we should add. Write it below and hoist it up the mast. We read every one.":"想看到甚麼新功能、哪裏看不明白、想我們加入哪個熱帶氣旋，都可以寫下來，把它掛上信號桿。每一則我們都會細閱。","Name or email, only if you would like a reply (optional)":"名字或電郵（如希望我們回覆才需填寫，可留空）","e.g. Show the chance of No. 8 for Macau too":"例如：也顯示澳門八號信號的機會率","Hoist it ↑":"掛起來 ↑","Your message goes only to the people who run this site. Nothing you write is published.":"留言只會送到本網站的負責人，不會公開。","The ideas box opens soon.":"意見箱即將開放。","Write a few words first.":"請先寫幾個字。","Hoisting…":"掛起中……","Hoisted — thanks! We have it.":"已掛起，多謝！我們收到了。","Hoisted (preview: nothing was sent).":"已掛起（預覽：沒有送出）。","It did not go through. Please try again in a moment.":"未能送出，請稍後再試。","waiting for your idea":"等待你的意見","Tracks are not shown for live Google DeepMind forecasts: while a forecast is live, Google's terms let this site publish only results worked out from it, such as the signal chances and the winds at Hong Kong. The tracks appear here once the storm has passed.":"Google DeepMind 的實時預報不顯示路徑：Google 的使用條款只容許本網站在預報期間公開由預報推算出來的結果，例如信號機會率及香港的風力。熱帶氣旋過後，路徑會在這裏顯示。","turned into Hong Kong signal chances here; Google is not involved in this site":"本網站據此推算香港信號機會率；Google 並無參與本網站","Google DeepMind Weather Lab. © 2024-6 Google LLC, whose machine learning models were used to create the experimental data made available under the following licence terms https://storage.googleapis.com/weathernext-public/terms-of-use.pdf. This data is intended for experimental modelling only and is not intended, validated, or approved for real world use.":"Google DeepMind Weather Lab. © 2024-6 Google LLC, whose machine learning models were used to create the experimental data made available under the following licence terms https://storage.googleapis.com/weathernext-public/terms-of-use.pdf. This data is intended for experimental modelling only and is not intended, validated, or approved for real world use.","Data and credits":"資料來源及鳴謝","No threat":"預測沒有熱帶氣旋接近香港","No data for this run.":"這次預報沒有資料。","One run.":"單一預報：","This run gives":"這次預報推算的信號","This forecast is a single run, so it gives one answer instead of a share of members.":"這個預報只有一次計算，所以只給出一個結果，而非成員比例。","no timing in this run's data":"這次預報沒有時間資料","deterministic run only":"只有高解像度預報","not reached":"未達到","unavailable":"未能提供","this member's storm never comes within 800 km of Hong Kong, the range the wind index covers":"這個成員的熱帶氣旋不會進入香港 800 公里範圍（風力指數的計算範圍）","no wind index for this run (runs exported before it was added)":"這次預報沒有風力指數（較早的預報未有計算）","no values for this member in this run":"這次預報中這個成員沒有數值","ECMWF physics":"ECMWF 物理模式","▼ HKO":"▼ 天文台"
}));
const TN=x=>x==="once"?1:x==="twice"?2:x==="never"?0:parseInt(x,10);
const RX=[
 [/^No\. (8 and 9|\d+) \((\d+) storms?(; \* = No\. 9)?\)$/,(m,a,n,s)=>`${a==="8 and 9"?"八號及九號":NO[a]}（${n} 個${s?"；* 為九號信號":""}）`],
 [/^No signal \((\d+) storms?\)$/,(m,n)=>`沒有信號（${n} 個）`],
 [/^· produced (\S+ \S+) UTC \((\d+) h ago\)(?: · past case: (.+?) — (?:HKO No\. (\d+) on (.+?)|no HKO signal) \((a fair test: not used to set up the site|this storm was used to set up the site)\))?$/,
  (m,t,h,c,n,d,u)=>` · ${t} UTC 計算（${h} 小時前）`+(c?` · 過往熱帶氣旋：${G(c)}，`+(n?`天文台曾於${G(d)}發出${NO[n]}信號`:"天文台沒有發出信號")+(/^this/.test(u||"")?"（此熱帶氣旋曾用於調校本網站）":"（沒有用於調校本網站）"):"")],
 [/^of (\d+) members pass within (\d+) km ·$/,(m,a,b)=>` / ${a} 個集合成員在香港 ${b} 公里範圍內掠過 · `],
 [/^within (\d+) km(?: · deterministic run (\d+) km)?$/,(m,a,b)=>` 個在 ${a} 公里範圍內`+(b?` · 高解像度預報最接近時相距 ${b} 公里`:"")],
 [/^of (\d+)$/,(m,a)=>` / ${a} `],
 [/^Similar storms — stronger: (.+)$/,(m,a)=>{const L=a.split(" · weaker: "), f=x=>x==="none"?"沒有":x.split(", ").map(y=>G(y).replace(/）\s+/,"）")).join("、"); return `相近個案——較強：${f(L[0])}；較弱：${f(L[1]||"none")}`}],
 [/^Below (\d+) km\/h: outside the top (\d+) of the (\d+) storms since 2007; the forecast cannot rank weaker storms finely\.$/,
  (m,v,n,N)=>`低於每小時 ${v} 公里：不在 2007 年以來 ${N} 個熱帶氣旋的首 ${n} 位之內；本預報未能細分較弱的熱帶氣旋。`],
 [/^HKO recorded (\d+\.\d) km\/h, (\d+)(?:st|nd|rd|th) of the (\d+)\.$/,(m,v,n,N)=>`天文台實測：每小時 ${v} 公里，在 ${N} 個熱帶氣旋中排第 ${n}。`],
 [/^\(10th–90th percentile: (\d+)–(\d+)\)$/,(m,a,b)=>`（第 10–90 百分位數：${a}–${b} 個）`],
 [/^(?:All (\d+) of MET WARN's forecasts for the storms of 2025 and 2026 were compared|Of MET WARN's (\d+) forecasts for the storms of 2025 and 2026, (\d+) could be compared)\. This site was closer in (\d+) of them, MET WARN in (\d+), and both made the same call in (\d+)\.$/,
  (m,all,n,nc,a,b,c)=>`MET WARN 在 2025 年及 2026 年共公布 ${all||n} 次熱帶氣旋預測，${all?"全部":`其中 ${nc} 次`}可作比較。本網站有 ${a} 次較接近天文台實際發出的信號，MET WARN 有 ${b} 次，兩者判斷相同 ${c} 次。`],
 [/^MET WARN is an unofficial Hong Kong weather channel\. It posts how likely it thinks HKO is to raise a signal\. Each of its forecasts for the storms of 2025 and 2026 was compared with what HKO did and with this site's chance from the newest forecast out before the post, which is Google DeepMind's when it had the storm and ECMWF's physics forecast otherwise\. If this site's chance falls inside MET WARN's range, both made the same call\. If not, whichever was nearer to what HKO did counts as closer\. None of these storms were used to build this site\.$/,
  (m,n)=>`MET WARN 是香港一個非官方天氣資訊頻道，會公布其估計天文台發出各熱帶氣旋警告信號的機會率。這裏把 MET WARN 就 2025 年及 2026 年熱帶氣旋公布的每次預測，與天文台實際發出的信號，以及本網站在其公布前最新一次預報推算的機會率作比較（Google DeepMind 已追蹤該熱帶氣旋時採用其預報，否則採用 ECMWF 物理模式）。若本網站的機會率落在 MET WARN 的機會率區間內，即屬判斷相同。否則，以較接近天文台實際做法的一方為較接近。這些熱帶氣旋個案並未用於建立或調校本網站的預測方法。`],
 [/^For No\. 3, this site was closer (once|twice|never|\d+ times) and MET WARN (once|twice|never|\d+ times), and both made the same call (once|twice|never|\d+ times)\. For No\. 8 and 9, this site was closer (once|twice|never|\d+ times) and MET WARN (once|twice|never|\d+ times), and both made the same call (once|twice|never|\d+ times)\. For No\. 10, this site was closer (once|twice|never|\d+ times) and MET WARN (once|twice|never|\d+ times), and both made the same call (once|twice|never|\d+ times)\.(?: (One|\d+) could not be compared because Google DeepMind had no track for the storm yet\.)?(?: (One|\d+) No\. 9 forecasts? (?:was|were) not compared, because this site does not forecast No\. 9\.)?$/,
  (m,a,b,c,d,e,f,g,h,i,nv,na)=>`按信號劃分，三號信號方面，本網站較接近 ${TN(a)} 次，MET WARN 較接近 ${TN(b)} 次，兩者判斷相同 ${TN(c)} 次；八號及九號信號方面，分別為 ${TN(d)}、${TN(e)}、${TN(f)} 次；十號信號方面，分別為 ${TN(g)}、${TN(h)}、${TN(i)} 次。`+(nv?`另有 ${nv==="One"?1:nv} 次因 Google DeepMind 當時仍未追蹤該熱帶氣旋而未能比較。`:"")+(na?`另有 ${na==="One"?1:na} 次九號信號預測未納入比較，因本網站不另行推算九號信號的機會。`:"")],
 [/^· deterministic (\d+)$/,(m,a)=>`· 高解像度預報 ${a}`],
 [/^members$/,()=>` 個集合成員`],[/^(\d+) members?$/,(m,a)=>`${a} 個集合成員`],
 [/^Stations — (.+)$/,(m,a)=>`各測風站風速參考值（${who(a)}）`],
 [/^(?!Ensemble mean of \d+ members — )(.+?) — (expected signal through time|chance of No\. (\d+) through time|Hong Kong wind index through time|station guide)$/,(m,a,b,n)=>`${who(a)}：${b==="expected signal through time"?"預測信號":b==="Hong Kong wind index through time"?"香港風力指數":b==="station guide"?"測風站預報":`${NO[n]}信號機會率`}`],
 [/^Chance of No\. (\d+)$/,(m,n)=>`${NO[n]}機會率`],
 [/^(\d+)% earliest start → (\d+)% latest end$/,(m,a,b)=>`最早 ${a}% 至最遲 ${b}% 成員`],
 [/^(\d+) h per second$/,(m,a)=>`每秒 ${a} 小時`],
 [/^every member's storm together through time, (\d+) forecast hours per second$/,(m,a)=>`以每秒 ${a} 個預報小時，同時播放全部成員`],
 [/^members with a chance of ≥ ([\d.]+) \(No\. 10: ≥ ([\d.]+)\) at any hour · times HKT, median over those members \((\d+)–(\d+)% below\)$/,(m,a,b,c,d)=>`只計算在預報期內任何一小時機會率達 ${a}（十號為 ${b}）的成員；時間為香港時間，取中位數，下行為 ${c}% 至 ${d}%`],
 [/^other periods: (.+)$/,(m,a)=>`其他時段：${G(a.replace(/^(\d+) members? /,"$1 個成員 "))}`],
 [/^(\d+) possible paths, each started from slightly different conditions\.$/,(m,a)=>`每條代表一個集合成員，共 ${a} 條。`],
 [/^the possible paths, each started from slightly different conditions\.$/,()=>` 每條代表一個集合成員。`],
 [/^ECMWF's main forecast, made once in finer detail\.$/,()=>`ECMWF 以較高解像度計算的單一預報。`],
 [/^the one path started without any change\.$/,()=>`初始條件沒有加入擾動的成員。`],
 [/^(.*?) · teal = wind index \(km\/h\)$/,(m,a)=>`${zt(a,false)} · 藍綠線為風力指數（公里每小時）`],
 [/^(\d{1,2}) (\d{2})Z–(\d{1,2}) (\d{2})Z( →)?$/,(m,a,b,c,d,e)=>`${+a}日${b}時至${+c}日${d}時${e?" →":""}`],
 [/^(\d{1,2}) (\d{2})Z$/,(m,d,h)=>`${+d}日${h}時`],
 [/^(\d{1,2}) (\d{2}:\d{2})Z$/,(m,d,t)=>`${+d}日${t} UTC`],
 [/^\(P ([\d.]+)\)$/,(m,a)=>`（機會率 ${a}）`],
 [/^(.+?): members by expected wind force$/,(m,a)=>`${G(a)}：各集合成員的風速參考值`],
 [/^peak ([\d.]+), ≥ ([\d.]+) from (.+)$/,(m,a,b,c)=>`最高 ${a}，${zt(c)}起達 ${b}`],
 [/^peak ([\d.]+), stays below ([\d.]+)$/,(m,a,b)=>`最高 ${a}，一直低於 ${b}`],
 [/^closest (\d+) km, (.+)$/,(m,a,b)=>`最接近 ${a} 公里（${zt(b)}）`],
 [/^No\. (\d+) tier$/,(m,n)=>`屬${NO[n]}級別`],[/^near No\. (\d+)$/,(m,n)=>`接近${NO[n]}`],
 [/^\(P ([\d.]+), up to ([\d.]+)\)$/,(m,a,b)=>`（機會率 ${a}，最高 ${b}）`],
 [/^gale stations$/,()=>`烈風測風站 `],
 [/^\((\d+)–(\d+)\) at (\S+), (\d+) km$/,(m,a,b,c,d)=>`（${a}–${b}），${zt(c)}，距離 ${d} 公里`],
 [/^past storms at (\d+): (.+?)( \(few\))?$/,(m,n,l,f)=>`過往同樣有 ${n} 個測風站錄得烈風的熱帶氣旋：${G(l).replace(/, /g,"、")}${f?"（個案不多）":""}`],
 [/^peak wind index$/,()=>`最高風力指數 `],[/^(\d+) km\/h$/,(m,a)=>`每小時 ${a} 公里`],
 [/^\((very strong|light|fresh|strong|extreme)\) (.+)$/,(m,b,c)=>`（${wib(b)}）${zt(c)}`],
 [/^Click a station to see its wind in each of the (\d+) members\.$/,(m,a)=>`按測風站，可看到該站在 ${a} 個集合成員中的風速參考值分布。`],
 [/^click: (.+) in every member$/,(m,a)=>`按此查看${G(a)}在各集合成員中的風速參考值`],
 [/^: forecast wind force in each of the (\d+) members; the (white|dark) outline marks (.+?)'s force(?:; ▼ what HKO recorded \((\d+) km\/h\))?\.$/,(m,a,o,w,h)=>`：${a} 個集合成員的預測風力分布，${o==="white"?"白色":"深色"}外框標示${who(w)}的風力級別`+(h?`；▼ 為天文台實測（每小時 ${h} 公里）`:"")+"。"],
 [/^below (\d+)$/,(m,a)=>`${a} 以下`],
 [/^(strong|gale|storm|hurricane) (\d+)(–\d+|\+)$/,(m,a,b,c)=>`${{strong:"強風",gale:"烈風",storm:"暴風",hurricane:"颶風"}[a]} ${b}${c}`],
 [/^(.+?) \(closest\): (\d+) km from HK$/,(m,a,b)=>`${zt(a)}（最接近香港）：${b} 公里`],
 [/^(\d\d \d\d:\d\dZ): (\d+) km from HK$/,(m,a,b)=>`${zt(a)}：距離香港 ${b} 公里`],
 [/^(\d+) km from HK, (.+)$/,(m,a,b)=>`距離香港 ${a} 公里，${zt(b)}`],
 [/^expected signal: No\. (\d+)$/,(m,n)=>`預測信號：${NO[n]}`],
 [/^wind index at HK: about (\d+) km\/h(?: \((.+)\))?$/,(m,a,b)=>`香港風力指數：約每小時 ${a} 公里`+(b?`（${wib(b)}）`:"")],
 [/^(\S+) (\d{4}): (\d+) km\/h( \(HKCOC's published peak, older index\))?$/,(m,n,y,v,o)=>`${y}年${STORM[n]||n}：每小時 ${v} 公里`+(o?"（HKCOC 公布的最高值，舊版指數）":"")],
 [/^close to (\S+ \d{4} \(\d+\))(?: and (\S+ \d{4} \(\d+\)))?$/,(m,a,b)=>`與${wref(a)}${b?`及${wref(b)}`:""}相若`],
 [/^(below|above) (\S+ \d{4} \(\d+\))$/,(m,k,a)=>`${k==="below"?"低於":"高於"}${wref(a)}`],
 [/^between (\S+ \d{4} \(\d+\)) and (\S+ \d{4} \(\d+\))$/,(m,a,b)=>`介乎${wref(a)}與${wref(b)}之間`],
 [/^actual: (\d+) km from HK(?:, HKO No\. (\d+) up|, no HKO signal)$/,(m,a,n)=>`實況：距離香港 ${a} 公里，`+(n?`天文台已發出${NO[n]}信號`:`天文台沒有發出信號`)],
 [/^(.+?)( \(closest approach\))? · (\d+) km from Hong Kong(?: · expected No\. (\d+))?(?: · wind index (\d+)(?: \((.+)\))?)?$/,(m,t,c,d,n,w,b)=>`${zt(t)}${c?"（最接近香港）":""} · 距離香港 ${d} 公里`+(n?` · 預測${NO[n]}`:"")+(w?` · 風力指數 ${w}`+(b?`（${wib(b)}）`:""):"")],
 [/^all members · (.+) \(\+(\d+) h\)$/,(m,a,h)=>`全部成員 · ${zt(a)}（預報第 ${h} 小時）`],
 [/^— — actual track: (.+)$/,(m,a)=>`— — 實際路徑：${a==="HKO best track"?"天文台最佳路徑":a}`],
 [/^signal along each track \(≥ ([\d.]+); No\. 10 ≥ ([\d.]+)\)$/,(m,a,b)=>`預測信號（機會率 ${a} 或以上；十號 ${b}）`],
 [/^shaded: HKO actually had No\. (\d+) or higher up$/,(m,n)=>`陰影：天文台實際已發出${NO[n]}或更高信號`],
 [/^run (.+)$/,(m,a)=>`${G(a)} 起報`],
 [/^(\d+\/\d+) · (\d+) h$/,(m,a,b)=>`${a} · ${b} 小時`],
 [/^HKO (.+?): No\. (\d+) (.+?) → (.+?) HKT$/,(m,c,n,a,b)=>`天文台（${G(c)}）：${NO[n]}，${G(a)} 至 ${G(b)}（香港時間）`],
 [/^deterministic run: (.+?) → (.+?) HKT · (\d+) h$/,(m,a,b,h)=>`高解像度預報：${G(a)} 至 ${G(b)}（香港時間），${h} 小時`],
 [/^from HKO's reported maximum hourly mean winds \((\d+) \/ (\d+) km\/h\)$/,(m,a,b)=>`根據天文台公布的最高每小時平均風速（${a} / ${b} 公里/小時）`],
 [/^the AI ensemble's unperturbed member \((\d+)\) on its own -- the site has no separate deterministic AI run$/,(m,a)=>`單獨顯示人工智能模式的高解像度預報（成員 ${a}）`],
 [/^Newest run: (.+?), (\d\dZ)(?: \((.+)\))?\.$/,(m,a,z,f)=>`最新預報：${G(a)} ${z.replace("Z","")}時 UTC 起報`+(f?`（${f.replace("ECMWF physics","ECMWF 物理模式").replace("ECMWF AI","ECMWF 人工智能模式")}）`:"")+"。"],
 [/^Not updating right now: this run is (\d+) (days|hours) old\.$/,(m,a,u)=>`暫停更新：最新預報已是 ${a} ${u==="days"?"天":"小時"}前。`],
 [/^Past cases only: each section compares the site with what the Hong Kong Observatory \(HKO\) recorded\. Hover or tap a dot for details\. State of (.+)\.$/,(m,a)=>`只計算過往熱帶氣旋，並與香港天文台的紀錄比較。把滑鼠移到圓點上或按圓點可看詳情。資料截至${G(a)}。`],
 [/^No\. (8 and 9|\d+)$/,(m,a)=>`${a==="8 and 9"?"八號及九號":NO[a]} `],
 [/^, ((?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4})$/,(m,a)=>`，${G(a)}`],
 [/^HKO went up to No\. (\d+)$/,(m,n)=>`天文台最高發出${NO[n]}信號`],
 [/^Will HKO raise No\. (\d+)\?$/,(m,n)=>`天文台會否發出${NO[n]}信號？`],
 [/^asked (\d+) (\w{3}), (\d\d:\d\d) HK time( · picture post)?$/,(m,d,M,t,p)=>`${MON[M]}月${d}日 ${t}（香港時間）`+(p?" · 圖片帖文":"")],
 [/^forecast (\d+) h old$/,(m,a)=>`對照時，模式預報已是 ${a} 小時前的版本`],
 [/^Each line is one possible path from ECMWF physics \(IFS\)(?:, its run of (.+?))?; its colour shows the signal expected along it\. Everything else on this page is Google DeepMind's forecast: Google's terms don't allow showing its paths while the forecast is live\.(?: Click a line to see that path on its own\.)?$/,(m,r)=>`每條線代表 ECMWF 物理模式（IFS）${r?zt(G(r))+" 起報":""}預測的一條可能路徑，顏色顯示沿途預計的信號。本頁其他資料均來自 Google DeepMind 的預報：根據 Google 的使用條款，實時預報的路徑不能在此展示。點擊路徑可單獨查看。`],
 [/^ECMWF member (\d+)(?:: closest about (\d+) km from Hong Kong)?\. Click to see this path on its own\.$/,(m,a,b)=>`ECMWF 成員 ${a}${b?`：最接近香港約 ${b} 公里`:""}。點擊可單獨查看此路徑。`],
 [/^ECMWF physics \(IFS\) path: (.+?)(?:, its run of (.+?))?\. The chances on this page stay Google DeepMind's\.$/,(m,a,r)=>`ECMWF 物理模式（IFS）路徑：${a.replace(/^Member (\d+)$/,"成員 $1").replace("Deterministic run","高解像度預報")}${r?`（${zt(G(r))} 起報）`:""}。本頁的機會率仍來自 Google DeepMind。`],
 [/^Forecast: (.+)$/,(m,f)=>`預報模式：${EX.get(f)||f}`],
 [/^With Google DeepMind, this site's chance is the share of its 50 forecast versions \(Weather Lab cyclone forecast\) that reach the signal for that storm\. It is the newest Google DeepMind run \(four a day\) that Google had published when MET WARN posted, about (\d+) hours after the run started, so the forecast was (\d+)–(\d+) hours older than the post\. Where Google DeepMind had no track for the storm yet, it is marked not available\.$/,(m,h,a,b)=>`選擇 Google DeepMind 時，本網站的機會率是 Google DeepMind Weather Lab 熱帶氣旋預報 50 個集合成員之中，達到該熱帶氣旋相關信號的成員比例。採用的是 MET WARN 發帖時 Google 已公布的最新一次 Google DeepMind 預報（每日四次，約於起報後 ${h} 小時公布），因此預報比帖文早 ${a} 至 ${b} 小時。若 Google DeepMind 當時仍未追蹤該熱帶氣旋，則標示為未能提供。`],
 [/^MET WARN, (.+?) HK time: (low|medium-low|medium|medium-high|high|very high) \((\d+)–(\d+)%\) for No\. (\d+)( · picture post)?$/,(m,a,w,lo,hi,n,pic)=>`MET WARN，${G(a)}（香港時間）：${{"low":"低","medium-low":"中低","medium":"中等","medium-high":"中高","high":"高","very high":"極高"}[w]}（${lo}–${hi}%），${{"3":"三","8":"八","10":"十"}[n]}號信號${pic?" · 圖片帖文":""}`],
 [/^MET WARN: each bar is the range it posted for No\. (\d+), at the time of the post \(an unofficial channel; How good is it\? compares the two\)\.$/,(m,n)=>`MET WARN：每條直條為其就${{"3":"三","8":"八","10":"十"}[n]}號信號公布的機會率區間，按發帖時間標示（MET WARN 為非官方頻道；「預報表現」頁有兩者的比較）。`],
 [/^Not available: (\d+) \(Google DeepMind had no track for the storm yet\)\.$/,(m,n)=>`未能提供：${n} 次（Google DeepMind 當時仍未追蹤該熱帶氣旋）。`],
 [/^(\d+)% is (below|above|inside) MET WARN's (\d+–\d+)%$/,(m,a,w,r)=>w==="inside"?`${a}% 在 MET WARN 的 ${r}% 之內`:`${a}% ${w==="below"?"低於":"高於"} MET WARN 的 ${r}%`],
 [/^(.+?) · runs made before HKO's highest signal$/,(m,a)=>`${a.replace(/ forecasts?, /,"，").replace("ECMWF AI","ECMWF 人工智能模式").replace("Old ECMWF","ECMWF 存檔").replace("Pangu-Weather","盤古氣象")} 年 · 只計算天文台發出最高信號前的預報`],
 [/^(\d+) storms, against the index from HKO's station winds$/,(m,a)=>`${a} 個熱帶氣旋，與根據天文台測風站風速計算的指數比較`],
 [/^(\d+) storms, against the peaks HKCOC published$/,(m,a)=>`${a} 個熱帶氣旋，與 HKCOC 公布的最高值比較`],
 [/^(.+?) \(most threatening\)$/,(m,a)=>`${who(a)}（對香港影響最大）`],
 [/^(.+?) — storm ranking$/,(m,a)=>`${who(a)}：熱帶氣旋排名`],
 [/^(.+?) — estimated wind$/,(m,a)=>`${who(a)}：估計風力`],
 [/^(.+?) \(median wind index\)$/,(m,a)=>`${who(a)}（風力指數中位數）`],
 [/^Member (\d+)$/,(m,a)=>`成員 ${a}`],
 [/^: closest (\d+) km at (.+?), peak No\. 8 ([\d.]+)\. Click to see it below\.$/,(m,a,b,c)=>`：最接近 ${a} 公里（${zt(b)}），八號信號機會率最高 ${c}。按下可在下面查看。`],
 [/^— most threatening: closest (\d+) km at (.+?), peak No\. 8 ([\d.]+)\. Click to see it below\.$/,(m,a,b,c)=>`（對香港影響最大）：最接近 ${a} 公里（${zt(b)}），八號信號機會率最高 ${c}。按下可在下面查看。`],
 [/^: click anywhere on its line, drag the time bar or press play to see the storm at any moment \(the charts below follow\)\.$/,()=>`：按路徑上任何位置、拖動時間軸或按播放，即可看到熱帶氣旋任何時刻的位置，下面的圖表會同步更新。`],
 [/^: the model stops tracking this storm at (.+?), (\d+) km from Hong Kong\.$/,(m,a,b)=>`：模式在 ${zt(a)} 停止追蹤這個熱帶氣旋，當時距離香港 ${b} 公里。`],
 [/^\. Click the dot to mark this time below\.$/,()=>`。按圓點可在下面標示這個時間。`],
 [/^No\. (\d+) forecast: (\d+) of (\d+) members · start (.+?) \(10–90% (.+?)\) · end (.+?) \((.+?)\) · (\d+) h \((.+?)\), HKT$/,(m,s,n,M,a,b,c,d,h,r)=>`${NO[s]}信號預測：${M} 個成員中有 ${n} 個 · 開始 ${G(a)}（10%–90%：${G(b)}）· 結束 ${G(c)}（${G(d)}）· ${h} 小時（${r}），香港時間`],
 [/^(.+?) \((.+?)\): expected wind (.+?) km\/h · chance of gale (\d+)%, storm (\d+)%, hurricane (\d+)%$/,(m,st,w,v,g,sm,h)=>`${G(st)}（${who(w)}）：風速參考值 ${v} 公里/小時 · 烈風機會率 ${g}%、暴風 ${sm}%、颶風 ${h}%`],
 [/^((?:the )?(?:[Mm]ember \d+|deterministic run|control run|most threatening member)(?: \(most threatening\))?) at$/,(m,a)=>`${who(a)}，`],
 [/^: (\d+) km from Hong Kong( · expected signal:)?$/,(m,a,e)=>`：距離香港 ${a} 公里`+(e?" · 預測信號：":"")],
 [/^(\d{1,2} \d{2}:\d{2}Z): (none|No\. \d+)(?: · wind index (\d+)(?: \((very strong|light|fresh|strong|extreme)\))?)?$/,(m,a,b,w,band)=>`${zt(a)}：${b==="none"?"沒有信號":G(b)}`+(w?` · 風力指數 ${w}`+(band?`（${wib(band)}）`:""):"")],
 [/^No member's storm comes within (\d+) km of Hong Kong; the closest is (\d+) km\.$/,(m,a,b)=>`所有集合成員的熱帶氣旋均不會進入香港 ${a} 公里範圍，最接近的約 ${b} 公里。`],
 [/^Ensemble mean of (\d+) members — Hong Kong wind index through time$/,(m,a)=>`${a} 個集合成員的平均：香港風力指數`],
 [/^no (.+?) run for (.+)$/,(m,a,b)=>`沒有 ${a==="ECMWF AI"?"ECMWF 人工智能模式":a==="ECMWF physics"?"ECMWF 物理模式":a} 在 ${G(b)} 的預報`],
 [/^pick a run in the menu above, or switch back to (.+)$/,(m,a)=>`請在上面的選單選擇其他起報時間，或改回 ${a==="ECMWF AI"?"ECMWF 人工智能模式":a==="ECMWF physics"?"ECMWF 物理模式":a}`],
 [/^HKO (\S.*)$/,(m,a)=>`天文台（${G(a)}）`],
 [/^Updated (\d+) (\w{3}) (\d\d:\d\d) \(Hong Kong time\)$/,(m,d,mo,t)=>`更新時間：${"JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(mo)/3+1}月${d}日 ${t}（香港時間）`],
 [/^Past storm: (.+)$/,(m,a)=>`過往熱帶氣旋：${G(a)}`],
 [/^Signal (No\. \d+) hoisted$/,(m,s)=>`${G(s)}信號已掛起`],
 [/^Not out yet for (\d{1,2} [A-Z][a-z]{2} \d{2}Z)\. Expected about (\d{1,2} [A-Z][a-z]{2} \d{2}:\d{2}) Hong Kong time \(from the last few days\)\.$/,(m,a,b)=>`${zt(G(a))}的預報尚未發出，預計約於香港時間${G(b)}發出（根據過去數天推算）。`],
 [/^No run of this forecast for (.+)\.$/,(m,a)=>`這個預報沒有${zt(G(a))}的運行。`],
 [/^next run (.+) expected about (.+) HKT( \(running late\))?$/,(m,a,b,c)=>`下一次預報（${zt(G(a))}）預計約於香港時間${G(b)}發出${c?"（較預期遲）":""}`],
 [/^Next update expected about (.+) \(Hong Kong time\)$/,(m,a)=>`下次更新預計約於香港時間${G(a)}`],
 [/^All forecasts: chance of (No\. \d+) only\. Each forecast has its own line style, marker and name at the end of its line\.$/,(m,a)=>`全部預報：只顯示${G(a)}信號的機會率。每個預報各有不同的線條樣式、標記，並在線末標示名稱。`],
 [/^(No\. \d+|IFS|AIFS|DeepMind|Old ECMWF|Pangu): (\d+)% \((\d+) of (\d+) members\)$/,(m,a,b,c,d)=>`${a.startsWith("No")?G(a):a}：${b}%（${d} 個成員中有 ${c} 個）`],
 [/^(IFS|AIFS|DeepMind|Old ECMWF|Pangu): (not available|no run)$/,(m,a,b)=>`${a}：${b==="no run"?"沒有運行":"未能提供"}`],
 [/^(\d{1,2} [A-Z][a-z]{2} \d{2}Z) · (No\. \d+|IFS|AIFS|DeepMind|Old ECMWF|Pangu)$/,(m,a,b)=>`${zt(G(a))} · ${b.startsWith("No")?G(b):b}`],
];
function who(a){a=a.trim(); return /^(the )?[Dd]eterministic run$/.test(a)?"高解像度預報":/^(the )?[Cc]ontrol run$/.test(a)?"控制預報":
 /^(the )?[Mm]ost threatening member$/.test(a)?"對香港影響最大的成員":a.replace(/^(?:the )?[Mm]ember (\d+)/,"成員 $1").replace(" (most threatening)","（對香港影響最大）").replace(" (median wind index)","（風力指數中位數）")}
const BX=[
 [/^8-station average of the highest 10-minute mean: <b>(\d+\.\d) km\/h<\/b> · <b>(\d+)(?:st|nd|rd|th)<\/b> of the (\d+) storms since 2007 that brought No\. 3 or higher$/,
  (m,v,n,N)=>`八個參考測風站最高十分鐘平均風速的平均值：<b>每小時 ${v} 公里</b>｜在 2007 年以來 ${N} 個天文台發出三號或以上信號的熱帶氣旋中排<b>第 ${n}</b>`],
 [/^8-station average in this forecast \(reference only\): <b>(\d+) km\/h<\/b>(?: · would rank about <b>(\d+)(?:st|nd|rd|th)<\/b> of the (\d+) storms since 2007)?$/,
  (m,v,n,N)=>`此預報的八站平均風速（只供參考）：<b>每小時 ${v} 公里</b>`+(n?`｜在 2007 年以來 ${N} 個熱帶氣旋中約排<b>第 ${n}</b>`:"")],
 [/^<b>8-station average\.<\/b> The average over the 8 reference stations of each station's highest 10-minute mean wind in the storm\. Past storms are ranked by it: (\d+) storms since 2007 that brought No\. 3 or higher, from the same station records the station numbers are built on\. For a forecast it is shown for each member, as a reference only, under the table in the Estimated wind tab, from that member's wind guide at the 8 stations; below (\d+) km\/h the guide cannot tell storms apart, so no rank is given\.$/,
  (m,N,v)=>`<b>八站平均風速</b>：八個參考測風站各自在熱帶氣旋期間錄得的最高十分鐘平均風速的平均值。過往個案按此排列：2007 年以來天文台發出三號或以上信號的 ${N} 個熱帶氣旋，數據與本網站測風站數字所用的紀錄相同。預報方面，「估計風力」分頁表格下方列出每個集合成員的數值，只供參考，由該成員在八個測風站的風速參考值計算；低於每小時 ${v} 公里時，風速參考值未能區分不同熱帶氣旋，因此不作排名。`],
 [/^<span class="gl"( title="[^"]*")?>(Gale stations|Gale force|Storm force|Hurricane force|Reference stations reaching (?:gale|storm|hurricane) force|Reference stations that recorded (?:gale|storm|hurricane) force)<\/span> (<span class="gd"[^>]*>(?:<i[^>]*><\/i>)*<\/span>) <b class="gn">(\d+)<\/b> of (\d+)( <span class="rng">\(10th–90th percentile: (\d+)–(\d+)\)<\/span>)?( <span class="rng">· deterministic run: (\d+)<\/span>)?$/,galeRow],
 [/^(?:ECMWF|(Google DeepMind's model)) runs every forecast <b>(\d+) times<\/b>, each from a slightly different start, to show how sure it is\. Each run is a <i>member<\/i>(.*)$/,(m,gd,n,rest)=>{
   const FULL={"1":"一號戒備信號","3":"三號強風信號","8":"八號烈風或暴風信號","9":"九號烈風或暴風風力增強信號","10":"十號颶風信號"};
   let o=`${gd?"Google DeepMind 的模式":"ECMWF"} 會以略有不同的初始條件，重複運行同一個天氣預報模式，模擬熱帶氣旋可能出現的不同發展情況，每次模擬的結果稱為一個<i>集合成員</i>。今次集合預報共有 <b>${n} 個成員</b>`;
   let r=rest, q;
   if(q=r.match(/^: <b>(\d+) of (\d+)<\/b> \((\d+)%\) of them bring No\. (\d+)\.(.*)$/)){o+=`，其中 <b>${q[1]} 個</b>（${q[3]}%）推算香港天文台可能需要發出${FULL[q[4]]}。此百分比反映集合成員的預測比例，並非天文台實際發出該信號的官方機會率。`; r=q[5]}
   else if(q=r.match(/^\. Only <b>(\d+) of (\d+)<\/b> bring No\. 3 or higher, fewer than half, so no signal has a majority\.(.*)$/)){o+=`，只有 <b>${q[1]} 個</b>推算香港天文台可能需要發出三號或更高信號，不足半數。`; r=q[3]}
   else if(q=r.match(/^\. None of them brings No\. 3 or higher\.(.*)$/)){o+=`，沒有成員推算香港天文台需要發出三號或更高信號。`; r=q[1]}
   else return null;
   r=r.trim();
   if(r==="ECMWF also makes one main forecast in finer detail, the <b>deterministic run</b> (black dashed on the map).")o+=`地圖上的黑色虛線代表 ECMWF 的<b>高解像度預報</b>路徑。`;
   else if(r==="The <b>control run</b> is the one member started without any change (black dashed on the map).")o+=`地圖上的黑色虛線代表 ECMWF 人工智能模式的<b>控制預報</b>路徑，即初始條件沒有加入擾動的集合成員。`;
   else if(r)return null;
   return o}],
 [/^<b>(\d+)<\/b> of (\d+) members pass within (\d+) km · <b>(\d+)<\/b> within (\d+) km(?: · deterministic run (\d+) km)?$/,(m,a,M,ka,b,kb,d)=>`${M} 個集合預報成員中，有 <b>${a}</b> 個預測熱帶氣旋會進入香港 ${ka} 公里範圍，${+b===+M?`全部 <b>${b}</b> 個均`:`<b>${b}</b> 個`}預測會進入 ${kb} 公里範圍。`+(d?`高解像度預報顯示，熱帶氣旋最接近香港時，中心距離約為 ${d} 公里。`:"")],
 [/^(?:from )?<b>(\d+)<\/b> of (\d+) members · (?:<b>(\d+)<\/b> of them )?(.+?) → (.+?) HKT · <b>(\d+) h<\/b>$/,(m,n,M,k,a,b,h)=>`${M} 個集合成員中有 <b>${n}</b> 個`+(k?`，當中 <b>${k}</b> 個`:"")+` · ${cl(G(a)+" 至 "+G(b))}（香港時間）· <b>${h} 小時</b>`],
 [/^<b>Members\.<\/b> ECMWF runs each forecast (\d+) times, each from slightly different starting conditions\. Each run is a member\. A count like "(\d+) of (\d+) members" means (\d+) of those runs give that signal at some point, so it gives a rough idea of the chance\. It is the share of members, not a calibrated probability that HKO will issue the signal\.$/,
  (m,n,a,b)=>`<b>集合成員</b>：ECMWF 每次預報由 ${n} 個略為不同的初始條件計算，每個結果稱為一個集合成員。「${b} 個成員中有 ${a} 個」即 ${a} 個成員在預報期內某時預測該信號，可大致反映機會高低（約 ${Math.round(100*a/b)}%）；這是成員所佔的比例，並非天文台發出該信號的實際機會率。`],
 [/^<b>Deterministic run\.<\/b> Besides the (\d+) members, ECMWF makes one main forecast in finer detail\. It is the black dashed line on the map, and its own numbers say "deterministic"\. It is still one forecast, so it can be right or wrong like any member\.$/,
  (m,n)=>`<b>高解像度預報</b>：除 ${n} 個集合成員外，ECMWF 亦以較高解像度計算一個單一預報，即地圖上的黑色虛線。它只是眾多可能情況之一，未必比其他成員準確。`],
 [/^<b>Control run\.<\/b> The AI forecast's member started without any change\. It is the black dashed line on the map\.$/,()=>`<b>控制預報</b>：ECMWF 人工智能模式中初始條件沒有加入擾動的集合成員，即地圖上的黑色虛線。它只是眾多可能情況之一，未必比其他成員準確。`],
 [/^<b>The times\.<\/b> The members that give the signal do not agree to the minute\. The start and end shown are the middle ones: half of those members start earlier, half later, and the same for the end\. The hours are the middle length\. The timeline below shows how far they spread \(earliest (\d+)% to latest (\d+)%\)\.$/,
  (m,a,b)=>`<b>時間</b>：預測同一信號的成員，開始及結束時間各有不同。這裏顯示的是中位數，即一半成員較早、一半較遲；時數亦取中位數。下面的時間線顯示最早 ${a}% 至最遲 ${b}% 成員的範圍。`],
 [/^<b>Gale stations\.<\/b> HKO decides No\. 3 and No\. 8 by the winds at (\d+) reference stations near sea level: .+?\. It raises No\. 8 when half or more of them \((\d+) of (\d+)\) record, or are expected to record, sustained winds of (\d+) to (\d+) km\/h and the winds are likely to persist; HKO adds that meeting the wind criterion is not the only consideration, as public safety comes first\. This site's numbers are not HKO's decision\. A count like "(\d+) of (\d+) \((\d+)–(\d+)\)" means the middle member expects (\d+) of the (\d+) stations to get gale winds at any time from this run onward, and most members expect (\d+) to (\d+)\.$/,
  (m,n,a,b,lo,hi,c,d,e,f,g,h,i,j)=>`<b>烈風測風站</b>：天文台考慮發出三號及八號信號時，會參考熱帶氣旋警告系統網絡內 ${n} 個接近海平面的參考測風站（長洲、赤鱲角、啟德、流浮山、西貢、沙田、打鼓嶺及青衣）。當網絡中半數或以上（${b} 個中至少 ${a} 個）測風站錄得或預料錄得每小時 ${lo} 至 ${hi} 公里的持續風速，且風勢可能持續時，天文台會發出八號信號；天文台亦指出，達到風力標準並非唯一考慮，公眾安全方為最大考慮。本網站的推算不等同天文台的決定。「${d} 個中有 ${c} 個（${e}–${f}）」表示中位成員預測由今次預報起，${h} 個參考測風站中有 ${g} 個達烈風程度，大部分成員預測 ${i} 至 ${j} 個。`],
 [/^<b>Storm and hurricane force<\/b> count the same (\d+) stations, at (\d+) and (\d+) km\/h \((\d+)-minute average wind\)\. Each station's own chance and expected wind are in <b>Stations<\/b> just above, for the (deterministic|control) run, and in the Estimated wind tab under the map, which shows the same run until you click another track\.$/,
  (m,n,a,b,c,w)=>`<b>暴風及颶風</b>：以同樣 ${n} 個測風站計算，持續風力分別達每小時 ${a} 及 ${b} 公里（${c} 分鐘平均）。各測風站的機會率及預計風速見上面的<b>各測風站風速參考值</b>（${w==="control"?"控制預報":"高解像度預報"}）及地圖下方的「估計風力」分頁；未按其他路徑前，兩者顯示同一預報。`],
 [/^<b>Lines:<\/b> (.+)$/,null],
 [/^A rough guide read from each station's chances, not a wind forecast\.(.*)$/,(m,r)=>{let o="風速參考值根據各測風站出現烈風、暴風及颶風的機會率推算，並非模式直接輸出的風速預報，只供參考。"; r=r.trim();
   const P=[["The same forecast as the Estimated wind tab under the map and the station dots on the map;","與地圖下方「估計風力」分頁及地圖上的測風站圓點屬同一預報；"],["This forecast, the same as Stations in the answer card;","與上面「各測風站風速參考值」屬同一預報；"],
            ["10-minute mean.","十分鐘平均風速。"],["HKO: the highest 10-minute mean recorded.","天文台實測為錄得的最高十分鐘平均風速。"]];
   for(const [e,z] of P){if(r.startsWith(e)){o+=z; r=r.slice(e.length).trim()}} return r?null:o}],
 [/^Choose <span class="ui">Today<\/span> or <span class="ui">Past storms<\/span>, then a storm and a run\.$/,()=>`選擇<span class="ui">最新預報</span>或<span class="ui">過往熱帶氣旋</span>。如選擇過往熱帶氣旋，再選擇熱帶氣旋及起報時間。`],
 [/^<span class="ui">Today<\/span> shows the newest forecasts\. <span class="ui">Past storms<\/span> are grouped by the highest signal HKO issued, starting with No\. 10\. Storms with No\. 9 are listed with No\. 8 and marked \*\. Pick a storm and then a run\. Each run is named after the time its forecast started, in UTC\.$/,
  ()=>`選擇<span class="ui">最新預報</span>可查看最近一次預報。<span class="ui">過往熱帶氣旋</span>則按天文台曾發出的最高信號分組，由十號信號開始排列。曾發出九號信號的熱帶氣旋歸入八號信號一組，並以 * 標示。選定熱帶氣旋後，再選擇起報時間（協調世界時）。`],
 [/^The buttons below switch between ECMWF's physics model \(IFS\) and its AI model \(AIFS\)\. Older years use ECMWF's archived forecasts \(2008–2023\) or Pangu-Weather \(2018–2022\)\.$/,
  ()=>`下面的按鈕可切換 ECMWF 物理模式（IFS）及人工智能模式（AIFS）。較早年份則採用 ECMWF 的歷史預報資料（2008–2023）或盤古氣象（2018–2022）。`],
 [/^In this example, (\d+) of the (\d+) members gives? <span class="c(\d+)">No\. (\d+)<\/span>(?:, lasting about (\d+) hours)?\.$/,(m,n,M,c,L,h)=>`在這個例子中，${M} 個集合成員有 ${n} 個預測會達到<span class="c${c}">${NO[L]}</span>信號`+(h?`，預計持續約 ${h} 小時。`:"。")],
 [/^Signal No\. (\d+) likely \((\d+)%\)$/,(m,n,p)=>`預料發出${NO[n]}信號（${p}%）`],
 [/^Signal No\. (\d+)$/,(m,n)=>`${NO[n]}信號`],
 [/^Most likely no signal \((\d+)%\)$/,(m,p)=>`最可能無需發出信號（${p}%）`],
 [/^Updated (\d+) (\w{3}) (\d\d:\d\d) \(Hong Kong time\)$/,(m,d,mo,t)=>`更新時間：${"JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(mo)/3+1}月${d}日 ${t}（香港時間）`],
 [/^Past storm: (.+)$/,(m,a)=>`過往熱帶氣旋：${G(a)}`],
 [/^Peak Hong Kong wind index in each of the (\d+) members$/,(m,n)=>`${n} 個集合成員各自的最高香港風力指數`],
 [/^10–90%: (\d+)–(\d+) km\/h$/,(m,a,b)=>`第 10–90 百分位數：每小時 ${a}–${b} 公里`],
 [/^(deterministic run|control run): (\d+) km\/h$/,(m,w,v)=>`${/control/.test(w)?"控制預報":"高解像度預報"}：每小時 ${v} 公里`],
 [/^Member (\d+): (\d+) km\/h$/,(m,n,v)=>`成員 ${n}：每小時 ${v} 公里`],
 [/^map: <b>(\d+)<\/b> members? at (\d+)–(\d+) km\/h · click the bar again for all$/,(m,n,a,b)=>`地圖只顯示最高風力指數為每小時 ${a}–${b} 公里的 <b>${n}</b> 個集合成員 · 再按該柱可顯示全部`],
 [/^The line (?:is |and the shaded area ).+\.$/,m=>{const r=m.split(/(?<=\.) (?=[A-Z])/).map(p=>EX.get(p)); return r.every(x=>x)?r.join(""):undefined}],
 [/^times HKT(, median over the members giving the signal \(10–90% below\))?$/,(m,x)=>"時間為香港時間"+(x?"，為預測該信號的集合成員的中位數（第 10–90 百分位數見下方）":"")],
[/^No storm comes within 800 km of Hong Kong in this run, so no signals are worked out\. Shown: every storm in it that enters the region and reaches a tropical depression — (\d+) member paths(?: of ((?!systems not yet named)[^·]+?))?( (?:and|of) systems not yet named \(ECMWF's numbers 70 and up, each member's own\))? · black dashed = the (control|deterministic) run$/,
  (m,n,d,u,w)=>`本次預報沒有熱帶氣旋進入香港 800 公里範圍，因此沒有推算信號機會。地圖顯示本次預報中所有進入本區域、並已達熱帶低氣壓或以上級別的熱帶氣旋，共 ${n} 條集合成員路徑`+(d?`，包括${G(d)}`:"")+(u?`${d?"及":"，包括"}尚未命名的系統（ECMWF 編號 70 或以上，各成員各自編號）`:"")+` · 黑色虛線為${w==="control"?"控制預報":"高解像度預報"}`],
[/^Expected from <b>(.+?)<\/b> to <b>(.+?)<\/b> \(Hong Kong time\)$/,(m,x,y)=>`預計由 <b>${G(x)}</b> 至 <b>${G(y)}</b>（香港時間）`],
[/^Issued (\w{3}) (\d{1,2}) (\w{3}) (\d{4}), (\d\d:\d\d) \(Hong Kong time\)$/,(m,w,d,M,y,hm)=>`本網站發布時間：${y}年${MON[M]}月${d}日（${DOW[w]}）${hm}（香港時間）`],
[/^Forecast started (\w{3}) (\d{1,2}) (\w{3}) (\d{4}), (\d\d:\d\d) \(Hong Kong time\)(?:, chances worked out in (\d{4}))?$/,(m,w,d,M,y,hm,g)=>`預報起報時間：${y}年${MON[M]}月${d}日（${DOW[w]}）${hm}（香港時間）`+(g?`，機會率於 ${g} 年推算`:"")],
 [/^In (ECMWF's main forecast|the control run of ECMWF's AI model|this forecast), the storm comes closest to Hong Kong on <b>(.+?)<\/b>, about <b>([\d,]+) km<\/b> away\.( Google DeepMind does not make a main forecast\.)?$/,
  (m,w,d,n,g)=>`根據${{"ECMWF's main forecast":" ECMWF 高解像度預報","the control run of ECMWF's AI model":" ECMWF 人工智能模式的控制預報","this forecast":"這次預報"}[w]}，熱帶氣旋預料於<b>${G(d)}</b>最接近香港，屆時距離約 <b>${n} 公里</b>。`+(g?"Google DeepMind 沒有高解像度預報。":"")],
 [/^Expected closest distance to Hong Kong: <b>about (\d+) km<\/b>$/,(m,n)=>`預計最接近香港的距離：<b>約 ${n} 公里</b>`],
 [/^Closest to Hong Kong: <b>(\d+) km<\/b>\. Click the line to see how windy Hong Kong gets along it\.$/,(m,n)=>`最接近香港：<b>${n} 公里</b>。點選路徑，即可查看香港的預測風力。`],
 [/^Peak <b>(\d+) km\/h<\/b>(?: \((.+?)\))?, around (.+?) \(Hong Kong time\)(?: · ((?:close to|below|above|between) .+?))?( · dashed line: what Hong Kong really had)?$/,(m,v,b,t,c,o)=>`最高 <b>每小時 ${v} 公里</b>`+(b?`（${wib(b)}）`:"")+`，約於${G(t)}（香港時間）`+(c?`，${tt(c)||c}`:"")+(o?" · 虛線為香港實際錄得":"")],
 [/^HKO observed: (\d+) km\/h$/,(m,v)=>`天文台實測：每小時 ${v} 公里`],
 [/^In this example only (\d+) of the (\d+) members gives? No\. 3 or higher, which is fewer than half\.$/,(m,n,M)=>`在這個例子中，${M} 個集合成員只有 ${n} 個預測會達到三號或更高信號，未達半數。`],
 [/^In this example no member gives No\. 3\.$/,()=>`在這個例子中，沒有集合成員預測會達到三號信號。`],
 [/^In this run no station goes above F7\.$/,()=>`在這個例子中，所有測風站的預測風力均不超過 7 級。`],
 [/^In this run (.+?) reaches (≤F7|F(\d+)(?:–(\d+))?)\.$/,(m,s,f,a,b)=>`在這個例子中，${ST[s]||s}的預測風力可達 ${f==="≤F7"?"7 級或以下":b?`${a} 至 ${b} 級`:`${a} 級`}。`],
 [/^The examples below use the newest ECMWF forecast with a storm near Hong Kong, which started at <b>(\d+) (\w{3}) (\d{4}), (\d\d) UTC<\/b>(?: \((.+)\))?\.$/,(m,d,mo,y,h,p)=>`以下以 ECMWF 最近一次預測有熱帶氣旋接近香港的預報為例，起報時間為 <b>${y} 年 ${"JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(mo)/3+1} 月 ${d} 日 ${h} 時（協調世界時）</b>`+(p?`（${G(p)}）`:"")+"。"],
 [/^ECMWF runs each forecast 50 times, each from a slightly different start, and each run is a member\. Each line is one member's storm track\. Its colour shows the signal that member expects for Hong Kong when the storm is at that point\. Grey is No\. 1, then come <span class="c3">No\. 3<\/span>, <span class="c8">No\. 8<\/span>, <span class="c9">No\. 9<\/span> and <span class="c10">No\. 10<\/span>, and the colour steps down again as the storm moves away\.$/,
  ()=>`ECMWF 每次預報以略有不同的初始條件進行 50 次模擬，每次模擬稱為一個集合成員。地圖上每條線顯示一個成員預測的熱帶氣旋路徑，顏色則顯示熱帶氣旋移至不同位置時，該成員預測香港天文台需要發出的信號。灰色代表一號信號，其後依次為<span class="c3">三號</span>、<span class="c8">八號</span>、<span class="c9">九號</span>及<span class="c10">十號</span>信號。當熱帶氣旋遠離香港，顏色亦會隨預計信號降級而改變。`],
 [/^Press <span class="ui">▶ all members<\/span> to play every storm forward, 24 hours a second\. You can try it here, because this is the real map\.$/,()=>`按<span class="ui">▶ 播放全部成員</span>，即可觀看熱帶氣旋沿各條預測路徑同步移動，每秒播放 24 個預報小時。地圖亦可直接操作。`],
 [/^Press <span class="ui">▶ all members<\/span> to move every member's storm forward together, 24 forecast hours a second\. The large black dot is the deterministic run\.$/,()=>`按<span class="ui">▶ 播放全部成員</span>，即可觀看熱帶氣旋沿各條預測路徑同步移動，每秒播放 24 個預報小時。大黑點顯示高解像度預報中熱帶氣旋的位置。`],
 [/^The track changes colour where that member expects each signal\. Grey is No\. 1, then come <span class="c3">No\. 3<\/span>, <span class="c8">No\. 8<\/span>, <span class="c9">No\. 9<\/span> and <span class="c10">No\. 10<\/span>, and the colour steps down again as the storm moves away\.$/,
  ()=>`路徑顏色會隨該成員預測的信號級別而改變。當熱帶氣旋遠離香港，顏色亦會隨信號降級而改變。`],
 [/^Use the player under the map to step through the hours\. To see all members again, press the large <span class="ui">← Back to all members<\/span> button at the top left of the map\.$/,()=>`利用地圖下方的播放控制列，可逐小時查看預測變化。如要重新顯示所有成員，按地圖左上角的<span class="ui">← 返回全部成員</span>。`],
 [/^Press <span class="ui">zoom to Hong Kong<\/span> to see HKO's eight stations, coloured by expected wind\.$/,()=>`按<span class="ui">放大香港範圍</span>，即可查看八個參考測風站的預測風力。`],
 [/^Press <span class="ui">zoom to Hong Kong<\/span> to see HKO's eight reference stations\. Each dot's colour shows the wind expected at that station, and its Beaufort force is next to the name\.$/,()=>`按<span class="ui">放大香港範圍</span>，即可查看天文台八個參考測風站。圓點顏色顯示各站的預測風力，站名旁則列出蒲福氏風級。`],
 [/^<b>(\d+)<\/b> of (\d+) give No\. 3$/,(m,n,M)=>`${M} 個集合成員中有 <b>${n}</b> 個預測三號信號`],
 [/^median <b>(\d+) km\/h<\/b>(?: \((.+?)\))?$/,(m,v,b)=>`中位數 <b>每小時 ${v} 公里</b>`+(b?`（${tt(b)||b}）`:"")],
 [/^Not compared: MET WARN's No\. (\d+) forecast for (.+? \d{4}) \((\d+) (\w{3}), (\d\d:\d\d) HK time\), because this site does not forecast No\. 9\.$/,(m,l,s,d,mo,t)=>`未作比較：MET WARN 對${G(s)}的${NO[l]}信號預測（${"JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(mo)/3+1}月${d}日 ${t}，香港時間），因本網站不預測九號信號。`],
 [/^The <span class="ui">Estimated wind<\/span> tab gives each station's chances and expected wind\.$/,()=>`<span class="ui">估計風力</span>分頁列出各測風站出現烈風、暴風及颶風的機會，以及預計風速。`],
 [/^The <span class="ui">Estimated wind<\/span> tab under the map lists each station's chance of gale \(63 km\/h\), storm force \(88 km\/h\) and hurricane force \(118 km\/h\), with a rough expected wind\.$/,
  ()=>`地圖下方的<span class="ui">估計風力</span>分頁列出各測風站出現烈風（每小時 63 公里）、暴風（每小時 88 公里）及颶風（每小時 118 公里）的機會，以及風速參考值。`],
 [/^For past storms it adds what HKO recorded and the difference\. <span class="down">Red<\/span> means the forecast was too low, <span class="up">green<\/span> too high\.$/,()=>`過往個案亦會列出天文台實測風速，以及預測與實測的差距。<span class="down">紅色</span>代表預測偏低，<span class="up">綠色</span>代表偏高。`],
 [/^<span class="ui">How good is it\?<\/span> sets past forecasts beside what HKO did, storm by storm\.$/,()=>`<span class="ui">預報表現</span>逐個熱帶氣旋比較過往預報與天文台實際發出的信號。`],
 [/^<a href="verify-zh\.html">How good is it\?<\/a> has the full record, signal by signal and station by station\.$/,()=>`<a href="verify-zh.html">預報表現</a>載有完整紀錄，按信號及測風站列出。`],
 [/^This site's chance is the share of the forecast versions that reach the signal for that storm, from the forecast this site opens on: Google DeepMind's \(Weather Lab cyclone forecast, 50 versions\) where it had a track for the storm, otherwise ECMWF's physics forecast \(about 50 versions\)\. It is the newest run that was public when MET WARN posted \(Google DeepMind about 8 hours after the run started, ECMWF about 13 hours\), so the forecast was (\d+)–(\d+) hours older than the post; each row names the forecast used\. MET WARN posts some forecasts as pictures only; those are marked\. Sources: MET WARN's posts on its public channel \((<a [^>]+>[^<]+<\/a>), read October 2026\) and HKO's signal records\.$/,
  (m,lo,hi,a)=>`本網站的機會率，是本網站開啟時所用預報中預測該信號的集合成員比例：Google DeepMind 已追蹤該熱帶氣旋時，採用其 Weather Lab 熱帶氣旋預報（50 個集合成員），否則採用 ECMWF 物理模式（約 50 個集合成員）。採用 MET WARN 發帖時已公開的最新一次預報（Google DeepMind 約於起報後 8 小時公開，ECMWF 約 13 小時），所以預報比帖文早 ${lo} 至 ${hi} 小時；每行均註明所用的預報。MET WARN 部分預測只以圖片公布，已註明。資料來源：MET WARN 公開頻道（${a}，2026年10月閱覽）及天文台的熱帶氣旋警告信號紀錄。`],
 [/^(Google DeepMind|ECMWF), forecast (\d+) h old$/,(m,f,a)=>`${f}：對照時，模式預報已是 ${a} 小時前的版本`],
 [/^This site's chance is the share of its forecast versions \(about 50\) that reach the signal for that storm, from ECMWF's physics forecast\. It is the newest ECMWF run \(four a day\) that would have been on this site when MET WARN posted, about 13 hours after the run started, so this site's forecast was (\d+)–(\d+) hours older than the post\. MET WARN posts some forecasts as pictures only; those are marked\. Sources: MET WARN's posts on its public channel \((<a [^>]+>[^<]+<\/a>), read October 2026\) and HKO's signal records\.$/,
  (m,lo,hi,a)=>`本網站的機會率，是 ECMWF 物理模式約 50 個集合成員中預測該信號的比例，採用 MET WARN 發帖時本網站已有的最新一次 ECMWF 預報（每日四次，約於起報後 13 小時上載），所以本網站的預報比 MET WARN 的帖文早 ${lo} 至 ${hi} 小時。MET WARN 部分預測只以圖片公布，已註明。資料來源：MET WARN 公開頻道（${a}，2026年10月閱覽）及天文台的熱帶氣旋警告信號紀錄。`]
];
let CUR=null;
function galeRow(m,ttl,lab,dots,n,M,rg,lo,hi,dt,d){
 const obs=CUR&&/HKO actually|天文台實際|HKO recorded|天文台實測/.test(((CUR.closest(".ans")||{}).querySelector&&CUR.closest(".ans").querySelector(".k")||{}).textContent||"");
 const lv=/[Hh]urricane/.test(lab)?"颶風":/[Ss]torm/.test(lab)?"暴風":"烈風", rec=obs||/recorded/.test(lab), L=rec?`錄得${lv}的參考測風站`:`達${lv}程度的參考測風站`;
 const t=ttl?` title="${tt(ttl.slice(8,-1))||ttl.slice(8,-1)}"`:"";
 return `<span class="gl"${t}>${L}</span> ${dots} <b class="gn">${n}</b>／${M} 個`+(rg?` <span class="rng">（第 10–90 百分位數：${lo}–${hi} 個）</span>`:"")+(dt?` <span class="rng">｜高解像度預報：${d} 個</span>`:"")}
const VH={"Gale stations":"烈風測風站數目：預測與實測比較","Wind index":"最高風力指數：預測與實測比較","Signals: this site and MET WARN, storm by storm":"警告信號預測比較：本網站與 MET WARN"};
const NBSP=/\u00a0/g, norm=s=>s.replace(NBSP," ").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim();
function tt(s){const k=norm(s);
 const mw=k.match(/^([\u4e00-\u9fff]+) = ([\u4e00-\u9fff]+)$/); if(mw)return `${mw[2]}（原文：${mw[1]}）`;
 if(k==="members"&&/^\s/.test(s))return " 個集合成員"+(/\s$/.test(s)?" ":"");
 if(!k||!/[A-Za-z]/.test(k))return null;
 let r=EX.get(k);
 if(r===undefined)for(const x of RX){if(!x)continue; const [re,f]=x, m=k.match(re); if(m){try{r=f(...m)}catch(e){r=undefined} break}}
 if(r===undefined||r===null){const g=G(k); if(g!==k)r=g; else return null}
 const lead=/^\s/.test(s)&&!/^\s/.test(r)?" ":"", trail=/\s$/.test(s)&&!/\s$/.test(r)?" ":"";
 return lead+r+trail}
const INL=/^(B|I|EM|STRONG|SPAN|A|BR|SMALL|SUP|SUB|CODE|KBD|ABBR)$/;
const isLeaf=e=>{for(const c of e.children){if(!INL.test(c.tagName)||!isLeaf(c))return false} return true};
function block(e){if(e.closest&&e.closest("svg"))return; if(!isLeaf(e)||!/[A-Za-z]/.test(e.textContent))return; const h=norm(e.innerHTML); CUR=e;
 if(/^H[23]$/.test(e.tagName)&&/verify/.test(location.pathname)&&VH[norm(e.textContent)]){e.textContent=VH[norm(e.textContent)]; return}
 for(const x of BX){if(!x)continue; const [re,f]=x, m=h.match(re); if(m){if(!f)return; let r; try{r=f(...m)}catch(err){return} if(r!=null&&r!==h)e.innerHTML=r; return}}}
const ATTR=["title","aria-label","alt","placeholder"];
function attrs(e){for(const a of ATTR){const v=e.getAttribute&&e.getAttribute(a); if(v){const r=tt(v); if(r!=null&&r!==v)e.setAttribute(a,r)}}}
function walk(root){if(!root)return; if(root.nodeType===3){const r=tt(root.data); if(r!=null&&r!==root.data)root.data=r; return}
 if(root.nodeType!==1||/^(SCRIPT|STYLE)$/.test(root.tagName))return;
 if(root.closest&&root.closest('[translate="no"]'))return;
 const els=[root,...root.querySelectorAll("*")]; els.forEach(e=>{if(!/^(SCRIPT|STYLE)$/.test(e.tagName)&&!e.closest('[translate="no"]')){attrs(e); block(e)}});
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); let n; const list=[];
 while(n=w.nextNode()){const p=n.parentElement; if(p&&!/^(SCRIPT|STYLE)$/.test(p.tagName)&&!p.closest('[translate="no"]'))list.push(n)}
 list.forEach(x=>{const r=tt(x.data); if(r!=null&&r!==x.data)x.data=r})}
let busy=false, obs=null;
function run(fn){busy=true; try{fn()}finally{if(obs)obs.takeRecords(); busy=false}}
function start(){
 run(()=>{walk(document.body); const t=tt(document.title); if(t)document.title=t});
 obs=new MutationObserver(ms=>{if(busy)return; run(()=>{const seen=new Set();
  for(const m of ms){if(m.type==="childList"){m.addedNodes.forEach(x=>{const t=x.nodeType===3?x.parentElement:x; if(t&&!seen.has(t)){seen.add(t); walk(t); if(x.nodeType===3&&t.parentElement)block(t)}})}
   else if(m.type==="characterData"){const t=m.target.parentElement; if(t&&!seen.has(t)){seen.add(t); walk(t)}}
   else if(m.type==="attributes"&&m.target.nodeType===1)attrs(m.target)}})});
 obs.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTR})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start); else start();
})();
