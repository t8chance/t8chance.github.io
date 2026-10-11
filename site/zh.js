(function(){
"use strict";
const NO={"1":"一號","3":"三號","8":"八號","9":"九號","10":"十號"};
const MON={Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
const MONF={January:1,February:2,March:3,April:4,May:5,June:6,July:7,August:8,September:9,October:10,November:11,December:12};
const DOW={Mon:"一",Tue:"二",Wed:"三",Thu:"四",Fri:"五",Sat:"六",Sun:"日"};
const ST={"Cheung Chau":"長洲","Chek Lap Kok":"赤鱲角","Kai Tak":"啟德","Lau Fau Shan":"流浮山","Sai Kung":"西貢","Sha Tin":"沙田","Ta Kwu Ling":"打鼓嶺","Tsing Yi":"青衣"};
const WI={"very strong":"甚強","light":"輕微","fresh":"清勁","strong":"強","extreme":"極強"};
const M3="(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)", DW="(Mon|Tue|Wed|Thu|Fri|Sat|Sun)";
function G(s){
 s=s.replace(/\bUnnamed (storm|depression) \((\w{3})\)/g,(m,k,M)=>`未命名${k==="storm"?"風暴":"低壓"}（${MON[M]||M}月）`).replace(new RegExp(DW+" (\\d{1,2}) "+M3+"\\b","g"),(m,d,n,M)=>`${MON[M]}月${n}日（${DOW[d]}）`)
    .replace(new RegExp("\\b(\\d{1,2}) "+M3+" (\\d{4})\\b","g"),(m,n,M,y)=>`${y}年${MON[M]}月${n}日`)
    .replace(new RegExp("\\b(\\d{1,2})–(\\d{1,2}) "+M3+"\\b","g"),(m,a,b,M)=>`${MON[M]}月${a}–${b}日`)
    .replace(new RegExp("\\b(\\d{1,2}) "+M3+"–(\\d{1,2}) "+M3+"\\b","g"),(m,a,M,b,N)=>`${MON[M]}月${a}日–${MON[N]}月${b}日`)
    .replace(new RegExp("\\b(\\d{1,2}) "+M3+"\\b","g"),(m,n,M)=>`${MON[M]}月${n}日`)
    .replace(new RegExp("\\b"+M3+" (\\d{4})\\b","g"),(m,M,y)=>`${y}年${MON[M]}月`)
    .replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})\b/g,(m,M,y)=>`${y}年${MONF[M]}月`)
    .replace(new RegExp(DW+" (\\d{1,2})\\b","g"),(m,d,n)=>`${n}日（${DOW[d]}）`)
    .replace(/\bNo\.[\s\u00a0](8) and (9)\b/g,"八號及九號").replace(/\bNo\.[\s\u00a0](10|1|3|8|9)\b/g,(m,n)=>NO[n])
    .replace(/\bHKT\b/g,"香港時間").replace(/\bHK time\b/g,"香港時間");
 for(const k in ST) s=s.split(k).join(ST[k]);
 s=s.replace(/\(F(\d+) or less\)/g,"（$1級或以下）").replace(/≤\s?F(\d+)/g,"≤$1級").replace(/\bF(\d+)–(\d+)\b/g,"$1–$2級").replace(/\bF(\d+)\b/g,"$1級")
    .replace(/(\d)\s?km\/h\b/g,"$1 公里/小時").replace(/(\d)\s?km\b/g,"$1 公里").replace(/(\d)[\s\u00a0]h\b/g,"$1 小時");
 return s}
const wib=b=>WI[b]||b;
const EX=new Map(Object.entries({
 "Hong Kong typhoon signal forecasts":"香港熱帶氣旋警告信號預測","How to read the forecasts":"如何閱讀預測","How good is it?":"準確度如何？","Open the forecasts":"打開預測",
 "New here? Take the tour":"第一次來？先看導覽","Forecasts":"預測","Tour":"導覽","Show":"顯示","Today":"今日","Past storms":"過往風暴","Run":"預報時次","Forecast":"預報模式",
 "ECMWF physics (IFS)":"ECMWF 物理模式（IFS）","ECMWF AI (AIFS)":"ECMWF 人工智能模式（AIFS）",
 "ECMWF ensemble forecasts turned into Hong Kong signal chances. Research output — the Hong Kong Observatory is the only authority for actual signals.":"把歐洲中期天氣預報中心（ECMWF）的集合預報，轉化為香港各熱帶氣旋警告信號的機會。此為研究成果——實際信號以香港天文台公布為準。",
 "Highest signal a majority gives":"過半數成員給出的最高信號","none":"無","Gale stations":"烈風測站","Storm force":"暴風","Hurricane force":"颶風",
 "Station":"測站","Gale chance":"烈風機會","Wind guide, km/h":"風速指引（公里/小時）","HKO":"天文台","What do these numbers mean?":"這些數字是甚麼意思？",
 "HKO actually issued":"天文台實際發出","Timeline · Hong Kong time":"時間線 · 香港時間","forecast, median start → median end":"預測：成員開始時間中位數 → 結束時間中位數",
 "deterministic run":"確定性預報","Deterministic run":"確定性預報","control run":"控制預報","Control run":"控制預報","faded: fewer than half the members":"淡色：不足一半成員",
 "Numbers per signal":"各信號數字","members":"成員","starts":"開始","ends":"結束","hours":"時數","deterministic":"確定性預報","not issued":"未有發出","main period":"主要時段","other periods":"其他時段",
 "Map":"地圖","zoom to Hong Kong":"放大香港","zoom out":"縮小","▶ all members":"▶ 所有成員","❚❚ pause":"❚❚ 暫停","within 150 km only":"只顯示 150 公里內","▶ play":"▶ 播放",
 "← Back to all members":"← 返回所有成員","Signal along each track":"沿路徑的信號","another storm of the same member":"同一成員的另一個風暴",
 "a signal counts at chance ≥ 0.30 (No. 10: ≥ 0.40)":"機會率達 0.30 才計作該信號（十號：0.40）","Tap or click a line to follow one member.":"點選任何一條線，即可單獨查看該成員。",
 "Expected signal":"預計信號","Wind index":"風力指數","Station guide":"測站指引","ensemble-mean wind index":"集合平均風力指數","Sequence:":"次序：","Sequence: ":"次序：",
 "dashed = observed":"虛線 = 實測","gale stations":"烈風測站","Gale":"烈風","Storm":"暴風","Hurricane":"颶風","Expected wind, km/h":"預計風速（公里/小時）","HKO, km/h":"天文台（公里/小時）",
 "Difference, km/h":"相差（公里/小時）","Gale, storm and hurricane are each station's chances.":"烈風、暴風和颶風為各測站的機會率。",
 "Station numbers are not ready for this run yet.":"此預報時次的測站數字尚未準備好。","Days are UTC · numbers only, no model files":"日期為世界時（UTC）· 只提供數字，不含模式檔案",
 "Lines:":"線條：","Deterministic run:":"確定性預報：","Control run:":"控制預報：","Members.":"成員。","Deterministic run.":"確定性預報。","Control run.":"控制預報。","The times.":"時間。",
 "Gale stations.":"烈風測站。","Storm and hurricane force":"暴風和颶風","Stations":"測站","HKO issued":"天文台發出","Hong Kong":"香港","no member":"沒有成員",
 "probability for this member":"此成員的機會率","wind index (km/h)":"風力指數（公里/小時）","— Hong Kong wind index (right axis, km/h)":"— 香港風力指數（右軸，公里/小時）",
 "- - what HKO actually issued":"- - 天文台實際發出","- - observed wind index (HKO station winds)":"- - 實測風力指數（天文台測站風速）","light":"輕微","fresh":"清勁","strong":"強","very strong":"甚強","extreme":"極強",
 "below 53 km/h":"低於每小時 53 公里","signal":"信號","pages":"頁面","storm":"風暴","run":"預報時次","HKO's highest signal":"天文台最高信號",
 "1. the highest signal HKO issued for the storm":"1. 天文台為該風暴發出的最高信號","2. the storm":"2. 風暴","3. the run (start time, UTC)":"3. 預報時次（開始時間，世界時）",
 "the forecasts that exist for this run -- each is its own system, judged on its own past":"此時次現有的預報——每個系統各自獨立，按各自的過往表現評估",
 "timeline of forecast and actual signals":"預測與實際信號時間線","ECMWF's main forecast, made once in finer detail than the members, shown on its own: track, time bar, charts":"ECMWF 的主要預報，以比各成員更高的解像度只做一次，單獨顯示：路徑、時間軸、圖表",
 "back to every member of this run":"返回此時次的所有成員","play this member's storm through time":"按時間播放此成員的風暴","time along this member's track":"此成員路徑上的時間","animation speed":"動畫速度",
 "the wind index averaged over all ensemble members, hour by hour":"所有集合成員逐小時的平均風力指數","Most threatening member":"威脅最大的成員",
 "Chances of signals No. 3, 8 and 10 for Hong Kong":"香港三號、八號及十號信號的機會","From every ECMWF forecast, updated every 6 hours.":"取材自每一個 ECMWF 預報，每 6 小時更新。",
 "Research output. The Hong Kong Observatory is the only authority for actual signals.":"此為研究成果。實際信號以香港天文台公布為準。","Start the tour":"開始導覽","On the page":"頁面上",
 "Answer":"答案","Timeline":"時間線","Charts":"圖表","Text":"文字","Short":"簡短","Full":"詳細","Choose today or a past storm":"選擇今日或過往風暴","Read the answer":"看答案",
 "The big number is the signal most of the ~50 forecast versions reach.":"大數字是約 50 個預報版本中大多數會達到的信號。",
 "ECMWF runs each forecast about 50 times. The page calls each version a member. The big number is the highest signal that most members reach, with when it starts and ends in Hong Kong time.":"ECMWF 每次預報約運行 50 次，本頁把每個版本稱為一個成員。大數字是大多數成員會達到的最高信號，並以香港時間列出開始和結束時間。",
 "Below it you see how many of HKO's eight reference stations get gale, storm or hurricane winds. For a past storm, HKO's own record sits next to it.":"下面顯示天文台八個參考測站中有多少個會出現烈風、暴風或颶風。過往風暴會在旁列出天文台的紀錄。",
 "See when each signal is up":"看各信號何時生效","Bars show when each signal starts and ends, in Hong Kong time.":"橫條顯示各信號的開始和結束時間（香港時間）。",
 "Each bar covers one signal, in Hong Kong time. The solid part runs from the members' middle start to their middle end. The pale part spans the earliest 10% to the latest 90%.":"每條橫條代表一個信號（香港時間）。實色部分由成員開始時間的中位數到結束時間的中位數；淺色部分涵蓋最早的 10% 至最遲的 90%。",
 "The thin line is the deterministic run, ECMWF's single main forecast. HKO's real signals run along the top.":"細線是確定性預報，即 ECMWF 唯一的主要預報。天文台實際發出的信號列在最上方。",
 "Every line is one member":"每條線是一個成員","Each line is one forecast run, coloured by the signal it expects along the way.":"每條線是一次預報運行，按沿途預計的信號上色。",
 "The thick black dashed line is the deterministic run. For past storms, the black dashed line with dots is where the storm really went. The circles mark distances from Hong Kong.":"粗黑虛線是確定性預報。過往風暴中，帶圓點的黑虛線是風暴的實際路徑。圓圈標示與香港的距離。",
 "Watch all members move":"看所有成員移動","You can watch the spread grow, and see whether it closes on Hong Kong.":"你可以看到各路徑如何逐漸散開，以及會否逼近香港。",
 "Follow one member":"單獨看一個成員","Click a line to see when that member expects each signal, by colour.":"點選一條線，即可按顏色看到該成員預計何時出現各信號。",
 "Click any line to see that member alone, and where its storm is at every hour.":"點選任何一條線，即可單獨看該成員，以及其風暴每小時的位置。",
 "Zoom in on the eight stations":"放大看八個測站","In this run Cheung Chau reaches F12.":"在這次預報中，長洲達到 12 級。","Compare each station with HKO":"把各測站與天文台比較",
 "Check how good it is":"看看準確度","For every storm of 2025 and 2026 it sets this site's chance of each signal beside MET WARN's forecast and what HKO raised.":"2025 及 2026 年的每個風暴，都把本網站各信號的機會率與 MET WARN 的預測及天文台實際發出的信號並列。",
 "Read today's forecast":"看今日預報","Close":"關閉","How much text":"文字多少","more pages":"更多頁面","Picture, full size":"圖片原大小",
 "The answer cards for Typhoon Ragasa: No. 10 from 37 of 50 members, beside HKO's actual No. 10":"颱風 Ragasa 的答案卡：50 個成員中有 37 個給出十號，旁邊是天文台實際發出的十號",
 "The run picker: year, storm and run menus, and the forecast buttons":"預報時次選擇：風暴及時次選單，以及預報模式按鈕","The answer cards":"答案卡",
 "Timeline with bars for No. 3, No. 8 and No. 10 under HKO's own signals":"時間線：三號、八號及十號的橫條，上方是天文台實際發出的信號",
 "Station table with chances, expected wind, HKO's recorded wind and the difference":"測站表：機會率、預計風速、天文台錄得的風速及兩者之差",
 "How good is it?: this site's chance beside MET WARN's forecast and what HKO raised":"準確度如何？：本網站的機會率與 MET WARN 的預測及天文台實際發出的信號並列",
 "The real forecast map: Ragasa 2025, ECMWF run of 21 Sep 12Z; every member's track coloured by the signal it expects":"真實的預測地圖：Ragasa 2025，ECMWF 9月21日 12Z 預報；每個成員的路徑按預計信號上色",
 "The real forecast map: Ragasa 2025, ECMWF run of 21 Sep 12Z, every member playing":"真實的預測地圖：Ragasa 2025，ECMWF 9月21日 12Z 預報，所有成員同時播放",
 "The real forecast map: one member of the Ragasa run on its own, its player running":"真實的預測地圖：Ragasa 預報中的一個成員，正在播放",
 "The real forecast map zoomed on Hong Kong: the eight stations coloured by expected wind, with their Beaufort forces":"放大至香港的真實預測地圖：八個測站按預計風力上色，並標示蒲福氏風級",
 "What would you like to see?":"你想看甚麼？","Today's forecast":"今日預報","Open today's forecast":"打開今日預報","A past storm":"過往風暴","Open Ragasa":"打開 Ragasa","The newest run.":"最新的預報時次。",
 "Starts with Typhoon Ragasa in 2025, when HKO issued No. 10. You can then pick any other storm since 2008.":"由 2025 年颱風 Ragasa 開始（天文台當時發出十號信號），之後可選擇 2008 年以來的任何風暴。",
 "← back to the forecasts":"← 返回預測","Signals":"信號","Signals: this site and MET WARN, storm by storm":"信號：本網站與 MET WARN，逐個風暴比較","Signal":"信號",
 "MET WARN, an unofficial Hong Kong weather channel, posts how likely it thinks HKO is to raise a signal. Below is every such forecast for the storms of 2025 and 2026, next to this site's chance at the same moment and what HKO actually did. These storms were not used to set up this site.":"MET WARN 是香港一個非官方天氣頻道，會發布其認為天文台發出某信號的可能性。以下是 2025 及 2026 年各風暴的所有這類預測，並列本網站在同一時間的機會率，以及天文台的實際做法。這些風暴未有用於設定本網站。",
 "MET WARN gives a range, for example \"high\" = 80–89%. If this site's chance is inside that range, it is the same call. If it is outside, the side nearer to what HKO did is closer.":"MET WARN 會給出一個範圍，例如「高」= 80–89%。若本網站的機會率落在範圍之內，即屬相同判斷；若在範圍之外，較接近天文台實際做法的一方為較準。",
 "All":"全部","this site closer":"本網站較準","MET WARN closer":"MET WARN 較準","same call":"相同判斷","waiting for this site":"待本網站補上","not compared":"不作比較",
 "Question":"問題","MET WARN said":"MET WARN 預測","This site said":"本網站預測","HKO raised it?":"天文台有否發出？","Who was closer":"誰較準","This site":"本網站","MET WARN":"MET WARN",
 "medium":"中等","high":"高","medium-low":"中低","very high":"極高","low":"低","medium-high":"中高","Yes":"有","No":"沒有","–":"–",
 "this site does not forecast No. 9":"本網站不預測九號","this storm's forecasts are being added":"此風暴的預報正在加入","Unnamed storm":"未命名風暴","Unnamed depression":"未命名低壓",
 "How many of HKO's 8 reference stations had gale winds, against what HKO recorded.":"天文台 8 個參考測站中有多少個出現烈風，與天文台的紀錄比較。",
 "ECMWF AI":"ECMWF 人工智能","Pangu-Weather":"盤古氣象（Pangu-Weather）","Old ECMWF":"舊 ECMWF","runs":"個預報時次","exactly right":"完全準確","stations off on average":"平均相差測站數",
 "Each circle = runs with the same pair of numbers; bigger = more runs. On the dashed line = same as HKO. Hover or tap a dot for details.":"每個圓圈 = 數字組合相同的預報時次；圓圈愈大，時次愈多。落在虛線上 = 與天文台相同。把滑鼠移到或點按圓點可看詳情。",
 "Storm peaks":"風暴最高值","Period":"時期","Since Aug 2021":"2021年8月起","2004 to Jul 2021":"2004年至2021年7月","storms":"個風暴","too low on average":"平均偏低","too high on average":"平均偏高","typical miss":"一般誤差",
 "Each dot = one storm's highest wind index. On the dashed line = same as observed; above = too high, below = too low. Hover or tap a dot for details.":"每點 = 一個風暴的最高風力指數。落在虛線上 = 與實測相同；高於虛線 = 偏高，低於虛線 = 偏低。把滑鼠移到或點按圓點可看詳情。",
 "Since Aug 2021 against HKO's station winds; 2004–2021 against the peaks HKCOC published.":"2021年8月起與天文台測站風速比較；2004–2021 年與 HKCOC 公布的最高值比較。",
 "stations with gale, HKO":"出現烈風的測站數（天文台）","stations with gale, this site (middle version)":"出現烈風的測站數（本網站，中位成員）",
 "observed peak, from HKO's station winds (km/h)":"實測最高值，根據天文台測站風速（公里/小時）","peak this site estimates (km/h)":"本網站估計的最高值（公里/小時）","this site against HKO's record":"本網站與天文台紀錄比較",
 "F7 or less":"7級或以下","▼ HKO":"▼ 天文台"
}));
const RX=[
 [/^No\. (8 and 9|\d+) \((\d+) storms?\)$/,(m,a,n)=>`${a==="8 and 9"?"八號及九號":NO[a]}（${n} 個風暴）`],
 [/^ · produced (\S+ \S+) UTC \((\d+) h ago\)(?: · past case: (.+?) — HKO No\. (\d+) on (.+?) \(a fair test: not used to set up the site\))?$/,
  (m,t,h,c,n,d)=>` · 製作於 ${t} UTC（${h} 小時前）`+(c?` · 過往個案：${c}——天文台${NO[n]}，${G(d)}（公平測試：此風暴未有用於設定本網站）`:"")],
 [/^ of (\d+) members pass within (\d+) km · $/,(m,a,b)=>` / ${a} 個成員在 ${b} 公里內經過 · `],
 [/^ within (\d+) km(?: · deterministic run (\d+) km)?$/,(m,a,b)=>` 個在 ${a} 公里內`+(b?` · 確定性預報 ${b} 公里`:"")],
 [/^ of (\d+) members · (?:(.+?) )?$/,(m,a,b)=>` / ${a} 個成員 · `+(b?G(b)+" ":"")],
 [/^ of them (.+)$/,(m,a)=>` 個 · ${G(a)}`],
 [/^ of (\d+) $/,(m,a)=>` / ${a} `],[/^ of (\d+)$/,(m,a)=>` / ${a}`],
 [/^· deterministic (\d+)$/,(m,a)=>`· 確定性預報 ${a}`],
 [/^ members$/,()=>` 個成員`],[/^(\d+) members?$/,(m,a)=>`${a} 個成員`],
 [/^Stations — (.+)$/,(m,a)=>`測站——${who(a)}`],
 [/^(.+?) — (expected signal through time|chance of No\. (\d+) through time|Hong Kong wind index through time|station guide)$/,(m,a,b,n)=>`${who(a)}——${b==="expected signal through time"?"預計信號隨時間變化":b==="Hong Kong wind index through time"?"香港風力指數隨時間變化":b==="station guide"?"測站指引":`${NO[n]}機會率隨時間變化`}`],
 [/^Chance of No\. (\d+)$/,(m,n)=>`${NO[n]}機會率`],
 [/^(\d+)% earliest start → (\d+)% latest end$/,(m,a,b)=>`最早 ${a}% 開始 → 最遲 ${b}% 結束`],
 [/^(\d+) h per second$/,(m,a)=>`每秒 ${a} 小時`],
 [/^every member's storm together through time, (\d+) forecast hours per second$/,(m,a)=>`所有成員的風暴一同隨時間推進，每秒 ${a} 個預報小時`],
 [/^members with a chance of ≥ ([\d.]+) \(No\. 10: ≥ ([\d.]+)\) at any hour · times HKT, median over those members \((\d+)–(\d+)% below\)$/,(m,a,b,c,d)=>`任何一小時機會率達 ${a}（十號：${b}）的成員 · 時間為香港時間，取這些成員的中位數（下方為 ${c}–${d}%）`],
 [/^other periods: (.+)$/,(m,a)=>`其他時段：${G(a.replace(/^(\d+) members? /,"$1 個成員 "))}`],
 [/^ (\d+) possible paths, each started from slightly different conditions\. $/,(m,a)=>` ${a} 條可能路徑，每條的起始條件略有不同。`],
 [/^ the possible paths, each started from slightly different conditions\. $/,()=>` 各條可能路徑，每條的起始條件略有不同。`],
 [/^ ECMWF's main forecast, made once in finer detail\.$/,()=>` ECMWF 的主要預報，以較高解像度只做一次。`],
 [/^ the one path started without any change\.$/,()=>` 起始條件不作任何改動的那條路徑。`],
 [/^(.*?) · teal = wind index \(km\/h\)$/,(m,a)=>`${a} · 藍綠色 = 風力指數（公里/小時）`],
 [/^peak ([\d.]+), ≥ ([\d.]+) from (.+)$/,(m,a,b,c)=>`最高 ${a}，自 ${c} 起達 ${b}`],
 [/^peak ([\d.]+), stays below ([\d.]+)$/,(m,a,b)=>`最高 ${a}，一直低於 ${b}`],
 [/^closest (\d+) km, (.+)$/,(m,a,b)=>`最接近 ${a} 公里，${b}`],
 [/^No\. (\d+) tier$/,(m,n)=>`${NO[n]}級別`],[/^near No\. (\d+)$/,(m,n)=>`接近${NO[n]}`],
 [/^ \(P ([\d.]+), up to ([\d.]+)\)$/,(m,a,b)=>`（P ${a}，最高 ${b}）`],
 [/^gale stations $/,()=>`烈風測站 `],
 [/^ \((\d+)–(\d+)\) at (\S+), (\d+) km$/,(m,a,b,c,d)=>`（${a}–${b}），於 ${c}，${d} 公里`],
 [/^past storms at (\d+): (.+?)( \(few\))?$/,(m,n,l,f)=>`過往有 ${n} 個烈風測站的風暴：${G(l).replace(/, /g,"、")}${f?"（樣本少）":""}`],
 [/^peak wind index $/,()=>`最高風力指數 `],[/^(\d+) km\/h$/,(m,a)=>`每小時 ${a} 公里`],
 [/^ \((very strong|light|fresh|strong|extreme)\) (.+)$/,(m,b,c)=>`（${wib(b)}）${c}`],
 [/^Click a station to see its wind in each of the (\d+) members\.$/,(m,a)=>`點選測站，即可看到該站在 ${a} 個成員中各自的風速。`],
 [/^click: (.+) in every member$/,(m,a)=>`點選：${G(a)}在每個成員中的風速`],
 [/^: expected wind in each of the (\d+) members \(bars\), (.+?) outlined(?:, ▼ what HKO recorded \((\d+) km\/h\))?$/,(m,a,w,h)=>`：${a} 個成員各自的預計風速（柱），框出${who(w)}`+(h?`，▼ 為天文台錄得的風速（每小時 ${h} 公里）`:"")],
 [/^below (\d+)$/,(m,a)=>`低於 ${a}`],
 [/^(strong|gale|storm|hurricane) (\d+)(–\d+|\+)$/,(m,a,b,c)=>`${{strong:"強風",gale:"烈風",storm:"暴風",hurricane:"颶風"}[a]} ${b}${c}`],
 [/^(.+?) \(closest\): (\d+) km from HK$/,(m,a,b)=>`${a}（最接近）：距香港 ${b} 公里`],
 [/^(\d\d \d\d:\d\dZ): (\d+) km from HK$/,(m,a,b)=>`${a}：距香港 ${b} 公里`],
 [/^(\d+) km from HK, (.+)$/,(m,a,b)=>`距香港 ${a} 公里，${b}`],
 [/^expected signal: No\. (\d+)$/,(m,n)=>`預計信號：${NO[n]}`],
 [/^wind index at HK: about (\d+) km\/h \((.+)\)$/,(m,a,b)=>`香港風力指數：約每小時 ${a} 公里（${wib(b)}）`],
 [/^actual: (\d+) km from HK(?:, HKO No\. (\d+) up|, no HKO signal)$/,(m,a,n)=>`實際：距香港 ${a} 公里，`+(n?`天文台已發出${NO[n]}`:`天文台未有發出信號`)],
 [/^(.+?)( \(closest approach\))? · (\d+) km from Hong Kong(?: · expected No\. (\d+))?(?: · wind index (\d+) \((.+)\))?$/,(m,t,c,d,n,w,b)=>`${t}${c?"（最接近時）":""} · 距香港 ${d} 公里`+(n?` · 預計${NO[n]}`:"")+(w?` · 風力指數 ${w}（${wib(b)}）`:"")],
 [/^all members · (.+) \(\+(\d+) h\)$/,(m,a,h)=>`所有成員 · ${a}（+${h} 小時）`],
 [/^— — actual track: (.+)$/,(m,a)=>`— — 實際路徑：${a==="HKO best track"?"天文台最佳路徑":a}`],
 [/^signal along each track \(≥ ([\d.]+); No\. 10 ≥ ([\d.]+)\)$/,(m,a,b)=>`沿路徑的信號（≥ ${a}；十號 ≥ ${b}）`],
 [/^shaded: HKO actually had No\. (\d+) or higher up$/,(m,n)=>`陰影：天文台實際已發出${NO[n]}或以上`],
 [/^run (.+)$/,(m,a)=>`預報開始 ${G(a)}`],
 [/^(\d+\/\d+) · (\d+) h$/,(m,a,b)=>`${a} · ${b} 小時`],
 [/^HKO (.+?): No\. (\d+) (.+?) → (.+?) HKT$/,(m,c,n,a,b)=>`天文台 ${c}：${NO[n]} ${G(a)} → ${G(b)}（香港時間）`],
 [/^deterministic run: (.+?) → (.+?) HKT · (\d+) h$/,(m,a,b,h)=>`確定性預報：${G(a)} → ${G(b)}（香港時間）· ${h} 小時`],
 [/^from HKO's reported maximum hourly mean winds \((\d+) \/ (\d+) km\/h\)$/,(m,a,b)=>`根據天文台公布的最高每小時平均風速（${a} / ${b} 公里/小時）`],
 [/^the AI ensemble's unperturbed member \((\d+)\) on its own -- the site has no separate deterministic AI run$/,(m,a)=>`人工智能集合預報中未經擾動的成員（${a}），單獨顯示——本網站沒有另外的人工智能確定性預報`],
 [/^Newest run: (.+?), (\d\dZ)(?: \((.+)\))?\.$/,(m,a,z,f)=>`最新預報時次：${G(a)} ${z}`+(f?`（${f.replace("ECMWF physics","ECMWF 物理模式").replace("ECMWF AI","ECMWF 人工智能模式")}）`:"")+"。"],
 [/^Not updating right now: this run is (\d+) (days|hours) old\.$/,(m,a,u)=>`目前沒有更新：此預報時次已是 ${a} ${u==="days"?"天":"小時"}前。`],
 [/^Past cases only: each section compares the site with what the Hong Kong Observatory \(HKO\) recorded\. Hover or tap a dot for details\. State of (.+)\.$/,(m,a)=>`只計過往個案：每部分都把本網站與香港天文台的紀錄作比較。把滑鼠移到或點按圓點可看詳情。資料截至 ${G(a)}。`],
 [/^No\. (8 and 9|\d+) $/,(m,a)=>`${a==="8 and 9"?"八號及九號":NO[a]} `],[/^All $/,()=>"全部 "],
 [/^, ((?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4})$/,(m,a)=>`，${G(a)}`],
 [/^HKO went up to No\. (\d+)$/,(m,n)=>`天文台最高發出${NO[n]}`],
 [/^Will HKO raise No\. (\d+)\?$/,(m,n)=>`天文台會否發出${NO[n]}？`],
 [/^asked (\d+) (\w{3}), (\d\d:\d\d) HK time( · picture post)?$/,(m,d,M,t,p)=>`${MON[M]}月${d}日 ${t}（香港時間）提問`+(p?" · 圖片帖文":"")],
 [/^forecast (\d+) h old$/,(m,a)=>`預報已發出 ${a} 小時`],
 [/^(\d+)% is (below|above|inside) MET WARN's (\d+–\d+)%$/,(m,a,w,r)=>w==="inside"?`${a}% 落在 MET WARN 的 ${r}% 之內`:`${a}% ${w==="below"?"低於":"高於"} MET WARN 的 ${r}%`],
 [/^(.+?) · runs made before HKO's highest signal$/,(m,a)=>`${a.replace(/ forecasts?/,"預報").replace("ECMWF AI","ECMWF 人工智能").replace("Old ECMWF","舊 ECMWF")} · 天文台發出最高信號前的預報`],
 [/^(\d+) storms, against the index from HKO's station winds$/,(m,a)=>`${a} 個風暴，與根據天文台測站風速計算的指數比較`],
 [/^(\d+) storms, against the peaks HKCOC published$/,(m,a)=>`${a} 個風暴，與 HKCOC 公布的最高值比較`],
 [/^(.+?) \(most threatening\)$/,(m,a)=>`${who(a)}（威脅最大）`],
 [/^Member (\d+)$/,(m,a)=>`成員 ${a}`],
 [/^: closest (\d+) km at (.+?), peak No\. 8 ([\d.]+)\. Click to see it below\.$/,(m,a,b,c)=>`：最接近 ${a} 公里（${b}），八號機會率最高 ${c}。點選後在下方顯示。`],
 [/^ — most threatening: closest (\d+) km at (.+?), peak No\. 8 ([\d.]+)\. Click to see it below\.$/,(m,a,b,c)=>`——威脅最大：最接近 ${a} 公里（${b}），八號機會率最高 ${c}。點選後在下方顯示。`],
 [/^: click anywhere on its line, drag the time bar or press play to see the storm at any moment \(the charts below follow\)\.$/,()=>`：點選線上任何位置、拖動時間軸或按播放，即可查看風暴在任何時刻的位置（下方圖表會同步）。`],
 [/^: the model stops tracking this storm at (.+?), (\d+) km from Hong Kong\.$/,(m,a,b)=>`：模式在 ${a} 停止追蹤此風暴，距香港 ${b} 公里。`],
 [/^ at (.+?): (\d+) km from Hong Kong(?: · expected signal: )?$/,(m,a,b)=>`，${a}：距香港 ${b} 公里`+(m.includes("expected")?" · 預計信號：":"")],
 [/^\. Click the dot to mark this time below\.$/,()=>`。點選圓點，即可在下方標記這個時間。`],
 [/^No\. (\d+) forecast: (\d+) of (\d+) members · start (.+?) \(10–90% (.+?)\) · end (.+?) \((.+?)\) · (\d+) h \((.+?)\), HKT$/,(m,s,n,M,a,b,c,d,h,r)=>`${NO[s]}預測：${M} 個成員中有 ${n} 個 · 開始 ${G(a)}（10–90%：${G(b)}）· 結束 ${G(c)}（${G(d)}）· ${h} 小時（${r}），香港時間`],
 [/^(.+?) \((.+?)\): expected wind (.+?) km\/h · chance of gale (\d+)%, storm (\d+)%, hurricane (\d+)%$/,(m,st,w,v,g,sm,h)=>`${G(st)}（${who(w)}）：預計風速 ${v} 公里/小時 · 烈風機會 ${g}%、暴風 ${sm}%、颶風 ${h}%`],
 [/^((?:the )?(?:[Mm]ember \d+|deterministic run|control run|most threatening member)(?: \(most threatening\))?) at $/,(m,a)=>`${who(a)}，`],
 [/^: (\d+) km from Hong Kong( · expected signal: )?$/,(m,a,e)=>`：距香港 ${a} 公里`+(e?" · 預計信號：":"")],
 [/^HKO (\S.*)$/,(m,a)=>`天文台 ${a}`]
];
function who(a){a=a.trim(); return a==="deterministic run"||a==="the deterministic run"||a==="Deterministic run"?"確定性預報":a==="control run"||a==="the control run"||a==="Control run"?"控制預報":
 a==="Most threatening member"||a==="the most threatening member"?"威脅最大的成員":a.replace(/^(?:the )?[Mm]ember (\d+)/,"成員 $1").replace(" (most threatening)","（威脅最大）")}
RX.forEach(r=>{r[0]=new RegExp(r[0].source.replace(/^\^ +/,"^").replace(/ +\$$/,"$"))});
const BX=[
 [/^ECMWF runs every forecast <b>(\d+) times<\/b>, each from a slightly different start, to show how sure it is\. Each run is a <i>member<\/i>(.*)$/,(m,n,rest)=>{
   let o=`ECMWF 每次預報都會運行 <b>${n} 次</b>，每次的起始條件略有不同，藉此顯示預報有多確定。每次運行稱為一個<i>成員</i>`;
   let r=rest, q;
   if(q=r.match(/^: <b>(\d+) of (\d+)<\/b> \((\d+)%\) of them bring No\. (\d+)\.(.*)$/)){o+=`：<b>${q[2]} 個中有 ${q[1]} 個</b>（${q[3]}%）帶來${NO[q[4]]}。`; r=q[5]}
   else if(q=r.match(/^\. Only <b>(\d+) of (\d+)<\/b> bring No\. 3 or higher, fewer than half, so no signal has a majority\.(.*)$/)){o+=`。只有 <b>${q[2]} 個中的 ${q[1]} 個</b>帶來三號或以上，不足一半，所以沒有任何信號獲過半數支持。`; r=q[3]}
   else if(q=r.match(/^\. None of them brings No\. 3 or higher\.(.*)$/)){o+=`。沒有成員帶來三號或以上。`; r=q[1]}
   else return null;
   r=r.trim();
   if(r==="ECMWF also makes one main forecast in finer detail, the <b>deterministic run</b> (black dashed on the map).")o+=`ECMWF 亦會以較高解像度另做一個主要預報，即<b>確定性預報</b>（地圖上的黑色虛線）。`;
   else if(r==="The <b>control run</b> is the one member started without any change (black dashed on the map).")o+=`<b>控制預報</b>是起始條件不作任何改動的那個成員（地圖上的黑色虛線）。`;
   else if(r)return null;
   return o}],
 [/^<b>(\d+)<\/b> of (\d+) members · (?:<b>(\d+)<\/b> of them )?(.+?) → (.+?) HKT · <b>(\d+) h<\/b>$/,(m,n,M,k,a,b,h)=>`${M} 個成員中有 <b>${n}</b> 個`+(k?` · 其中 <b>${k}</b> 個`:"")+` · ${G(a)} → ${G(b)}（香港時間）· <b>${h} 小時</b>`],
 [/^<b>Members\.<\/b> ECMWF runs each forecast (\d+) times, each from slightly different starting conditions\. Each run is a member\. A count like "(\d+) of (\d+) members" means (\d+) of those runs give that signal at some point, so it works like a chance\.$/,
  (m,n,a,b)=>`<b>成員。</b>ECMWF 每次預報運行 ${n} 次，每次的起始條件略有不同。每次運行稱為一個成員。「${b} 個成員中有 ${a} 個」的意思是其中 ${a} 次運行在某個時候給出該信號，所以可當作機會率看待。`],
 [/^<b>Deterministic run\.<\/b> Besides the (\d+) members, ECMWF makes one main forecast in finer detail\. It is the black dashed line on the map, and its own numbers say "deterministic"\. It is still one forecast, so it can be right or wrong like any member\.$/,
  (m,n)=>`<b>確定性預報。</b>除了 ${n} 個成員之外，ECMWF 亦會以較高解像度另做一個主要預報。它是地圖上的黑色虛線，相關數字標示為「確定性預報」。它始終只是一個預報，與任何成員一樣可能準確，也可能不準確。`],
 [/^<b>Control run\.<\/b> The AI forecast's member started without any change\. It is the black dashed line on the map\.$/,()=>`<b>控制預報。</b>人工智能預報中起始條件不作任何改動的成員，即地圖上的黑色虛線。`],
 [/^<b>The times\.<\/b> The members that give the signal do not agree to the minute\. The start and end shown are the middle ones: half of those members start earlier, half later, and the same for the end\. The hours are the middle length\. The timeline below shows how far they spread \(earliest (\d+)% to latest (\d+)%\)\.$/,
  (m,a,b)=>`<b>時間。</b>給出該信號的成員在時間上不會完全一致。顯示的開始和結束時間是中位數：一半成員較早開始、一半較遲，結束時間亦然。時數是中位長度。下方的時間線顯示它們有多分散（最早 ${a}% 至最遲 ${b}%）。`],
 [/^<b>Gale stations\.<\/b> HKO decides No\. 3 and No\. 8 by the winds at (\d+) reference stations near sea level: .+?\. It raises No\. 8 when half or more of them \((\d+) of (\d+)\) get, or are expected to get, gale winds of (\d+) to (\d+) km\/h\. A count like "(\d+) of (\d+) \((\d+)–(\d+)\)" means the middle member expects (\d+) of the (\d+) stations to get gale winds, and most members expect (\d+) to (\d+)\.$/,
  (m,n,a,b,lo,hi,c,d,e,f,g,h,i,j)=>`<b>烈風測站。</b>天文台根據 ${n} 個近海平面參考測站的風力決定三號和八號信號：長洲、赤鱲角、啟德、流浮山、西貢、沙田、打鼓嶺和青衣。當其中一半或以上（${b} 個中有 ${a} 個）錄得或預料會錄得每小時 ${lo} 至 ${hi} 公里的烈風時，天文台便會發出八號信號。「${d} 個中有 ${c} 個（${e}–${f}）」的意思是中位成員預計 ${h} 個測站中有 ${g} 個出現烈風，而大多數成員預計為 ${i} 至 ${j} 個。`],
 [/^<b>Storm and hurricane force<\/b> count the same (\d+) stations, at (\d+) and (\d+) km\/h \((\d+)-minute average wind\)\. Each station's own chance and expected wind are in <b>Stations<\/b> just above, for the (deterministic|control) run, and in the Station guide tab under the map, which shows the same run until you click another track\.$/,
  (m,n,a,b,c,w)=>`<b>暴風和颶風</b>以同樣的 ${n} 個測站計算，分別為每小時 ${a} 及 ${b} 公里（${c} 分鐘平均風速）。各測站的機會率及預計風速，載於上方的<b>測站</b>（${w==="control"?"控制預報":"確定性預報"}），以及地圖下方的測站指引分頁；在你點選另一條路徑前，兩者顯示同一個預報。`],
 [/^<b>Lines:<\/b> (.+)$/,null],
 [/^A rough guide read from each station's chances, not a wind forecast\.(.*)$/,(m,r)=>{let o="根據各測站機會率推算的大約指引，並非風速預報。"; r=r.trim();
   const P=[["The same forecast as the Station guide tab under the map and the station dots on the map;","與地圖下方的測站指引分頁及地圖上的測站圓點為同一預報；"],["This forecast, the same as Stations in the answer card;","此預報與答案卡中的「測站」相同；"],
            ["10-minute mean.","十分鐘平均風速。"],["HKO: the highest 10-minute mean recorded.","天文台：錄得的最高十分鐘平均風速。"]];
   for(const [e,z] of P){if(r.startsWith(e)){o+=z; r=r.slice(e.length).trim()}} return r?null:o}],
 [/^Choose <span class="ui">Today<\/span> or <span class="ui">Past storms<\/span>, then a storm and a run\.$/,()=>`選擇<span class="ui">今日</span>或<span class="ui">過往風暴</span>，再選擇風暴和預報時次。`],
 [/^<span class="ui">Today<\/span> shows the newest forecasts\. <span class="ui">Past storms<\/span> are grouped by the highest signal HKO issued, No\. 10 first\. Pick a storm, then a run, named after the time its forecast started, in UTC\.$/,
  ()=>`<span class="ui">今日</span>顯示最新的預報。<span class="ui">過往風暴</span>按天文台發出的最高信號分組，十號排先。先選擇風暴，再選擇預報時次；時次以預報開始的時間命名（世界時，UTC）。`],
 [/^The buttons below switch between ECMWF's physics model \(IFS\) and its AI model \(AIFS\)\. Older years use ECMWF's archived forecasts \(2008–2023\) or Pangu-Weather \(2018–2022\)\.$/,
  ()=>`下方的按鈕可在 ECMWF 的物理模式（IFS）與人工智能模式（AIFS）之間切換。較早年份使用 ECMWF 的存檔預報（2008–2023）或盤古氣象（Pangu-Weather，2018–2022）。`],
 [/^Here (\d+) of (\d+) members give <span class="c10">No\. 10<\/span>, for about (\d+) hours\. HKO kept No\. 10 up for (\d+) hours\.$/,(m,a,b,c,d)=>`這裏 ${b} 個成員中有 ${a} 個給出<span class="c10">十號</span>，持續約 ${c} 小時。天文台實際懸掛十號 ${d} 小時。`],
 [/^ECMWF runs each forecast 50 times from slightly different starts; each run is a member\. Each line is one member's storm track, coloured by the signal it expects Hong Kong to have at that point: grey for No\. 1, then <span class="c3">No\. 3<\/span>, <span class="c8">No\. 8<\/span>, <span class="c9">No\. 9<\/span> and <span class="c10">No\. 10<\/span>, and back down as the storm leaves\.$/,
  ()=>`ECMWF 每次預報都會從略有不同的起始條件運行 50 次，每次運行稱為一個成員。每條線是一個成員的風暴路徑，按該成員預計香港在該點會懸掛的信號上色：灰色為一號，然後是<span class="c3">三號</span>、<span class="c8">八號</span>、<span class="c9">九號</span>和<span class="c10">十號</span>，風暴遠離時再逐級回落。`],
 [/^<span class="ui">▶ all members<\/span> plays every storm forward, 12 hours a second\. Try it: this is the real map\.$/,()=>`<span class="ui">▶ 所有成員</span>讓每個風暴一起向前推進，每秒 12 小時。試試看：這是真實的地圖。`],
 [/^<span class="ui">▶ all members<\/span> moves every member's storm forward together, 12 forecast hours a second\. The large black dot is the deterministic run\.$/,()=>`<span class="ui">▶ 所有成員</span>讓所有成員的風暴一同向前推進，每秒 12 個預報小時。大黑點是確定性預報。`],
 [/^Its track changes colour where that member expects each signal: grey for No\. 1, then <span class="c3">No\. 3<\/span>, <span class="c8">No\. 8<\/span>, <span class="c9">No\. 9<\/span> and <span class="c10">No\. 10<\/span>, and back down as the storm leaves\.$/,
  ()=>`路徑會在該成員預計轉換信號的地方變色：灰色為一號，然後是<span class="c3">三號</span>、<span class="c8">八號</span>、<span class="c9">九號</span>和<span class="c10">十號</span>，風暴遠離時再逐級回落。`],
 [/^The player under the map steps through the hours\. The large <span class="ui">← Back to all members<\/span> button, at the top left of the map, brings everyone back\.$/,()=>`地圖下方的播放器會逐小時推進。地圖左上角的大按鈕<span class="ui">← 返回所有成員</span>會重新顯示全部成員。`],
 [/^<span class="ui">zoom to Hong Kong<\/span> colours HKO's eight stations by expected wind\.$/,()=>`<span class="ui">放大香港</span>按預計風力為天文台的八個測站上色。`],
 [/^<span class="ui">zoom to Hong Kong<\/span> shows HKO's eight reference stations\. Each dot is coloured by the station's expected wind, with its Beaufort force next to the name\.$/,()=>`<span class="ui">放大香港</span>顯示天文台的八個參考測站。每點按該站的預計風力上色，站名旁標示蒲福氏風級。`],
 [/^The <span class="ui">Station guide<\/span> tab sets each station beside what HKO recorded\.$/,()=>`<span class="ui">測站指引</span>分頁把每個測站與天文台的實測並列。`],
 [/^The <span class="ui">Station guide<\/span> tab under the map lists each station's chance of gale \(63 km\/h\), storm force \(88 km\/h\) and hurricane force \(118 km\/h\), with a rough expected wind\.$/,
  ()=>`地圖下方的<span class="ui">測站指引</span>分頁列出每個測站出現烈風（每小時 63 公里）、暴風（88 公里）和颶風（118 公里）的機會率，以及大約的預計風速。`],
 [/^For past storms it adds what HKO recorded and the difference\. <span class="down">Red<\/span> means the forecast was too low, <span class="up">green<\/span> too high\.$/,()=>`過往風暴會加上天文台的實測及兩者之差。<span class="down">紅色</span>表示預測偏低，<span class="up">綠色</span>表示偏高。`],
 [/^<span class="ui">How good is it\?<\/span> sets past forecasts beside what HKO did, storm by storm\.$/,()=>`<span class="ui">準確度如何？</span>逐個風暴把過往預測與天文台的實際做法並列。`],
 [/^<a href="verify-zh\.html">How good is it\?<\/a> has the full record, signal by signal and station by station\.$/,()=>`<a href="verify-zh.html">準確度如何？</a>載有完整紀錄，逐個信號、逐個測站列出。`],
 [/^This site's chance is the share of its forecast versions \(about 50\) that reach the signal for that storm, from ECMWF's physics forecast\. Past storms are re-run once a day and appear about 13 hours after the start, so this site's forecast was often a day older than the post\. MET WARN posts some forecasts as pictures only; those are marked\. Sources: MET WARN's posts on its public channel \((<a [^>]+>[^<]+<\/a>), read October 2026\) and HKO's signal records\.$/,
  (m,a)=>`本網站的機會率是其預報版本（約 50 個）中達到該風暴信號的比例，取自 ECMWF 物理模式。過往風暴每日重新運行一次，約在預報開始後 13 小時出現，所以本網站的預報往往比該帖文早一天。MET WARN 有些預測只以圖片發布，已加註明。資料來源：MET WARN 公開頻道的帖文（${a}，2026年10月閱覽）及天文台的信號紀錄。`]
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
