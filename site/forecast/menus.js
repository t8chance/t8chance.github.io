
function drawTabs(){
 if(["p3","p8","p10"].includes(tab)) tab="signal";
 if(tab==="wi"&&!(TR&&TR.tracks.some(x=>x.wix&&x.wix.length))) tab="signal";
 $("#tabs").innerHTML=[["signal","Expected signal"],["wi","Wind index"],["sg","Estimated wind"],["rk","Storm ranking"]].filter(([k])=>(k!=="wi"||(TR&&TR.tracks.some(x=>x.wix&&x.wix.length)))&&(!WH()||k==="wi"||k==="rk")&&(!BASIC||k==="signal"||k==="wi"||k==="sg"||k==="rk"))
   .map(([k,l])=>`<button data-t="${k}" class="${k===tab?"on":""}">${l}</button>`).join(" ")

  +"";
 $("#tabs").querySelectorAll("button").forEach(b=>b.onclick=()=>{tab=b.dataset.t; if(BIN){BIN=null;drawMap()} drawTabs();chart()});

 {const w=$("#wisw"), on=tab==="wi"&&!BASIC&&TR&&TR.tracks.some(x=>x.wix&&x.wix.length), v=showWIDist?"dist":showWIMean?"mean":"one";
  w.style.display=on?"":"none";
  w.innerHTML=on?`<span class="lbl">Show</span><span class="seg">${[["one","One member","one member's wind index through time"],["mean","Ensemble mean","the wind index averaged over all ensemble members, hour by hour"],["dist","Peaks of all members","each member's highest wind index, member by member"]].map(([k,l,t])=>`<button type="button" data-w="${k}" class="${k===v?"on":""}" title="${t}">${l}</button>`).join("")}</span>`:"";
  w.querySelectorAll("button").forEach(b=>b.onclick=()=>{if(BIN){BIN=null;drawMap()} showWIMean=b.dataset.w==="mean"; showWIDist=b.dataset.w==="dist"; drawTabs(); chart()})}
}
function head(){
 const mine=cycles.filter(c=>ORDER.some(e=>(HK[c]||{})[e])), rec=mine.filter(RECENT), past=mine.filter(c=>!RECENT(c));
 const ST={}; mine.forEach(c=>{const cs=casesOf(c); (cs.length?cs:RECENT(c)?[]:[`Other runs ${c.slice(0,4)}`]).forEach(k=>(ST[k]=ST[k]||[]).push(c))});
 Object.values(ST).forEach(a=>a.sort().reverse());
 const yrOf=k=>k.slice(-4), LAB=Object.fromEntries(PAST.map(p=>[p[2].split(" — ")[0],p[2]]));
 const lvOf=k=>{const t=(HKOEV[k]||{}).top; return t==null?(LAB[k]?"0":"other"):t===9?"8":String(t)};
 const stormsIn=y=>Object.keys(ST).filter(k=>lvOf(k)===y).sort((a,b)=>ST[b][0].localeCompare(ST[a][0]));
 const years=[...new Set(Object.keys(ST).map(lvOf))].sort((a,b)=>a==="other"?1:b==="other"?-1:+b-+a);
 const curS=ST[pickedStorm]&&ST[pickedStorm].includes(cyc)?pickedStorm:rec.includes(cyc)?"__recent":(casesOf(cyc).find(k=>ST[k])||Object.keys(ST).find(k=>ST[k].includes(cyc))||null);
 const curY=curS==="__recent"?"__recent":curS?lvOf(curS):null, today=curS==="__recent";
 $("#viewbtns").querySelectorAll("button").forEach(b=>{b.classList.toggle("on",(b.dataset.v==="today")===today); b.disabled=b.dataset.v==="today"&&!rec.length});
 $("#yearSel").hidden=today; $("#stormSel").hidden=today;
 document.body.classList.toggle("pastv",!today);
 {const st=$("#stale"), n=rec[0]; let h=0; if(today&&n) h=(Date.now()-Date.UTC(+n.slice(0,4),+n.slice(4,6)-1,+n.slice(6,8),+n.slice(8,10)))/36e5;
  st.hidden=!(h>30); if(h>30) st.textContent=`Not updating right now: the newest run is ${h>=48?Math.floor(h/24)+" days":Math.round(h)+" hours"} old.`}
 $("#yearSel").innerHTML=years.map(y=>{const n=stormsIn(y).length; return `<option value="${y}"${y===curY?" selected":""}>${y==="other"?"Other runs":y==="0"?"No signal":y==="8"?"No. 8 and 9":"No. "+y} (${n} storm${n>1?"s":""})</option>`}).join("")+(curY===null||today?`<option value="" selected disabled>signal</option>`:"");
 $("#stormSel").innerHTML=today?""
  :curY?(curY==="8"&&stormsIn(curY).some(k=>/ — HKO No\. 9 on /.test(LAB[k]||""))?`<option disabled>* HKO issued No. 9</option>`:"")
   +stormsIn(curY).map(k=>`<option value="${k}"${k===curS?" selected":""}>${(curY==="8"&&/ — HKO No\. 9 on /.test(LAB[k]||"")?"*":"")+k}</option>`).join(""):"";
 const runs=curS==="__recent"?rec:curS?ST[curS]:[];
 const ensAt=c=>{const av=HK[c]||{}; if(!CHOSEN&&DEFE(c))return DEFE(c); return av[ens]?ens:MODES[mode].find(e=>av[e])||ORDER.find(e=>av[e])||ens};
 $("#cyc").innerHTML=runs.map(c=>`<option value="${c}"${c===cyc?" selected":""}>${fmtc(c)}${curS!=="__recent"&&EMPTYR((HK[c]||{})[ensAt(c)])?" (no storm)":""}</option>`).join("");
 const go=c=>{if(!c)return; cyc=c;NOSAME=null;PICKED=false;sel=null;selH=null; chooseEns(c); head();load()};
 const fam=c=>CHOSEN?MODES[mode].some(e=>(HK[c]||{})[e]):DEFR(c), pick=a=>a&&(a===rec&&!CHOSEN&&OPEN()||a.find(fam)||a[0]);
 const famS=c=>fam(c)&&(!CHOSEN||(v=>v[ens]?!EMPTYR(v[ens]):MODES[mode].some(e=>v[e]&&!EMPTYR(v[e])))(HK[c]||{}));
 const cMs=c=>Date.UTC(+c.slice(0,4),+c.slice(4,6)-1,+c.slice(6,8),+c.slice(8,10));
 const cpaOf=k=>{const tr=((window.HKTRUTH||{})[k]||{}).track; if(!tr||!tr.length) return null; let b=null,bd=1e9;
  tr.forEach(p=>{const d=Math.hypot((p[0]-114.17)*0.925,p[1]-22.3); if(d<bd){bd=d;b=p[3]}}); return b?Date.parse(String(b).slice(0,16)+":00Z"):null};
 const pickStorm=k=>{const a=ST[k]; if(!a) return null; const t0=cpaOf(k); if(t0==null) return pick(a); const w=t0-48*36e5, pool=a.some(famS)?a.filter(famS):a.some(fam)?a.filter(fam):a;
  return pool.reduce((b,c)=>Math.abs(cMs(c)-w)<Math.abs(cMs(b)-w)?c:b)};
 $("#yearSel").onchange=e=>{const y=e.target.value; if(y==="__recent"){pickedStorm=null;go(pick(rec));return} const k=stormsIn(y).find(x=>ST[x].some(fam))||stormsIn(y)[0]; pickedStorm=k; go(pickStorm(k))};
 $("#stormSel").onchange=e=>{const k=e.target.value; if(k==="__recent"){go(pick(rec));return} pickedStorm=k; go(pickStorm(k))};
 $("#cyc").onchange=e=>go(e.target.value);
 {const ord=[...runs].sort(), i=ord.indexOf(cyc), pv=$("#runPrev"), nx=$("#runNext");
  if(pv){pv.disabled=i<=0; pv.onclick=()=>{if(i>0)go(ord[i-1])}}
  if(nx){nx.disabled=i<0||i>=ord.length-1; nx.onclick=()=>{if(i>=0&&i<ord.length-1)go(ord[i+1])}}
  const tg=$("#ctxTag"), nm=$("#ctxName"), cb=$("#chgBtn");
  if(tg){tg.hidden=false; tg.textContent=today?(cyc===rec[0]?"Latest forecast":"Earlier forecast"):"Past storm"; tg.classList.toggle("live",today)}
  if(nm)nm.textContent=today?"":curS&&curS!=="__recent"?curS:"";
  if(cb){cb.textContent=today?"Past storms":"Change storm"; cb.setAttribute("aria-expanded",document.body.classList.contains("tbopen")?"true":"false");
   cb.onclick=()=>{if(today){const pb=$("#viewbtns [data-v=past]"); if(pb){document.body.classList.add("tbopen"); pb.click()} return}
    const o=document.body.classList.toggle("tbopen"); cb.setAttribute("aria-expanded",o?"true":"false")}}
  window.STORMRUN=k=>pickStorm(k)}
 $("#viewbtns").querySelectorAll("button").forEach(b=>b.onclick=()=>{
  if(b.dataset.v==="today"){if(!today&&rec.length){pickedStorm=null;go(pick(rec))} return}
  if(!today)return; const R0="2025092112", k=casesOf(R0).find(x=>ST[x]);
  if(HK[R0]&&k){pickedStorm=k; go(R0); return}
  const y=years[0], k2=y&&stormsIn(y)[0]; if(k2){pickedStorm=k2; go(pickStorm(k2))}});
 const avE=HK[cyc]||{};
 const csE=casesOf(cyc), wE=PAST.filter(p=>csE.includes(p[2].split(" — ")[0])), inView=new Set(RECENT(cyc)?LIVEF:[]);
 cycles.filter(c=>wE.some(p=>c>=p[0]&&c<=p[1])).forEach(c=>Object.keys(HK[c]||{}).forEach(e=>inView.add(e)));
 $("#ensbtns").innerHTML=ORDER.filter(e=>avE[e]||inView.has(e)).map(e=>`<button data-e="${e}" class="${e===ens?"on":""}${avE[e]?"":" na"}"${avE[e]?"":` title="not available for this run time"`}>${matchMedia("(max-width:760px)").matches&&FSH[e]||FCN[e]}</button>`).join(" ");
 $("#ensbtns").querySelectorAll("button").forEach(b=>b.onclick=()=>{if(MIX){cyc=MIX.cyc;MIX=null} ens=b.dataset.e; mode=modeOf(ens)||mode; PICKED=true; CHOSEN=true; sel=null;selH=null;head();load()});
 $("#zoomBtn").onclick=e=>{view=view==="region"?"hk":"region";VB=BASIC&&view==="hk"?[113.55,114.75,21.95,22.75]:VIEWS[view].slice();
 HOME=VB.slice();e.target.textContent=view==="region"?"zoom to Hong Kong":"zoom out";drawMap()};
 $("#heatBtn").onclick=()=>{if(HEAT){HEAT=false; drawMap(); return}
 heatLoad(ok=>{if(!ok){$("#maphint").textContent="There is no shifted-path map for this run yet."; return}
  const t=TR&&TR.tracks.find(x=>x.m===sel); if(!t||!heatData().m[String(sel)]){$("#maphint").textContent="This member gives no signal anywhere within 50 km of its path."; return}
  HEAT=true; const c=heatAnchor(t), w=4.6, h=(VB[3]-VB[2])*w/(VB[1]-VB[0]); VB=[c[1]-w/2,c[1]+w/2,c[2]-h/2,c[2]+h/2]; drawMap()})};

$("#showAll").onclick=()=>{if(MIX){closePath();return} btOff();sel=null;selH=null;BIN=null;drawMap();chart()};
 $("#only150").onchange=drawMap;
 {const o=$("#othSt"); if(o)o.onchange=()=>{const k=cyc+"_"+ens; if(!o.checked||(window.HKPATHS||{})[k])return drawMap();
  const sc=document.createElement("script"); sc.src=`../data/paths_${k}.js`; sc.onload=()=>{if(k===cyc+"_"+ens)drawMap()}; sc.onerror=()=>{$("#maphint").textContent="no file of other storms for this run (IFS and AIFS runs from 16 Oct 2026 on)"}; document.head.appendChild(sc)}}

 $("#detBtn").onclick=()=>{const r=refM(); if(r===null)return; sel=(sel===r?null:r);selH=null;drawMap();chart()};
 drawTabs();
}
function unavailable(){{const xbd=document.getElementById("xbands"); if(xbd)xbd.innerHTML=""}const other=Object.keys(MODES).find(k=>k!==mode);
 $("#stamp").innerHTML=`<b>${mode==="ai"?"AI mode":"EC mode"}</b> · no run for ${NOSAME}`;
 $("#status").innerHTML=`<div class="ans"><div class="k">${MODEN[mode]}</div><div class="badge" style="color:var(--mut)">unavailable</div>`
  +`<div class="v">no ${MODEN[mode]} run for ${NOSAME}</div><div class="note">pick a run in the menu above, or switch back to ${MODEN[other]}</div></div>`;
 TR=null; MC=null; allH=null; if(allPlaying)allStop(); $("#map").innerHTML=""; $("#chart").innerHTML=""; $("#cnote").textContent=""; $("#tabs").innerHTML=""; syncPlayer();
 $("#map").style.display="none"; $("#chart").style.display="none"; TLA=null; sheetMove()}
function sigTable(t){const T0_=T0(), DW=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], p2=n=>String(n).padStart(2,"0");
 const f=h=>{const d=new Date(T0_+Math.round(h*60)*6e4+288e5); return `${DW[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`};
 const runs=[]; memberSignal(t).forEach(p=>{const h=labH(p[0]), v=p[1], r=runs[runs.length-1]; if(r&&r.g===v&&Math.abs(r.b-h)<1e-6)r.b=h+3; else runs.push({g:v,a:h,b:h+3})});
 const M=runs.filter(r=>r.g>=1), tU=x=>Date.parse(x+":00Z");
 const HS=casesOf(cyc).flatMap(x=>(HKOSEQ[x]||[]).map(([a,b,g])=>({g,a:(tU(a)-T0_)/36e5,b:(tU(b)-T0_)/36e5}))).sort((x,y)=>x.a-y.a);
 const used=new Set(), rows=M.map(m=>{let best=-1, bs=-Infinity; HS.forEach((h,j)=>{if(used.has(j)||h.g!==m.g)return;
   const ov=Math.min(m.b,h.b)-Math.max(m.a,h.a), gap=Math.abs((m.a+m.b)/2-(h.a+h.b)/2), sc=ov>0?1e6+ov:-gap; if((ov>0||gap<=36)&&sc>bs){bs=sc; best=j}});
  if(best>=0)used.add(best); return {g:m.g,m,h:best>=0?HS[best]:null}});
 HS.forEach((h,j)=>{if(!used.has(j))rows.push({g:h.g,m:null,h})});
 const st=r=>Math.min(r.m?r.m.a:1e9,r.h?r.h.a:1e9); rows.sort((x,y)=>st(x)-st(y));
 const cell=r=>r?`<span>${f(r.a)}</span> <span>to ${f(r.b)}</span> <span class="hrs">${Math.round(r.b-r.a)} h</span>`:`<span class="nx">–</span>`;
 if(!rows.length)return `<p class="note">This path gives no signal.</p>`;
 return `<table class="rc sigt"><thead><tr><th>Signal</th><th>This path</th>${HS.length?`<th>HKO issued</th>`:""}</tr></thead><tbody>`
  +rows.map(r=>`<tr><td><span class="plate s p${r.g}" title="No. ${r.g}">${r.g}</span></td><td>${cell(r.m)}</td>${HS.length?`<td>${cell(r.h)}</td>`:""}</tr>`).join("")
  +`</tbody></table><p class="note">${M.length?"":"This path gives no signal. "}Times along a path are in steps of 3 hours.</p>`}
function sheetMove(){const c1=$("#cslot"), c2=$("#cslot2"), c3=$("#cslot3"), st=$("#status"); if(!c1||!c2||!c3||!st)return; c1.innerHTML=""; c2.innerHTML=""; c3.innerHTML=""; if(!SHEETV||window.HK_DEMO){quietMap(); return}
 ["#bmapbox","#qmapbox"].forEach(q=>{const x=st.querySelector(q); if(x)c1.appendChild(x)});
 const w=st.querySelector(".tlcard.when"); if(w)(BASIC?c2:c1).appendChild(w);
 st.querySelectorAll(".tlcard").forEach(x=>c3.appendChild(x));
 const ap=$("#allPast"); if(ap)ap.onclick=e=>{e.preventDefault(); const pb=$("#viewbtns [data-v=past]"); document.body.classList.add("tbopen"); if(pb)pb.click()};
 quietMap()}
const cmpBox=()=>{const t=cmpBlock(); return t?`<div class="cmpbox"><h2>Compared with other forecasts</h2>${t}</div>`:""};
const recentStorms=()=>{if(window.HK_DEMO||!window.STORMRUN)return ""; const seen=new Set(), L=[];
 [...PAST].sort((a,b)=>b[1].localeCompare(a[1])).forEach(p=>{const nm=p[2].split(" — ")[0]; if(seen.has(nm)||L.length>=7)return; seen.add(nm);
  const run=window.STORMRUN(nm); if(run)L.push([nm,p[1],run])});
 if(!L.length)return "";
 return `<div class="recent"><h2>Recent storms</h2><table class="rc"><thead><tr><th>Storm</th><th>When</th><th>HKO's highest signal</th></tr></thead><tbody>`
  +L.map(([nm,c,run])=>{const t=(HKOEV[nm]||{}).top; return `<tr><td><a href="?run=${run}&f=${DEFE(run)||"ifsens"}">${nm.replace(/ \d{4}$/,"")}</a></td><td>${MON[+c.slice(4,6)-1]} ${c.slice(0,4)}</td><td>${t?`<span class="plate s p${t}" title="No. ${t}">${t}</span>`:"None"}</td></tr>`}).join("")
  +`</tbody></table><p class="more"><a href="#" id="allPast">All past storms</a></p></div>`};
function quietMap(){const bx=document.getElementById("qmapbox"); if(bx)areaMap(bx,"No storm within 800 km")}
function areaMap(bx,over){if(!bx)return;
 bx.innerHTML=`<div class="figh"><h2>The area this forecast watches</h2></div><div class="frame"><svg></svg>${over?`<div class="over">${over}</div>`:""}</div>`;
 const sv=bx.querySelector("svg"), {X,Y,hx,hy}=mapBase(sv,[104.4,124.0,14.6,30.0]);
 sv.appendChild(el("circle",{cx:hx,cy:hy,r:6,fill:"#f2c200",stroke:"#333","stroke-width":1.2}));
 const t=el("text",{x:hx+9,y:hy+4,fill:"#111","font-size":12,"font-weight":600,stroke:"#fff","stroke-width":3,"paint-order":"stroke"}); t.textContent="Hong Kong"; sv.appendChild(t)}
const nsStorm=()=>{const cs=casesOf(cyc); return cs.includes(pickedStorm)?pickedStorm:cs[0]||null};
const nsSlot=d=>EMPTYR(d)&&!window.HK_DEMO&&nsStorm()?`<div class="nsnext" id="nsnext"></div>`:"";
const nsLoad=k=>new Promise(r=>{if((window.HKT||{})[k])return r(); const s=document.createElement("script"); s.src=`../data/tracks_${k}.js`; s.onload=s.onerror=()=>r(); document.head.appendChild(s)});
function nsHas(k,nm){const T=(window.HKT||{})[k], tr=((window.HKTRUTH||{})[nm]||{}).track; if(!T||!T.tracks||!T.tracks.length)return false;
 if(!tr||!tr.length||!T.tracks.some(t=>t.pts&&t.pts.length))return true;
 const y=+k.slice(0,4), mo=+k.slice(4,6), d0=+k.slice(6,8), B={}, p2=n=>String(n).padStart(2,"0"), R=Math.PI/180; tr.forEach(p=>B[String(p[3]).slice(0,13)]=p);
 const km=(a,b,c,d)=>6371*Math.acos(Math.min(1,Math.sin(b*R)*Math.sin(d*R)+Math.cos(b*R)*Math.cos(d*R)*Math.cos((a-c)*R)));
 return T.tracks.some(t=>(t.pts||[]).some(p=>{const [dd,hh]=String(p[3]).split(/[ \/]/).map(Number); let m2=mo+(dd<d0?1:0), y2=y; if(m2>12){m2=1;y2++}
  const q=B[`${y2}-${p2(m2)}-${p2(dd)}T${p2(hh)}`]; return !!q&&km(p[0],p[1],q[0],q[1])<300}))}
async function nsFill(){const bx=document.getElementById("nsnext"), nm=nsStorm(), c0=cyc, e=ens; if(!bx||!nm)return;
 const win=PAST.filter(p=>p[2].split(" — ")[0]===nm), runs=Object.keys(HK).filter(c=>win.some(p=>c>=p[0]&&c<=p[1])&&(HK[c]||{})[e]&&!EMPTYR(HK[c][e])).sort();
 const N=/^Unnamed/.test(nm)?"The storm":nm.replace(/ \d{4}$/,"");
 const later=runs.filter(c=>c>c0), earlier=runs.filter(c=>c<c0).reverse(); let hit=null, kind="";
 for(const c of later.slice(0,4)){await nsLoad(c+"_"+e); if(nsHas(c+"_"+e,nm)){hit=c; kind=earlier.length?"next":"first"; break}}
 if(!hit)for(const c of earlier.slice(0,4)){await nsLoad(c+"_"+e); if(nsHas(c+"_"+e,nm)){hit=c; kind="last"; break}}
 const alt=[]; for(const x of ORDER.filter(x=>x!==e&&(HK[c0]||{})[x]&&!EMPTYR(HK[c0][x])).slice(0,4)){await nsLoad(c0+"_"+x); if(nsHas(c0+"_"+x,nm))alt.push(x)}
 if(cyc!==c0||ens!==e||!document.body.contains(bx))return;
 const at=hit?fmtc(hit):"", main=!runs.length?`${N} is not in any forecast from this model.`:!hit?""
  :kind==="first"?`${N} is not in this forecast yet. It first shows in the forecast from ${at}.`:kind==="next"?`${N} is not in this forecast. The next forecast that has it is from ${at}.`:`${N} is no longer in this forecast. It last shows in the forecast from ${at}.`;
 if(!main&&!alt.length)return;
 bx.innerHTML=(main?`<p>${main}</p>`:"")+(hit?`<button type="button" id="nsgo">See that forecast</button>`:"")
  +(alt.length?`<p class="nsalt">${alt.length>1?`Other forecasts from the same time have ${N.replace(/^The /,"the ")}.`:`Another forecast from the same time has ${N.replace(/^The /,"the ")}.`}</p><div class="nsbtns">${alt.map(x=>`<button type="button" data-e="${x}">${FCN[x]||x}</button>`).join("")}</div>`:"");
 const g=document.getElementById("nsgo"); if(g)g.onclick=()=>{cyc=hit; NOSAME=null; PICKED=false; sel=null; selH=null; head(); load(); window.scrollTo(0,0)};
 bx.querySelectorAll(".nsbtns button").forEach(b=>b.onclick=()=>{ens=b.dataset.e; mode=modeOf(ens)||mode; NOSAME=null; PICKED=true; CHOSEN=true; sel=null; selH=null; head(); load(); window.scrollTo(0,0)})}
const noStorm=(d,txt)=>(SHEETV?`<div class="bhead"><div class="bh"><span>No storm near Hong Kong</span></div>${issuedDiv(d,cyc)}${nsSlot(d)}</div><div class="facts"><div class="bv">${txt}</div></div>${recentStorms()}${EASY?`<div class="bmapc quiet" id="qmapbox"></div>`:cmpBox()}`
 :`<h2 class="sech">The forecast</h2><div class="ans"><div class="k">Expected signal</div><div class="badge" style="color:var(--mut)">No storm near Hong Kong</div>${issuedDiv(d,cyc)}${nsSlot(d)}<div class="v">${txt}</div><div class="note" id="qclose"></div>${cmpBlock()}</div>`)
 +(window.HK_DEMO||EASY?"":BASIC?r2rCardB():SHEETV?r2rCard().replace('<h2 class="sech">Trend</h2>',""):r2rCard());
const passOf=(d,one,km)=>one?`closest approach <b>about ${KM10(km)} km</b>`:`<b>${d.within_150km}</b> of ${d.members} members pass within 150 km · <b>${d.within_500km}</b> within 500 km${km!=null?` · deterministic run about ${KM10(km)} km`:""}`;
function fillDetCa(){const n=document.getElementById("passn"), d=(HK[cyc]||{})[ens]; if(!n||!d||!TR)return; const one=(d.members||0)<=1;
 if(!one&&ens!=="ifsens"&&ens!=="tigge")return; const R=refOf(TR,cyc+"_"+ens); if(R)n.innerHTML=passOf(d,one,R.ca[0])}
const r2rCard=()=>`<h2 class="sech">Trend</h2><div class="tlcard"><div class="k">Run to run · chance of each signal</div><div class="r2rlg"><span class="sg"><b style="color:var(--no3)">—</b> No. 3</span><span class="sg"><b style="color:var(--no8)">—</b> No. 8</span><span class="sg"><b style="color:var(--no10)">—</b> No. 10</span><span>- - 50%</span>${casesOf(cyc).some(c=>HKOEV[c]&&HKOEV[c].L3)?`<span><b style="opacity:.35">█</b> HKO signal No. 3 or higher in force</span>`:""}</div><div id="r2r"></div><p class="note" style="margin:2px 0 0">Each dot is one run. Tap or click a dot to open that run.</p></div>`;
const r2rCardB=()=>`<div class="tlcard"><div class="k">How the chance changed with each new forecast</div><div class="r2rlg"><span><b style="color:var(--no3)">—</b> No. 3</span><span><b style="color:var(--no8)">—</b> No. 8</span><span><b style="color:var(--no10)">—</b> No. 10</span><span>- - 50%</span>${casesOf(cyc).some(c=>HKOEV[c]&&HKOEV[c].L3)?`<span><b style="opacity:.35">█</b> HKO signal No. 3 or higher in force</span>`:""}</div><div id="r2r"></div><p class="note" style="margin:2px 0 0">Each dot is one forecast. Tap or click a dot to open it.</p></div>`;
let R2RSEL=null, R2RSIG="No8";
const FSH={ifsens:"IFS",aifsens:"AIFS",deepmind:"DeepMind",tigge:"Old ECMWF",pangu:"Pangu",gefs:"NOAA",era5:"ERA5"};
const FSTY={ifsens:["","circle"],aifsens:["7 4","square"],deepmind:["2 3","triangle"],tigge:["9 3 2 3","diamond"],pangu:["1 3","ring"],gefs:["5 2 1 2","diamond"],era5:["1 2","circle"]};
const r2rMk=(sh,x,y,r,col,at)=>sh==="square"?`<rect class="mk" x="${(x-r).toFixed(1)}" y="${(y-r).toFixed(1)}" width="${2*r}" height="${2*r}" style="fill:${col};stroke:var(--card)" stroke-width="1.2"${at}>`
 :sh==="triangle"?`<path class="mk" d="M${x.toFixed(1)} ${(y-r*1.25).toFixed(1)}L${(x+r*1.15).toFixed(1)} ${(y+r*.85).toFixed(1)}L${(x-r*1.15).toFixed(1)} ${(y+r*.85).toFixed(1)}Z" style="fill:${col};stroke:var(--card)" stroke-width="1.2"${at}>`
 :sh==="diamond"?`<path class="mk" d="M${x.toFixed(1)} ${(y-r*1.3).toFixed(1)}L${(x+r*1.3).toFixed(1)} ${y.toFixed(1)}L${x.toFixed(1)} ${(y+r*1.3).toFixed(1)}L${(x-r*1.3).toFixed(1)} ${y.toFixed(1)}Z" style="fill:${col};stroke:var(--card)" stroke-width="1.2"${at}>`
 :sh==="ring"?`<circle class="mk" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" style="fill:var(--card);stroke:${col}" stroke-width="1.8"${at}>`
 :`<circle class="mk" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" style="fill:${col};stroke:var(--card)" stroke-width="1.2"${at}>`;
const r2rMkEnd=sh=>sh==="square"?"</rect>":sh==="triangle"||sh==="diamond"?"</path>":"</circle>";
function drawR2R(){const box=$("#r2r"); if(!box)return; const card=box.closest(".tlcard");
 const cs=casesOf(cyc), Wn=PAST.filter(p=>cs.includes(p[2].split(" — ")[0]));
 const runs=(Wn.length?cycles.filter(c=>Wn.some(p=>c>=p[0]&&c<=p[1])):cycles.filter(c=>Math.abs(tUc(c)-tUc(cyc))<=5*864e5)).slice().sort();
 const nRun=(c,e)=>{const d=(HK[c]||{})[e]; if(!d||(d.members||0)<=1)return null; const E=d.event||{};
  const n=sg=>d.quiet?0:(E[sg]?E[sg].n:(d[sg]&&d[sg].any?d[sg].any[0]:0)); return {c,M:d.members,No3:n("No3"),No8:n("No8"),No10:n("No10")}};
 const avail=ORDER.filter(e=>runs.filter(c=>{const p=nRun(c,e); return p&&!p.na}).length>=2);
 const pick=R2RSEL==="all"&&avail.length>1?"all":avail.includes(R2RSEL)?R2RSEL:avail.includes(ens)?ens:avail[0];
 const ens_=BASIC?(ens==="deepmind"&&avail.includes(ens)?[ens]:ORDER.filter(e=>MODES.ec.includes(e)&&avail.includes(e))):pick==="all"?["all"]:pick?[pick]:[];
 if(!ens_.length){card.style.display="none";return}
 const MWA=ens_[0]==="all"?cs.flatMap(k=>(window.MWPOSTS||{})[k]||[]).map(p=>({t:Date.parse(p[0]+":00Z"),lv:p[1],lo:p[2],hi:p[3],w:p[4],pic:p[5]})):[];
 card.style.display=""; card.classList.toggle("r2rall",ens_[0]==="all");
 const PW=Math.round(box.clientWidth||600), W=Math.max(300,PW), H=(ens_[0]==="all"?180:150)+(box.closest("#cslot3")?Math.round(Math.max(0,W-600)*.18):0),   /* taller when it runs the full width (2026-11-17) */ L=34, R=ens_[0]==="all"?(W<480?58:84):10, T=10, B=24;
 const ts=runs.map(tUc).concat(MWA.map(p=>p.t)), t0=Math.min(...ts)-3*36e5, t1=Math.max(...ts)+3*36e5, X=t=>L+(W-L-R)*(t-t0)/Math.max(t1-t0,1);
 const hko=cs.map(c=>HKOEV[c]&&HKOEV[c].L3).filter(Boolean).map(y=>[Date.parse(String(y[0]).replace(" ","T")+(String(y[0]).length<=16?":00Z":"Z")),Date.parse(String(y[1]).replace(" ","T")+(String(y[1]).length<=16?":00Z":"Z"))]);
 const SGc=[["No3","var(--no3)"],["No8","var(--no8)"],["No10","var(--no10)"]], SGN_={No3:"No. 3",No8:"No. 8",No10:"No. 10"}, pc=(p,sg)=>100*p[sg]/p.M, Y=v=>T+(H-T-B)*(1-v/100);
 const frame=()=>{let g=hko.map(([a,b])=>{const x0=Math.max(X(a),L),x1=Math.min(X(b),W-R);return x1>x0?`<rect x="${x0}" y="${T}" width="${x1-x0}" height="${H-T-B}" style="fill:var(--ink)" opacity=".08"></rect>`:""}).join("");
  [0,100].forEach(v=>{g+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" style="stroke:var(--line)"></line><text x="${L-5}" y="${Y(v)+4}" text-anchor="end" font-size="11" style="fill:var(--mut)">${v}%</text>`});
  g+=`<line x1="${L}" x2="${W-R}" y1="${Y(50)}" y2="${Y(50)}" style="stroke:var(--mut)" stroke-dasharray="4 3"></line><text x="${L-5}" y="${Y(50)+4}" text-anchor="end" font-size="11" style="fill:var(--mut)">50%</text>`;
  const d0=new Date(t0+288e5), days=[]; for(let u=Date.UTC(d0.getUTCFullYear(),d0.getUTCMonth(),d0.getUTCDate()+1)-288e5;u<=t1;u+=864e5)days.push(u);
  const stp=Math.max(1,Math.ceil(days.length/(W<480?4:8)));
  days.forEach((u,k)=>{if(k%stp)return; const dd=new Date(u+288e5); g+=`<line x1="${X(u)}" x2="${X(u)}" y1="${T}" y2="${H-B}" style="stroke:var(--line)" opacity=".6"></line><text x="${X(u)}" y="${H-B+15}" text-anchor="middle" font-size="11" style="fill:var(--mut)">${dd.getUTCDate()}/${dd.getUTCMonth()+1}</text>`});
  if(Object.keys(HK[cyc]||{}).length) g+=`<line x1="${X(tUc(cyc))}" x2="${X(tUc(cyc))}" y1="${T-4}" y2="${H-B}" style="stroke:var(--ink)" stroke-width="1.6" stroke-dasharray="2 2"></line>`;
  return g};
 const path=(P,sg)=>P.map((p,i)=>p.na?"":(i&&!P[i-1].na?"L":"M")+X(tUc(p.c)).toFixed(1)+" "+Y(pc(p,sg)).toFixed(1)).join(" ");
 const one=e=>{const P=runs.map(c=>nRun(c,e)).filter(Boolean); let g=frame();
  const tp=p=>tUc(p.c), naR=P.map((p,i)=>p.na?[i?(tp(P[i-1])+tp(p))/2:tp(p)-3*36e5,i<P.length-1?(tp(p)+tp(P[i+1]))/2:tp(p)+3*36e5,p.c]:null).filter(Boolean);
  if(naR.length) g+=`<defs><pattern id="nah-${e}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" style="stroke:var(--mut)" stroke-width="1.4" opacity=".55"></line></pattern></defs>`
   +naR.map(([a,b,c])=>{const x0=Math.max(X(a),L), w=Math.max(Math.min(X(b),W-R)-x0,2).toFixed(1);
    return `<rect class="na" x="${x0.toFixed(1)}" y="${T}" width="${w}" height="${H-T-B}" style="fill:var(--soft)" data-c="${c}" data-e="${e}"><title>${fmtc(c)}: not available</title></rect>`
     +`<rect x="${x0.toFixed(1)}" y="${T}" width="${w}" height="${H-T-B}" fill="url(#nah-${e})" pointer-events="none"></rect>`}).join("");
  SGc.forEach(([sg,col])=>{g+=`<path d="${path(P,sg)}" fill="none" style="stroke:${col}" stroke-width="2"></path>`;
   g+=P.filter(p=>!p.na).map(p=>`<circle cx="${X(tUc(p.c)).toFixed(1)}" cy="${Y(pc(p,sg)).toFixed(1)}" r="${p.c===cyc&&e===ens?4.5:3.2}" style="fill:${col};stroke:var(--card)" stroke-width="1.2" data-c="${p.c}" data-e="${e}"><title>${fmtc(p.c)}: ${SGN_[sg]} ${Math.round(pc(p,sg))}% (${p[sg]} of ${p.M} members)</title></circle>`).join("")});
  return `<div class="r2rp"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="chance of No. 3, 8 and 10 in each run">${g}</svg></div>`};
 const all=sg=>{const col=SGc.find(x=>x[0]===sg)[1]; let g=frame(), labs=[];
  const MW=MWA.filter(p=>p.lv==={No3:3,No8:8,No10:10}[sg]);
  MW.forEach(p=>{const x=X(p.t), y1=Y(p.hi), y0=Y(p.lo); g+=`<rect class="mwr" x="${(x-3.5).toFixed(1)}" y="${y1.toFixed(1)}" width="7" height="${Math.max(3,y0-y1).toFixed(1)}" rx="3.5" style="fill:var(--ink);stroke:var(--ink)" fill-opacity=".22" stroke-width="1.2"><title>MET WARN, ${hktS(p.t)} HK time: ${p.w} (${p.lo}–${p.hi}%) for ${SGN_[sg]}${p.pic?" · picture post":""}</title></rect>`});
  avail.forEach(e=>{const P=runs.map(c=>nRun(c,e)).filter(Boolean), [da,sh]=FSTY[e]||["","circle"], Q=P.filter(p=>!p.na);
   g+=`<path d="${path(P,sg)}" fill="none" style="stroke:${col}" stroke-width="2"${da?` stroke-dasharray="${da}"`:""}></path>`;
   g+=Q.map(p=>r2rMk(sh,X(tUc(p.c)),Y(pc(p,sg)),p.c===cyc&&e===ens?4.6:3.3,col,` data-c="${p.c}" data-e="${e}"`)+`<title>${fmtc(p.c)} · ${FCN[e]||e}: ${SGN_[sg]} ${Math.round(pc(p,sg))}% (${p[sg]} of ${p.M} members)</title>`+r2rMkEnd(sh)).join("");
   if(Q.length){const q=Q[Q.length-1]; labs.push({e,x:X(tUc(q.c)),y:Y(pc(q,sg)),y0:Y(pc(q,sg))})}});
  labs.sort((a,b)=>a.y-b.y); for(let i=1;i<labs.length;i++) if(labs[i].y-labs[i-1].y<12) labs[i].y=labs[i-1].y+12;
  labs.forEach(l=>{g+=`<line x1="${(l.x+5).toFixed(1)}" x2="${W-R+3}" y1="${l.y0.toFixed(1)}" y2="${l.y.toFixed(1)}" style="stroke:var(--mut)" stroke-width=".8"></line><text x="${W-R+6}" y="${(l.y+4).toFixed(1)}" font-size="11" font-weight="600" style="fill:var(--ink)">${FSH[l.e]||l.e}</text>`});
  const sw=e=>{const [da,sh]=FSTY[e]||["","circle"]; return `<svg width="38" height="12" viewBox="0 0 38 12" aria-hidden="true"><line x1="1" x2="37" y1="6" y2="6" style="stroke:${col}" stroke-width="2"${da?` stroke-dasharray="${da}"`:""}></line>${r2rMk(sh,19,6,3.6,col,"")}${r2rMkEnd(sh)}</svg>`};
  return `<div class="r2rp"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="chance of ${SGN_[sg]} in each run, every forecast">${g}</svg></div>`
   +`<div class="r2rlgA">${avail.map(e=>`<span>${sw(e)}${FCN[e]||e}</span>`).join("")}${MW.length?`<span><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="3.5" y="1" width="7" height="12" rx="3.5" style="fill:var(--ink);stroke:var(--ink)" fill-opacity=".22" stroke-width="1.2"></rect></svg>MET WARN</span>`:""}</div>`
   +`<p class="r2rallnote">All forecasts: chance of ${SGN_[sg]} only. Each forecast has its own line style, marker and name at the end of its line.</p>`
   +(MW.length?`<p class="r2rallnote">MET WARN: each bar is the range it posted for ${SGN_[sg]}, at the time of the post (an unofficial channel; How good is it? compares the two).</p>`:"")};
 const ctl=BASIC||avail.length<2?"":`<div class="r2rctl"><span class="seg" role="group" aria-label="forecast shown">${avail.map(e=>`<button type="button" data-r="${e}" class="${pick===e?"on":""}">${FSH[e]||e}</button>`).join("")}<button type="button" data-r="all" class="${pick==="all"?"on":""}">All forecasts</button></span>`
  +(pick==="all"?`<span class="seg" role="group" aria-label="signal compared">${SGc.map(([sg])=>`<button type="button" data-sg="${sg}" class="${R2RSIG===sg?"on":""}">${SGN_[sg]}</button>`).join("")}</span>`:"")+`</div>`;
 box.innerHTML=ctl+ens_.map(e=>e==="all"?all(R2RSIG):one(e)).join("");
 const tip=document.createElement("div"); tip.className="r2rtip"; tip.hidden=true; box.appendChild(tip);
 box.querySelectorAll(".r2rp svg").forEach((svg,k)=>{const kind=ens_[k], hl=document.createElementNS("http://www.w3.org/2000/svg","line");
  hl.setAttribute("y1",T); hl.setAttribute("y2",H-B); hl.setAttribute("style","stroke:var(--ink)"); hl.setAttribute("stroke-width","1"); hl.setAttribute("opacity",".35"); hl.setAttribute("pointer-events","none"); hl.style.display="none"; svg.appendChild(hl);
  const has=kind==="all"?runs.filter(c=>avail.some(e=>nRun(c,e))):runs.filter(c=>nRun(c,kind));
  const row=(col,txt,sh)=>`<div>${sh?`<svg width="16" height="10" viewBox="0 0 16 10" style="vertical-align:-1px;margin-right:5px">${r2rMk(sh,8,5,3.4,col,"")}${r2rMkEnd(sh)}</svg>`:`<i style="background:${col}"></i>`}<span>${txt}</span></div>`;
  const val=(p,sg,lab)=>!p?`${lab}: no run`:p.na?`${lab}: not available`:`${lab}: ${Math.round(pc(p,sg))}% (${p[sg]} of ${p.M} members)`;
  svg.addEventListener("pointermove",ev=>{if(ev.pointerType!=="mouse"||!has.length)return; const m=svg.getScreenCTM(); if(!m)return;
   const x=(ev.clientX-m.e)/m.a, t=t0+(x-L)/(W-L-R)*(t1-t0), c=has.reduce((b,q)=>Math.abs(tUc(q)-t)<Math.abs(tUc(b)-t)?q:b,has[0]), xc=X(tUc(c));
   hl.setAttribute("x1",xc); hl.setAttribute("x2",xc); hl.style.display="";
   tip.innerHTML=kind==="all"?`<b>${fmtc(c)} · ${SGN_[R2RSIG]}</b>`+avail.map(e=>row(SGc.find(s=>s[0]===R2RSIG)[1],val(nRun(c,e),R2RSIG,FSH[e]||e),(FSTY[e]||[])[1]||"circle")).join("")
    :`<b>${fmtc(c)} · ${FSH[kind]||kind}</b>`+(p=>p&&p.na?`<div class="mu"><span>not available</span></div>`:SGc.map(([sg,col])=>row(col,val(p,sg,SGN_[sg]))).join(""))(nRun(c,kind));
   tip.hidden=false; const bb=box.getBoundingClientRect(), tw=tip.offsetWidth, th=tip.offsetHeight;
   let lx=ev.clientX-bb.left+14; if(lx+tw>bb.width) lx=ev.clientX-bb.left-tw-14; tip.style.left=Math.max(0,lx)+"px"; tip.style.top=Math.max(0,ev.clientY-bb.top-th/2)+"px"});
  svg.addEventListener("pointerleave",()=>{tip.hidden=true; hl.style.display="none"})});
 box.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{R2RSEL=b.dataset.r; drawR2R()});
 box.querySelectorAll("[data-sg]").forEach(b=>b.onclick=()=>{R2RSIG=b.dataset.sg; drawR2R()});
 const lg=card.querySelector(".r2rlg"), na_=lg&&lg.querySelector(".nalg");
 if(lg&&!na_&&box.querySelector("rect.na")) lg.insertAdjacentHTML("beforeend",`<span class="nalg"><b style="color:var(--mut)">▨</b> not available (DeepMind had no storm near Hong Kong to follow)</span>`);
 else if(na_&&!box.querySelector("rect.na")) na_.remove();
 box.querySelectorAll("[data-c]").forEach(o=>o.onclick=()=>{cyc=o.dataset.c; ens=o.dataset.e; mode=modeOf(ens)||mode; NOSAME=null; PICKED=false; if(!BASIC)CHOSEN=true; sel=null; selH=null; head(); load()});
}
