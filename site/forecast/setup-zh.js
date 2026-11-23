function oldObs(c){const [avg,w,src]=HKOOLD[c], ZO=/^zh/.test(document.documentElement.lang||""), TO=(e,z)=>ZO?z:e, nm=["Cheung Chau","Chek Lap Kok","Kai Tak","Lau Fau Shan","Sai Kung","Sha Tin","Ta Kwu Ling","Tsing Yi"],
 hr=avg==="hour", isH=/^HKO/.test(src), ok=w.filter(x=>x!=null).map(x=>hr?cv10(x):x), n=t=>ok.filter(x=>x>=t).length, early=+c.slice(-4)<=1985&&(w[0]!=null||w[1]!=null||w[2]!=null),
 srcZ=isH?src.replace(/^HKO's (\d{4}) tropical cyclone report, PDF page (\d+)$/,"天文台 $1 年熱帶氣旋年刊，PDF 第 $2 頁"):"維基百科："+src;
 return `<div class="gh" style="margin-top:12px">${TO(`Reference stations, recorded by HKO (${hr?"highest hourly mean":"highest 10-minute mean"}, ${isH?"from HKO's annual report":"from Wikipedia's table"})`,`天文台參考測風站紀錄（${hr?"最高每小時平均風速":"最高十分鐘平均風速"}，資料來自${isH?"天文台年刊":"維基百科的表格"}）`)}</div>`
  +[["Gale force",63],["Storm force",88],["Hurricane force",118]].map(([l,t])=>`<div class="v gs"><span class="gl">${l}</span> ${gdots(n(t),n(t))} <b class="gn">${n(t)}</b> of ${ok.length}</div>`).join("")
  +`<div class="v" style="font-size:.9em">${w.map((x,i)=>x==null?null:`${nm[i]} ${x}`).filter(Boolean).join(" · ")} ${TO("km/h.","公里/小時。")}${hr?TO(" These are hourly means. The counts and the station table use 10-minute equivalents (hourly mean x 1.10 to 1.22, the ratio measured at these stations in 2000-2025, so gale, storm and hurricane force start at about 56, 79 and 107 km/h hourly).","以上為每小時平均風速。級別統計及測風站表格採用換算後的十分鐘平均風速（每小時平均風速乘以 1.10 至 1.22，即這些測風站於 2000 至 2025 年的實測比率，故烈風、暴風及颶風約由每小時平均風速 56、79 及 107 公里起計）。"):""}${early?TO(" Before 1986 three of these stations read differently from today's sites, measured against Waglan Island in storms on similar tracks. Kai Tak read about 40% higher, Chek Lap Kok (then a hill station on the island, 65 m above sea level) about 30% higher and Cheung Chau about 7% lower. The storm ranking scales these three to today's sites.","1986 年以前，以橫瀾島作比較，在路徑相近的熱帶氣旋中，啟德的讀數約高出 40%，赤鱲角（當時為島上山頭的測風站，海拔 65 米）約高出 30%，長洲則約低 7%。熱帶氣旋排名已將這三站換算至現址水平。"):""} ${TO("Source "+src+".","來源："+srcZ+"。")}</div>`}
const r8key=r=>`${r[0]} ${r[1]}`.toLowerCase(), ordE=n=>n+((n%100>=11&&n%100<=13)?"th":({1:"st",2:"nd",3:"rd"}[n%10]||"th"));
const r8rank=(v,skip)=>1+RANK8.filter(r=>r8key(r)!==skip&&r[2]>v).length;
const r8near=(v,skip)=>{const o=RANK8.filter(r=>r8key(r)!==skip), up=o.filter(r=>r[2]>v).slice(-3).reverse(), dn=o.filter(r=>r[2]<=v).slice(0,3);
 const f=r=>`${r[0]} ${r[1]} ${r[2].toFixed(1)}`; return `<div class="r8s">Similar storms — stronger: ${up.length?up.map(f).join(", "):"none"} · weaker: ${dn.length?dn.map(f).join(", "):"none"}</div>`};
const r8hko=(c,w)=>{const x=RANK8.find(r=>r8key(r)===c.toLowerCase()); return x?x[2]:w.reduce((a,b)=>a+b,0)/w.length};
function rank8Obs(c){const w=HKOWIND[c]; if(!w||HKOOLD[c])return ""; const v=r8hko(c,w), k=c.toLowerCase();
 return `<div class="r8"><div>8-station average of the highest 10-minute mean: <b>${v.toFixed(1)} km/h</b> · <b>${ordE(r8rank(v,k))}</b> of the ${R8N} storms since 2007 that brought No. 3 or higher</div>${r8near(v,k)}</div>`}
const LT53=[46.5,40,39,38,43,27,28,30.5];
function r8val(t){
 const val=i=>{const w=stationWind(t,i); if(w.fv!=null)return w.fv; const b=w.fb; if(!b)return 46; return ((isFinite(b[0])?b[0]:40)+(isFinite(b[1])?b[1]:130))/2};
 const lt=i=>{const w=stationWind(t,i); return w.fv==null&&(!w.fb||w.fb[1]===52)};
 const v46=SGN.reduce((a,_,i)=>a+val(i),0)/SGN.length, v=v46>=R8MIN?v46:SGN.reduce((a,_,i)=>a+(lt(i)?LT53[i]:val(i)),0)/SGN.length;
 return v}
function rank8Member(t){if(!t||!t.gst)return "";
 const v=r8val(t), skip=(casesOf(cyc)[0]||"").toLowerCase(), hk=casesOf(cyc).map(c=>[c,HKOWIND[c]]).find(x=>x[1]&&!HKOOLD[x[0]]);
 const obs=hk?(o=>`<div class="r8s">HKO recorded ${o.toFixed(1)} km/h, ${ordE(r8rank(o,hk[0].toLowerCase()))} of the ${R8N}.</div>`)(r8hko(hk[0],hk[1])):"";
 const head=`8-station average in this forecast (reference only): <b>${Math.round(v)} km/h</b>`;
 const go8=`<div class="r8s"><a href="ranking-zh.html?v=${v.toFixed(1)}&g=${t.gale!=null?Math.round(t.gale):""}&glo=${t.gale_lo??""}&ghi=${t.gale_hi??""}&f=${ens}&r=${cyc}&m=${t.m}${memLab(t.m)!=="member "+t.m?"&det="+(t.m===52?"1":"2"):""}${TR&&t.m===TR.top&&ens!=="deepmind"?"&top=1":""}${FILLF?caQ(t):""}&c=${encodeURIComponent(casesOf(cyc)[0]||"")}" data-rktab="1">See it in the storm ranking</a></div>`;
 if(v<R8MIN)return `<div class="r8"><div>${head}</div>${obs}${go8}</div>`;
 return `<div class="r8"><div>${head} · would rank about <b>${ordE(r8rank(v,skip))}</b> of the ${R8N} storms since 2007</div>${r8near(v,skip)}${obs}${go8}</div>`}
const caseOf=c=>{const p=PAST.find(p=>c>=p[0]&&c<=p[1]);return p?p[2].split(" — ")[0]:null};
const pastOf=c=>PAST.filter(p=>c>=p[0]&&c<=p[1]).map(p=>p[2]).join(" / ");
const SKA={"Unnamed storm (Jun) 2025":"TS0625_2025","Unnamed depression (Aug) 2025":"TD0816_2025"};
const casesOf=c=>PAST.filter(p=>c>=p[0]&&c<=p[1]).map(p=>p[2].split(" — ")[0]);
const RECENT=c=>(Date.UTC(+cycles[0].slice(0,4),+cycles[0].slice(4,6)-1,+cycles[0].slice(6,8))-Date.UTC(+c.slice(0,4),+c.slice(4,6)-1,+c.slice(6,8)))/864e5<=10;
const DROPPED={};
{const W=PAST.map(p=>[p[0],p[1]]); for(const c of Object.keys(HK)){if(RECENT(c)||!W.some(([a,b])=>c>=a&&c<=b))continue; const v=HK[c];
 for(const e of Object.keys(v))if(EMPTYR(v[e])){delete v[e]; (DROPPED[c]=DROPPED[c]||[]).push(e)}
 if(!Object.keys(v).length){delete HK[c]; const i=cycles.indexOf(c); if(i>=0)cycles.splice(i,1)}}}
const el=(t,a={})=>{const e=document.createElementNS("http://www.w3.org/2000/svg",t);for(const k in a)e.setAttribute(k,a[k]);return e};
const CLSE=[0,22,34,48,64,81,100,400], CLSC=["#c8c8c8","#000","#006400","#00008b","#d62728","#ff69b4","#7b1fa2"];
const CLSN=["below TD","TD","TS","STS","T","ST","SuperT"];
const clsOf=v=>{let i=0;while(i<7&&v>=CLSE[i+1])i++;return Math.min(i,6)};
const ramp=p=>{const c=[[205,209,212],[232,179,168],[214,96,77],[178,24,43],[103,0,31]],x=Math.max(0,Math.min(1,p))*(c.length-1),
 i=Math.floor(x),f=x-i,a=c[i],b=c[Math.min(i+1,c.length-1)];return `rgb(${a.map((v,k)=>Math.round(v+(b[k]-v)*f)).join(",")})`};
const VIEWS={region:[103,143,6,33],hk:[109,121,17,27]}, MINW=1.2;
let VB=VIEWS.region.slice(), HOME=VIEWS.region.slice(), moved=false;
const PUB=true;

const GCL=s=>!/^zh/.test(document.documentElement.lang||"")&&ens==="gefs"&&!!s&&Date.parse(String(s).replace(" ","T")+(String(s).length<=16?":00Z":"Z"))<=Date.UTC(+cyc.slice(0,4),+cyc.slice(4,6)-1,+cyc.slice(6,8),+cyc.slice(8,10))+6*36e5+6e4;
let colBy="signal"; 
let cyc=cycles.find(RECENT)||cycles[0], ens="ifsens", view="region", tab="signal", sel=null, selH=null, TR=null;
const MODES={ai:["aifsens","deepmind","pangu"],ec:["ifsens","tigge","gefs","era5"]}, MODEN={ai:"AI models",ec:"ECMWF physics (IFS)"};
const ENSN={ifsens:"IFS (physics)",aifsens:"AIFS (AI)",tigge:"ECMWF ENS of the time (physics)",pangu:"Pangu (AI)",deepmind:"DeepMind (AI)",gefs:"NOAA GEFS (physics)",era5:"ERA5"};
const FCN={ifsens:"ECMWF physics (IFS)",aifsens:"ECMWF AI (AIFS)",tigge:"Old ECMWF (physics)",pangu:"Pangu-Weather (AI)",deepmind:"Google DeepMind (AI)",gefs:"NOAA reforecast (physics)",era5:"ERA5"}, ORDER=["ifsens","aifsens","deepmind","tigge","pangu","gefs","era5"];
const modeOf=e=>Object.keys(MODES).find(k=>MODES[k].includes(e));
const chooseEns=c=>{const av=HK[c]||{}; if(!CHOSEN&&DEFE(c)) ens=DEFE(c); else if(!av[ens]) ens=MODES[mode].find(e=>av[e])||ORDER.find(e=>av[e])||ens; mode=modeOf(ens)||mode};
let mode="ec";
const inMode=c=>MODES[mode].some(e=>(HK[c]||{})[e]);
let NOSAME=null, pickedStorm=null;
const tUc=c=>Date.UTC(+c.slice(0,4),+c.slice(4,6)-1,+c.slice(6,8),+c.slice(8,10));
const pickRun=keep=>{if(!inMode(cyc)&&!keep){cyc=cycles.filter(inMode).find(RECENT)||cycles.find(inMode)||cyc}
 else if(!inMode(cyc)){const mine=cycles.filter(inMode), cs=casesOf(cyc), prev=cyc;
  const same=mine.filter(c=>casesOf(c).some(x=>cs.includes(x))), near=mine.filter(c=>Math.abs(tUc(c)-tUc(prev))<=3*864e5), pool=same.length?same:near;
  if(pool.length) cyc=pool.reduce((a,b)=>Math.abs(tUc(b)-tUc(prev))<Math.abs(tUc(a)-tUc(prev))?b:a);
  else {NOSAME=cs.length?cs.join(" / "):fmtc(prev)+" "+prev.slice(0,4); return}}
 const av=HK[cyc]||{}; if(!MODES[mode].includes(ens)||!av[ens]) ens=MODES[mode].find(e=>av[e])||MODES[mode][0]};
pickRun();
{const nb=$("#mapnav"), mw=$(".mapwrap"); if(nb&&mw) mw.appendChild(nb)}
const BASIC=(()=>{const qs=new URLSearchParams(location.search); if(qs.get("demo")) return qs.get("mode")==="basic";
 try{const q=qs.get("mode");
 if(q==="basic"||q==="advanced"||q==="easy"){localStorage.setItem("hk_mode",q); return q!=="advanced"} const m=localStorage.getItem("hk_mode"); return m?m!=="advanced":PUB}catch(e){return PUB}})();
const EASY=BASIC&&(()=>{const qs=new URLSearchParams(location.search); if(qs.get("demo"))return false; const q=qs.get("mode"); if(q)return q==="easy";
 try{return localStorage.getItem("hk_mode")==="easy"}catch(e){return false}})();
{const c0=OPEN(); if(c0){cyc=c0; ens=DEFE(c0)||ens; mode=modeOf(ens)||mode}}
const SHEETV=BASIC||!/[?&]demo=/.test(location.search); if(SHEETV)document.body.classList.add("sheetv");
if(SHEETV&&!BASIC){const mh=$("#maph"); if(mh) mh.innerHTML=`<span>Possible paths of the storm</span><a class="howto" href="guide-zh.html?mode=advanced">Don't know how to use the map? Read the guide</a>`}
if(BASIC){document.body.classList.add("basic");
 if(EASY){document.body.classList.add("easy"); const st=$("#status"); if(st){const m=document.createElement("p"); m.id="easymore";
  m.innerHTML=`<a href="#" class="easygo">See the details</a>`; st.after(m); m.querySelector("a").onclick=e=>{e.preventDefault(); try{localStorage.setItem("hk_mode","basic")}catch(x){}
   const q=new URLSearchParams(location.search); q.set("mode","basic"); location.search=q.toString()}}}
  [$("#ensbtns")&&$("#ensbtns").closest(".grp"),$("#checks"),$("#only150")&&$("#only150").closest("label"),$("#mapexp"),$("#chead"),$("#tabs"),
  $("#chart")&&$("#chart").closest(".scrollx"),$("#stationchart"),$("#cnote")].forEach(e=>e&&e.classList.add("adv"));
 {const rl=$("#runlbl"), cy=$("#cyc"); if(rl) rl.textContent="Forecast from"; if(cy) cy.title="3. when the forecast started (Hong Kong time)"}
 const ds=$(".mast .disc"); if(ds) ds.textContent="Chances of tropical cyclone warning signals for Hong Kong, from computer forecasts. Research output — the Hong Kong Observatory is the only authority for actual signals.";
 $("#maphint").textContent="Tap or click a path to see its signals and how windy Hong Kong gets along it."; {const mh=$("#maph"); if(mh) mh.innerHTML=`<span>Possible paths of the storm</span><a class="howto" href="guide-zh.html?mode=basic#b4">Don't know how to use the map? Read the guide</a>`}   /* the reading note is in the tour now (2026-11-17, layout review P5) */ const sa=$("#showAll"); if(sa) sa.textContent="← All paths"; const cb=$("#chart")&&$("#chart").closest(".scrollx"); if(cb) cb.classList.add("cbox"); const kh=$("#mapkey .kh"); if(kh) kh.textContent="Signal expected along each path"; const kn=$("#mapkey .kn"); if(kn) kn.classList.add("adv"); const ap=$("#allPlay"); if(ap) ap.textContent="Play"}
if(BASIC&&!/[?&]demo=/.test(location.search)){const mc=$(".mapcard"); if(mc){const bx=document.createElement("div"); bx.id="mchart"; mc.after(bx);
 [$(".sech.mch"),$("#chead"),$("#tabs"),$("#wisw"),$("#chart")&&$("#chart").closest(".scrollx"),$("#stationchart"),$("#cnote"),$("#bwx")].forEach(e=>{if(e)bx.appendChild(e)})}}
window._defHint=$("#maphint").innerHTML;
if(!/[?&]demo=/.test(location.search)){const nv=$("#modeslot"); if(nv){const sw=document.createElement("span"); sw.className="modesw";
 sw.innerHTML=`<a href="#" data-m="easy" class="${EASY?"on":""}">Basic</a><a href="#" data-m="basic" class="${BASIC&&!EASY?"on":""}">Advanced</a><a href="#" data-m="advanced" class="${BASIC?"":"on"}">Expert</a>`; nv.appendChild(sw);
 sw.querySelectorAll("a").forEach(a=>a.onclick=e=>{e.preventDefault(); try{localStorage.setItem("hk_mode",a.dataset.m)}catch(x){}
  const q=new URLSearchParams(location.search); q.set("run",cyc); q.set("f",ens); q.set("mode",a.dataset.m); location.search=q.toString()})}
 document.querySelectorAll(".mast nav a.tour").forEach(a=>a.href=a.getAttribute("href").split("?")[0]+"?mode="+(EASY?"easy":BASIC?"basic":"advanced"))}
const REFK=()=>{if(ens!=="deepmind")return cyc+"_"+ens; const c=pathRun(cyc); return c?c+"_ifsens":(HK[cyc]||{}).tigge?cyc+"_tigge":null};
const refOf=(T,k)=>{if(!T||!T.tracks)return null; const ok=t=>t.pts&&t.pts.length&&t.ca, R=T.tracks.find(t=>t.m===(k.endsWith("_aifsens")?51:52)&&ok(t));
 if(R)return R; const one=T.tracks.filter(ok); return one.length===1?one[0]:null};
const KM10=km=>Math.max(10,Math.round(km/10)*10).toLocaleString("en-US");
const kmP=(a,b)=>Math.hypot((a[0]-b[0])*111.32*Math.cos((a[1]+b[1])/2*Math.PI/180),(a[1]-b[1])*110.57);
const sameStorm=(R,t)=>{if(String(R.storm)===String(t.storm))return true; const m=new Map(t.pts.map(p=>[String(p[3]),p]));
 const d=R.pts.filter(p=>m.has(String(p[3]))).map(p=>kmP(p,m.get(String(p[3])))).sort((a,b)=>a-b); return d.length>=2&&d[Math.floor(d.length/2)]<400};
