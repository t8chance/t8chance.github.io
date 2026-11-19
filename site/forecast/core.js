const $=s=>document.querySelector(s), HK=window.HK||{}, cycles=Object.keys(HK).sort().reverse();
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let _B0=null;
const BASIC0=()=>{if(_B0===null){try{const qs=new URLSearchParams(location.search), q=qs.get("mode"); let m=null; try{m=localStorage.getItem("hk_mode")}catch(e){}
  _B0=qs.get("demo")?q==="basic":(q==="basic"||q==="advanced"||q==="easy")?q!=="advanced":m?m!=="advanced":PUB}catch(e){return false}} return _B0};
const fmtc=c=>{if(!BASIC0()) return `${c.slice(6,8)} ${MON[+c.slice(4,6)-1]} ${c.slice(8,10)}Z`;
 const d=new Date(Date.UTC(+c.slice(0,4),+c.slice(4,6)-1,+c.slice(6,8),+c.slice(8,10))+288e5); return `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${String(d.getUTCHours()).padStart(2,"0")}:00`};
const WH=()=>{const d=(HK[cyc]||{})[ens]; return !!(d&&d.tracks_withheld)};
const LIVEF=["ifsens","aifsens","deepmind"];
let PICKED=false;
let CHOSEN=false, PATHS=null, PATHC=null, MIX=null;
const tUcy=c=>Date.UTC(+c.slice(0,4),+c.slice(4,6)-1,+c.slice(6,8),+c.slice(8,10));
const issuedTxt=(d,c)=>{const H=36e5, p=n=>String(n).padStart(2,"0"), f=t=>{const x=new Date(t+8*H); return `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][x.getUTCDay()]} ${x.getUTCDate()} ${MON[x.getUTCMonth()]} ${x.getUTCFullYear()}, ${p(x.getUTCHours())}:${p(x.getUTCMinutes())}`};
 const t0=tUcy(c), g=d&&d.generated?Date.parse(String(d.generated).replace(" ","T")+":00Z"):NaN;
 if(g>=t0&&g-t0<=48*H) return `Issued ${f(g)} (Hong Kong time)`;
 return `${ens==="era5"?"From ERA5,":"Forecast started"} ${f(t0)} (Hong Kong time)`+(isFinite(g)?`, chances worked out in ${new Date(g+8*H).getUTCFullYear()}`:"")};
const issuedDiv=(d,c)=>`<div class="iss">${issuedTxt(d,c)}</div>`;
const ZHPG=/^zh/.test(document.documentElement.lang||"");
const pcOf=(dd,sg)=>{if(!dd||dd.quiet)return 0; const E=dd.event, n=E&&E[sg]?E[sg].n:(dd[sg]&&dd[sg].any?dd[sg].any[0]:0);
 return (dd.members||0)<=1?(n?100:0):Math.round(100*n/(dd.members||50))};
function cmpBlock(){if(!LIVEF.includes(ens)||window.HK_DEMO)return "";
 const t0=tUcy(cyc), R=[], cls=c=>ens==="ifsens"?(+c.slice(8,10))%12:0;
 const row=(c,e,lab,me)=>{const dd=(HK[c]||{})[e]; R.push(`<tr${me?' class="me"':""}><td>${me?lab:`<a href="#" data-c="${c}" data-e="${e}">${lab}</a> <span class="note">${fmtc(c)}</span>`}</td>`
  +["No3","No8","No10"].map(sg=>`<td>${pcOf(dd,sg)}%</td>`).join("")+"</tr>")};
 row(cyc,ens,"This run",true);
 const pv=cycles.find(c=>c<cyc&&(HK[c]||{})[ens]&&cls(c)===cls(cyc)); if(pv)row(pv,ens,"Previous run");
 LIVEF.filter(e=>e!==ens).forEach(e=>{const c=cycles.find(x=>(HK[x]||{})[e]&&tUcy(x)<=t0&&tUcy(x)>=t0-432e5); if(c)row(c,e,FCN[e])});
 return R.length>1?`<table class="cmp"><tr><th></th><th>No. 3</th><th>No. 8</th><th>No. 10</th></tr>${R.join("")}</table>`:""}
document.addEventListener("click",ev=>{const a=ev.target.closest&&ev.target.closest(".cmp a[data-c]"); if(!a)return; ev.preventDefault();
 cyc=a.dataset.c; ens=a.dataset.e; mode=modeOf(ens)||mode; PICKED=true; CHOSEN=true; sel=null; selH=null; head(); load()});
const HKOTC={TC1:[1,"Standby Signal No. 1","一號戒備信號"],TC3:[3,"Strong Wind Signal No. 3","三號強風信號"],
 TC8NE:[8,"No. 8 Northeast Gale or Storm Signal","八號東北烈風或暴風信號"],TC8SE:[8,"No. 8 Southeast Gale or Storm Signal","八號東南烈風或暴風信號"],
 TC8SW:[8,"No. 8 Southwest Gale or Storm Signal","八號西南烈風或暴風信號"],TC8NW:[8,"No. 8 Northwest Gale or Storm Signal","八號西北烈風或暴風信號"],
 TC9:[9,"Increasing Gale or Storm Signal No. 9","九號烈風或暴風風力增強信號"],TC10:[10,"Hurricane Signal No. 10","十號颶風信號"]};
function hkoNow(){const box=document.getElementById("hkonow"); if(!box||window.HK_DEMO)return;
 fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=en",{cache:"no-store"}).then(r=>r.json()).then(j=>{
  const w=j&&j.WTCSGNL, s=w&&w.actionCode!=="CANCEL"&&HKOTC[w.code];
  if(!s){box.style.display="none"; box.innerHTML=""; return}
  const t=w.issueTime?Date.parse(w.issueTime):NaN, x=isNaN(t)?null:new Date(t+288e5), p=n=>String(n).padStart(2,"0");
  const hm=x?`${p(x.getUTCHours())}:${p(x.getUTCMinutes())}`:"";
  box.style.borderLeftColor=SIGV[s[0]]||"var(--no3)";
  box.innerHTML=ZHPG?`香港天文台的<b>${s[2]}</b>現正生效${x?`（${x.getUTCMonth()+1}月${x.getUTCDate()}日 ${hm} 發出）`:""}。 <a href="https://www.hko.gov.hk/tc/index.html">香港天文台網頁</a>`
   :`The Hong Kong Observatory has the <b>${s[1]}</b> in force${x?` (issued ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][x.getUTCDay()]} ${x.getUTCDate()} ${MON[x.getUTCMonth()]} ${hm})`:""}. <a href="https://www.hko.gov.hk/en/index.html">HKO website</a>`;
  box.style.display=""}).catch(()=>{})}
{const fh=document.getElementById("feedh"); if(fh&&ZHPG){fh.href="../data/feed-zh.xml"; fh.title="香港熱帶氣旋警告信號預測"}}
const hktS=t=>{const d=new Date(t+8*36e5), z=n=>String(n).padStart(2,"0"); return `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${z(d.getUTCHours())}:${z(d.getUTCMinutes())}`};
function etaOf(e,c){const rs=cycles.filter(x=>(HK[x]||{})[e]&&HK[x][e].generated); if(!rs.length)return null;
 let D=rs.filter(x=>tUcy(rs[0])-tUcy(x)<=5*864e5).map(x=>[x.slice(8,10),(Date.parse(HK[x][e].generated.replace(" ","T")+":00Z")-tUcy(x))/36e5]).filter(x=>x[1]>0&&x[1]<48);
 if(!D.length)return null; const lo=Math.min(...D.map(x=>x[1])); D=D.filter(x=>x[1]<=lo+12);
 const med=a=>{a=a.slice().sort((p,q)=>p-q); return a[Math.floor(a.length/2)]}, same=D.filter(x=>x[0]===c.slice(8,10)).map(x=>x[1]);
 return tUcy(c)+med(same.length>=2?same:D.map(x=>x[1]))*36e5}
function nextRun(e){const last=cycles.find(x=>(HK[x]||{})[e]); if(!last)return null;
 const step=h=>new Date(tUcy(last)+h*36e5).toISOString().slice(0,13).replace(/[-T]/g,"");
 let c=step(6); if(e==="ifsens"&&/(06|18)$/.test(c)&&c<"2026101906") c=step(12);
 const t=etaOf(e,c); return t?{c,t}:null}
const NAv=d=>!!d&&d.ens==="deepmind"&&!!d.quiet;
const EMPTYR=x=>!!x&&Array.isArray(x.storms)&&!x.storms.length;
const DEFE=c=>{const a=HK[c]||{}; return a.deepmind&&!a.deepmind.quiet?"deepmind":a.ifsens?"ifsens":a.tigge?"tigge":a.gefs?"gefs":a.era5?"era5":BASIC?null:a.aifsens?"aifsens":a.pangu?"pangu":a.deepmind?"deepmind":null};
const DEFR=c=>{const a=HK[c]||{}; return !!(a.deepmind&&!a.deepmind.quiet||a.ifsens||a.tigge)};
const OPEN=()=>{const r=cycles.filter(RECENT), dm=r.find(c=>(HK[c]||{}).deepmind); return dm&&!HK[dm].deepmind.quiet?dm:r.find(c=>(HK[c]||{}).ifsens)||null};
const PHINT=()=>`Each line is one possible path from ECMWF physics (IFS)${PATHC===cyc?"":", its run of "+fmtc(PATHC)}; its colour shows the signal expected along it. Everything else on this page is Google DeepMind's forecast: Google's terms don't allow showing its paths while the forecast is live. Click a line to see that path on its own.`;
const pathRun=c=>{const t=tUcy(c), ok=x=>!!(HK[x]||{}).ifsens&&Math.abs(tUcy(x)-t)<=12*36e5; if(ok(c))return c;
 return cycles.filter(ok).sort((x,y)=>Math.abs(tUcy(x)-t)-Math.abs(tUcy(y)-t)||(x<y?-1:1))[0]||null};
