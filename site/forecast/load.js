const DMCITE=d=>d.tracks_withheld   // Google's citation (live) / CC BY credit (past), word for word: Advanced and Basic (2026-10-20)
      ?`<br><span class="dmcite">Google DeepMind Weather Lab. © 2024-6 Google LLC, whose machine learning models were used to create the experimental data made available under the following licence terms https://storage.googleapis.com/weathernext-public/terms-of-use.pdf. This data is intended for experimental modelling only and is not intended, validated, or approved for real world use.</span>`
      :` <span class="dmcite">Data from <a href="https://deepmind.google.com/science/weatherlab" target="_blank" rel="noopener">Google DeepMind Weather Lab</a> (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>), turned into Hong Kong signal chances here. Google is not involved in this site.</span>`;
function load(){
 HEAT=false;
 BIN=null; PATHC=null; PATHS=null; MIX=null; QP=null; if(QVB){VB=QVB; QVB=null}
 if(BASIC){const ph=c=>!!DEFE(c);
  if(!ph(cyc)){const c2=cycles.find(c=>c<=cyc&&ph(c))||cycles.find(ph); if(c2&&c2!==cyc){cyc=c2; head()}}
  const av=HK[cyc]||{}; if(!CHOSEN||!av[ens]) ens=DEFE(cyc)||"ifsens"; mode=modeOf(ens)||mode}
 allH=null; if(allPlaying)allStop(); btOff(); {const b=$("#btBtn"); if(b)b.style.display="none"}
 if(NOSAME){unavailable();return}
 $("#map").style.display=""; $("#chart").style.display="";
 if(!BASIC&&!CHOSEN){const e1=DEFE(cyc); if(e1&&e1!==ens){ens=e1; mode=modeOf(ens)||mode; head()}}
 if(!(HK[cyc]||{})[ens]&&!PICKED){const av=Object.keys(HK[cyc]||{}); if(av.length){const e0=MODES[mode].find(e=>av.includes(e));
  if(e0) ens=e0; else {mode=Object.keys(MODES).find(k=>MODES[k].some(e=>av.includes(e)))||mode; ens=MODES[mode].find(e=>av.includes(e))||av[0]}; head()}}
 const d=(HK[cyc]||{})[ens];
 if(!/[?&]demo=/.test(location.search)) try{const q=new URLSearchParams(location.search), c0=OPEN(), dflt=c0===cyc&&(DEFE(c0)||ens)===ens;
  if(dflt){q.delete("run");q.delete("f")}else{q.set("run",cyc);q.set("f",ens)} q.set("mode",EASY?"easy":BASIC?"basic":"advanced");
  history.replaceState(null,"",location.pathname+"?"+q.toString()+location.hash)}catch(e){}
 $("#foot").innerHTML=(BASIC?"":`<p>Run names are in UTC, and 12Z is 20:00 Hong Kong time.</p>`)+`<p><a href="../data/${ZHPG?"feed-zh":"feed"}.xml">Feed of changes (RSS)</a></p>`;
 if(d&&d.generated){const g=new Date(d.generated.replace(" ","T")+":00Z"), hrs=(Date.now()-g)/3.6e6;
  $("#stamp").innerHTML=`<b>${FCN[ens]||ens}</b>`+(d.experimental?` · <b>experimental</b>`:"")
   +(ens==="pangu"?" · re-forecast from ERA5, one run":"")+(ens==="gefs"?` · ${d.members} members, no main forecast`:"")+(ens==="era5"?" · From ERA5 and HKO's best track":"")
   +(ens==="ifsens"&&/^(06|18)$/.test(cyc.slice(8,10))?"<span> · this run looks 6 days ahead (ECMWF runs its 06Z and 18Z ensemble to 144 h)</span>":"")
   +(ens==="deepmind"?DMCITE(d):"")
   +` · produced ${new Date(g.getTime()+288e5).toISOString().slice(0,16).replace("T"," ")} HKT (${hrs<1?"<1 h":Math.round(hrs)+" h"} ago)`
   +((NR=>NR?` · <span class="nextrun">next run ${fmtc(NR.c)} expected about ${hktS(NR.t)} HKT${Date.now()>NR.t+36e5?" (running late)":""}</span>`:"")(RECENT(cyc)&&LIVEF.includes(ens)&&cyc===cycles.find(c=>(HK[c]||{})[ens])?nextRun(ens):null))
   +(cyc===cycles[0]&&hrs>18?` — <b style="color:var(--no8)">this copy is behind</b>`:"")
   +(d.rerun?`<span> · worked out again in 2026 from ${ens==="deepmind"?"Google DeepMind's":"ECMWF's"} stored forecast (not on the site at the time)</span>`:"")
   +(pastOf(cyc)?` · past case: ${pastOf(cyc)}${cyc<"2025"?" (this storm was used to set up the site)":" (a fair test: not used to set up the site)"}`:"")
;}
 else $("#stamp").textContent="";
 if(SHEETV&&d&&d.generated){ /* Expert too (2026-11-18, user on Expert's one-line stamp: 'Are these really necessary? (a fair test: not used to set up the site) so much garbage!') */ const t=new Date(Date.parse(d.generated.replace(" ","T")+":00Z")+8*36e5), z=n=>String(n).padStart(2,"0");
  const P=pastOf(cyc), ps=P?P.split(" / ").map(x=>{const [nm_,h]=x.split(" — "), w=!h?"":/^no HKO signal/.test(h)?"HKO issued no signal.":h.replace(/^HKO /,"HKO issued ")+".";
    return P.includes(" / ")&&w?`For ${nm_}, ${w[0].toLowerCase()+w.slice(1)}`:w}).filter(Boolean):[];
  const NR=RECENT(cyc)&&cyc===cycles.find(c=>(HK[c]||{})[ens])?nextRun(ens):null;
  $("#stamp").innerHTML=[...ps.map(x=>`<span class="sl">${x}</span>`), EASY?"":`<span class="sl">From the ${FCN[ens]||ens} forecast.</span>`,
   d.rerun?`<span class="sl">This forecast was not on the site at the time. It was added later, made the same way from ${ens==="deepmind"?"Google DeepMind's":"ECMWF's"} stored forecast.</span>`:"",
   P||d.rerun||EASY?"":`<span class="sl">Updated ${t.getUTCDate()} ${MON[t.getUTCMonth()]} ${z(t.getUTCHours())}:${z(t.getUTCMinutes())} (Hong Kong time).</span>`,
   !EASY&&ens==="ifsens"&&/^(06|18)$/.test(cyc.slice(8,10))?`<span class="sl">This update looks 6 days ahead.</span>`:"",
   NR?`<span class="sl">The next update is expected about ${hktS(NR.t)} (Hong Kong time).</span>`:""].filter(Boolean).join(ZHPG?"":" ")+(ens==="deepmind"?DMCITE(d):"")}
 if(!d){
  {const xbd=document.getElementById("xbands"); if(xbd)xbd.innerHTML=""}
  const hh=cyc.slice(8,10), last=cycles.find(c=>(HK[c]||{})[ens]), near=cycles.filter(c=>(HK[c]||{})[ens]).sort((a,b)=>Math.abs(tUcy(a)-tUcy(cyc))-Math.abs(tUcy(b)-tUcy(cyc)))[0];
  const eta=last&&cyc>last&&LIVEF.includes(ens)?etaOf(ens,cyc):null;
  const why=ens==="ifsens"&&(hh==="06"||hh==="18")&&cyc<"2026101906"?"Until 19 Oct 2026 this site ran ECMWF's physics ensemble only at 00Z and 12Z (at 06Z and 18Z ECMWF runs it 6 days ahead only)."
   :eta?`Not out yet for ${fmtc(cyc)}. Expected about ${hktS(eta)} Hong Kong time (from the last few days).`:`No run of this forecast for ${fmtc(cyc)}.`;
  $("#stamp").innerHTML=`<b>${FCN[ens]||ens}</b> · <span>not available for this run time</span>`;
  $("#status").innerHTML=`<div class="ans na"><div class="k">${FCN[ens]||ens}</div><div class="badge">Not available</div><div class="v">${why}</div>`
   +(near?`<div class="v">Nearest run with it: <a href="#" id="toNear">${fmtc(near)}</a></div>`:"")+`</div>`; sheetMove();
  const b=$("#toNear"); if(b)b.onclick=e=>{e.preventDefault();cyc=near;PICKED=false;sel=null;selH=null;head();load()};
  [...document.querySelectorAll(".mapbar,#mapkey,#mapnav,#maph,#chead,#tabs,.sech.mch"),$("#chart")&&$("#chart").closest(".scrollx")].forEach(e=>{if(e)e.style.display="none"});
  $("#map").style.display="none"; TR=null; MC=null; sel=null; selH=null; syncPlayer(); $("#selbar").style.display="none";
  ["map","chart"].forEach(i=>$("#"+i).innerHTML="");$("#cnote").textContent="";$("#maphint").textContent="";return}
 if(NAv(d)){$("#status").innerHTML=noStorm(d,"No storm in Google DeepMind's forecast comes within 800 km of Hong Kong. It follows only storms that have already formed, so a storm that forms later will not show here. The ECMWF forecasts include those."); sheetMove(); nsFill();
  [...document.querySelectorAll(".mapbar,#mapkey,#mapnav,#maph,#chead,#tabs,.sech.mch"),$("#chart")&&$("#chart").closest(".scrollx")].forEach(e=>{if(e)e.style.display="none"});
  $("#map").style.display="none"; TR=null; MC=null; sel=null; selH=null; syncPlayer(); $("#selbar").style.display="none";
  ["map","chart"].forEach(i=>$("#"+i).innerHTML="");$("#cnote").textContent="";$("#maphint").textContent="";drawR2R();return}
 if(d.quiet){$("#xbands").innerHTML=""; $("#status").innerHTML=noStorm(d,"No storm is forecast to come within 800 km of Hong Kong."); sheetMove(); nsFill();
  ["map","chart"].forEach(i=>$("#"+i).innerHTML="");$("#cnote").textContent="";
  drawR2R(); quietPaths();return}
 const src=(d.sources||[]).includes("s1")?"s1":"s1", MJ=Math.floor((d.members||51)/2)+1;
 const SG=[["No3","No. 3","var(--no3)"],["No8","No. 8","var(--no8)"],["No10","No. 10","var(--no10)"]];
 const cntD=(sg,k)=>{const x=d[sg]&&d[sg].days&&d[sg].days[k];return x?(x[src]||[0,0,0]):[0,0,0]};
 const allDays=[...new Set(SG.flatMap(([sg])=>Object.keys((d[sg]&&d[sg].days)||{})))].sort();
 const act=allDays.filter(k=>SG.some(([sg])=>cntD(sg,k)[2]>0));
 const cs=caseOf(cyc), truth=(()=>{const o={};casesOf(cyc).forEach(c=>Object.entries(HKODAYS[c]||{}).forEach(([k,v])=>{o[k]=Math.max(o[k]||0,v)}));return Object.keys(o).length?o:null})(), tdays=truth?Object.keys(truth):[];
 const span=[...act,...tdays.filter(k=>allDays.includes(k))].sort();
 const dl=span.length?allDays.filter(k=>k>=span[0]&&k<=span[span.length-1]):[];
 const hkT=k=>{const v=truth?(truth[k]||0):0;return v>=10?10:v>=8?8:v>=3?3:0};
 const tierD=k=>{const [a,b,e]=SG.map(([sg])=>cntD(sg,k)[0]);return e>=MJ?10:b>=MJ?8:a>=MJ?3:0};
 const rng=x=>x&&x[1]!==x[2]?`<br><span class="note" style="margin:0">${x[1]}–${x[2]}</span>`:"";
 const tcol=t=>t===10?"var(--no10)":t===8?"var(--no8)":t===3?"var(--no3)":"var(--mut)";
 const E=d.event||null, DW=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], p2=n=>String(n).padStart(2,"0");
 const hkd=iso=>new Date(Date.parse(String(iso).replace(" ","T")+(String(iso).length<=16?":00Z":"Z"))+8*36e5);
 const hk=iso=>{const t=hkd(iso);return `${DW[t.getUTCDay()]} ${t.getUTCDate()} ${MON[t.getUTCMonth()]} ${p2(t.getUTCHours())}:${p2(t.getUTCMinutes())}`};
 const hkS=iso=>hk(iso).split(" ").slice(1).join(" ");
 const LV=[["No3","No. 3",3,"var(--no3)"],["No8","No. 8",8,"var(--no8)"],["No10","No. 10",10,"var(--no10)"]];
 const nOf=sg=>E&&E[sg]?E[sg].n:(d[sg]&&d[sg].any?d[sg].any[0]:0);
 const topL=[...LV].reverse().find(([sg])=>nOf(sg)>=MJ);
 const tU=s=>Date.parse(String(s).replace(" ","T")+(String(s).length<=16?":00Z":"Z"));
 const evW=(()=>{if(!E)return null;let a=Infinity,b=-Infinity;LV.forEach(([sg])=>GS(E[sg]).forEach(g=>{a=Math.min(a,tU(g.start[0]));b=Math.max(b,tU(g.end[2]))}));return a<b?[a-432e5,b+432e5]:null})();
 const ovl=c=>{const x=HKOEV[c].L3;return !!(evW&&x&&tU(x[0])<=evW[1]&&tU(x[1])>=evW[0])};
 const hcases=[...new Set([...casesOf(cyc).filter(c=>HKOEV[c]),...Object.keys(HKOEV).filter(ovl)])], hkoTop=hcases.length?Math.max(...hcases.map(c=>HKOEV[c].top)):null;
 const sm=s=>`<br><span class="note" style="margin:0">${s}</span>`, cell=(sg,f)=>{const x=E&&E[sg];return x&&x.n?f(x):"–"};
 const one=(d.members||0)<=1, clsL=s=>s>=10?10:s>=8?8:3, colL={3:"var(--no3)",8:"var(--no8)",10:"var(--no10)"};
 const pass=passOf(d,one,one?d.min_dist_km:d.det_ca_km);
 let tb="", xb="";
 if(!d.quiet){
  const x=topL&&E&&E[topL[0]]&&E[topL[0]].n?E[topL[0]]:null;
  const pcA=sg=>one?(nOf(sg)?100:0):Math.round(100*nOf(sg)/(d.members||50)), noneA=100-Math.max(...LV.map(([sg])=>pcA(sg)));
  const ans=`<div class="ans"><div class="k">${one?"This run gives":"Expected signal"}</div>`
   +`<div class="bh" style="color:${topL?topL[3]:"var(--ink)"}">${one?(topL?`Signal ${topL[1]}`:"No signal"):topL?`Signal ${topL[1]} likely (${pcA(topL[0])}%)`:`Most likely no signal (${noneA}%)`}</div>${issuedDiv(d,cyc)}`
   +(one?"":LV.map(([sg,lab,L,col])=>`<div class="bbar"><b>${lab}</b><div class="tr"><div class="fl" style="width:${pcA(sg)}%;background:${col}"></div></div><span class="pc">${pcA(sg)}%</span></div>`).join("")+cmpBlock())
   +(topL?`<div class="v">${one?"":`from <b>${nOf(topL[0])}</b> of ${d.members} members`}${x?`${one?"":" · "}${x.groups?`<b>${MAING(x).n}</b> of them `:""}${(GCL(x.start[1])?"by ":"")+""}${hk(x.start[1])}${(GCL(x.start[1])?" (where the data begins)":"")+""} → ${hk(x.end[1])} HKT · <b>${x.hours[1]}&nbsp;h</b>`:""}</div>`:"")
   +(x&&x.groups?`<div class="note">other periods: ${x.groups.filter(g=>g!==MAING(x)).map(g=>`${g.n} member${g.n>1?"s":""} ${hk(g.start[1])} → ${hkS(g.end[1])}`).join(" · ")}</div>`:"")
   +`<div class="note" style="margin-top:8px" id="passn">${pass}</div></div>%%WIND%%<div class="ans"><div class="k">Wind at Hong Kong's reference stations</div><div class="v gs" id="galeF"></div>`
   +`<details class="what"><summary>What do these numbers mean?</summary>`
   +(!one?`<div class="mexp">${ens==="deepmind"?"Google DeepMind's model":ens==="gefs"?"NOAA":"ECMWF"} runs every forecast <b>${d.members} times</b>, each from a slightly different start, to show how sure it is. Each run is a <i>member</i>${topL?`: <b>${nOf(topL[0])} of ${d.members}</b> (${Math.round(100*nOf(topL[0])/d.members)}%) of them bring ${topL[1]}.`:nOf("No3")?`. Only <b>${nOf("No3")} of ${d.members}</b> bring No. 3 or higher, fewer than half, so no signal has a majority.`:". None of them brings No. 3 or higher."}${ens==="ifsens"?` ECMWF also makes one main forecast in finer detail, the <b>deterministic run</b> (black dashed on the map).`:ens==="aifsens"?` The <b>control run</b> is the one member started without any change (black dashed on the map).`:""}</div>`:"")
   +(one?`<p><b>One run.</b> This forecast is a single run, so it gives one answer instead of a share of members.</p>`
        :`<p><b>Members.</b> ${ens==="gefs"?"NOAA":"ECMWF"} runs each forecast ${d.members||50} times, each from slightly different starting conditions. Each run is a member. A count like "${Math.max(1,Math.round(.4*(d.members||50)))} of ${d.members||50} members" means ${Math.max(1,Math.round(.4*(d.members||50)))} of those runs give that signal at some point, so it gives a rough idea of the chance. It is the share of members, not a calibrated probability that HKO will issue the signal.</p>`
         +(ens==="ifsens"?`<p><b>Deterministic run.</b> Besides the ${d.members||50} members, ECMWF makes one main forecast in finer detail. It is the black dashed line on the map, and its own numbers say "deterministic". It is still one forecast, so it can be right or wrong like any member.</p>`:ens==="aifsens"?`<p><b>Control run.</b> The AI forecast's member started without any change. It is the black dashed line on the map.</p>`:"")
         +`<p><b>The times.</b> The members that give the signal do not agree to the minute. The start and end shown are the middle ones: half of those members start earlier, half later, and the same for the end. The hours are the middle length. The timeline below shows how far they spread (earliest 10% to latest 90%).</p>`)
   +`<p><b>Gale stations.</b> HKO decides No. 3 and No. 8 by the winds at 8 reference stations near sea level: Cheung Chau, Chek Lap Kok, Kai Tak, Lau Fau Shan, Sai Kung, Sha Tin, Ta Kwu Ling and Tsing Yi. It raises No. 8 when half or more of them (4 of 8) record, or are expected to record, sustained winds of 63 to 117 km/h and the winds are likely to persist; HKO adds that meeting the wind criterion is not the only consideration, as public safety comes first. This site's numbers are not HKO's decision. A count like "6 of 8 (4–6)" means the middle member expects 6 of the 8 stations to get gale winds at any time from this run onward, and most members expect 4 to 6.</p>`
   +`<p><b>Storm and hurricane force</b> count the same 8 stations, at 88 and 118 km/h (10-minute average wind). Each station's own chance and expected wind are in <b>Stations</b> just above, for the ${ens==="aifsens"?"control":"deterministic"} run, and in the Estimated wind tab under the map, which shows the same run until you click another track.</p>`
   +`<p><b>8-station average.</b> The average over the 8 reference stations of each station's highest 10-minute mean wind in the storm. Past storms are ranked by it: ${R8N} storms since 2007 that brought No. 3 or higher, from the same station records the station numbers are built on. For a forecast it is shown for each member, as a reference only, under the table in the Estimated wind tab, from that member's wind guide at the 8 stations; below ${R8MIN} km/h the guide cannot tell storms apart, so no rank is given.</p></details></div>`;
  const hko=hcases.length&&!window.HK_DEMO?`<div class="ans"><div class="k">HKO actually issued</div><div class="badge" style="color:${colL[clsL(hkoTop)]}">No. ${hkoTop}</div>`
   +hcases.map(c=>{const t=HKOEV[c].top, y=HKOEV[c]["L"+clsL(t)];return `<div class="v">${c}: No. ${t}${y?` · ${hkS(y[0])} → ${hkS(y[1])} HKT · <b>${Math.round(y[2])}&nbsp;h</b>`:""}</div>%%HW%%${HKOGALE[c]!=null?`<div class="gh" style="margin-top:12px">Reference stations, recorded by HKO</div><div class="v gs"><span class="gl">Gale force</span> ${gdots(HKOGALE[c],HKOGALE[c])} <b class="gn">${HKOGALE[c]}</b> of 8</div>`:""}${HKOSH[c]?[["Storm force",0],["Hurricane force",1]].map(([l,i])=>`<div class="v gs"><span class="gl" title="from HKO's reported maximum hourly mean winds (80 / 107 km/h); the station table uses the highest 10-minute mean">${l}</span> ${gdots(HKOSH[c][i],HKOSH[c][i])} <b class="gn">${HKOSH[c][i]}</b> of 8</div>`).join(""):""}${(HKOGALE[c]==null&&HKOOLD[c]?oldObs(c):"")||""}${rank8Obs(c)}%%HE%%`}).join("")+obsHTML("v")+`</div>`
   :(()=>{const ns=casesOf(cyc).filter(c=>!HKOEV[c]); return ns.length&&!window.HK_DEMO?`<div class="ans"><div class="k">HKO actually issued</div><div class="badge" style="color:var(--mut)">No signal</div>${ns.map(c=>`<div class="v">${c}</div>`).join("")}${obsHTML("v")}</div>`:""})();
  const [ansS,ansW]=ans.split("%%WIND%%"), hkW=[...hko.matchAll(/%%HW%%([\s\S]*?)%%HE%%/g)].map(m=>m[1]).join("");
  const hkoS=hko.replace(/%%HW%%[\s\S]*?%%HE%%/g,""), hkoW=hko&&hkW.replace(/<[^>]*>/g,"").trim()?`<div class="ans"><div class="k">HKO recorded</div>${hkW}</div>`:"";
  const card=([sg,lab,L,col])=>{const x_=E&&E[sg], a=d[sg]&&d[sg].any, n=nOf(sg);
   const rows=[[one?"reached":"members",one?`<b>${n?"yes":"no"}</b>`:`<b>${n}</b> of ${d.members}${(L!==10&&a&&a[1]!==a[2])?` <span class="rng">(${a[1]}–${a[2]})</span>`:""}`]];
   if(x_&&x_.groups) rows.push(["main period",`<b>${MAING(x_).n}</b> members`]);
   if(x_&&x_.n){rows.push(["starts",(GCL(x_.start[1])?"by ":"")+hk(x_.start[1])+(GCL(x_.start[1])?" (where the data begins)":"")+(one?"":`<div class="rng">${hkS(x_.start[0])} – ${hkS(x_.start[2])}</div>`)]);
    rows.push(["ends",hk(x_.end[1])+(one?"":`<div class="rng">${hkS(x_.end[0])} – ${hkS(x_.end[2])}</div>`)]);
    rows.push(["hours",`<b>${x_.hours[1]}</b>`+(one?"":` <span class="rng">(${x_.hours[0]}–${x_.hours[2]})</span>`)])}
   if(x_&&x_.groups) rows.push(["other periods",x_.groups.filter(g=>g!==MAING(x_)).map(g=>`${g.n} · ${hkS(g.start[1])} → ${hkS(g.end[1])} · ${g.hours[1]}&nbsp;h`).join("<br>")]);
   if(x_&&x_.det) rows.push(["deterministic",`${hkS(x_.det[0])} → ${hkS(x_.det[1])} · ${x_.det[2]}&nbsp;h`]);
   hcases.forEach(c=>{const y=HKOEV[c]["L"+L];rows.push([`HKO ${c.split(" ")[0]}`,y?`<b>${hkS(y[0])} → ${hkS(y[1])}</b> · ${Math.round(y[2])}&nbsp;h`:"not issued"])});
   return `<div class="lv" style="--c:${col}"><h3>${lab}</h3><dl>${rows.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl></div>`};
  xb=`<div class="xband"><div>${ansW}</div><div>${hkoS}${hkoW}</div></div>`;
  tb=`<h2 class="sech">The forecast</h2><div class="hero">${ansS}${hkoS}${ansW}${hkoS?hkoW||"<div></div>":""}</div><h2 class="sech">When</h2><div class="tlcard"><div class="k">Timeline · Hong Kong time</div><div id="tl"></div></div>`
   +(window.HK_DEMO?"":r2rCard())
   +`<details class="nums"><summary>Numbers per signal</summary><div class="lvgrid">${LV.map(card).join("")}</div>`
   +(E?"":`<p class="note">start, end and hours: not in this run's data</p>`)
   +`<p class="note">times HKT${one?"":", median over the members giving the signal (10–90% below)"}`+`</p></details>`;
  xb+=tb.slice(tb.indexOf('<details class="nums">'));
 }
 GA={members:d.members||0,one};
 const basicCard=()=>{const M=d.members||50, pc=sg=>one?(nOf(sg)?100:0):Math.round(100*nOf(sg)/M);
  const none=100-Math.max(...LV.map(([sg])=>pc(sg)));
  const win=sg=>{const x=E&&E[sg]&&E[sg].n?E[sg]:null; if(!x)return pc(sg)?"":`<span class="nx">Not expected</span>`;
   return GCL(x.start[1])?`<span>By ${hk(x.start[1])}</span> <span>until ${hk(x.end[1])}</span>`:`<span>${hk(x.start[1])}</span> <span>to ${hk(x.end[1])}</span>`};
  return `<div class="bhead"><div class="bh">${topL?`<span class="plate p${topL[2]}" aria-hidden="true">${topL[2]}</span>`:""}<span>${topL?`Signal ${topL[1]} likely (${pc(topL[0])}%)`:`Most likely no signal (${none}%)`}</span></div>${issuedDiv(d,cyc)}</div>`
   +`<table class="board"><thead><tr><th>Signal</th><th class="r">Chance</th><th>Expected, Hong Kong time</th></tr></thead><tbody>`
   +LV.map(([sg,lab,L,col])=>`<tr><th><span class="plate p${L}" title="${lab}">${L}</span></th><td class="pc">${pc(sg)}<small>%</small></td><td><div class="bar"><i style="width:${pc(sg)}%;background:${col}"></i></div><div class="win">${win(sg)}</div></td></tr>`).join("")
   +`</tbody></table>`
   +(EASY||one?"":cmpBox())
   +`<div class="facts"><div class="bv" id="bclose"></div>${obsHTML("bv")}</div>`
   +`<div class="tlcard when"><div class="figh"><h2>When each signal is expected</h2><span>Hong Kong time</span></div><div id="tl"></div></div>`
   +`<div class="bmapc" id="bmapbox" data-top="${topL?topL[2]:0}"></div>`
   +(EASY?"":BASIC?r2rCardB():r2rCard().replace('<h2 class="sech">Trend</h2>',""))};
 $("#xbands").innerHTML=SHEETV&&!BASIC?xb:"";
 $("#status").innerHTML=SHEETV?basicCard():tb||`<div class="ans"><div class="k">Highest signal</div><div class="badge" style="color:var(--mut)">none</div>${issuedDiv(d,cyc)}<div class="note">${pass}</div></div>`; sheetMove();
 drawTL({E,one,members:d.members||0,MJ,hcases,init:Date.UTC(+cyc.slice(0,4),+cyc.slice(4,6)-1,+cyc.slice(6,8),+cyc.slice(8,10))});
 drawR2R();
 const key=cyc+"_"+ens;
 PATHC=d.tracks_withheld?pathRun(cyc):null;
 [...document.querySelectorAll(".mapbar,#mapnav,#maph")].forEach(e=>{if(e)e.style.display=d.tracks_withheld&&!PATHC?"none":""});
 {const k=$("#mapkey"); if(k)k.style.display=d.tracks_withheld&&!PATHC?"none":""}
 [$("#allPlay"),$("#only150")&&$("#only150").closest("label")].forEach(e=>{if(e)e.style.display=d.tracks_withheld?"none":""});
 {const l=$("#othL"); if(l)l.style.display=ens==="ifsens"||ens==="aifsens"?"":"none"}
 [...document.querySelectorAll("#chead,#tabs,.sech.mch"),$("#chart")&&$("#chart").closest(".scrollx")].forEach(e=>{if(e)e.style.display=""});
 if(d.tracks_withheld){TR=null; sel=null; selH=null; MC=null; BIN=null; syncPlayer(); $("#selbar").style.display="none"; $("#map").innerHTML=""; $("#map").style.display=PATHC?"":"none"; $("#chart").innerHTML=""; $("#cnote").textContent="";
  if(window._defHint===undefined)window._defHint=$("#maphint").innerHTML;
  $("#maphint").textContent=PATHC?PHINT():"Tracks are not shown for live Google DeepMind forecasts: while a forecast is live, Google's terms let this site publish only results worked out from it, such as the signal chances and the winds at Hong Kong. The tracks appear here once the storm has passed.";
  if(PATHC){const pc=PATHC, k2=pc+"_ifsens", fin=()=>{if(PATHC!==pc)return; PATHS=wrapT((window.HKT||{})[k2])||null; if(PATHS)drawMap()};
   if(window.HKT&&window.HKT[k2])fin(); else{const s2=document.createElement("script"); s2.src=`../data/tracks_${k2}.js`; s2.onload=fin; document.head.appendChild(s2)}}
  tab="wi"; if(!showWIDist) showWIMean=true}
 else $("#map").style.display="";
 if(window.HKT&&window.HKT[key]){TR=wrapT(window.HKT[key]);wiC2();drawTabs();drawMap();chart();fillGale();fillBasic();fillDetCa();return}
 const sc=document.createElement("script");sc.src=`../data/tracks_${key}.js`;
 sc.onload=()=>{TR=wrapT((window.HKT||{})[key]);wiC2();drawTabs();drawMap();chart();fillGale();fillBasic();fillDetCa()};
 sc.onerror=()=>{TR=null;MC=null;syncPlayer();$("#map").innerHTML="";$("#chart").innerHTML="";$("#cnote").textContent="track file missing for this run"};
 document.head.appendChild(sc);
}
const GS=x=>x&&x.n?(x.groups||[{n:x.n,start:x.start,end:x.end,hours:x.hours}]):[], MAING=x=>GS(x).reduce((a,b)=>b.n>a.n?b:a,GS(x)[0]);
let TLA=null, GA=null;
function drawTL(a){if(a)TLA=a;a=TLA;const box=document.getElementById("tl");if(!box||!a)return;
 const {E,one,members,MJ,hcases,init}=a, H=36e5, CP=BASIC;
 const tU=s=>Date.parse(String(s).replace(" ","T")+(String(s).length<=16?":00Z":"Z"));
 const LVs=[["No3","No. 3",3,"var(--no3)"],["No8","No. 8",8,"var(--no8)"],["No10","No. 10",10,"var(--no10)"]];
 const W=Math.max(300,Math.round(box.getBoundingClientRect().width)), ph=W<560, LW=ph?50:74, R=W-2, fz=ph?11:12, cw=fz*.6;
 let lo=Infinity,hi=-Infinity;const ext=(p,q)=>{if(p<lo)lo=p;if(q>hi)hi=q};
 LVs.forEach(([sg,,L])=>{const x=E&&E[sg];GS(x).forEach(g=>ext(tU(g.start[0]),tU(g.end[2])));if(x&&x.det&&!CP)ext(tU(x.det[0]),tU(x.det[1]));
  hcases.forEach(c=>{const y=HKOEV[c]["L"+L];if(y)ext(tU(y[0]),tU(y[1]))})});
 const card=box.parentNode;
 const hd=card.previousElementSibling&&card.previousElementSibling.classList.contains("sech")?card.previousElementSibling:null;
 if(!(lo<hi)){box.innerHTML="";card.style.display="none";if(hd)hd.style.display="none";return}
 card.style.display="";if(hd)hd.style.display="";
 if(init<lo&&lo-init<=36*H)lo=init;
 const b6=t=>Math.floor((t+8*H)/(6*H))*6*H-8*H; lo=b6(lo-2*H); hi=b6(hi+8*H);
 const X=t=>LW+(Math.min(Math.max(t,lo),hi)-lo)/(hi-lo)*(R-LW);
 const p2=n=>String(n).padStart(2,"0"), DW=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
 const hl=(t,full)=>{const d=new Date(t+8*H);return `${full?DW[d.getUTCDay()]+" ":""}${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`};
 const hh=h=>`${Math.round(h)} h`;
 let s="", grid="", y=0;
 const rect=(x0,x1,y0,h,st,tip)=>{s+=`<rect x="${x0.toFixed(1)}" y="${y0}" width="${Math.max(x1-x0,2).toFixed(1)}" height="${h}" rx="3" style="${st}">${tip?`<title>${tip}</title>`:""}</rect>`};
 const txt=(x,y0,t,st,anc)=>{s+=`<text x="${x.toFixed(1)}" y="${y0}" font-size="${fz}" text-anchor="${anc||"start"}" style="${st||"fill:var(--mut)"}">${t}</text>`};
 const side=(x0,x1,y0,t,st)=>{const w=t.length*cw+(/^zh/.test(document.documentElement.lang||"")?fz*2:0);   /* the Chinese page writes 'h' as 小時, two characters wider */ st+=";paint-order:stroke;stroke:var(--card);stroke-width:4px;stroke-linejoin:round";
  if(x1+6+w<=R)txt(x1+6,y0,t,st);else if(x0-6-w>=LW)txt(x0-6,y0,t,st,"end");else txt(R,y0,t,st,"end")};
 const AX=34;
 for(let d=Math.floor((lo+8*H)/(24*H))*24*H-8*H; d<hi; d+=24*H){const a0=Math.max(d,lo), a1=Math.min(d+24*H,hi), w=X(a1)-X(a0);
  if(d>lo)grid+=`<line x1="${X(d).toFixed(1)}" x2="${X(d).toFixed(1)}" y1="2" y2="@B" style="stroke:var(--line)"/>`;
  const dd=new Date(d+9*H), lab=w>=92&&!ph?`${DW[dd.getUTCDay()]} ${dd.getUTCDate()} ${MON[dd.getUTCMonth()]}`:w>=46?`${DW[dd.getUTCDay()]} ${dd.getUTCDate()}`:w>=18?`${dd.getUTCDate()}`:"";
  if(lab)txt((X(a0)+X(a1))/2,13,lab,"fill:var(--ink);font-weight:600","middle")}
 const px6=(R-LW)/((hi-lo)/(6*H));
 for(let t=lo; t<=hi; t+=6*H){const hr=new Date(t+8*H).getUTCHours(); if(hr===0)continue;
  grid+=`<line x1="${X(t).toFixed(1)}" x2="${X(t).toFixed(1)}" y1="${AX-5}" y2="${AX-1}" style="stroke:var(--mut)"/>`;
  if(px6>=24&&X(t)<=R-9&&X(t)>=LW+9)txt(X(t),AX-8,p2(hr),`fill:var(--mut);font-size:${fz-1.5}px`,"middle")}
 grid+=`<line x1="${LW}" x2="${R}" y1="${AX-1}" y2="${AX-1}" style="stroke:var(--line)"/>`;
 y=AX+6;
 const SC={1:"var(--no1)",3:"var(--no3)",8:"var(--no8)",9:"var(--no9)",10:"var(--no10)"};
 hcases.forEach(c=>{const q=(HKOSEQ[c]||[]).filter(([a_,b_])=>tU(b_)>lo&&tU(a_)<hi); if(!q.length)return;
  const nm=c.split(" ")[0]; txt(0,y+12,hcases.length>1?(ph?nm.slice(0,7):nm):(ph?"HKO":"HKO issued"),"fill:var(--ink);font-weight:600");
  q.forEach(([a_,b_,g])=>{const x0=X(tU(a_)),x1=X(tU(b_));
   s+=`<rect x="${x0.toFixed(1)}" y="${y}" width="${Math.max(x1-x0,1.5).toFixed(1)}" height="16" style="fill:${SC[g]||"var(--mut)"};stroke:var(--card);stroke-width:1"><title>HKO ${c}: No. ${g} ${hl(tU(a_),1)} → ${hl(tU(b_),1)} HKT</title></rect>`;
   if(x1-x0>=(g>=10?18:11))s+=`<text x="${((x0+x1)/2).toFixed(1)}" y="${y+12}" font-size="${fz-1}" font-weight="700" text-anchor="middle" class="${g<=3?"tt-k":"tt-w"}" style="pointer-events:none">${g}</text>`});
  y+=22});
 if(hcases.length)y+=8;
 LVs.forEach(([sg,lab,L,col],li)=>{const x=E&&E[sg], y0=y, op=x&&x.n?(x.n>=MJ||one?1:.45):1;
  if(li)s+=`<line x1="0" x2="${R}" y1="${y0-5}" y2="${y0-5}" style="stroke:var(--line)"/>`;
  if(CP){s+=`<rect x="0" y="${y0}" width="24" height="18" style="fill:${col}"><title>${lab}</title></rect><text x="12" y="${y0+13}" font-size="${fz}" font-weight="700" text-anchor="middle" class="${L===3?"pk":"pw"}">${L}</text>`}
  else txt(0,y0+13,lab,`fill:${col};font-weight:700`);
  let xl=Infinity, xr=-Infinity;
  const LB=[];
  GS(x).forEach(g=>{const a0=X(tU(g.start[0])),a1=X(tU(g.start[1])),b1=X(tU(g.end[1])),b2=X(tU(g.end[2])), og=one||g.n>=MJ?1:.45;
   const tip=`${lab} forecast: ${one?"":`${g.n} of ${members} members · `}start ${GCL(g.start[1])?"by ":""}${hl(tU(g.start[1]),1)}${GCL(g.start[1])?" (where the data begins)":""}${one?"":` (10–90% ${hl(tU(g.start[0]))} – ${hl(tU(g.start[2]))})`} · end ${hl(tU(g.end[1]),1)}${one?"":` (${hl(tU(g.end[0]))} – ${hl(tU(g.end[2]))})`} · ${g.hours[1]} h${one?"":` (${g.hours[0]}–${g.hours[2]})`}, HKT`;
   if(!one)rect(a0,b2,y0+2,14,`fill:${col};opacity:${(.25*og).toFixed(2)}`,tip);
   rect(a1,b1,y0+2,14,`fill:${col};opacity:${og}`,tip); LB.push([Math.min(a0,a1),Math.max(b1,b2),g]); xl=Math.min(xl,a0,a1); xr=Math.max(xr,b1,b2)});
  if(x&&x.det&&!CP){const d0=X(tU(x.det[0])),d1=X(tU(x.det[1]));
   s+=`<g style="stroke:var(--ink);stroke-width:2"><line x1="${d0.toFixed(1)}" x2="${d1.toFixed(1)}" y1="${y0+21}" y2="${y0+21}"/><line x1="${d0.toFixed(1)}" x2="${d0.toFixed(1)}" y1="${y0+18}" y2="${y0+24}"/><line x1="${d1.toFixed(1)}" x2="${d1.toFixed(1)}" y1="${y0+18}" y2="${y0+24}"/><title>deterministic run: ${hl(tU(x.det[0]),1)} → ${hl(tU(x.det[1]),1)} HKT · ${x.det[2]} h</title></g>`;
   xl=Math.min(xl,d0); xr=Math.max(xr,d1)}
  if(LB.length===1){const g=LB[0][2];side(xl,xr,y0+13,one||CP?hh(g.hours[1]):`${g.n}/${members} · ${hh(g.hours[1])}`,"fill:var(--ink)")}
  else if(LB.length>1)LB.forEach(([p,q,g])=>side(p,q,y0+13,CP?hh(g.hours[1]):`${g.n}/${members} · ${hh(g.hours[1])}`,"fill:var(--ink)"));
  else txt(LW+4,y0+13,CP?(!E?"No timing in this forecast":"Not expected"):!E?"no timing in this run's data":x&&x.det?"deterministic run only":(one?"not reached":"no member"));
  y+=30});
 const B=y-4; let foot="";
 if(ens==="gefs"){const g0=X(init), g1=X(init+6*H); if(g1-g0>1)grid+=`<rect x="${g0.toFixed(1)}" y="${AX}" width="${(g1-g0).toFixed(1)}" height="${Math.max(0,B-AX)}" style="fill:var(--mut);opacity:.2"><title>No NOAA data before 6 h: the reforecast starts 6 hours into the run, so nothing is forecast here</title></rect>`}
 [[init,"run"],[Date.now(),"now"]].forEach(([t,lab])=>{if(t<=lo||t>=hi)return; const xx=X(t).toFixed(1);
  grid+=`<line x1="${xx}" x2="${xx}" y1="${AX-1}" y2="${B}" style="stroke:var(--ink);stroke-dasharray:3 3;opacity:.55"/>`;
  foot+=`<text x="${xx}" y="${B+13}" font-size="${fz-1}" text-anchor="middle" style="fill:var(--mut)">${lab} ${hl(t)}</text>`});
 const Ht=B+(foot?18:2);
 const anyDet=LVs.some(([g])=>E&&E[g]&&E[g].det), faded=!one&&LVs.some(([g])=>E&&E[g]&&E[g].n>0&&E[g].n<MJ);
 const lg=CP?(EASY||one?[]:[`<span><i style="background:var(--mut)"></i>Most likely hours</span>`,`<span><i style="background:var(--mut);opacity:.3"></i>Earliest start to latest end</span>`,
   faded?`<span><i style="background:var(--mut);opacity:.45"></i>Lighter, fewer than half the members</span>`:""].filter(Boolean).join("")):[`<span><i style="background:var(--mut)"></i>${one?"forecast":"forecast, median start → median end"}</span>`,
  one?"":`<span><i style="background:var(--mut);opacity:.3"></i>10% earliest start → 90% latest end</span>`,
  anyDet?`<span><i style="height:2px;background:var(--ink);vertical-align:3px"></i>deterministic run</span>`:"",
  faded?`<span><i style="background:var(--mut);opacity:.45"></i>faded: fewer than half the members</span>`:"",ens==="gefs"?`<span><i style="background:var(--mut);opacity:.2"></i>no NOAA data before 6 h</span>`:""].filter(Boolean).join("");
 box.innerHTML=`<svg viewBox="0 0 ${W} ${Ht}" width="${W}" height="${Ht}" role="img" aria-label="timeline of forecast and actual signals">${grid.replaceAll("@B",B)}${s}${foot}</svg><div class="tlleg">${lg}</div>`}
addEventListener("resize",()=>{clearTimeout(window._tlr);window._tlr=setTimeout(()=>drawTL(),150)});
