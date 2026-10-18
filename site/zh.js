(function(){
"use strict";
const STORM={"Chanthu":"燦都","Dianmu":"電母","Fanapi":"凡亞比","Jebi":"飛燕","Mawar":"瑪娃","Megi":"鮎魚","Mujigae":"彩虹","Neoguri":"浣熊","Nock-Ten":"洛坦","Pabuk":"帕布","Rammasun":"威馬遜","Rumbia":"溫比亞","Sarika":"莎莉嘉","Soudelor":"蘇迪羅","Trami":"潭美","Yinxing":"銀杏","Barijat":"百里嘉","Bebinca":"貝碧嘉","Cempaka":"查帕卡","Chaba":"暹芭","Danas":"丹娜絲","Doksuri":"杜蘇芮","Ewiniar":"艾雲尼","Fengshen":"風神","Fung-wong":"鳳凰","Fung-Wong":"鳳凰","Goni":"天鵝","Hagupit":"黑格比","Haima":"海馬","Hato":"天鴿","Higos":"海高斯","Kai-Tak":"啟德","Kajiki":"劍魚","Kalmaegi":"海鷗","Kammuri":"北冕","Khanun":"卡努","Koinu":"小犬","Kompasu":"圓規","Koppu":"巨爵","Linfa":"蓮花","Lionrock":"獅子山","Lupit":"盧碧","Ma-On":"馬鞍","Maliksi":"馬力斯","Mangkhut":"山竹","Matmo":"麥德姆","Maysak":"美莎克","Merbok":"苗柏","Mitag":"米娜","Molave":"莫拉菲","Mulan":"木蘭","Nalgae":"尼格","Nangka":"浪卡","Nesat":"納沙","Nida":"妮妲","Nongfa":"藍湖","Noul":"紅霞","Nuri":"鸚鵡","Pakhar":"帕卡","Podul":"楊柳","Ragasa":"樺加沙","Roke":"洛克","Saola":"蘇拉","Saudel":"沙德爾","Sinlaku":"森拉克","Son-Tinh":"山神","Talim":"泰利","Tapah":"塔巴","Toraji":"桃芝","Usagi":"天兔","Utor":"尤特","Vicente":"韋森特","Wipha":"韋帕","Wutip":"蝴蝶","Yagi":"摩羯","Yutu":"玉兔"};
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
 "ECMWF ensemble forecasts turned into Hong Kong signal chances. Research output — the Hong Kong Observatory is the only authority for actual signals.":"本網站根據歐洲中期預報中心（ECMWF）的集合預報，由電腦自動估算香港各熱帶氣旋警告信號的機會率，不經人手修訂，只供研究參考。熱帶氣旋警告信號以香港天文台發出的為準。",
 "Highest signal a majority gives":"過半數集合成員預測的最高風球","Highest signal":"最高風球","none":"沒有","no majority":"未達過半數","Gale stations":"烈風","Storm force":"暴風","Hurricane force":"颶風","Forecast, at any time from this run onward":"預測：由今次預報起任何時間","Reference stations reaching gale force":"達烈風程度的參考測風站","Reference stations reaching storm force":"達暴風程度的參考測風站","Reference stations reaching hurricane force":"達颶風程度的參考測風站",
 "Station":"測風站","Gale chance":"烈風機會率","Wind guide, km/h":"風速參考值（公里每小時）","HKO":"天文台","What do these numbers mean?":"如何解讀這些數字？",
 "HKO actually issued":"天文台實際發出的最高信號","Timeline · Hong Kong time":"時間線（香港時間）","forecast, median start → median end":"預測時段：成員開始及結束時間的中位數",
 "deterministic run":"高解像度預報","Deterministic run":"高解像度預報","control run":"高解像度預報","Control run":"高解像度預報","faded: fewer than half the members":"淡色：不足半數成員",
 "Numbers per signal":"各級信號詳細數據","members":"集合成員","starts":"開始","ends":"結束","hours":"時數","deterministic":"高解像度預報","not issued":"沒有發出","main period":"主要時段","other periods":"其他時段",
 "Map":"地圖","zoom to Hong Kong":"放大香港範圍","zoom out":"顯示整個區域","Zoom in":"放大","Zoom out":"縮小","Move west":"向西移","Move north":"向北移","Move south":"向南移","Move east":"向東移","Back to the starting view":"還原地圖範圍","Move and zoom the map":"移動及縮放地圖","Forecast map":"預報地圖","The buttons under the map zoom in and out (+ −), move it (← ↑ ↓ →) and bring back the starting view (↺).":"地圖下方的按鈕可放大或縮小地圖（+ −）、移動地圖（← ↑ ↓ →）及還原地圖範圍（↺）。","▶ all members":"▶ 播放全部成員","❚❚ pause":"❚❚ 暫停","within 150 km only":"只顯示進入香港 150 公里範圍的預測路徑","▶ play":"▶ 播放",
 "← Back to all members":"← 返回全部成員","Signal along each track":"路徑顏色代表該成員推算的警告信號","another storm of the same member":"同一預報中的其他熱帶氣旋","other tropical cyclones in the same forecast":"同一預報中的其他熱帶氣旋",
 "a signal counts at chance ≥ 0.30 (No. 10: ≥ 0.40)":"推算信號的最低機會率門檻：30%（十號：40%）","Tap or click a line to follow one member.":"按任何一條路徑，可單獨顯示該成員。",
 "Expected signal":"預測信號","Wind index":"風力指數","Station guide":"測風站預報","ensemble-mean wind index":"集合平均風力指數","Sequence:":"順序（UTC）：",
 "dashed = observed":"虛線為實況","gale stations":"烈風測風站","Gale":"烈風","Storm":"暴風","Hurricane":"颶風","Expected wind, km/h":"風速參考值（公里每小時）","HKO, km/h":"天文台實測（公里每小時）",
 "Difference, km/h":"相差（公里每小時）","Gale, storm and hurricane are each station's chances.":"烈風、暴風及颶風三欄為各測風站的機會率。",
 "Station numbers are not ready for this run yet.":"這次預報的測風站數字尚未準備好。","Days are UTC · numbers only, no model files":"UTC 為協調世界時，即香港時間減八小時 · 只提供數字，不含模式檔案",
 "Lines:":"路徑：","Deterministic run:":"高解像度預報：","Control run:":"高解像度預報：","Members.":"集合成員：","Deterministic run.":"高解像度預報：","Control run.":"高解像度預報：","The times.":"時間：",
 "Gale stations.":"烈風測風站：","Storm and hurricane force":"暴風及颶風","Stations":"各測風站風速參考值","HKO issued":"天文台發出","Hong Kong":"香港","no member":"沒有成員",
 "probability for this member":"該成員的機會率","wind index (km/h)":"風力指數（公里每小時）","— Hong Kong wind index (right axis, km/h)":"— 香港風力指數（右軸，公里每小時）",
 "- - what HKO actually issued":"- - 天文台實際發出","- - observed wind index (HKO station winds)":"- - 實測風力指數（天文台測風站風速）","light":"輕微","fresh":"清勁","strong":"強","very strong":"甚強","extreme":"極強",
 "below 53 km/h":"每小時 53 公里以下","signal":"信號","pages":"頁面","storm":"熱帶氣旋","run":"起報時間","HKO's highest signal":"天文台最高信號",
 "1. the highest signal HKO issued for the storm":"一、天文台曾發出的最高信號","2. the storm":"二、熱帶氣旋","3. the run (start time, UTC)":"三、起報時間（協調世界時）",
 "the forecasts that exist for this run -- each is its own system, judged on its own past":"這個起報時間可選的模式；各模式分開驗證",
 "timeline of forecast and actual signals":"預測及實際信號時間線","ECMWF's main forecast, made once in finer detail than the members, shown on its own: track, time bar, charts":"單獨顯示 ECMWF 的高解像度預報：路徑、時間軸及圖表",
 "back to every member of this run":"返回這次預報的全部成員","play this member's storm through time":"播放該成員的熱帶氣旋路徑","time along this member's track":"該成員路徑上的時間","animation speed":"播放速度",
 "the wind index averaged over all ensemble members, hour by hour":"所有集合成員每小時的平均風力指數","Most threatening member":"對香港影響最大的成員",
 "Chances of signals No. 3, 8 and 10 for Hong Kong":"香港三號、八號及十號信號機會率","From every ECMWF forecast, updated every 6 hours.":"根據每次 ECMWF 預報自動計算，每 6 小時更新。",
 "Research output. The Hong Kong Observatory is the only authority for actual signals.":"本網站只供研究參考，熱帶氣旋警告信號以香港天文台發出的為準。","Start the tour":"開始導覽","On the page":"跳至章節",
 "Answer":"預報結果","Timeline":"時間線","Charts":"圖表","Text":"說明","Short":"精簡","Full":"詳細","Choose today or a past storm":"選擇最新預報或過往個案","Read the answer":"如何閱讀預報結果","What the forecast says":"如何閱讀預報結果","Summary":"預報結果","Forecast at a glance":"預報結果",
 "The big number is the signal most of the ~50 forecast versions reach.":"大字顯示獲過半數集合成員預測的最高風球。",
 "ECMWF runs each forecast about 50 times. The page calls each version a member. The big number is the highest signal that most members reach, with when it starts and ends in Hong Kong time.":"ECMWF 集合預報約有 50 個成員。頁面以大字顯示獲過半數成員預測的最高風球，下方則列出預計生效時段（香港時間）。",
 "Below it you see how many of HKO's eight reference stations get gale, storm or hurricane winds. For a past storm, HKO's own record sits next to it.":"再下面是八個參考測風站中，預測有多少個達到烈風、暴風或颶風程度；歷史個案會在旁列出天文台的實際紀錄。",
 "See when each signal is up":"各級信號預測時段","Bars show when each signal starts and ends, in Hong Kong time.":"橫條顯示各級信號的預計生效時段（香港時間）。",
 "Each bar covers one signal, in Hong Kong time. The solid part runs from the members' middle start to their middle end. The pale part spans the earliest 10% to the latest 90%.":"每條橫條代表一級警告信號的預測時段。深色橫條由預測開始時間的中位數延伸至結束時間的中位數；淺色部分則由開始時間的第 10 百分位數延伸至結束時間的第 90 百分位數，反映各成員預測的時間差異。",
 "The thin line is the deterministic run, ECMWF's single main forecast. HKO's real signals run along the top.":"細線標示高解像度預報的信號時段，最上方則顯示天文台實際發出的信號。",
 "Every line is one member":"了解預測路徑","Each line is one forecast run, coloured by the signal it expects along the way.":"每條線代表一個集合成員，顏色代表不同時刻的預測風球。",
 "The thick black dashed line is the deterministic run. For past storms, the black dashed line with dots is where the storm really went. The circles mark distances from Hong Kong.":"粗黑虛線是高解像度預報；過往熱帶氣旋的實際路徑以帶圓點的黑虛線顯示。以香港為中心的同心圓表示距離。",
 "Watch all members move":"播放全部預測路徑","You can watch the spread grow, and see whether it closes on Hong Kong.":"可觀察各條預測路徑如何隨時間分散，以及熱帶氣旋會否移近香港。",
 "Follow one member":"查看個別集合成員","Click a line to see when that member expects each signal, by colour.":"點選路徑即可查看個別成員的預測，顏色代表不同時刻的風球。",
 "Click any line to see that member alone, and where its storm is at every hour.":"按任何一條路徑，即可單獨顯示該成員，以及熱帶氣旋每小時的位置。",
 "Zoom in on the eight stations":"查看八個參考測風站","In this run Cheung Chau reaches F12.":"今次預報顯示，長洲風力可達 12 級。","Compare each station with HKO":"比較預測與實測風速",
 "Check how good it is":"查看過往預報表現","For every storm of 2025 and 2026 it sets this site's chance of each signal beside MET WARN's forecast and what HKO raised.":"2025 及 2026 年每個熱帶氣旋，本網站各信號的機會率均與 MET WARN 的預測及天文台實際發出的信號並列比較。",
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
 "this site closer":"本網站較接近實際結果","MET WARN closer":"MET WARN 較接近實際結果","same call":"落在相同機會率區間","waiting for this site":"待本網站補上","not compared":"不作比較",
 "Question":"預測項目","MET WARN said":"MET WARN 預測","This site said":"本網站預測","HKO raised it?":"天文台最終有否發出？","Who was closer":"哪個預測較接近實際結果？","This site":"本網站","MET WARN":"MET WARN",
 "medium":"中等","high":"高","medium-low":"中低","very high":"極高","low":"低","medium-high":"中高","Yes":"有","No":"沒有","–":"–","All":"全部",
 "this site does not forecast No. 9":"本網站未有提供九號信號的獨立機會率","this storm's forecasts are being added":"預報資料整理中",
 "How many of HKO's 8 reference stations had gale winds, against what HKO recorded.":"預測達到烈風程度的參考測風站數目，與天文台實際錄得的數目比較。",
 "ECMWF AI":"ECMWF 人工智能","Pangu-Weather":"盤古氣象","Old ECMWF":"舊 ECMWF","runs":"次預報","exactly right":"完全吻合","stations off on average":"個測風站（平均相差）",
 "Each circle = runs with the same pair of numbers; bigger = more runs. On the dashed line = same as HKO. Hover or tap a dot for details.":"每個圓圈代表數字相同的預報，圓圈愈大，預報愈多；落在虛線上即與天文台相同。把滑鼠移到圓點上或按圓點可看詳情。",
 "Storm peaks":"各熱帶氣旋的最高風力指數","Period":"時期","Since Aug 2021":"2021年8月起","2004 to Jul 2021":"2004年至2021年7月","storms":"個熱帶氣旋","too low on average":"平均偏低","too high on average":"平均偏高","typical miss":"一般誤差",
 "Each dot = one storm's highest wind index. On the dashed line = same as observed; above = too high, below = too low. Hover or tap a dot for details.":"每點代表一個熱帶氣旋的最高風力指數；落在虛線上即與實測相同，虛線以上偏高，以下偏低。把滑鼠移到圓點上或按圓點可看詳情。",
 "Since Aug 2021 against HKO's station winds; 2004–2021 against the peaks HKCOC published.":"2021年8月起與天文台測風站風速比較；2004至2021年與 HKCOC 公布的最高值比較。",
 "stations with gale, HKO":"實際錄得烈風的測風站數目（天文台）","stations with gale, this site (middle version)":"預測達到烈風程度的測風站數目（本網站，中位成員）",
 "observed peak, from HKO's station winds (km/h)":"實測最高值（根據天文台測風站風速，公里/小時）","peak this site estimates (km/h)":"本網站估計的最高值（公里/小時）","this site against HKO's record":"本網站與天文台紀錄比較",
 "F7 or less":"7級或以下","Ranking":"排名","See it in the storm ranking":"在熱帶氣旋排名中查看","not available":"未能提供","All forecasts":"全部預報","Old ECMWF":"舊 ECMWF","ECMWF runs its physics ensemble to full range only at 00Z and 12Z.":"歐洲中期天氣預報中心只在 00Z 及 12Z 運行完整的物理模式集合預報。","Nearest run with it:":"最接近而有此預報的運行：","not available for this run time":"這個時間沒有此預報","Not available":"未能提供","DeepMind had no storm near Hong Kong to follow in this run. It only forecasts storms that have already formed, so this is not a forecast of no threat.":"DeepMind 這次預報沒有追蹤香港附近的熱帶氣旋。DeepMind 只預報已經形成的熱帶氣旋，所以這並不表示沒有威脅。","not available (DeepMind had no storm near Hong Kong to follow)":"未能提供（DeepMind 沒有追蹤香港附近的熱帶氣旋）","Storm and hurricane counts use HKO's maximum hourly mean winds; the station table uses the highest 10-minute mean.":"暴風及颶風測風站數目根據天文台公布的最高每小時平均風速；測風站表則採用最高十分鐘平均風速。","experimental":"試驗性質","Read each station":"逐站查看","The thin line is the deterministic run, ECMWF's single main forecast. For past storms, HKO's real signals run along the top.":"細線標示高解像度預報的信號時段；過往熱帶氣旋則在最上方顯示天文台實際發出的信號。","peaks of all members":"各成員最高值","peak wind index (km/h)":"最高風力指數（公里每小時）","— wind index (right axis)":"— 風力指數（右軸）","HKO observed":"天文台實測","Run to run · members giving each signal":"歷次預報 · 預測各級信號的集合成員數目","- - half of the members":"- - 半數集合成員","HKO No. 3 or higher up":"天文台三號或以上信號生效","Each dot is one run; click a dot to open that run.":"每一點代表一次預報，按下即可開啟該次預報。","Old ECMWF (physics)":"舊 ECMWF 物理模式","click a bar to see its tracks":"按柱可顯示相關路徑","Run to run · chance of each signal":"歷次預報 · 各級信號的機會率","Basic":"簡易","Advanced":"進階","No storm near Hong Kong":"香港附近沒有熱帶氣旋","No tropical cyclone is forecast to come within 800 km of Hong Kong.":"預測沒有熱帶氣旋進入香港 800 公里範圍。","No signal expected":"預料無需發出信號","How the chance changed with each new forecast":"每次更新預報時各級信號機會率的變化","Each dot is one forecast; click a dot to open it.":"每一點代表一次預報，按下即可開啟。","Each line is one possible path; its colour shows the signal expected along it.":"每條線代表一條可能路徑，顏色代表沿途預料的信號。","▶ play":"▶ 播放","Chances of tropical cyclone warning signals for Hong Kong, from computer forecasts. Research output — the Hong Kong Observatory is the only authority for actual signals.":"根據電腦預報推算的香港熱帶氣旋警告信號機會率。此為研究結果，熱帶氣旋警告信號以香港天文台發出者為準。","Signal expected along each path":"沿途預料的信號","signal expected along each path":"沿途預料的信號","Start the tour: which page?":"開始導覽：想了解哪個版本？","Signal chances and the possible paths":"各級信號的機會率及熱帶氣旋可能路徑","Everything, incl. stations and each forecast model":"全部資料，包括測風站及各個預報模式","1. How likely is No. 3, No. 8 or No. 10?":"1. 三號、八號及十號信號的機會有多大？","The headline says whether a signal is likely. The bars give the chance of No. 3, No. 8 and No. 10: the share of about 50 computer forecasts that bring each signal to Hong Kong. Below them: when the signal is most likely, and how close the storm is expected to come.":"標題顯示是否可能需要發出信號。橫條顯示三號、八號及十號信號的機會率，即約 50 個電腦預報中推算香港需要發出該信號的比例。下方列出信號最可能生效的時間，以及熱帶氣旋預計最接近香港的距離。","2. Is it getting more likely?":"2. 機會是否正在增加？","A new forecast comes out twice a day. Each dot is one forecast's chance of each signal; a line rising to the right means that signal is getting more likely.":"每天會有兩次新預報。每一點代表一次預報推算的各級信號機會率；線向右上升，即代表該信號的機會正在增加。","3. Where the storm may go":"3. 熱帶氣旋可能的路徑","Each line is one possible path of the storm, coloured by the signal Hong Kong would expect as it passes: grey for No. 1, then No. 3, No. 8 and No. 10. Lines close together mean the forecasts agree; spread out, they do not.":"每條線代表熱帶氣旋一條可能的路徑，顏色代表其經過時香港預料需要發出的信號：灰色為一號，其次為三號、八號及十號。線條越集中，代表各預報越一致；越分散，則越不確定。","4. Watch it move":"4. 觀看移動過程","Press ▶ play to see every possible path move through time.":"按 ▶ 播放，即可觀看所有可能路徑隨時間移動。","5. Want more detail?":"5. 想了解更多？","Switch to Advanced at the top of the forecast page: the eight reference stations, each forecast model and the full numbers.":"可在預報頁面頂部切換至進階模式，查看八個參考測風站、各個預報模式及完整數據。","The forecast":"預測結果","When":"時間","Trend":"趨勢","Member charts":"集合成員圖表","Gale force":"烈風","Reference stations, forecast (any time from this run)":"參考測風站預測（由今次預報起任何時間）","Reference stations, recorded by HKO":"參考測風站天文台實測","Each line is one possible path; its colour shows the signal expected along it. Click a line to see how windy Hong Kong gets along it.":"每條線代表一條可能路徑，顏色代表沿途預料的信號。按下路徑，即可查看沿途香港的風勢。","← All paths":"← 返回全部路徑","Along this path: how windy Hong Kong gets":"沿這條路徑：香港的風勢","Along this path the storm stays more than 800 km from Hong Kong.":"沿這條路徑，熱帶氣旋與香港保持 800 公里以上距離。","The Hong Kong wind index is one number for how windy Hong Kong is overall: an unofficial index from HKCOC, a weighted average of the 10-minute winds and gusts at 20 Hong Kong Observatory stations, in km/h. Light below 14, fresh 14–24, strong 25–44, very strong 45–74, extreme 75 or more.":"香港風力指數以一個數值表示全港整體風勢：由 HKCOC 提出的非官方指數，以天文台 20 個測風站的十分鐘平均風速及陣風加權平均計算，單位為公里/小時。輕微：14 以下；清勁：14–24；強：25–44；甚強：45–74；極強：75 或以上。","Wind at Hong Kong's reference stations":"香港參考測風站的風力","HKO recorded":"天文台實測","No signal":"沒有信號","Google DeepMind (AI)":"Google DeepMind（人工智能）","(CC BY 4.0), turned into Hong Kong signal chances here":"（CC BY 4.0），本網站據此推算香港信號機會率","· data:":"· 資料：","Ideas":"意見","Ideas & suggestions":"意見與建議","Got an idea? Hoist it.":"有好主意？掛起來吧。","Something you would like to see, something that confused you, a storm we should add. Write it below and hoist it up the mast. We read every one.":"想看到甚麼新功能、哪裏看不明白、想我們加入哪個熱帶氣旋，都可以寫下來，把它掛上信號桿。每一則我們都會細閱。","Name or email, only if you would like a reply (optional)":"名字或電郵（如希望我們回覆才需填寫，可留空）","e.g. Show the chance of No. 8 for Macau too":"例如：也顯示澳門八號信號的機會率","Hoist it ↑":"掛起來 ↑","Your message goes only to the people who run this site. Nothing you write is published.":"留言只會送到本網站的負責人，不會公開。","The ideas box opens soon.":"意見箱即將開放。","Write a few words first.":"請先寫幾個字。","Hoisting…":"掛起中……","Hoisted — thanks! We have it.":"已掛起，多謝！我們收到了。","Hoisted (preview: nothing was sent).":"已掛起（預覽：沒有送出）。","It did not go through. Please try again in a moment.":"未能送出，請稍後再試。","waiting for your idea":"等待你的意見","Tracks are not shown for live Google DeepMind forecasts: while a forecast is live, Google's terms let this site publish only results worked out from it, such as the signal chances and the winds at Hong Kong. The tracks appear here once the storm has passed.":"Google DeepMind 的實時預報不顯示路徑：Google 的使用條款只容許本網站在預報期間公開由預報推算出來的結果，例如信號機會率及香港的風力。熱帶氣旋過後，路徑會在這裏顯示。","turned into Hong Kong signal chances here; Google is not involved in this site":"本網站據此推算香港信號機會率；Google 並無參與本網站","Google DeepMind Weather Lab. © 2024-6 Google LLC, whose machine learning models were used to create the experimental data made available under the following licence terms https://storage.googleapis.com/weathernext-public/terms-of-use.pdf. This data is intended for experimental modelling only and is not intended, validated, or approved for real world use.":"Google DeepMind Weather Lab. © 2024-6 Google LLC, whose machine learning models were used to create the experimental data made available under the following licence terms https://storage.googleapis.com/weathernext-public/terms-of-use.pdf. This data is intended for experimental modelling only and is not intended, validated, or approved for real world use.","Data and credits":"資料來源及鳴謝","No threat":"沒有威脅","No data for this run.":"這次預報沒有資料。","One run.":"單一預報：","This run gives":"這次預報推算的信號","This forecast is a single run, so it gives one answer instead of a share of members.":"這個預報只有一次計算，所以只給出一個結果，而非成員比例。","no timing in this run's data":"這次預報沒有時間資料","deterministic run only":"只有高解像度預報","not reached":"未達到","unavailable":"未能提供","this member's storm never comes within 800 km of Hong Kong, the range the wind index covers":"這個成員的熱帶氣旋不會進入香港 800 公里範圍（風力指數的計算範圍）","no wind index for this run (runs exported before it was added)":"這次預報沒有風力指數（較早的預報未有計算）","no values for this member in this run":"這次預報中這個成員沒有數值","ECMWF physics":"ECMWF 物理模式","▼ HKO":"▼ 天文台"
}));
const RX=[
 [/^No\. (8 and 9|\d+) \((\d+) storms?\)$/,(m,a,n)=>`${a==="8 and 9"?"八號及九號":NO[a]}（${n} 個）`],
 [/^· produced (\S+ \S+) UTC \((\d+) h ago\)(?: · past case: (.+?) — HKO No\. (\d+) on (.+?) \(a fair test: not used to set up the site\))?$/,
  (m,t,h,c,n,d)=>` · ${t} UTC 計算（${h} 小時前）`+(c?` · 過往熱帶氣旋：${G(c)}，天文台曾於${G(d)}發出${NO[n]}信號（沒有用於調校本網站）`:"")],
 [/^of (\d+) members pass within (\d+) km ·$/,(m,a,b)=>` / ${a} 個集合成員在香港 ${b} 公里範圍內掠過 · `],
 [/^within (\d+) km(?: · deterministic run (\d+) km)?$/,(m,a,b)=>` 個在 ${a} 公里範圍內`+(b?` · 高解像度預報最接近時相距 ${b} 公里`:"")],
 [/^of (\d+)$/,(m,a)=>` / ${a} `],
 [/^Similar storms — stronger: (.+)$/,(m,a)=>{const L=a.split(" · weaker: "), f=x=>x==="none"?"沒有":x.split(", ").map(y=>G(y).replace(/）\s+/,"）")).join("、"); return `相近個案——較強：${f(L[0])}；較弱：${f(L[1]||"none")}`}],
 [/^Below (\d+) km\/h: outside the top (\d+) of the (\d+) storms since 2007; the forecast cannot rank weaker storms finely\.$/,
  (m,v,n,N)=>`低於每小時 ${v} 公里：不在 2007 年以來 ${N} 個熱帶氣旋的首 ${n} 位之內；本預報未能細分較弱的熱帶氣旋。`],
 [/^HKO recorded (\d+\.\d) km\/h, (\d+)(?:st|nd|rd|th) of the (\d+)\.$/,(m,v,n,N)=>`天文台實測：每小時 ${v} 公里，在 ${N} 個熱帶氣旋中排第 ${n}。`],
 [/^\(10th–90th percentile: (\d+)–(\d+)\)$/,(m,a,b)=>`（第 10–90 百分位數：${a}–${b} 個）`],
 [/^Against MET WARN's (\d+) forecasts for the storms of 2025 and 2026: this site closer (\d+) times, MET WARN (\d+), same call (\d+)\.$/,
  (m,n,a,b,c)=>`與 MET WARN 就 2025 年及 2026 年熱帶氣旋公布的 ${n} 次預測比較：本網站較接近實際結果 ${a} 次，MET WARN 較接近實際結果 ${b} 次，落在相同機會率區間 ${c} 次。`],
 [/^MET WARN, an unofficial Hong Kong weather channel, posts how likely it thinks HKO is to raise a signal\. Each of its (\d+) forecasts for the storms of 2025 and 2026 is set beside this site's chance from the newest run out before the post, and what HKO did\. If this site's chance is inside MET WARN's range, it is the same call; if not, the side nearer to what HKO did is closer\. These storms were not used to set up this site\.$/,
  (m,n)=>`MET WARN 是香港一個非官方天氣資訊頻道，會公布天文台發出不同熱帶氣旋警告信號的預測機會率。這裏把 MET WARN 在 2025 年及 2026 年熱帶氣旋個案中公布的 ${n} 次預測，與本網站在其公布前最新一次預報推算的機會率，以及天文台最終發出的警告信號作比較。若本網站的機會率落在 MET WARN 的機會率區間內，即屬相同判斷；否則以較接近天文台實際做法的一方為較接近。這些熱帶氣旋個案並未用於建立或調校本網站的預測方法。`],
 [/^By signal: No\. 3, this site (\d+), MET WARN (\d+), same (\d+); No\. 8 and 9, (\d+), (\d+), (\d+); No\. 10, (\d+), (\d+), (\d+)\.(?: (\d+) not compared \(No\. 9, which this site does not forecast\)\.)?$/,
  (m,a,b,c,d,e,f,g,h,i,na)=>`按信號劃分：三號，本網站較接近 ${a} 次、MET WARN 較接近 ${b} 次、相同 ${c} 次；八號及九號，分別為 ${d}、${e}、${f} 次；十號，分別為 ${g}、${h}、${i} 次。`+(na?`另有 ${na} 次九號信號預測未作比較，因本網站不推算九號信號。`:"")],
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
 [/^wind index at HK: about (\d+) km\/h \((.+)\)$/,(m,a,b)=>`香港風力指數：約每小時 ${a} 公里（${wib(b)}）`],
 [/^actual: (\d+) km from HK(?:, HKO No\. (\d+) up|, no HKO signal)$/,(m,a,n)=>`實況：距離香港 ${a} 公里，`+(n?`天文台已發出${NO[n]}信號`:`天文台沒有發出信號`)],
 [/^(.+?)( \(closest approach\))? · (\d+) km from Hong Kong(?: · expected No\. (\d+))?(?: · wind index (\d+) \((.+)\))?$/,(m,t,c,d,n,w,b)=>`${zt(t)}${c?"（最接近香港）":""} · 距離香港 ${d} 公里`+(n?` · 預測${NO[n]}`:"")+(w?` · 風力指數 ${w}（${wib(b)}）`:"")],
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
 [/^(\d+)% is (below|above|inside) MET WARN's (\d+–\d+)%$/,(m,a,w,r)=>w==="inside"?`${a}% 在 MET WARN 的 ${r}% 之內`:`${a}% ${w==="below"?"低於":"高於"} MET WARN 的 ${r}%`],
 [/^(.+?) · runs made before HKO's highest signal$/,(m,a)=>`${a.replace(/ forecasts?, /,"，").replace("ECMWF AI","ECMWF 人工智能模式").replace("Old ECMWF","ECMWF 存檔").replace("Pangu-Weather","盤古氣象")} 年 · 只計算天文台發出最高信號前的預報`],
 [/^(\d+) storms, against the index from HKO's station winds$/,(m,a)=>`${a} 個熱帶氣旋，與根據天文台測風站風速計算的指數比較`],
 [/^(\d+) storms, against the peaks HKCOC published$/,(m,a)=>`${a} 個熱帶氣旋，與 HKCOC 公布的最高值比較`],
 [/^(.+?) \(most threatening\)$/,(m,a)=>`${who(a)}（對香港影響最大）`],
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
 [/^(\d{1,2} \d{2}:\d{2}Z): (none|No\. \d+)(?: · wind index (\d+) \((very strong|light|fresh|strong|extreme)\))?$/,(m,a,b,w,band)=>`${zt(a)}：${b==="none"?"沒有信號":G(b)}`+(w?` · 風力指數 ${w}（${wib(band)}）`:"")],
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
function who(a){a=a.trim(); return /^(the )?[Dd]eterministic run$/.test(a)?"高解像度預報":/^(the )?[Cc]ontrol run$/.test(a)?"高解像度預報":
 /^(the )?[Mm]ost threatening member$/.test(a)?"對香港影響最大的成員":a.replace(/^(?:the )?[Mm]ember (\d+)/,"成員 $1").replace(" (most threatening)","（對香港影響最大）")}
const BX=[
 [/^8-station average of the highest 10-minute mean: <b>(\d+\.\d) km\/h<\/b> · <b>(\d+)(?:st|nd|rd|th)<\/b> of the (\d+) storms since 2007 that brought No\. 3 or higher$/,
  (m,v,n,N)=>`八個參考測風站最高十分鐘平均風速的平均值：<b>每小時 ${v} 公里</b>｜在 2007 年以來 ${N} 個天文台發出三號或以上信號的熱帶氣旋中排<b>第 ${n}</b>`],
 [/^8-station average in this forecast \(reference only\): <b>(\d+) km\/h<\/b>(?: · would rank about <b>(\d+)(?:st|nd|rd|th)<\/b> of the (\d+) storms since 2007)?$/,
  (m,v,n,N)=>`此預報的八站平均風速（只供參考）：<b>每小時 ${v} 公里</b>`+(n?`｜在 2007 年以來 ${N} 個熱帶氣旋中約排<b>第 ${n}</b>`:"")],
 [/^<b>8-station average\.<\/b> The average over the 8 reference stations of each station's highest 10-minute mean wind in the storm\. Past storms are ranked by it: (\d+) storms since 2007 that brought No\. 3 or higher, from the same station records the station numbers are built on\. For a forecast it is shown for each member, as a reference only, under the table in the Station guide tab, from that member's wind guide at the 8 stations; below (\d+) km\/h the guide cannot tell storms apart, so no rank is given\.$/,
  (m,N,v)=>`<b>八站平均風速</b>：八個參考測風站各自在熱帶氣旋期間錄得的最高十分鐘平均風速的平均值。過往個案按此排列：2007 年以來天文台發出三號或以上信號的 ${N} 個熱帶氣旋，數據與本網站測風站數字所用的紀錄相同。預報方面，「測風站預報」分頁表格下方列出每個集合成員的數值，只供參考，由該成員在八個測風站的風速參考值計算；低於每小時 ${v} 公里時，風速參考值未能區分不同熱帶氣旋，因此不作排名。`],
 [/^<span class="gl"( title="[^"]*")?>(Gale stations|Gale force|Storm force|Hurricane force|Reference stations reaching (?:gale|storm|hurricane) force|Reference stations that recorded (?:gale|storm|hurricane) force)<\/span> (<span class="gd"[^>]*>(?:<i[^>]*><\/i>)*<\/span>) <b class="gn">(\d+)<\/b> of (\d+)( <span class="rng">\(10th–90th percentile: (\d+)–(\d+)\)<\/span>)?( <span class="rng">· deterministic run: (\d+)<\/span>)?$/,galeRow],
 [/^(?:ECMWF|(Google DeepMind's model)) runs every forecast <b>(\d+) times<\/b>, each from a slightly different start, to show how sure it is\. Each run is a <i>member<\/i>(.*)$/,(m,gd,n,rest)=>{
   const FULL={"1":"一號戒備信號","3":"三號強風信號","8":"八號烈風或暴風信號","9":"九號烈風或暴風風力增強信號","10":"十號颶風信號"};
   let o=`${gd?"Google DeepMind 的模式":"ECMWF"} 會以略有不同的初始條件，重複運行同一個天氣預報模式，模擬熱帶氣旋可能出現的不同發展情況，每次模擬的結果稱為一個<i>集合成員</i>。今次集合預報共有 <b>${n} 個成員</b>`;
   let r=rest, q;
   if(q=r.match(/^: <b>(\d+) of (\d+)<\/b> \((\d+)%\) of them bring No\. (\d+)\.(.*)$/)){o+=`，其中 <b>${q[1]} 個</b>（${q[3]}%）推算香港可能需要發出${FULL[q[4]]}。此百分比反映集合成員的預測比例，並非天文台實際發出該信號的官方機會率。`; r=q[5]}
   else if(q=r.match(/^\. Only <b>(\d+) of (\d+)<\/b> bring No\. 3 or higher, fewer than half, so no signal has a majority\.(.*)$/)){o+=`，只有 <b>${q[1]} 個</b>推算香港可能需要發出三號或更高信號，不足半數。`; r=q[3]}
   else if(q=r.match(/^\. None of them brings No\. 3 or higher\.(.*)$/)){o+=`，沒有成員推算香港需要發出三號或更高信號。`; r=q[1]}
   else return null;
   r=r.trim();
   if(r==="ECMWF also makes one main forecast in finer detail, the <b>deterministic run</b> (black dashed on the map).")o+=`地圖上的黑色虛線代表 ECMWF 的<b>高解像度預報</b>路徑。`;
   else if(r==="The <b>control run</b> is the one member started without any change (black dashed on the map).")o+=`地圖上的黑色虛線代表人工智能模式的<b>高解像度預報</b>路徑。`;
   else if(r)return null;
   return o}],
 [/^<b>(\d+)<\/b> of (\d+) members pass within (\d+) km · <b>(\d+)<\/b> within (\d+) km(?: · deterministic run (\d+) km)?$/,(m,a,M,ka,b,kb,d)=>`${M} 個集合預報成員中，有 <b>${a}</b> 個預測熱帶氣旋會進入香港 ${ka} 公里範圍，${+b===+M?`全部 <b>${b}</b> 個均`:`<b>${b}</b> 個`}預測會進入 ${kb} 公里範圍。`+(d?`高解像度預報顯示，熱帶氣旋最接近香港時，中心距離約為 ${d} 公里。`:"")],
 [/^(?:from )?<b>(\d+)<\/b> of (\d+) members · (?:<b>(\d+)<\/b> of them )?(.+?) → (.+?) HKT · <b>(\d+) h<\/b>$/,(m,n,M,k,a,b,h)=>`${M} 個集合成員中有 <b>${n}</b> 個`+(k?`，當中 <b>${k}</b> 個`:"")+` · ${cl(G(a)+" 至 "+G(b))}（香港時間）· <b>${h} 小時</b>`],
 [/^<b>Members\.<\/b> ECMWF runs each forecast (\d+) times, each from slightly different starting conditions\. Each run is a member\. A count like "(\d+) of (\d+) members" means (\d+) of those runs give that signal at some point, so it gives a rough idea of the chance\. It is the share of members, not a calibrated probability that HKO will issue the signal\.$/,
  (m,n,a,b)=>`<b>集合成員</b>：ECMWF 每次預報由 ${n} 個略為不同的初始條件計算，每個結果稱為一個集合成員。「${b} 個成員中有 ${a} 個」即 ${a} 個成員在預報期內某時預測該信號，可大致反映機會高低（約 ${Math.round(100*a/b)}%）；這是成員所佔的比例，並非天文台發出該信號的實際機會率。`],
 [/^<b>Deterministic run\.<\/b> Besides the (\d+) members, ECMWF makes one main forecast in finer detail\. It is the black dashed line on the map, and its own numbers say "deterministic"\. It is still one forecast, so it can be right or wrong like any member\.$/,
  (m,n)=>`<b>高解像度預報</b>：除 ${n} 個集合成員外，ECMWF 亦以較高解像度計算一個單一預報，即地圖上的黑色虛線。它只是眾多可能情況之一，未必比其他成員準確。`],
 [/^<b>Control run\.<\/b> The AI forecast's member started without any change\. It is the black dashed line on the map\.$/,()=>`<b>高解像度預報</b>：即地圖上的黑色虛線。它只是眾多可能情況之一，未必比其他成員準確。`],
 [/^<b>The times\.<\/b> The members that give the signal do not agree to the minute\. The start and end shown are the middle ones: half of those members start earlier, half later, and the same for the end\. The hours are the middle length\. The timeline below shows how far they spread \(earliest (\d+)% to latest (\d+)%\)\.$/,
  (m,a,b)=>`<b>時間</b>：預測同一信號的成員，開始及結束時間各有不同。這裏顯示的是中位數，即一半成員較早、一半較遲；時數亦取中位數。下面的時間線顯示最早 ${a}% 至最遲 ${b}% 成員的範圍。`],
 [/^<b>Gale stations\.<\/b> HKO decides No\. 3 and No\. 8 by the winds at (\d+) reference stations near sea level: .+?\. It raises No\. 8 when half or more of them \((\d+) of (\d+)\) record, or are expected to record, sustained winds of (\d+) to (\d+) km\/h and the winds are likely to persist; HKO adds that meeting the wind criterion is not the only consideration, as public safety comes first\. This site's numbers are not HKO's decision\. A count like "(\d+) of (\d+) \((\d+)–(\d+)\)" means the middle member expects (\d+) of the (\d+) stations to get gale winds at any time from this run onward, and most members expect (\d+) to (\d+)\.$/,
  (m,n,a,b,lo,hi,c,d,e,f,g,h,i,j)=>`<b>烈風測風站</b>：天文台考慮發出三號及八號信號時，會參考熱帶氣旋警告系統網絡內 ${n} 個接近海平面的參考測風站（長洲、赤鱲角、啟德、流浮山、西貢、沙田、打鼓嶺及青衣）。當網絡中半數或以上（${b} 個中至少 ${a} 個）測風站錄得或預料錄得每小時 ${lo} 至 ${hi} 公里的持續風速，且風勢可能持續時，天文台會發出八號信號；天文台亦指出，達到風力標準並非唯一考慮，公眾安全方為最大考慮。本網站的推算不等同天文台的決定。「${d} 個中有 ${c} 個（${e}–${f}）」表示中位成員預測由今次預報起，${h} 個參考測風站中有 ${g} 個達烈風程度，大部分成員預測 ${i} 至 ${j} 個。`],
 [/^<b>Storm and hurricane force<\/b> count the same (\d+) stations, at (\d+) and (\d+) km\/h \((\d+)-minute average wind\)\. Each station's own chance and expected wind are in <b>Stations<\/b> just above, for the (deterministic|control) run, and in the Station guide tab under the map, which shows the same run until you click another track\.$/,
  (m,n,a,b,c,w)=>`<b>暴風及颶風</b>：以同樣 ${n} 個測風站計算，持續風力分別達每小時 ${a} 及 ${b} 公里（${c} 分鐘平均）。各測風站的機會率及預計風速見上面的<b>各測風站風速參考值</b>（高解像度預報）及地圖下方的「測風站預報」；未按其他路徑前，兩者顯示同一預報。`],
 [/^<b>Lines:<\/b> (.+)$/,null],
 [/^A rough guide read from each station's chances, not a wind forecast\.(.*)$/,(m,r)=>{let o="風速參考值根據各測風站出現烈風、暴風及颶風的機會率推算，並非模式直接輸出的風速預報，只供參考。"; r=r.trim();
   const P=[["The same forecast as the Station guide tab under the map and the station dots on the map;","與地圖下方「測風站預報」分頁及地圖上的測風站圓點屬同一預報；"],["This forecast, the same as Stations in the answer card;","與上面「各測風站風速參考值」屬同一預報；"],
            ["10-minute mean.","十分鐘平均風速。"],["HKO: the highest 10-minute mean recorded.","天文台實測為錄得的最高十分鐘平均風速。"]];
   for(const [e,z] of P){if(r.startsWith(e)){o+=z; r=r.slice(e.length).trim()}} return r?null:o}],
 [/^Choose <span class="ui">Today<\/span> or <span class="ui">Past storms<\/span>, then a storm and a run\.$/,()=>`選擇<span class="ui">最新預報</span>或<span class="ui">過往熱帶氣旋</span>，再選擇熱帶氣旋及起報時間。`],
 [/^<span class="ui">Today<\/span> shows the newest forecasts\. <span class="ui">Past storms<\/span> are grouped by the highest signal HKO issued, No\. 10 first\. Pick a storm, then a run, named after the time its forecast started, in UTC\.$/,
  ()=>`<span class="ui">最新預報</span>顯示最新一次預報。<span class="ui">過往熱帶氣旋</span>按天文台實際發出的最高信號分類，由十號信號開始排列。選擇熱帶氣旋後，再選擇起報時間（UTC）。`],
 [/^The buttons below switch between ECMWF's physics model \(IFS\) and its AI model \(AIFS\)\. Older years use ECMWF's archived forecasts \(2008–2023\) or Pangu-Weather \(2018–2022\)\.$/,
  ()=>`下面的按鈕可切換 ECMWF 物理模式（IFS）及人工智能模式（AIFS）。較早年份則採用 ECMWF 的歷史預報資料（2008–2023）或盤古氣象（2018–2022）。`],
 [/^Here (\d+) of (\d+) members give <span class="c(\d+)">No\. (\d+)<\/span>(?:, for about (\d+) hours)?\.$/,(m,n,M,c,L,h)=>`圖中 ${M} 個集合成員中，有 ${n} 個預測<span class="c${c}">${NO[L]}</span>信號`+(h?`，預計持續約 ${h} 小時。`:"。")],
 [/^Signal No\. (\d+) likely \((\d+)%\)$/,(m,n,p)=>`預料發出${NO[n]}信號（${p}%）`],
 [/^Signal No\. (\d+)$/,(m,n)=>`${NO[n]}信號`],
 [/^Most likely no signal \((\d+)%\)$/,(m,p)=>`最可能無需發出信號（${p}%）`],
 [/^Updated (\d+) (\w{3}) (\d\d:\d\d) \(Hong Kong time\)$/,(m,d,mo,t)=>`更新時間：${"JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(mo)/3+1}月${d}日 ${t}（香港時間）`],
 [/^Past storm: (.+)$/,(m,a)=>`過往熱帶氣旋：${G(a)}`],
 [/^Peak Hong Kong wind index in each of the (\d+) members$/,(m,n)=>`${n} 個集合成員各自的最高香港風力指數`],
 [/^10–90%: (\d+)–(\d+) km\/h$/,(m,a,b)=>`第 10–90 百分位數：每小時 ${a}–${b} 公里`],
 [/^(deterministic run|control run): (\d+) km\/h$/,(m,w,v)=>`高解像度預報：每小時 ${v} 公里`],
 [/^Member (\d+): (\d+) km\/h$/,(m,n,v)=>`成員 ${n}：每小時 ${v} 公里`],
 [/^map: <b>(\d+)<\/b> members? at (\d+)–(\d+) km\/h · click the bar again for all$/,(m,n,a,b)=>`地圖只顯示最高風力指數為每小時 ${a}–${b} 公里的 <b>${n}</b> 個集合成員 · 再按該柱可顯示全部`],
 [/^Most likely from <b>(.+?)<\/b> to <b>(.+?)<\/b> \(Hong Kong time\)$/,(m,x,y)=>`最可能在 <b>${G(x)}</b> 至 <b>${G(y)}</b>（香港時間）`],
 [/^Expected closest distance to Hong Kong: <b>about (\d+) km<\/b>$/,(m,n)=>`預計最接近香港的距離：<b>約 ${n} 公里</b>`],
 [/^Closest to Hong Kong: <b>(\d+) km<\/b>\. Click the line to see how windy Hong Kong gets along it\.$/,(m,n)=>`最接近香港：<b>${n} 公里</b>。按下路徑，即可查看沿途香港的風勢。`],
 [/^Peak <b>(\d+) km\/h<\/b> \((.+?)\), around (.+?) \(Hong Kong time\)( · dashed line: what Hong Kong really had)?$/,(m,v,b,t,o)=>`最高 <b>每小時 ${v} 公里</b>（${wib(b)}），約於${G(t)}（香港時間）`+(o?" · 虛線為香港實際錄得":"")],
 [/^HKO observed: (\d+) km\/h$/,(m,v)=>`天文台實測：每小時 ${v} 公里`],
 [/^Here only (\d+) of (\d+) members give No\. 3 or higher, fewer than half\.$/,(m,n,M)=>`圖中 ${M} 個集合成員中，只有 ${n} 個預測三號或更高信號，未達半數。`],
 [/^Here no member gives No\. 3\.$/,()=>`圖中沒有集合成員預測三號信號。`],
 [/^In this run no station goes above F7\.$/,()=>`今次預報顯示，各測風站風力均不超過 7 級。`],
 [/^In this run (.+?) reaches (≤F7|F(\d+)(?:–(\d+))?)\.$/,(m,s,f,a,b)=>`今次預報顯示，${ST[s]||s}風力可達 ${f==="≤F7"?"7 級或以下":b?`${a} 至 ${b} 級`:`${a} 級`}。`],
 [/^The pictures show the newest ECMWF forecast with a storm near Hong Kong: the run of <b>(\d+) (\w{3}) (\d{4}), (\d\d) UTC<\/b>(?: \((.+)\))?\.$/,(m,d,mo,y,h,p)=>`以下畫面採用最新一次有熱帶氣旋靠近香港的 ECMWF 預報：<b>${y}年${"JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(mo)/3+1}月${d}日 ${h} 時（協調世界時）</b>起報`+(p?`，${G(p)}`:"")+"。"],
 [/^ECMWF runs each forecast 50 times from slightly different starts; each run is a member\. Each line is one member's storm track, coloured by the signal it expects Hong Kong to have at that point: grey for No\. 1, then <span class="c3">No\. 3<\/span>, <span class="c8">No\. 8<\/span>, <span class="c9">No\. 9<\/span> and <span class="c10">No\. 10<\/span>, and back down as the storm leaves\.$/,
  ()=>`ECMWF 以略有不同的初始條件進行 50 次模擬，每次模擬的結果稱為一個集合成員。每條線是一個成員的熱帶氣旋路徑，顏色代表該成員在該位置預測香港的信號：灰色代表一號信號，其餘顏色分別代表<span class="c3">三號</span>、<span class="c8">八號</span>、<span class="c9">九號</span>及<span class="c10">十號</span>信號。隨着預報時間推進，路徑顏色亦會按預測信號改變。`],
 [/^<span class="ui">▶ all members<\/span> plays every storm forward, 12 hours a second\. Try it: this is the real map\.$/,()=>`按<span class="ui">▶ 播放全部成員</span>，查看各條預測路徑隨時間的變化。地圖可直接操作。`],
 [/^<span class="ui">▶ all members<\/span> moves every member's storm forward together, 12 forecast hours a second\. The large black dot is the deterministic run\.$/,()=>`按<span class="ui">▶ 播放全部成員</span>，即可同步播放所有預測路徑，播放速度為每秒 12 個預報小時。大黑點代表高解像度預報的熱帶氣旋位置。`],
 [/^Its track changes colour where that member expects each signal: grey for No\. 1, then <span class="c3">No\. 3<\/span>, <span class="c8">No\. 8<\/span>, <span class="c9">No\. 9<\/span> and <span class="c10">No\. 10<\/span>, and back down as the storm leaves\.$/,
  ()=>`路徑顏色會隨預測信號改變：灰色代表一號信號，其餘顏色分別代表<span class="c3">三號</span>、<span class="c8">八號</span>、<span class="c9">九號</span>及<span class="c10">十號</span>信號。隨着預報時間推進，路徑顏色亦會按預測信號改變。`],
 [/^The player under the map steps through the hours\. The large <span class="ui">← Back to all members<\/span> button, at the top left of the map, brings everyone back\.$/,()=>`地圖下方的播放控制列可逐小時查看預測變化。按地圖左上角的<span class="ui">← 返回全部成員</span>，可重新顯示全部成員。`],
 [/^<span class="ui">zoom to Hong Kong<\/span> colours HKO's eight stations by expected wind\.$/,()=>`按<span class="ui">放大香港範圍</span>，查看八個參考測風站的預測風力。`],
 [/^<span class="ui">zoom to Hong Kong<\/span> shows HKO's eight reference stations\. Each dot is coloured by the station's expected wind, with its Beaufort force next to the name\.$/,()=>`<span class="ui">放大香港範圍</span>顯示八個參考測風站，圓點顏色代表風速參考值，站名旁標示蒲福氏風級。`],
 [/^<b>(\d+)<\/b> of (\d+) give No\. 3$/,(m,n,M)=>`${M} 個集合成員中有 <b>${n}</b> 個預測三號信號`],
 [/^median <b>(\d+) km\/h<\/b> \((.+?)\)$/,(m,v,b)=>`中位數 <b>每小時 ${v} 公里</b>（${tt(b)||b}）`],
 [/^Not compared: MET WARN's No\. (\d+) forecast for (.+? \d{4}) \((\d+) (\w{3}), (\d\d:\d\d) HK time\), because this site does not forecast No\. 9\.$/,(m,l,s,d,mo,t)=>`未作比較：MET WARN 對${G(s)}的${NO[l]}信號預測（${"JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(mo)/3+1}月${d}日 ${t}，香港時間），因本網站不預測九號信號。`],
 [/^The <span class="ui">Station guide<\/span> tab gives each station's chances and expected wind\.$/,()=>`<span class="ui">測風站預報</span>分頁列出各測風站的機會率及預計風速。`],
 [/^The <span class="ui">Station guide<\/span> tab under the map lists each station's chance of gale \(63 km\/h\), storm force \(88 km\/h\) and hurricane force \(118 km\/h\), with a rough expected wind\.$/,
  ()=>`地圖下方的<span class="ui">測風站預報</span>分頁列出各測風站出現烈風（每小時 63 公里）、暴風（88 公里）及颶風（118 公里）的機會率，以及風速參考值。`],
 [/^For past storms it adds what HKO recorded and the difference\. <span class="down">Red<\/span> means the forecast was too low, <span class="up">green<\/span> too high\.$/,()=>`過往個案亦會列出天文台實測風速，以及預測與實測的差距。<span class="down">紅色</span>表示預測偏低，<span class="up">綠色</span>表示偏高。`],
 [/^<span class="ui">How good is it\?<\/span> sets past forecasts beside what HKO did, storm by storm\.$/,()=>`<span class="ui">預報表現</span>逐個熱帶氣旋比較過往預報與天文台實際發出的信號。`],
 [/^<a href="verify-zh\.html">How good is it\?<\/a> has the full record, signal by signal and station by station\.$/,()=>`<a href="verify-zh.html">預報表現</a>載有完整紀錄，按信號及測風站列出。`],
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
