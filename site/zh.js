(function(){
"use strict";
const STORM={"Barijat":"百里嘉","Bebinca":"貝碧嘉","Cempaka":"查帕卡","Chaba":"暹芭","Danas":"丹娜絲","Doksuri":"杜蘇芮","Ewiniar":"艾雲尼","Fengshen":"風神","Fung-wong":"鳳凰","Fung-Wong":"鳳凰","Goni":"天鵝","Hagupit":"黑格比","Haima":"海馬","Hato":"天鴿","Higos":"海高斯","Kai-Tak":"啟德","Kajiki":"劍魚","Kalmaegi":"海鷗","Kammuri":"北冕","Khanun":"卡努","Koinu":"小犬","Kompasu":"圓規","Koppu":"巨爵","Linfa":"蓮花","Lionrock":"獅子山","Lupit":"盧碧","Ma-On":"馬鞍","Maliksi":"馬力斯","Mangkhut":"山竹","Matmo":"麥德姆","Maysak":"美莎克","Merbok":"苗柏","Mitag":"米娜","Molave":"莫拉菲","Mulan":"木蘭","Nalgae":"尼格","Nangka":"浪卡","Nesat":"納沙","Nida":"妮妲","Nongfa":"藍湖","Noul":"紅霞","Nuri":"鸚鵡","Pakhar":"帕卡","Podul":"楊柳","Ragasa":"樺加沙","Roke":"洛克","Saola":"蘇拉","Saudel":"沙德爾","Sinlaku":"森拉克","Son-Tinh":"山神","Talim":"泰利","Tapah":"塔巴","Toraji":"桃芝","Usagi":"天兔","Utor":"尤特","Vicente":"韋森特","Wipha":"韋帕","Wutip":"蝴蝶","Yagi":"摩羯","Yutu":"玉兔"};
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
 s=zt(s).replace(/ \((\d+(?:至\d+)?級(?:或以下)?)\)/g,"（$1）").replace(/ （/g,"（");
 return s}
const wib=b=>WI[b]||b;
function zt(s,mark){const u=mark===false?"":" UTC";
 return s.replace(/\b(\d{1,2}) (\d{2})Z–(\d{1,2}) (\d{2})Z\b/g,(m,a,b,c,d)=>`${+a}日${b}時至${+c}日${d}時${u}`)
  .replace(/\b(\d{1,2})-(\d{1,2}) (\d{2}:\d{2})Z\b/g,(m,M,d,t)=>`${+M}月${+d}日${t}${u}`)
  .replace(/\b(\d{1,2})\/(\d{2}:\d{2})Z\b/g,(m,d,t)=>`${+d}日${t}${u}`)
  .replace(/(\d+月\d+日) (\d{2})Z\b/g,(m,a,h)=>`${a} ${h}時${u}`)
  .replace(/\b(\d{1,2}) (\d{2}:\d{2})Z\b/g,(m,d,t)=>`${+d}日${t}${u}`)
  .replace(/\b(\d{1,2}) (\d{2})Z\b/g,(m,d,h)=>`${+d}日${h}時${u}`)}
const EX=new Map(Object.entries({
 "Hong Kong typhoon signal forecasts":"香港熱帶氣旋警告信號機會率","How to read the forecasts":"使用導覽","How good is it?":"預報驗證","Open the forecasts":"打開預報",
 "New here? Take the tour":"初次使用？請看導覽","Forecasts":"預報","Tour":"導覽","Show":"顯示","Today":"最新預報","Past storms":"過往熱帶氣旋","Run":"選擇預報","Forecast":"模式",
 "ECMWF physics (IFS)":"ECMWF 物理模式（IFS）","ECMWF AI (AIFS)":"ECMWF 人工智能模式（AIFS）",
 "ECMWF ensemble forecasts turned into Hong Kong signal chances. Research output — the Hong Kong Observatory is the only authority for actual signals.":"本網站根據歐洲中期預報中心（ECMWF）的集合預報，由電腦自動估算香港各熱帶氣旋警告信號的機會率，不經人手修訂，只供研究參考。熱帶氣旋警告信號以香港天文台發出的為準。",
 "Highest signal a majority gives":"過半數集合成員預測的最高信號","none":"沒有","Gale stations":"烈風","Storm force":"暴風","Hurricane force":"颶風",
 "Station":"測站","Gale chance":"烈風機會率","Wind guide, km/h":"預計風速（公里每小時）","HKO":"天文台","What do these numbers mean?":"數字說明",
 "HKO actually issued":"天文台實際發出的最高信號","Timeline · Hong Kong time":"時間線（香港時間）","forecast, median start → median end":"預測時段：成員開始及結束時間的中位數",
 "deterministic run":"高解像度預報","Deterministic run":"高解像度預報","control run":"控制預報","Control run":"控制預報","faded: fewer than half the members":"淡色：不足半數成員",
 "Numbers per signal":"各信號數字","members":"集合成員","starts":"開始","ends":"結束","hours":"時數","deterministic":"高解像度預報","not issued":"沒有發出","main period":"主要時段","other periods":"其他時段",
 "Map":"地圖","zoom to Hong Kong":"放大香港範圍","zoom out":"顯示整個區域","▶ all members":"▶ 播放全部成員","❚❚ pause":"❚❚ 暫停","within 150 km only":"只顯示在 150 公里內掠過的成員","▶ play":"▶ 播放",
 "← Back to all members":"← 返回全部成員","Signal along each track":"路徑顏色：該成員預測的信號","another storm of the same member":"同一成員的其他熱帶氣旋",
 "a signal counts at chance ≥ 0.30 (No. 10: ≥ 0.40)":"機會率達 0.30 才計算（十號為 0.40）","Tap or click a line to follow one member.":"按任何一條路徑，可單獨顯示該成員。",
 "Expected signal":"預測信號","Wind index":"風力指數","Station guide":"測站指引","ensemble-mean wind index":"集合平均風力指數","Sequence:":"順序（UTC）：",
 "dashed = observed":"虛線為實況","gale stations":"烈風測站","Gale":"烈風","Storm":"暴風","Hurricane":"颶風","Expected wind, km/h":"預計風速（公里每小時）","HKO, km/h":"天文台實測（公里每小時）",
 "Difference, km/h":"相差（公里每小時）","Gale, storm and hurricane are each station's chances.":"烈風、暴風及颶風三欄為各測站的機會率。",
 "Station numbers are not ready for this run yet.":"這次預報的測站數字尚未準備好。","Days are UTC · numbers only, no model files":"標示 UTC 的時間為協調世界時，即香港時間減八小時 · 只提供數字，不含模式檔案",
 "Lines:":"路徑：","Deterministic run:":"高解像度預報：","Control run:":"控制預報：","Members.":"集合成員","Deterministic run.":"高解像度預報","Control run.":"控制預報","The times.":"時間",
 "Gale stations.":"烈風測站","Storm and hurricane force":"暴風及颶風","Stations":"各測站預計風速","HKO issued":"天文台發出","Hong Kong":"香港","no member":"沒有成員",
 "probability for this member":"該成員的機會率","wind index (km/h)":"風力指數（公里每小時）","— Hong Kong wind index (right axis, km/h)":"— 香港風力指數（右軸，公里每小時）",
 "- - what HKO actually issued":"- - 天文台實際發出","- - observed wind index (HKO station winds)":"- - 實測風力指數（天文台測站風速）","light":"輕微","fresh":"清勁","strong":"強","very strong":"甚強","extreme":"極強",
 "below 53 km/h":"每小時 53 公里以下","signal":"信號","pages":"頁面","storm":"熱帶氣旋","run":"起報時間","HKO's highest signal":"天文台最高信號",
 "1. the highest signal HKO issued for the storm":"一、天文台曾發出的最高信號","2. the storm":"二、熱帶氣旋","3. the run (start time, UTC)":"三、起報時間（協調世界時）",
 "the forecasts that exist for this run -- each is its own system, judged on its own past":"這個起報時間可選的模式；各模式分開驗證",
 "timeline of forecast and actual signals":"預測及實際信號時間線","ECMWF's main forecast, made once in finer detail than the members, shown on its own: track, time bar, charts":"單獨顯示 ECMWF 的高解像度預報：路徑、時間軸及圖表",
 "back to every member of this run":"返回這次預報的全部成員","play this member's storm through time":"播放該成員的熱帶氣旋路徑","time along this member's track":"該成員路徑上的時間","animation speed":"播放速度",
 "the wind index averaged over all ensemble members, hour by hour":"所有集合成員每小時的平均風力指數","Most threatening member":"威脅最大的成員",
 "Chances of signals No. 3, 8 and 10 for Hong Kong":"香港三號、八號及十號信號機會率","From every ECMWF forecast, updated every 6 hours.":"根據每次 ECMWF 預報自動計算，每 6 小時更新。",
 "Research output. The Hong Kong Observatory is the only authority for actual signals.":"本網站只供研究參考，熱帶氣旋警告信號以香港天文台發出的為準。","Start the tour":"開始導覽","On the page":"跳到",
 "Answer":"預報結果","Timeline":"時間線","Charts":"圖表","Text":"文字","Short":"簡短","Full":"詳細","Choose today or a past storm":"選擇預報","Read the answer":"預報結果","What the forecast says":"預報結果","Summary":"預報結果","Forecast at a glance":"預報結果",
 "The big number is the signal most of the ~50 forecast versions reach.":"大字顯示約 50 個集合成員中，過半數預測的最高信號。",
 "ECMWF runs each forecast about 50 times. The page calls each version a member. The big number is the highest signal that most members reach, with when it starts and ends in Hong Kong time.":"ECMWF 每次預報約有 50 個集合成員。大字是過半數成員預測的最高信號，下面是預測的開始及結束時間（香港時間）。",
 "Below it you see how many of HKO's eight reference stations get gale, storm or hurricane winds. For a past storm, HKO's own record sits next to it.":"再下面是八個參考測風站中，預料有多少個錄得烈風、暴風或颶風。過往熱帶氣旋會在旁列出天文台的實際紀錄。",
 "See when each signal is up":"各信號的時段","Bars show when each signal starts and ends, in Hong Kong time.":"橫條顯示各信號的開始及結束時間（香港時間）。",
 "Each bar covers one signal, in Hong Kong time. The solid part runs from the members' middle start to their middle end. The pale part spans the earliest 10% to the latest 90%.":"每條橫條代表一個信號。深色部分由成員開始時間的中位數至結束時間的中位數；淺色部分涵蓋最早 10% 至最遲 90% 的成員。",
 "The thin line is the deterministic run, ECMWF's single main forecast. HKO's real signals run along the top.":"細線是高解像度預報；最上一行是天文台實際發出的信號。",
 "Every line is one member":"集合成員路徑","Each line is one forecast run, coloured by the signal it expects along the way.":"路徑按該成員沿途預測的信號上色。",
 "The thick black dashed line is the deterministic run. For past storms, the black dashed line with dots is where the storm really went. The circles mark distances from Hong Kong.":"粗黑虛線是高解像度預報；過往熱帶氣旋的實際路徑以帶圓點的黑虛線顯示。圓圈標示與香港的距離。",
 "Watch all members move":"播放全部成員","You can watch the spread grow, and see whether it closes on Hong Kong.":"可以看到各成員的路徑如何逐漸分散，以及會否移近香港。",
 "Follow one member":"單獨查看成員","Click a line to see when that member expects each signal, by colour.":"按一條路徑，即可從顏色看到該成員預測各信號的時間。",
 "Click any line to see that member alone, and where its storm is at every hour.":"按任何一條路徑，即可單獨顯示該成員，以及熱帶氣旋每小時的位置。",
 "Zoom in on the eight stations":"八個參考測風站","In this run Cheung Chau reaches F12.":"這次預報中，長洲達 12 級。","Compare each station with HKO":"與天文台實測比較",
 "Check how good it is":"預報驗證","For every storm of 2025 and 2026 it sets this site's chance of each signal beside MET WARN's forecast and what HKO raised.":"2025 及 2026 年每個熱帶氣旋，本網站各信號的機會率均與 MET WARN 的預測及天文台實際發出的信號並列比較。",
 "Read today's forecast":"查看最新預報","Close":"關閉","How much text":"文字多少","more pages":"其他頁面","Picture, full size":"原大圖片",
 "The answer cards for Typhoon Ragasa: No. 10 from 37 of 50 members, beside HKO's actual No. 10":"超強颱風樺加沙的預報結果：50 個集合成員中有 37 個預測十號，旁為天文台實際發出的十號",
 "The run picker: year, storm and run menus, and the forecast buttons":"選擇預報：熱帶氣旋及起報時間選單，以及模式按鈕","The answer cards":"預報結果",
 "Timeline with bars for No. 3, No. 8 and No. 10 under HKO's own signals":"時間線：三號、八號及十號的預測時段，上面是天文台實際發出的信號",
 "Station table with chances, expected wind, HKO's recorded wind and the difference":"測站表：機會率、預計風速、天文台實測及兩者差距",
 "How good is it?: this site's chance beside MET WARN's forecast and what HKO raised":"預報驗證：本網站的機會率與 MET WARN 的預測及天文台實際發出的信號並列",
 "The real forecast map: Ragasa 2025, ECMWF run of 21 Sep 12Z; every member's track coloured by the signal it expects":"真實預報地圖：樺加沙（2025），ECMWF 9月21日 12時 UTC 起報；各成員路徑按預測信號上色",
 "The real forecast map: Ragasa 2025, ECMWF run of 21 Sep 12Z, every member playing":"真實預報地圖：樺加沙（2025），ECMWF 9月21日 12時 UTC 起報，播放全部成員",
 "The real forecast map: one member of the Ragasa run on its own, its player running":"真實預報地圖：單獨播放樺加沙預報中的一個成員",
 "The real forecast map zoomed on Hong Kong: the eight stations coloured by expected wind, with their Beaufort forces":"放大至香港的真實預報地圖：八個測站按預計風力上色，並標示蒲福氏風級",
 "What would you like to see?":"請選擇","Today's forecast":"最新預報","Open today's forecast":"查看最新預報","A past storm":"過往熱帶氣旋","Open Ragasa":"打開樺加沙","The newest run.":"最新一次預報。",
 "Starts with Typhoon Ragasa in 2025, when HKO issued No. 10. You can then pick any other storm since 2008.":"先顯示 2025 年超強颱風樺加沙（天文台曾發出十號颶風信號），之後可選擇 2008 年以來其他熱帶氣旋。",
 "← back to the forecasts":"← 返回預報","Signals":"信號","Signals: this site and MET WARN, storm by storm":"信號：本網站與 MET WARN 比較","Signal":"信號",
 "MET WARN, an unofficial Hong Kong weather channel, posts how likely it thinks HKO is to raise a signal. Below is every such forecast for the storms of 2025 and 2026, next to this site's chance at the same moment and what HKO actually did. These storms were not used to set up this site.":"MET WARN 是香港一個非官方天氣頻道，會公布其估計天文台發出個別信號的機會。下表列出 2025 及 2026 年各熱帶氣旋的這類預測，並與本網站同一時間的機會率及天文台實際發出的信號比較。這些熱帶氣旋沒有用於調校本網站。",
 "MET WARN gives a range, for example \"high\" = 80–89%. If this site's chance is inside that range, it is the same call. If it is outside, the side nearer to what HKO did is closer.":"MET WARN 會給出一個範圍，例如「高」即 80–89%。本網站的機會率若在範圍內，即屬判斷相同；若在範圍外，較接近天文台實際做法的一方較準。",
 "this site closer":"本網站較準","MET WARN closer":"MET WARN 較準","same call":"判斷相同","waiting for this site":"待本網站補上","not compared":"不作比較",
 "Question":"問題","MET WARN said":"MET WARN 預測","This site said":"本網站預測","HKO raised it?":"天文台有否發出","Who was closer":"誰較準","This site":"本網站","MET WARN":"MET WARN",
 "medium":"中等","high":"高","medium-low":"中低","very high":"極高","low":"低","medium-high":"中高","Yes":"有","No":"沒有","–":"–","All":"全部",
 "this site does not forecast No. 9":"本網站不預測九號信號","this storm's forecasts are being added":"預報資料整理中",
 "How many of HKO's 8 reference stations had gale winds, against what HKO recorded.":"八個參考測風站中錄得烈風的數目，與天文台紀錄比較。",
 "ECMWF AI":"ECMWF 人工智能","Pangu-Weather":"盤古氣象","Old ECMWF":"舊 ECMWF","runs":"次預報","exactly right":"完全吻合","stations off on average":"平均相差測站數目",
 "Each circle = runs with the same pair of numbers; bigger = more runs. On the dashed line = same as HKO. Hover or tap a dot for details.":"每個圓圈代表數字相同的預報，圓圈愈大，預報愈多；落在虛線上即與天文台相同。把滑鼠移到圓點上或按圓點可看詳情。",
 "Storm peaks":"各熱帶氣旋的最高風力指數","Period":"時期","Since Aug 2021":"2021年8月起","2004 to Jul 2021":"2004年至2021年7月","storms":"個熱帶氣旋","too low on average":"平均偏低","too high on average":"平均偏高","typical miss":"一般誤差",
 "Each dot = one storm's highest wind index. On the dashed line = same as observed; above = too high, below = too low. Hover or tap a dot for details.":"每點代表一個熱帶氣旋的最高風力指數；落在虛線上即與實測相同，虛線以上偏高，以下偏低。把滑鼠移到圓點上或按圓點可看詳情。",
 "Since Aug 2021 against HKO's station winds; 2004–2021 against the peaks HKCOC published.":"2021年8月起與天文台測站風速比較；2004至2021年與 HKCOC 公布的最高值比較。",
 "stations with gale, HKO":"錄得烈風的測站數目（天文台）","stations with gale, this site (middle version)":"錄得烈風的測站數目（本網站，中位成員）",
 "observed peak, from HKO's station winds (km/h)":"實測最高值（根據天文台測站風速，公里/小時）","peak this site estimates (km/h)":"本網站估計的最高值（公里/小時）","this site against HKO's record":"本網站與天文台紀錄比較",
 "F7 or less":"7級或以下","▼ HKO":"▼ 天文台"
}));
const RX=[
 [/^No\. (8 and 9|\d+) \((\d+) storms?\)$/,(m,a,n)=>`${a==="8 and 9"?"八號及九號":NO[a]}（${n} 個）`],
 [/^· produced (\S+ \S+) UTC \((\d+) h ago\)(?: · past case: (.+?) — HKO No\. (\d+) on (.+?) \(a fair test: not used to set up the site\))?$/,
  (m,t,h,c,n,d)=>` · ${t} UTC 計算（${h} 小時前）`+(c?` · 過往熱帶氣旋：${G(c)}，天文台曾於${G(d)}發出${NO[n]}信號（沒有用於調校本網站）`:"")],
 [/^of (\d+) members pass within (\d+) km ·$/,(m,a,b)=>` / ${a} 個集合成員在香港 ${b} 公里範圍內掠過 · `],
 [/^within (\d+) km(?: · deterministic run (\d+) km)?$/,(m,a,b)=>` 個在 ${a} 公里範圍內`+(b?` · 高解像度預報最接近時相距 ${b} 公里`:"")],
 [/^of (\d+)$/,(m,a)=>` / ${a} `],
 [/^· deterministic (\d+)$/,(m,a)=>`· 高解像度預報 ${a}`],
 [/^members$/,()=>` 個集合成員`],[/^(\d+) members?$/,(m,a)=>`${a} 個集合成員`],
 [/^Stations — (.+)$/,(m,a)=>`各測站預計風速（${who(a)}）`],
 [/^(.+?) — (expected signal through time|chance of No\. (\d+) through time|Hong Kong wind index through time|station guide)$/,(m,a,b,n)=>`${who(a)}：${b==="expected signal through time"?"預測信號":b==="Hong Kong wind index through time"?"香港風力指數":b==="station guide"?"測站指引":`${NO[n]}信號機會率`}`],
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
 [/^(.+?): members by expected wind force$/,(m,a)=>`${G(a)}：各集合成員的預計風力`],
 [/^peak ([\d.]+), ≥ ([\d.]+) from (.+)$/,(m,a,b,c)=>`最高 ${a}，${zt(c)}起達 ${b}`],
 [/^peak ([\d.]+), stays below ([\d.]+)$/,(m,a,b)=>`最高 ${a}，一直低於 ${b}`],
 [/^closest (\d+) km, (.+)$/,(m,a,b)=>`最接近 ${a} 公里（${zt(b)}）`],
 [/^No\. (\d+) tier$/,(m,n)=>`屬${NO[n]}級別`],[/^near No\. (\d+)$/,(m,n)=>`接近${NO[n]}`],
 [/^\(P ([\d.]+), up to ([\d.]+)\)$/,(m,a,b)=>`（機會率 ${a}，最高 ${b}）`],
 [/^gale stations$/,()=>`烈風測站 `],
 [/^\((\d+)–(\d+)\) at (\S+), (\d+) km$/,(m,a,b,c,d)=>`（${a}–${b}），${zt(c)}，距離 ${d} 公里`],
 [/^past storms at (\d+): (.+?)( \(few\))?$/,(m,n,l,f)=>`過往同樣有 ${n} 個測站錄得烈風的熱帶氣旋：${G(l).replace(/, /g,"、")}${f?"（個案不多）":""}`],
 [/^peak wind index$/,()=>`最高風力指數 `],[/^(\d+) km\/h$/,(m,a)=>`每小時 ${a} 公里`],
 [/^\((very strong|light|fresh|strong|extreme)\) (.+)$/,(m,b,c)=>`（${wib(b)}）${zt(c)}`],
 [/^Click a station to see its wind in each of the (\d+) members\.$/,(m,a)=>`按測站，可看到該站在 ${a} 個集合成員中的預計風力分布。`],
 [/^click: (.+) in every member$/,(m,a)=>`按此查看${G(a)}在各集合成員中的預計風力`],
 [/^: expected wind in each of the (\d+) members \(bars\), (.+?) outlined(?:, ▼ what HKO recorded \((\d+) km\/h\))?$/,(m,a,w,h)=>`：${a} 個集合成員的預計風力（棒形），外框為${who(w)}`+(h?`，▼ 為天文台實測（每小時 ${h} 公里）`:"")],
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
 [/^the AI ensemble's unperturbed member \((\d+)\) on its own -- the site has no separate deterministic AI run$/,(m,a)=>`單獨顯示人工智能模式的控制預報（成員 ${a}）；人工智能模式沒有另外的高解像度預報`],
 [/^Newest run: (.+?), (\d\dZ)(?: \((.+)\))?\.$/,(m,a,z,f)=>`最新預報：${G(a)} ${z.replace("Z","")}時 UTC 起報`+(f?`（${f.replace("ECMWF physics","ECMWF 物理模式").replace("ECMWF AI","ECMWF 人工智能模式")}）`:"")+"。"],
 [/^Not updating right now: this run is (\d+) (days|hours) old\.$/,(m,a,u)=>`暫停更新：最新預報已是 ${a} ${u==="days"?"天":"小時"}前。`],
 [/^Past cases only: each section compares the site with what the Hong Kong Observatory \(HKO\) recorded\. Hover or tap a dot for details\. State of (.+)\.$/,(m,a)=>`只計算過往熱帶氣旋，並與香港天文台的紀錄比較。把滑鼠移到圓點上或按圓點可看詳情。資料截至${G(a)}。`],
 [/^No\. (8 and 9|\d+)$/,(m,a)=>`${a==="8 and 9"?"八號及九號":NO[a]} `],
 [/^, ((?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4})$/,(m,a)=>`，${G(a)}`],
 [/^HKO went up to No\. (\d+)$/,(m,n)=>`天文台最高發出${NO[n]}信號`],
 [/^Will HKO raise No\. (\d+)\?$/,(m,n)=>`天文台會否發出${NO[n]}信號？`],
 [/^asked (\d+) (\w{3}), (\d\d:\d\d) HK time( · picture post)?$/,(m,d,M,t,p)=>`${MON[M]}月${d}日 ${t}（香港時間）`+(p?" · 圖片帖文":"")],
 [/^forecast (\d+) h old$/,(m,a)=>`預報為 ${a} 小時前`],
 [/^(\d+)% is (below|above|inside) MET WARN's (\d+–\d+)%$/,(m,a,w,r)=>w==="inside"?`${a}% 在 MET WARN 的 ${r}% 之內`:`${a}% ${w==="below"?"低於":"高於"} MET WARN 的 ${r}%`],
 [/^(.+?) · runs made before HKO's highest signal$/,(m,a)=>`${a.replace(/ forecasts?, /,"，").replace("ECMWF AI","ECMWF 人工智能模式").replace("Old ECMWF","ECMWF 存檔").replace("Pangu-Weather","盤古氣象")} 年 · 只計算天文台發出最高信號前的預報`],
 [/^(\d+) storms, against the index from HKO's station winds$/,(m,a)=>`${a} 個熱帶氣旋，與根據天文台測站風速計算的指數比較`],
 [/^(\d+) storms, against the peaks HKCOC published$/,(m,a)=>`${a} 個熱帶氣旋，與 HKCOC 公布的最高值比較`],
 [/^(.+?) \(most threatening\)$/,(m,a)=>`${who(a)}（威脅最大）`],
 [/^Member (\d+)$/,(m,a)=>`成員 ${a}`],
 [/^: closest (\d+) km at (.+?), peak No\. 8 ([\d.]+)\. Click to see it below\.$/,(m,a,b,c)=>`：最接近 ${a} 公里（${zt(b)}），八號信號機會率最高 ${c}。按下可在下面查看。`],
 [/^— most threatening: closest (\d+) km at (.+?), peak No\. 8 ([\d.]+)\. Click to see it below\.$/,(m,a,b,c)=>`（威脅最大）：最接近 ${a} 公里（${zt(b)}），八號信號機會率最高 ${c}。按下可在下面查看。`],
 [/^: click anywhere on its line, drag the time bar or press play to see the storm at any moment \(the charts below follow\)\.$/,()=>`：按路徑上任何位置、拖動時間軸或按播放，即可看到熱帶氣旋任何時刻的位置，下面的圖表會同步更新。`],
 [/^: the model stops tracking this storm at (.+?), (\d+) km from Hong Kong\.$/,(m,a,b)=>`：模式在 ${zt(a)} 停止追蹤這個熱帶氣旋，當時距離香港 ${b} 公里。`],
 [/^\. Click the dot to mark this time below\.$/,()=>`。按圓點可在下面標示這個時間。`],
 [/^No\. (\d+) forecast: (\d+) of (\d+) members · start (.+?) \(10–90% (.+?)\) · end (.+?) \((.+?)\) · (\d+) h \((.+?)\), HKT$/,(m,s,n,M,a,b,c,d,h,r)=>`${NO[s]}信號預測：${M} 個成員中有 ${n} 個 · 開始 ${G(a)}（10%–90%：${G(b)}）· 結束 ${G(c)}（${G(d)}）· ${h} 小時（${r}），香港時間`],
 [/^(.+?) \((.+?)\): expected wind (.+?) km\/h · chance of gale (\d+)%, storm (\d+)%, hurricane (\d+)%$/,(m,st,w,v,g,sm,h)=>`${G(st)}（${who(w)}）：預計風速 ${v} 公里/小時 · 烈風機會率 ${g}%、暴風 ${sm}%、颶風 ${h}%`],
 [/^((?:the )?(?:[Mm]ember \d+|deterministic run|control run|most threatening member)(?: \(most threatening\))?) at$/,(m,a)=>`${who(a)}，`],
 [/^: (\d+) km from Hong Kong( · expected signal:)?$/,(m,a,e)=>`：距離香港 ${a} 公里`+(e?" · 預測信號：":"")],
 [/^HKO (\S.*)$/,(m,a)=>`天文台（${G(a)}）`]
];
function who(a){a=a.trim(); return /^(the )?[Dd]eterministic run$/.test(a)?"高解像度預報":/^(the )?[Cc]ontrol run$/.test(a)?"控制預報":
 /^(the )?[Mm]ost threatening member$/.test(a)?"威脅最大的成員":a.replace(/^(?:the )?[Mm]ember (\d+)/,"成員 $1").replace(" (most threatening)","（威脅最大）")}
const BX=[
 [/^ECMWF runs every forecast <b>(\d+) times<\/b>, each from a slightly different start, to show how sure it is\. Each run is a <i>member<\/i>(.*)$/,(m,n,rest)=>{
   let o=`集合預報是把同一模式由略為不同的初始條件計算多次，得出一系列可能情況。這次 ECMWF 預報有 <b>${n} 個<i>集合成員</i></b>`;
   let r=rest, q;
   if(q=r.match(/^: <b>(\d+) of (\d+)<\/b> \((\d+)%\) of them bring No\. (\d+)\.(.*)$/)){o+=`，其中 <b>${q[1]} 個</b>（${q[3]}%）預測天文台會發出${NO[q[4]]}信號。`; r=q[5]}
   else if(q=r.match(/^\. Only <b>(\d+) of (\d+)<\/b> bring No\. 3 or higher, fewer than half, so no signal has a majority\.(.*)$/)){o+=`，只有 <b>${q[1]} 個</b>預測三號或更高信號，不足半數。`; r=q[3]}
   else if(q=r.match(/^\. None of them brings No\. 3 or higher\.(.*)$/)){o+=`，沒有成員預測三號或更高信號。`; r=q[1]}
   else return null;
   r=r.trim();
   if(r==="ECMWF also makes one main forecast in finer detail, the <b>deterministic run</b> (black dashed on the map).")o+=`地圖上的黑色虛線是 ECMWF 的<b>高解像度預報</b>。`;
   else if(r==="The <b>control run</b> is the one member started without any change (black dashed on the map).")o+=`地圖上的黑色虛線是<b>控制預報</b>，即初始條件沒有加入擾動的成員。`;
   else if(r)return null;
   return o}],
 [/^<b>(\d+)<\/b> of (\d+) members pass within (\d+) km · <b>(\d+)<\/b> within (\d+) km(?: · deterministic run (\d+) km)?$/,(m,a,M,ka,b,kb,d)=>`${M} 個集合成員中，<b>${a}</b> 個在香港 ${ka} 公里範圍內掠過，<b>${b}</b> 個在 ${kb} 公里範圍內`+(d?`；高解像度預報最接近時相距 ${d} 公里`:"")+"。"],
 [/^<b>(\d+)<\/b> of (\d+) members · (?:<b>(\d+)<\/b> of them )?(.+?) → (.+?) HKT · <b>(\d+) h<\/b>$/,(m,n,M,k,a,b,h)=>`${M} 個集合成員中有 <b>${n}</b> 個`+(k?`，當中 <b>${k}</b> 個`:"")+` · ${G(a)} 至 ${G(b)}（香港時間）· <b>${h} 小時</b>`],
 [/^<b>Members\.<\/b> ECMWF runs each forecast (\d+) times, each from slightly different starting conditions\. Each run is a member\. A count like "(\d+) of (\d+) members" means (\d+) of those runs give that signal at some point, so it works like a chance\.$/,
  (m,n,a,b)=>`<b>集合成員</b>　ECMWF 每次預報由 ${n} 個略為不同的初始條件計算，每個結果稱為一個集合成員。「${b} 個成員中有 ${a} 個」即 ${a} 個成員在預報期內某時預測該信號，可視作約 ${Math.round(100*a/b)}% 機會。`],
 [/^<b>Deterministic run\.<\/b> Besides the (\d+) members, ECMWF makes one main forecast in finer detail\. It is the black dashed line on the map, and its own numbers say "deterministic"\. It is still one forecast, so it can be right or wrong like any member\.$/,
  (m,n)=>`<b>高解像度預報</b>　除 ${n} 個集合成員外，ECMWF 亦以較高解像度計算一個單一預報，即地圖上的黑色虛線。它只是眾多可能情況之一，未必比其他成員準確。`],
 [/^<b>Control run\.<\/b> The AI forecast's member started without any change\. It is the black dashed line on the map\.$/,()=>`<b>控制預報</b>　人工智能模式中初始條件沒有加入擾動的成員，即地圖上的黑色虛線。`],
 [/^<b>The times\.<\/b> The members that give the signal do not agree to the minute\. The start and end shown are the middle ones: half of those members start earlier, half later, and the same for the end\. The hours are the middle length\. The timeline below shows how far they spread \(earliest (\d+)% to latest (\d+)%\)\.$/,
  (m,a,b)=>`<b>時間</b>　預測同一信號的成員，開始及結束時間各有不同。這裏顯示的是中位數，即一半成員較早、一半較遲；時數亦取中位數。下面的時間線顯示最早 ${a}% 至最遲 ${b}% 成員的範圍。`],
 [/^<b>Gale stations\.<\/b> HKO decides No\. 3 and No\. 8 by the winds at (\d+) reference stations near sea level: .+?\. It raises No\. 8 when half or more of them \((\d+) of (\d+)\) get, or are expected to get, gale winds of (\d+) to (\d+) km\/h\. A count like "(\d+) of (\d+) \((\d+)–(\d+)\)" means the middle member expects (\d+) of the (\d+) stations to get gale winds, and most members expect (\d+) to (\d+)\.$/,
  (m,n,a,b,lo,hi,c,d,e,f,g,h,i,j)=>`<b>烈風測站</b>　天文台參考熱帶氣旋警告系統網絡內 ${n} 個近海平面的參考測風站的風力，決定是否發出三號及八號信號：長洲、赤鱲角、啟德、流浮山、西貢、沙田、打鼓嶺及青衣。當網絡中半數或以上（${b} 個中有 ${a} 個）錄得或預料會錄得每小時 ${lo} 至 ${hi} 公里的烈風，天文台會發出八號信號。「${d} 個中有 ${c} 個（${e}–${f}）」表示中位成員預測 ${h} 個測站中有 ${g} 個錄得烈風，大部分成員預測 ${i} 至 ${j} 個。`],
 [/^<b>Storm and hurricane force<\/b> count the same (\d+) stations, at (\d+) and (\d+) km\/h \((\d+)-minute average wind\)\. Each station's own chance and expected wind are in <b>Stations<\/b> just above, for the (deterministic|control) run, and in the Station guide tab under the map, which shows the same run until you click another track\.$/,
  (m,n,a,b,c,w)=>`<b>暴風及颶風</b>　以同樣 ${n} 個測站計算，持續風力分別達每小時 ${a} 及 ${b} 公里（${c} 分鐘平均）。各測站的機會率及預計風速見上面的<b>各測站預計風速</b>（${w==="control"?"控制預報":"高解像度預報"}）及地圖下方的「測站指引」；未按其他路徑前，兩者顯示同一預報。`],
 [/^<b>Lines:<\/b> (.+)$/,null],
 [/^A rough guide read from each station's chances, not a wind forecast\.(.*)$/,(m,r)=>{let o="根據各測站的烈風、暴風及颶風機會率估算，只供參考，並非風速預報。"; r=r.trim();
   const P=[["The same forecast as the Station guide tab under the map and the station dots on the map;","與地圖下方「測站指引」分頁及地圖上的測站圓點屬同一預報；"],["This forecast, the same as Stations in the answer card;","與上面「各測站預計風速」屬同一預報；"],
            ["10-minute mean.","十分鐘平均風速。"],["HKO: the highest 10-minute mean recorded.","天文台實測為錄得的最高十分鐘平均風速。"]];
   for(const [e,z] of P){if(r.startsWith(e)){o+=z; r=r.slice(e.length).trim()}} return r?null:o}],
 [/^Choose <span class="ui">Today<\/span> or <span class="ui">Past storms<\/span>, then a storm and a run\.$/,()=>`選擇<span class="ui">最新預報</span>或<span class="ui">過往熱帶氣旋</span>，再選擇熱帶氣旋及起報時間。`],
 [/^<span class="ui">Today<\/span> shows the newest forecasts\. <span class="ui">Past storms<\/span> are grouped by the highest signal HKO issued, No\. 10 first\. Pick a storm, then a run, named after the time its forecast started, in UTC\.$/,
  ()=>`<span class="ui">最新預報</span>顯示最新一次預報。<span class="ui">過往熱帶氣旋</span>按天文台曾發出的最高信號分類，十號信號排最前；先選擇熱帶氣旋，再選擇起報時間（協調世界時）。`],
 [/^The buttons below switch between ECMWF's physics model \(IFS\) and its AI model \(AIFS\)\. Older years use ECMWF's archived forecasts \(2008–2023\) or Pangu-Weather \(2018–2022\)\.$/,
  ()=>`下面的按鈕可切換 ECMWF 物理模式（IFS）及人工智能模式（AIFS）。較早年份則用 ECMWF 的存檔預報（2008–2023）或盤古氣象（2018–2022）。`],
 [/^Here (\d+) of (\d+) members give <span class="c10">No\. 10<\/span>, for about (\d+) hours\. HKO kept No\. 10 up for (\d+) hours\.$/,(m,a,b,c,d)=>`圖中 ${b} 個成員有 ${a} 個預測<span class="c10">十號</span>信號，為時約 ${c} 小時；天文台實際發出十號信號 ${d} 小時。`],
 [/^ECMWF runs each forecast 50 times from slightly different starts; each run is a member\. Each line is one member's storm track, coloured by the signal it expects Hong Kong to have at that point: grey for No\. 1, then <span class="c3">No\. 3<\/span>, <span class="c8">No\. 8<\/span>, <span class="c9">No\. 9<\/span> and <span class="c10">No\. 10<\/span>, and back down as the storm leaves\.$/,
  ()=>`ECMWF 每次預報由 50 個略為不同的初始狀態出發，每個稱為集合成員。每條線是一個成員的熱帶氣旋路徑，顏色代表該成員在該位置預測香港的信號：灰色為一號，然後是<span class="c3">三號</span>、<span class="c8">八號</span>、<span class="c9">九號</span>及<span class="c10">十號</span>，遠離時再逐步降低。`],
 [/^<span class="ui">▶ all members<\/span> plays every storm forward, 12 hours a second\. Try it: this is the real map\.$/,()=>`<span class="ui">▶ 播放全部成員</span>以每秒 12 小時推進全部路徑。這是真實的預報地圖，可以直接使用。`],
 [/^<span class="ui">▶ all members<\/span> moves every member's storm forward together, 12 forecast hours a second\. The large black dot is the deterministic run\.$/,()=>`<span class="ui">▶ 播放全部成員</span>以每秒 12 個預報小時，同時推進每個成員的熱帶氣旋位置；大黑點是高解像度預報。`],
 [/^Its track changes colour where that member expects each signal: grey for No\. 1, then <span class="c3">No\. 3<\/span>, <span class="c8">No\. 8<\/span>, <span class="c9">No\. 9<\/span> and <span class="c10">No\. 10<\/span>, and back down as the storm leaves\.$/,
  ()=>`路徑在預測信號改變的位置轉色：灰色為一號，然後是<span class="c3">三號</span>、<span class="c8">八號</span>、<span class="c9">九號</span>及<span class="c10">十號</span>，遠離時再逐步降低。`],
 [/^The player under the map steps through the hours\. The large <span class="ui">← Back to all members<\/span> button, at the top left of the map, brings everyone back\.$/,()=>`地圖下方的播放器會逐小時推進。按地圖左上角的<span class="ui">← 返回全部成員</span>，可重新顯示全部成員。`],
 [/^<span class="ui">zoom to Hong Kong<\/span> colours HKO's eight stations by expected wind\.$/,()=>`<span class="ui">放大香港範圍</span>後，八個參考測風站會按預計風力顯示顏色。`],
 [/^<span class="ui">zoom to Hong Kong<\/span> shows HKO's eight reference stations\. Each dot is coloured by the station's expected wind, with its Beaufort force next to the name\.$/,()=>`<span class="ui">放大香港範圍</span>顯示八個參考測風站，圓點顏色代表預計風力，站名旁標示蒲福氏風級。`],
 [/^The <span class="ui">Station guide<\/span> tab sets each station beside what HKO recorded\.$/,()=>`<span class="ui">測站指引</span>分頁把各測站與天文台實測並列。`],
 [/^The <span class="ui">Station guide<\/span> tab under the map lists each station's chance of gale \(63 km\/h\), storm force \(88 km\/h\) and hurricane force \(118 km\/h\), with a rough expected wind\.$/,
  ()=>`地圖下方的<span class="ui">測站指引</span>分頁列出各測站出現烈風（每小時 63 公里）、暴風（88 公里）及颶風（118 公里）的機會率，以及大概的預計風速。`],
 [/^For past storms it adds what HKO recorded and the difference\. <span class="down">Red<\/span> means the forecast was too low, <span class="up">green<\/span> too high\.$/,()=>`過往個案會加上天文台實測及兩者差距。<span class="down">紅色</span>代表預報偏低，<span class="up">綠色</span>代表偏高。`],
 [/^<span class="ui">How good is it\?<\/span> sets past forecasts beside what HKO did, storm by storm\.$/,()=>`<span class="ui">預報驗證</span>逐個熱帶氣旋比較過往預報與天文台實際發出的信號。`],
 [/^<a href="verify-zh\.html">How good is it\?<\/a> has the full record, signal by signal and station by station\.$/,()=>`<a href="verify-zh.html">預報驗證</a>載有完整紀錄，按信號及測站列出。`],
 [/^This site's chance is the share of its forecast versions \(about 50\) that reach the signal for that storm, from ECMWF's physics forecast\. Past storms are re-run once a day and appear about 13 hours after the start, so this site's forecast was often a day older than the post\. MET WARN posts some forecasts as pictures only; those are marked\. Sources: MET WARN's posts on its public channel \((<a [^>]+>[^<]+<\/a>), read October 2026\) and HKO's signal records\.$/,
  (m,a)=>`本網站的機會率，是 ECMWF 物理模式約 50 個集合成員中預測該信號的比例。過往熱帶氣旋每日重新計算一次，約在起報後 13 小時完成，所以本網站的預報往往比 MET WARN 的帖文早一天。MET WARN 部分預測只以圖片公布，已註明。資料來源：MET WARN 公開頻道（${a}，2026年10月閱覽）及天文台的熱帶氣旋警告信號紀錄。`]
];
const NBSP=/\u00a0/g, norm=s=>s.replace(NBSP," ").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim();
function tt(s){const k=norm(s); if(!k||!/[A-Za-z]/.test(k))return null;
 let r=EX.get(k);
 if(r===undefined)for(const [re,f] of RX){const m=k.match(re); if(m){r=f(...m); break}}
 if(r===undefined||r===null){const g=G(k); if(g!==k)r=g; else return null}
 const lead=/^\s/.test(s)&&!/^\s/.test(r)?" ":"", trail=/\s$/.test(s)&&!/\s$/.test(r)?" ":"";
 return lead+r+trail}
const INL=/^(B|I|EM|STRONG|SPAN|A|BR|SMALL|SUP|SUB|CODE|KBD|ABBR)$/;
const isLeaf=e=>{for(const c of e.children){if(!INL.test(c.tagName)||!isLeaf(c))return false} return true};
function block(e){if(e.closest&&e.closest("svg"))return; if(!isLeaf(e)||!/[A-Za-z]/.test(e.textContent))return; const h=norm(e.innerHTML);
 for(const [re,f] of BX){const m=h.match(re); if(m){if(!f)return; const r=f(...m); if(r!=null&&r!==h)e.innerHTML=r; return}}}
const ATTR=["title","aria-label","alt","placeholder"];
function attrs(e){for(const a of ATTR){const v=e.getAttribute&&e.getAttribute(a); if(v){const r=tt(v); if(r!=null&&r!==v)e.setAttribute(a,r)}}}
function walk(root){if(!root)return; if(root.nodeType===3){const r=tt(root.data); if(r!=null&&r!==root.data)root.data=r; return}
 if(root.nodeType!==1||/^(SCRIPT|STYLE)$/.test(root.tagName))return;
 const els=[root,...root.querySelectorAll("*")]; els.forEach(e=>{if(!/^(SCRIPT|STYLE)$/.test(e.tagName)){attrs(e); block(e)}});
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); let n; const list=[];
 while(n=w.nextNode()){const p=n.parentElement; if(p&&!/^(SCRIPT|STYLE)$/.test(p.tagName))list.push(n)}
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
