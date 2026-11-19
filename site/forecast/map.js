(function(){const m=$("#map");let st=null,raf=0,PZ=null;
 const redraw=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;drawMap()})};
 const clamp=()=>{const R=VIEWS.region,w=VB[1]-VB[0],h=VB[3]-VB[2];
  const cx=Math.min(Math.max((VB[0]+VB[1])/2,R[0]),R[1]), cy=Math.min(Math.max((VB[2]+VB[3])/2,R[2]),R[3]);
  VB=[cx-w/2,cx+w/2,cy-h/2,cy+h/2]};
 m.addEventListener("pointerdown",e=>{if(PZ||(st&&e.pointerType==="touch")){st=null;return}
  st={id:e.pointerId,x:e.clientX,y:e.clientY,vb:VB.slice()};moved=false});
 m.addEventListener("pointermove",e=>{if(!st||PZ||e.pointerId!==st.id)return;const dx=e.clientX-st.x,dy=e.clientY-st.y;
  if(!moved&&Math.hypot(dx,dy)<4)return;
  if(!moved){moved=true;try{m.setPointerCapture(e.pointerId)}catch(_){}}
  const r=m.getBoundingClientRect(),w=st.vb[1]-st.vb[0],h=st.vb[3]-st.vb[2];
  VB=[st.vb[0]-dx/r.width*w,st.vb[1]-dx/r.width*w,st.vb[2]+dy/r.height*h,st.vb[3]+dy/r.height*h];clamp();redraw()});
 const end=()=>{st=null;setTimeout(()=>moved=false,0)};
 m.addEventListener("pointerup",end);m.addEventListener("pointercancel",end);m.addEventListener("pointerleave",()=>{if(st&&!moved)st=null});
 const tm=t=>[(t[0].clientX+t[1].clientX)/2,(t[0].clientY+t[1].clientY)/2], td=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY)||1;
 const pzStart=e=>{st=null; moved=true; const r=m.getBoundingClientRect(), [x,y]=tm(e.touches), b=m.viewBox.baseVal;
  PZ={d:td(e.touches),vb:VB.slice(),fx:(x-r.left)/r.width,fy:1-(y-r.top)/r.height,W:b.width,H:b.height}; window.HK_PZ=1};
 m.addEventListener("touchstart",e=>{if(e.touches.length<2)return; e.preventDefault(); pzStart(e)},{passive:false});
 const pzMove=e=>{const r=m.getBoundingClientRect(), [x,y]=tm(e.touches), R=VIEWS.region, v=PZ.vb, w0=v[1]-v[0], h0=v[3]-v[2];
  const nw=Math.min(Math.max(w0*PZ.d/td(e.touches),MINW),R[1]-R[0]), nh=h0*nw/w0, L=v[0]+PZ.fx*w0, B=v[2]+PZ.fy*h0;
  const fx=(x-r.left)/r.width, fy=1-(y-r.top)/r.height; VB=[L-fx*nw,L+(1-fx)*nw,B-fy*nh,B+(1-fy)*nh]; clamp();
  m.setAttribute("viewBox",`${(VB[0]-v[0])/w0*PZ.W} ${(v[3]-VB[3])/h0*PZ.H} ${nw/w0*PZ.W} ${nh/h0*PZ.H}`)};
 m.addEventListener("touchmove",e=>{if(e.touches.length<2){if(st&&e.cancelable)e.preventDefault(); return}
  if(e.cancelable)e.preventDefault(); if(PZ)pzMove(e); else pzStart(e)},{passive:false});
 document.addEventListener("touchmove",e=>{if(m.contains(e.target)||e.touches.length<2||![...e.touches].some(t=>m.contains(t.target)))return;
  if(PZ)pzMove(e); else pzStart(e)},{passive:true});
 const pzEnd=e=>{if(!PZ||e.touches.length>=2)return; PZ=null; window.HK_PZ=0; const R=VIEWS.region;
  view=(VB[1]-VB[0])<(R[1]-R[0])*0.99?"hk":"region"; $("#zoomBtn").textContent=view==="region"?"zoom to Hong Kong":"zoom out";
  drawMap(); setTimeout(()=>moved=false,350)};
 document.addEventListener("touchend",pzEnd,{passive:true}); document.addEventListener("touchcancel",pzEnd,{passive:true});
 let GS=null;
 m.addEventListener("gesturestart",e=>{e.preventDefault(); if(PZ)return; const r=m.getBoundingClientRect(),
  cx=Number.isFinite(e.clientX)?e.clientX:r.left+r.width/2, cy=Number.isFinite(e.clientY)?e.clientY:r.top+r.height/2;
  const b=m.viewBox.baseVal; GS={vb:VB.slice(),fx:(cx-r.left)/r.width,fy:1-(cy-r.top)/r.height,W:b.width,H:b.height}; st=null; moved=true; window.HK_PZ=1},{passive:false});
 m.addEventListener("gesturechange",e=>{e.preventDefault(); if(!GS)return; if(PZ){GS=null;return}
  const R=VIEWS.region, v=GS.vb, w0=v[1]-v[0], h0=v[3]-v[2], nw=Math.min(Math.max(w0/Math.pow(e.scale||1,4),MINW),R[1]-R[0]), nh=h0*nw/w0;
  const lx=v[0]+GS.fx*w0, ly=v[2]+GS.fy*h0; VB=[lx-GS.fx*nw,lx+(1-GS.fx)*nw,ly-GS.fy*nh,ly+(1-GS.fy)*nh]; clamp();
  m.setAttribute("viewBox",`${(VB[0]-v[0])/w0*GS.W} ${(v[3]-VB[3])/h0*GS.H} ${(VB[1]-VB[0])/w0*GS.W} ${(VB[3]-VB[2])/h0*GS.H}`);
  view=nw<(R[1]-R[0])*0.99?"hk":"region"; $("#zoomBtn").textContent=view==="region"?"zoom to Hong Kong":"zoom out"},{passive:false});
 m.addEventListener("gestureend",e=>{e.preventDefault(); if(GS){GS=null; window.HK_PZ=0; drawMap(); setTimeout(()=>moved=false,350)}},{passive:false});
 m.addEventListener("wheel",e=>{e.preventDefault();const r=m.getBoundingClientRect();
  const fx=(e.clientX-r.left)/r.width, fy=1-(e.clientY-r.top)/r.height, u=e.deltaMode===1?16:e.deltaMode===2?400:1, k=Math.min(Math.max(Math.exp(u*e.deltaY*(e.ctrlKey?0.01:0.0018)),1/1.5),1.5);
 
  const w=VB[1]-VB[0], h=VB[3]-VB[2], R=VIEWS.region, nw=Math.min(Math.max(w*k,MINW),R[1]-R[0]), nh=h*nw/w;
  const lx=VB[0]+fx*w, ly=VB[2]+fy*h; VB=[lx-fx*nw,lx+(1-fx)*nw,ly-fy*nh,ly+(1-fy)*nh];clamp();
  view=nw<(R[1]-R[0])*0.99?"hk":"region";$("#zoomBtn").textContent=view==="region"?"zoom to Hong Kong":"zoom out";redraw()},{passive:false});
 const nav=k=>{const R=VIEWS.region, w=VB[1]-VB[0], h=VB[3]-VB[2], cx=(VB[0]+VB[1])/2, cy=(VB[2]+VB[3])/2;
  if(k==="in"||k==="out"){const nw=Math.min(Math.max(k==="in"?w/1.5:w*1.5,MINW),R[1]-R[0]), nh=h*nw/w; VB=[cx-nw/2,cx+nw/2,cy-nh/2,cy+nh/2]}
  else if(k==="home") VB=HOME.slice();
  else {const dx={w:-w/4,e:w/4}[k]||0, dy={s:-h/4,n:h/4}[k]||0; VB=[VB[0]+dx,VB[1]+dx,VB[2]+dy,VB[3]+dy]}
  clamp(); view=(VB[1]-VB[0])<(R[1]-R[0])*0.99?"hk":"region"; $("#zoomBtn").textContent=view==="region"?"zoom to Hong Kong":"zoom out"; redraw()};
 document.querySelectorAll("#mapnav button").forEach(b=>b.onclick=()=>nav(b.dataset.nav));
 m.addEventListener("keydown",e=>{const k={ArrowLeft:"w",ArrowRight:"e",ArrowUp:"n",ArrowDown:"s","+":"in","=":"in","-":"out","0":"home"}[e.key];
  if(!k||e.ctrlKey||e.metaKey||e.altKey)return; e.preventDefault(); nav(k)});
})();
function syncNav(){const b=document.getElementById("mapnav"); if(!b)return; const R=VIEWS.region, w=VB[1]-VB[0], q=k=>b.querySelector(`[data-nav="${k}"]`);
 q("in").disabled=w<=MINW+1e-6; q("out").disabled=w>=R[1]-R[0]-1e-6; q("home").disabled=VB.every((v,i)=>Math.abs(v-HOME[i])<1e-6)}
let MAPW=0;
function openPath(m){if(!PATHS||MIX)return; const pd=(HK[PATHC]||{}).ifsens;
 MIX={ens,cyc,TR,GA,tab,showWIMean,showWIDist}; ens="ifsens"; cyc=PATHC; TR=PATHS; GA={members:(pd&&pd.members)||51,one:false}; sel=m; selH=null; BIN=null; showWIMean=false; showWIDist=false;
 drawTabs(); drawMap(); chart()}
function closePath(){if(!MIX)return; ({ens,cyc,TR,GA,tab,showWIMean,showWIDist}=MIX); MIX=null; sel=null; selH=null; BIN=null; drawTabs(); drawMap(); chart(); $("#maphint").textContent=PHINT()}
var QP=null, QVB=null;
const QDEDUP=P=>{if(P._dd)return; P._dd=1; const K=P.tracks.map(t=>new Set(t[2].map(p=>p[0]+","+p[1]+","+p[3])));
 P.tracks=P.tracks.filter((t,i)=>!P.tracks.some((u,j)=>j!==i&&u[0]===t[0]&&K[i].size<=K[j].size&&[...K[i]].every(x=>K[j].has(x))
  &&(K[i].size<K[j].size||QDES(u[1])&&!QDES(t[1])||QDES(u[1])===QDES(t[1])&&j<i)))};

const QREF=()=>ens==="aifsens"?51:52, QPK=t=>Math.max(...t[2].map(p=>p[2]||0)), QCA=t=>Math.min(...t[2].map(p=>dist(p[0],p[1])));
const QOK=t=>t[2].length>1&&(t[2][0][2]==null||QPK(t)>=22-0.5), QT=()=>QP.tracks.filter(QOK), QDES=sid=>+String(sid).slice(0,2)<70, QCOL="#3f6d8f";
function quietPaths(){QP=null; TR=null; MC=null; MG=null; sel=null; selH=null; BIN=null; syncPlayer(); $("#selbar").style.display="none";
 if(!(ens==="ifsens"||ens==="aifsens"))return;
 const k=cyc+"_"+ens, fin=()=>{if(k!==cyc+"_"+ens||!((HK[cyc]||{})[ens]||{}).quiet)return; QP=(window.HKPATHS||{})[k]||null; if(!QP)return; QDEDUP(QP);
  const L=QT().flatMap(t=>t[2]), q=(a,p)=>{const v=a.slice().sort((x,y)=>x-y); return v[Math.min(v.length-1,Math.max(0,Math.round(p*(v.length-1))))]};
  if(L.length){const lo=L.map(p=>p[0]), la=L.map(p=>p[1]); if(!QVB)QVB=VB.slice();
   VB=[Math.max(95,Math.min(103,q(lo,.05)-2)),Math.min(165,Math.max(143,q(lo,.95)+2)),Math.max(0,Math.min(6,q(la,.05)-2)),Math.min(42,Math.max(33,q(la,.95)+2))]}
  {const qc=$("#qclose"), T=QT(); if(qc&&T.length)qc.textContent=`The closest path on the map comes about ${KM10(Math.min(...T.map(QCA)))} km from Hong Kong.`}
  $("#map").style.display=""; [...document.querySelectorAll("#mapnav,#maph")].forEach(e=>{if(e)e.style.display=""});
  [...document.querySelectorAll(".mapbar,#mapkey")].forEach(e=>{if(e)e.style.display="none"}); drawMap()};
 if(window.HKPATHS&&window.HKPATHS[k])fin(); else{const sc=document.createElement("script"); sc.src=`../data/paths_${k}.js`; sc.onload=fin; sc.onerror=()=>{}; document.head.appendChild(sc)}}
const QHINT=()=>{const T=QT(), n=T.filter(t=>t[0]!==QREF()).length, D=[...new Set(T.map(t=>t[1]).filter(QDES))].sort(), U=new Set(T.map(t=>t[1]).filter(s=>!QDES(s))).size;
 if(BASIC) return `No storm comes within 800 km of Hong Kong in this forecast, so there are no signal chances to show. The lines are the possible paths of storms elsewhere in the region.`;
 return `No storm comes within 800 km of Hong Kong in this run, so no signals are worked out. Shown: every storm in it that enters the region and reaches a tropical depression — ${n} member paths`
  +`${D.length?` of ${D.join(", ")}`:""}${U?`${D.length?" and":" of"} systems not yet named (ECMWF's numbers 70 and up, each member's own)`:""}${""} · black dashed = the ${QREF()===51?"control":"deterministic"} run${""}`};
function drawQuiet(s){const {X,Y,hx,hy}=mapBase(s); $("#selbar").style.display="none"; syncNav();
 const dP=P=>P.map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join(" "), T=QT();
 const hov=(path,txt)=>{path.onmouseenter=()=>$("#maphint").innerHTML=txt; path.onmouseleave=()=>$("#maphint").innerHTML=QHINT()};
 T.filter(t=>t[0]!==QREF()).sort((a,b)=>QPK(a)-QPK(b)).forEach(t=>{
  t[2].slice(0,-1).forEach((p,i)=>{const q=t[2][i+1]; s.appendChild(el("line",{x1:X(p[0]),y1:Y(p[1]),x2:X(q[0]),y2:Y(q[1]),stroke:QCOL,"stroke-width":1.5,"stroke-linecap":"round",opacity:.8,"pointer-events":"none"}))});
  const hit=el("path",{fill:"none",stroke:"#000","stroke-opacity":0,"stroke-width":8,"pointer-events":"stroke",d:dP(t[2])});
  hov(hit,`<b>member ${t[0]}</b> · storm ${t[1]}${""} · closest ${Math.round(QCA(t))} km from Hong Kong`); s.appendChild(hit)});
 T.filter(t=>t[0]===QREF()).forEach(t=>{const d=dP(t[2]);
  s.appendChild(el("path",{fill:"none",stroke:"#fff","stroke-width":5,d,opacity:.9,"stroke-linejoin":"round","pointer-events":"none"}));
  const p=el("path",{fill:"none",stroke:"#000","stroke-width":2.4,"stroke-dasharray":"9 4",d,"stroke-linejoin":"round","pointer-events":"stroke"});
  hov(p,`<b>${QREF()===51?"control":"deterministic"} run</b> · storm ${t[1]}${""} · closest ${Math.round(QCA(t))} km from Hong Kong`); s.appendChild(p)});
 const lab={}; [...T.filter(t=>t[0]===QREF()),...T].filter(t=>QDES(t[1])).forEach(t=>{if(!lab[t[1]])lab[t[1]]=t[2][0]});
 Object.entries(lab).forEach(([sid,p])=>{const tx=el("text",{x:X(p[0])+6,y:Y(p[1])-6,fill:"#111","font-size":11.5,"font-weight":700,"pointer-events":"none",stroke:"#fff","stroke-width":3,"paint-order":"stroke"}); tx.textContent=sid; s.appendChild(tx)});
 if(VB[1]-VB[0]>=5){s.appendChild(el("circle",{cx:hx,cy:hy,r:6,fill:"#f2c200",stroke:"#333","stroke-width":1.2}));
  const t=el("text",{x:hx+9,y:hy+4,fill:"#111","font-size":12,"font-weight":600,"text-anchor":"start"});t.textContent="Hong Kong";s.appendChild(t)}
 $("#maphint").innerHTML=QHINT(); syncPlayer(); AXY=null}
function mapBase(s,V){
 const dw=s.getBoundingClientRect().width||(s.parentNode&&s.parentNode.clientWidth)||1200, K=dw>=700?1.2:1.1;
 const W=Math.max(300,Math.round(dw/K)),[lo0,lo1,la0,la1]=V||VB; if(!V)MAPW=dw;
 s.style.touchAction=V?"auto":"none"; s.style.cursor=V?"default":moved?"grabbing":"grab";
 const H=Math.round(W*(la1-la0)*110.57/((lo1-lo0)*111.32*Math.cos((la0+la1)/2*Math.PI/180)));
 s.setAttribute("viewBox",`0 0 ${W} ${H}`);
 const X=l=>(l-lo0)/(lo1-lo0)*W, Y=b=>H-(b-la0)/(la1-la0)*H, hx=X(114.174), hy=Y(22.302);
 s.appendChild(el("rect",{x:0,y:0,width:W,height:H,fill:"#e8eff6"}));
 (window.COAST||[]).forEach(seg=>s.appendChild(el("path",{fill:"none",stroke:"#8d8d8d","stroke-width":.9,
   d:seg.map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join(" ")})));
 [100,200,400,800].forEach(r=>{const ry=r/110.57*(H/(la1-la0));
   s.appendChild(el("ellipse",{cx:hx,cy:hy,rx:r/(111.32*Math.cos(.389))*(W/(lo1-lo0)),ry,fill:"none",stroke:"#666","stroke-dasharray":"4 4","stroke-width":.8}));
   if(!s._rl)s._rl=[]; s._rl.push([r,ry])});
 {let last=1e9; (s._rl||[]).sort((a,b)=>b[1]-a[1]).forEach(([r,ry])=>{if(last-ry<15||ry<12||hy-ry-3<13)return; last=ry;
   const tx=el("text",{x:hx,y:hy-ry-3,fill:"#555","font-size":11.5,"text-anchor":"middle"}); tx.textContent=r+" km"; s.appendChild(tx)}); s._rl=null}
 return {W,H,X,Y,hx,hy,lo0,lo1,la0,la1}}
const OBSC=["area of low pressure","Tropical Depression","Tropical Storm","Severe Tropical Storm","Typhoon","Severe Typhoon","Super Typhoon"];
const obsK=v=>Math.round(v*1.852/5)*5, obs10=r=>Math.round(r/10)*10;
function obsAt(h){const TRU=truthNow(); if(!TRU||!TRU.track||!TRU.track.length) return null; const A=truthAt(TRU,h);
 return A?Object.assign(A,{cls:OBSC[clsOf(A.v)]}):{none:true,before:h<isoH(TRU.track[0][3]),first:TRU.track[0][3]}}
function obsLine(){const o=obsAt(0); if(!o) return "";
 if(o.none) return o.before?`When this forecast started, the storm was not yet on HKO's best track, which begins on <b>${hktS(Date.parse(o.first+":00Z"))}</b>.`
  :"When this forecast started, HKO's best track for this storm had already ended.";
 return `When this forecast started, the storm was ${o.cls[0]==="a"?"an":"a"} ${o.cls} on HKO's best track, with sustained winds of about <b>${obsK(o.v)} km/h</b> near its centre`
  +(o.gale>0?` and gale winds out to about <b>${obs10(o.gale)} km</b>`:"")+"."}
const obsHTML=c=>{const t=obsLine(); return t?`<div class="${c} obs">${t}</div>`:""};
function obsDraw(add,X,Y,RX,RY,A,lab){const ax=X(A.lon), ay=Y(A.lat); let last=-1e9;
 [[A.gale,"63 km/h",1.6,.08,"#2f9e44","#237a35"],[A.storm,"88 km/h",1.8,0,"#f08c00","#b85f00"],[A.hur,"118 km/h",2.2,0,"#e03131","#b42020"]].forEach(([r,w,sw,fo,col,tc])=>{if(!(r>0))return;
  add(el("ellipse",{cx:ax,cy:ay,rx:RX(r),ry:RY(r),fill:col,"fill-opacity":fo,stroke:col,"stroke-width":sw,opacity:.95,"pointer-events":"none"}));
  const ty=ay-RY(r)-3; if(lab&&Math.abs(ty-last)>=12){last=ty; const t=el("text",{x:ax,y:ty,fill:tc,"font-size":10.5,"font-weight":700,"text-anchor":"middle",
   stroke:"#fff","stroke-width":3,"paint-order":"stroke","pointer-events":"none"}); t.textContent=w; add(t)}});
 add(el("circle",{cx:ax,cy:ay,r:6,fill:"#fff",stroke:"#000","stroke-width":2.2,"pointer-events":"none"}))}
let OG=null, OXY=null;
function drawObs(){if(!OG||!OXY)return; while(OG.firstChild)OG.removeChild(OG.firstChild); if(sel!==null)return;
 const h=BT?BTH:(allH===null?0:allH), A=obsAt(h); if(!A||A.none)return; const add=e=>OG.appendChild(e); obsDraw(add,OXY.X,OXY.Y,OXY.RX,OXY.RY,A,true);
 if(!BT)return;
 const TRb=truthNow(), sg=sigIn(TRb,h,h+1e-6), dk=Math.round(dist(A.lon,A.lat)), W=OXY.W, H=OXY.H;
 const lines=[fmtH(h),`HKO best track: ${A.cls}, about ${obsK(A.v)} km/h`,`actual: ${dk} km from HK${sg?`, HKO No. ${sg} up`:", no HKO signal"}`];
 const bw=Math.min(W-16,Math.max(260,...lines.map(x=>6.6*x.length+16))), bh=16*lines.length+10, bx=W-bw-8, by=H-bh-8;
 add(el("rect",{x:bx,y:by,width:bw,height:bh,rx:0,fill:"#fff",opacity:.94,stroke:"#999","stroke-width":.7}));
 lines.forEach((x,i)=>{const t=el("text",{x:bx+8,y:by+18+16*i,fill:"#111","font-size":11.5,"font-weight":i?400:600}); t.textContent=x; add(t)});
 $("#ptime").textContent=`${fmtH(h)} · ${dk} km from Hong Kong`}
let BT=false, BTH=null, btPlaying=false, btTs=0, btChartTs=0;
const btSpan=()=>{const T_=truthNow(); if(!T_||!T_.track||T_.track.length<2)return null; const k=T_.track; return [isoH(k[0][3]),isoH(k[k.length-1][3])]};
function btOff(){if(!BT)return; BT=false; if(btPlaying){btPlaying=false; $("#play").textContent="Play"} document.body.classList.remove("btsel"); playLabel()}
function btSync(){const pl=$("#player"), sp=btSpan(); playLabel();
 if(!sp){pl.style.display="none";return} pl.style.display=""; const sl=$("#slider"); sl.min=sp[0]; sl.max=sp[1]; sl.value=BTH}
function btStep(){if(!btPlaying||!BT)return; const sp=btSpan(); if(!sp){btPlaying=false;return} const ts=performance.now();
 if(btTs) BTH=Math.min(sp[1],BTH+(+$("#speed").value)*(ts-btTs)/1000); btTs=ts; drawObs(); $("#slider").value=BTH;
 if(ts-btChartTs>150){chart(); btChartTs=ts}
 if(BTH>=sp[1]-1e-6){btPlaying=false; $("#play").textContent="Play"; playLabel(); chart(); return} setTimeout(btStep,40)}
$("#btBtn").onclick=()=>{if(BT){btOff(); drawMap(); chart(); syncPlayer(); return}
 const sp=btSpan(); if(!sp)return; if(allPlaying)allStop(); allH=null; if(playing)stopPlay(); sel=null; selH=null; BIN=null;
 BTH=Math.min(Math.max(0,sp[0]),sp[1]); BT=true; document.body.classList.remove("bsel"); document.body.classList.add("btsel"); drawMap(); chart(); syncPlayer();
 setTimeout(()=>{try{$("#map").scrollIntoView({behavior:"smooth",block:"nearest"})}catch(e){}},60)};
{const p0=$("#play").onclick; $("#play").onclick=()=>{if(!BT){p0();return} const sp=btSpan(); if(!sp)return;
  if(btPlaying){btPlaying=false; $("#play").textContent="Play"; playLabel(); chart(); return}
  if(BTH===null||BTH>=sp[1]-1e-6) BTH=sp[0]; btPlaying=true; btTs=0; btChartTs=0; $("#play").textContent="Pause"; playLabel(); btStep()}}
{const s0=$("#slider").oninput; $("#slider").oninput=e=>{if(!BT){s0(e);return} BTH=+e.target.value; drawObs(); chart()}}
function playLabel(){const b=$("#allPlay"); if(!b)return; const one=BT||(sel!==null&&MC&&MC.t&&MC.t.wf);
 b.textContent=allPlaying||playing||btPlaying?"Pause":one||BASIC?"Play":"Play all members"}
{const a0=$("#allPlay").onclick; $("#allPlay").onclick=()=>{const t=MC&&MC.t;
  if(!allPlaying&&(BT||(sel!==null&&t&&t.wf))){$("#play").onclick(); playLabel(); return} a0(); playLabel()}}
function btChart(){const s=$("#chart"), sg=$("#stationchart"), TRb=truthNow(); s.innerHTML=""; if(sg){sg.innerHTML=""; sg.style.display="none"} s.style.display="";
 document.body.classList.remove("bsel"); $("#chead").textContent="HKO best track: what really happened";
 if(!TRb||!TRb.track||TRb.track.length<2){$("#cnote").textContent="";return}
 const ZH=/^zh/.test(document.documentElement.lang||""), k=TRb.track, hs=k.map(p=>isoH(p[3])), kh=k.map(p=>p[2]*1.852);
 const sigs=(TRb.signals||[]).map(([a,b,g])=>[isoH(a),isoH(b),g]).filter(z=>z[2]>=1);
 const x0=Math.min(hs[0],...sigs.map(z=>z[0])), x1=Math.max(hs[hs.length-1],...sigs.map(z=>z[1]));
 const PW=Math.round((s.parentNode&&s.parentNode.clientWidth)||1000), NAR=PW<700, W=NAR?Math.max(320,PW):1000, H=NAR?300:330, L=NAR?40:50, R=NAR?(ZH?70:52):126, T=26, SH=16, B=SH+40;
 s.setAttribute("viewBox",`0 0 ${W} ${H}`);
 const top=Math.max(200,Math.ceil(Math.max(...kh)/50)*50), X=h=>L+(W-L-R)*(h-x0)/Math.max(x1-x0,1), Y=v=>T+(H-B-T)*(1-v/top);
 const BANDS=[[41,63,"Tropical Depression","TD","熱帶低氣壓"],[63,88,"Tropical Storm","TS","熱帶風暴"],[88,118,"Severe Tropical Storm","STS","強烈熱帶風暴"],
  [118,150,"Typhoon","T","颱風"],[150,185,"Severe Typhoon","ST","強颱風"],[185,top,"Super Typhoon","SuperT","超強颱風"]];
 BANDS.forEach(([a,b,e,ab,z],i)=>{if(a>=top)return; const y0=Y(Math.min(b,top)), y1=Y(a);
  s.appendChild(el("rect",{x:L,y:y0,width:W-L-R,height:y1-y0,fill:CLSC[i+1],opacity:.07}));
  s.appendChild(el("line",{x1:L,x2:W-R,y1:y1,y2:y1,stroke:"var(--line)"}));
  const t=el("text",{x:W-R+6,y:(y0+y1)/2+4,fill:"var(--mut)","font-size":NAR?9.5:10.5}); t.textContent=ZH?z:NAR?ab:e; s.appendChild(t);
  const n=el("text",{x:L-5,y:y1+4,fill:"var(--mut)","font-size":10.5,"text-anchor":"end"}); n.textContent=a; s.appendChild(n)});
 {const u=el("text",{x:4,y:T-12,fill:"var(--mut)","font-size":10.5}); u.textContent=ZH?"公里/小時":"km/h"; s.appendChild(u)}
 const t0=T0(), d0=new Date(t0+x0*36e5+288e5), days=[]; for(let u=Date.UTC(d0.getUTCFullYear(),d0.getUTCMonth(),d0.getUTCDate()+1)-288e5;u<=t0+x1*36e5;u+=864e5)days.push(u);
 const stp=Math.max(1,Math.ceil(days.length/(NAR?4:9)));
 days.forEach((u,i)=>{const xx=X((u-t0)/36e5); s.appendChild(el("line",{x1:xx,x2:xx,y1:T,y2:H-B+12+SH,stroke:"var(--line)",opacity:.6}));
  if(i%stp)return; const dd=new Date(u+288e5), t=el("text",{x:xx+3,y:H-8,fill:"var(--mut)","font-size":10.5}); t.textContent=ZH?`${dd.getUTCMonth()+1}月${dd.getUTCDate()}日`:`${dd.getUTCDate()} ${MON[dd.getUTCMonth()]}`; s.appendChild(t)});
 s.appendChild(el("path",{fill:"none",stroke:"var(--ink)","stroke-width":2.2,d:hs.map((h,i)=>(i?"L":"M")+X(h).toFixed(1)+" "+Y(kh[i]).toFixed(1)).join(" ")}));
 hs.forEach((h,i)=>s.appendChild(el("circle",{cx:X(h),cy:Y(kh[i]),r:2.6,fill:CLSC[clsOf(k[i][2])],stroke:"var(--card)","stroke-width":1})));
 const sy=H-B+12; s.appendChild(el("rect",{x:L,y:sy,width:W-L-R,height:SH,fill:"var(--soft)"}));
 sigs.forEach(([a,b,g])=>{const xa=X(a), xb=X(b); s.appendChild(el("rect",{x:xa,y:sy,width:Math.max(1,xb-xa),height:SH,fill:SIGC[g]||SIGC[1]}));
  if(xb-xa>16){const t=el("text",{x:(xa+xb)/2,y:sy+12,fill:"#fff","font-size":10,"font-weight":700,"text-anchor":"middle"}); t.textContent=g; s.appendChild(t)}});
 {const t=el("text",{x:L-5,y:sy+12,fill:"var(--mut)","font-size":10,"text-anchor":"end"}); t.textContent=ZH?"信號":"HKO"; s.appendChild(t)}
 if(BTH!==null){const xx=X(BTH), A=truthAt(TRb,BTH); s.appendChild(el("line",{x1:xx,x2:xx,y1:T,y2:sy+SH,stroke:"var(--ink)","stroke-dasharray":"4 3","stroke-width":1.4}));
  if(A){const t=el("text",{x:Math.min(Math.max(xx,L+70),W-R-70),y:T-12,fill:"var(--ink)","font-size":11,"font-weight":600,"text-anchor":"middle"}); t.textContent=`${fmtH(BTH)}: ${obsK(A.v)} km/h`; s.appendChild(t)}}
 let pk=0; kh.forEach((v,i)=>{if(v>kh[pk])pk=i});
 let cb=null, cd=1e9; for(let h=hs[0];h<=hs[hs.length-1]+1e-6;h+=0.5){const A=truthAt(TRb,h); if(A){const d=dist(A.lon,A.lat); if(d<cd){cd=d;cb=h}}}
 const cls=OBSC[clsOf(k[pk][2])];
 $("#cnote").innerHTML=`On HKO's best track the storm peaked as ${cls[0]==="a"?"an":"a"} ${cls} of about <b>${obsK(k[pk][2])} km/h</b> on <b>${fmtH(hs[pk])}</b>`
  +(cb!==null?`, and came closest to Hong Kong, about <b>${KM10(cd)} km</b> away, on <b>${fmtH(cb)}</b>`:"")+"."}

function drawMap(){
 if(window.HK_PZ)return;
 const s=$("#map");s.innerHTML="";MC=null;MG=null;
 if(!TR&&QP&&!WH()){drawQuiet(s);return}
 if(WH()?!PATHS:!TR){syncPlayer();return}
 const {W,H,X,Y,hx,hy,lo0,lo1,la0,la1}=mapBase(s);
 if(sel!==null&&BT)btOff();
 $("#selbar").style.display=sel!==null||BIN||BT?"":"none"; syncNav();
 
 if(sel===null)HEAT=false; {const hb=$("#heatBtn"); if(hb){hb.style.display=sel!==null&&!BT&&!WH()&&!MIX&&(!PUB||(!BASIC&&((HK[cyc]||{})[ens]||{}).heat))?"":"none";   /* public: Expert only (2026-11-18, user: 'Show in expert please') */ hb.classList.toggle("on",HEAT)}}
 {const b=$("#btBtn"), T_=truthNow(); if(b){b.style.display=T_&&T_.track&&T_.track.length>1&&!WH()?"":"none"; b.classList.toggle("on",BT)}}
 if(WH()){
  $("#selbar").style.display="none"; $("#detBtn").style.display="none"; $("#mapexp").innerHTML="";
  {const k=$("#mapkey"); if(k)k.querySelectorAll("i[data-lv]").forEach(i=>i.style.background=SIGC[i.dataset.lv])} {const kd=$("#kdet"); if(kd)kd.parentNode.style.display="none"}
  PATHS.tracks.filter(t=>t.m!==52&&t.pts&&t.pts.length>1&&!weakT(t)).sort((a,b)=>{const A=tierOf(a),B=tierOf(b);return A[0]-B[0]||A[1]-B[1]}).forEach(t=>{const SQ=sqOf(t);
   {const hit=el("path",{fill:"none",stroke:"#000","stroke-opacity":0,"stroke-width":9,"pointer-events":"stroke",d:t.pts.map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join(" ")});
    hit.style.cursor="pointer"; hit.onclick=()=>{if(!moved)openPath(t.m)};
    hit.onmouseenter=()=>$("#maphint").textContent=`ECMWF member ${t.m}${t.ca?`: closest about ${Math.round(t.ca[0])} km from Hong Kong`:""}. Click to see this path on its own.`;
    hit.onmouseleave=()=>$("#maphint").textContent=PHINT(); s.appendChild(hit)}
   if(!SQ.length)return; const SB=SQ.map(p=>labH(p[0]));
   for(let i=0;i<t.pts.length-1;i++){const a=t.pts[i], b=t.pts[i+1], ha=labH(a[3]), hb=labH(b[3]), dh=hb-ha||1, cuts=[ha,...SB.filter(h=>h>ha+1e-6&&h<hb-1e-6),hb];
    for(let k=0;k<cuts.length-1;k++){const f0=(cuts[k]-ha)/dh, f1=(cuts[k+1]-ha)/dh, lv=sigAt(t,cuts[k]+1e-3,SQ);
     s.appendChild(el("line",{x1:X(a[0]+(b[0]-a[0])*f0),y1:Y(a[1]+(b[1]-a[1])*f0),x2:X(a[0]+(b[0]-a[0])*f1),y2:Y(a[1]+(b[1]-a[1])*f1),stroke:SIGC[lv],"stroke-width":lv>=3?2.2:1.5,"stroke-linecap":"round",opacity:lv===0?.4:.95,"pointer-events":"none"}))}}});
  stationDots(s,X,Y,lo1-lo0);
  if(lo1-lo0>=5){s.appendChild(el("circle",{cx:hx,cy:hy,r:6,fill:"#f2c200",stroke:"#333","stroke-width":1.2}));
   const t=el("text",{x:hx+9,y:hy+4,fill:"#111","font-size":12,"font-weight":600,"text-anchor":"start"});t.textContent="Hong Kong";s.appendChild(t)}
  syncPlayer(); AXY=null; return}
 const only=$("#only150").checked;
 {const o=$("#othSt"), P=(window.HKPATHS||{})[cyc+"_"+ens];
  if(o&&o.checked&&P){const own={}; TR.tracks.forEach(t=>{(own[t.m]=own[t.m]||new Set()).add(String(t.storm))}); const lab={};
   P.tracks.filter(t=>t[2].length>1&&!(own[t[0]]&&own[t[0]].has(t[1]))&&QOK(t)&&(sel===null||t[0]===sel)).forEach(t=>{
    s.appendChild(el("path",{fill:"none",stroke:QCOL,"stroke-width":sel===null?1.3:2,"stroke-dasharray":"1 3","stroke-linecap":"round",opacity:sel===null?.7:.95,"pointer-events":"none","stroke-linejoin":"round",d:t[2].map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join(" ")}));
    if(QDES(t[1])&&!lab[t[1]])lab[t[1]]=t[2][0]});
   Object.entries(lab).forEach(([sid,p])=>{const tx=el("text",{x:X(p[0])+6,y:Y(p[1])-6,fill:QCOL,"font-size":11,"font-weight":700,"pointer-events":"none",stroke:"#fff","stroke-width":3,"paint-order":"stroke"}); tx.textContent=sid; s.appendChild(tx)});
   $("#maphint").innerHTML+=` · <span style="display:inline-block;width:18px;border-top:2px dotted #3f6d8f;vertical-align:middle;margin:0 3px 0 4px"></span> other storms in this forecast that reach a tropical depression (ECMWF's track file; numbers 70 and up = not yet named)`}}
 1// it is not an ensemble member (never counted), but it is DRAWN in the members' view as the default reference track
 const isDet=t=>t.m===52&&(ens==="ifsens"||ens==="tigge"), hasDet=TR.tracks.some(isDet);
 const byI=false, pk=t=>Math.max(...t.pts.map(p=>p[2]));
 {const k=$("#mapkey"); if(k){k.style.display=byI?"none":""; k.querySelectorAll("i[data-lv]").forEach(i=>i.style.background=SIGC[i.dataset.lv])}}
 
 if(window._defHint===undefined)window._defHint=$("#maphint").innerHTML;
 $("#maphint").innerHTML=window._defHint;
 {const r=refM(); $("#detBtn").style.display=r!==null?"":"none"; $("#detBtn").classList.toggle("on",r!==null&&sel===r);
  $("#detBtn").textContent=r===51?"Control run":"Deterministic run";
  {const kd=$("#kdet"); if(kd){kd.textContent=r===51?"control run":"deterministic run"; kd.parentNode.style.display=r!==null?"":"none"}}
  $("#mapexp").innerHTML=`<b>Lines:</b> ${TR.tracks.filter(x=>x.m!==52).length>1?`${(HK[cyc]||{})[ens]&&(HK[cyc]||{})[ens].members||50} possible paths`:"the possible paths"}, each started from slightly different conditions.`
   +(n=>n?` <span>${n} of them never ${n===1?"reaches":"reach"} a tropical depression and ${n===1?"is":"are"} not drawn.</span>`:"")(TR.tracks.filter(x=>!isDet(x)&&x.m!==DEFM()&&weakT(x)).length)
   +(r===52?` <b>Deterministic run:</b> ECMWF's main forecast, made once in finer detail.`:r===51?` <b>Control run:</b> the one path started without any change.`:"");
  $("#detBtn").title=r===51?"the AI ensemble's unperturbed member (51) on its own -- the site has no separate deterministic AI run":"ECMWF's main forecast, made once in finer detail than the members, shown on its own: track, time bar, charts"}
 if(sel!==null&&allH!==null){allH=null; if(allPlaying)allStop()}
 let HFM=null;
 if(HEAT&&sel!==null){const HD=heatData(), t=TR.tracks.find(x=>x.m===sel);
  if(HD&&t&&HD.m[String(sel)]){const [cd,lon0,lat0]=heatAnchor(t), kx=1/(111.32*Math.cos(lat0*Math.PI/180)), ky=1/110.57, st=2.5, g=el("g",{"pointer-events":"none",opacity:.55,"shape-rendering":"crispEdges"});
   for(let dx=-50+st/2;dx<50;dx+=st)for(let dy=-50+st/2;dy<50;dy+=st){if(Math.hypot(dx,dy)>50)continue;
    const lv=heatLv(heatAt(HD,sel,"3",dx,dy),heatAt(HD,sel,"8",dx,dy),heatAt(HD,sel,"10",dx,dy));
    const x0=X(lon0+(dx-st/2)*kx), x1=X(lon0+(dx+st/2)*kx), y0=Y(lat0+(dy+st/2)*ky), y1=Y(lat0+(dy-st/2)*ky);
    g.appendChild(el("rect",{x:x0.toFixed(1),y:y0.toFixed(1),width:(x1-x0+.6).toFixed(1),height:(y1-y0+.6).toFixed(1),fill:lv?SIGC[lv]:"#d6dbe0"}))}
   s.appendChild(g);
   const rx=X(lon0+50*kx)-X(lon0), ry=Y(lat0-50*ky)-Y(lat0);
   s.appendChild(el("ellipse",{cx:X(lon0),cy:Y(lat0),rx:rx,ry:ry,fill:"none",stroke:"#222","stroke-width":1.2,"stroke-dasharray":"5 4","pointer-events":"none"}));
   {const mk=el("mask",{id:"hfm",maskUnits:"userSpaceOnUse",x:-1e4,y:-1e4,width:2e4,height:2e4}); mk.appendChild(el("rect",{x:-1e4,y:-1e4,width:2e4,height:2e4,fill:"#fff"}));
    mk.appendChild(el("ellipse",{cx:X(lon0),cy:Y(lat0),rx:rx,ry:ry,fill:"#4d4d4d"})); s.appendChild(mk); HFM="url(#hfm)"}
   const hov=el("ellipse",{cx:X(lon0),cy:Y(lat0),rx:rx,ry:ry,fill:"#000","fill-opacity":0,"pointer-events":"fill"});
   hov.onmousemove=ev=>{const pt=s.createSVGPoint(); pt.x=ev.clientX; pt.y=ev.clientY; const q=pt.matrixTransform(s.getScreenCTM().inverse());
    const lon=lo0+q.x/W*(lo1-lo0), lat=la0+(H-q.y)/H*(la1-la0), dx=(lon-lon0)/kx, dy=(lat-lat0)/ky, P=["3","8","10"].map(k=>heatAt(HD,sel,k,dx,dy));
    if(P[0]==null)return; $("#maphint").textContent=`If its path were moved so this part passed here, the chances would be No. 3 ${Math.round(100*P[0])}%, No. 8 ${Math.round(100*P[1])}% and No. 10 ${Math.round(100*P[2])}%.`};
   hov.onmouseleave=()=>{$("#maphint").textContent="The circle sits where this member's chance of the next signal is highest. Each spot in it shows the signal the member would give if its whole path were moved so this part passed through that spot, up to 50 km away. Hover over it to see the chances."};
   s.appendChild(hov);
   $("#maphint").textContent="The circle sits where this member's chance of the next signal is highest. Each spot in it shows the signal the member would give if its whole path were moved so this part passed through that spot, up to 50 km away. Hover over it to see the chances."}}
 TR.tracks.filter(t=>(!only||t.ca[0]<150)&&(sel===null||t.m===sel)&&(!isDet(t)||sel===null||sel===t.m)&&(sel!==null||!BIN||BIN.ms.has(t.m))&&!(BASIC&&isDet(t))&&(isDet(t)||sel===t.m||!!BIN||t.m===DEFM()||!weakT(t))).sort((a,b)=>{if(byI)return (isDet(a)-isDet(b))||pk(a)-pk(b);const A=tierOf(a),B=tierOf(b);return (isDet(a)-isDet(b))||A[0]-B[0]||A[1]-B[1]}).forEach(t=>{
  const top=sel===null&&t.m===DEFM(), on=sel===t.m, d=t.pts.map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join(" ");
  if(top||on){const hp=el("path",{fill:"none",stroke:"#fff","stroke-width":(on?7:5.5),d:d,"stroke-linejoin":"round"}); if(on&&HFM)hp.setAttribute("mask",HFM); s.appendChild(hp)}
  const det=isDet(t), SQ=!byI&&(!det||on)?sqOf(t):null, sq=SQ&&SQ.length;
  if(sq){const hAt=i=>t.wf&&t.wf[i]?t.wf[i][0]:labH(t.pts[i][3]), SB=SQ.map(p=>labH(p[0]));
   for(let i=0;i<t.pts.length-1;i++){const a=t.pts[i], b=t.pts[i+1], ha=hAt(i), hb=hAt(i+1), dh=hb-ha||1;
    const cuts=[ha,...SB.filter(h=>h>ha+1e-6&&h<hb-1e-6),hb];
    for(let k=0;k<cuts.length-1;k++){const f0=(cuts[k]-ha)/dh, f1=(cuts[k+1]-ha)/dh, lv=sigAt(t,cuts[k]+1e-3,SQ);
     {const ln=el("line",{x1:X(a[0]+(b[0]-a[0])*f0),y1:Y(a[1]+(b[1]-a[1])*f0),x2:X(a[0]+(b[0]-a[0])*f1),y2:Y(a[1]+(b[1]-a[1])*f1),stroke:SIGC[lv],
       "stroke-width":on?4.4:top?3:lv>=3?2.2:1.5,"stroke-linecap":"round",opacity:lv===0&&!on&&!top?.4:.95,"pointer-events":"none"}); if(on&&HFM)ln.setAttribute("mask",HFM); s.appendChild(ln)}}}}
  if(det&&!on){s.appendChild(el("path",{fill:"none",stroke:"#fff","stroke-width":6,d:d,opacity:.9,"stroke-linejoin":"round"}));
   const L=t.pts[t.pts.length-1], clash=Math.abs(Y(L[1])-hy)<22&&X(L[0])<hx&&X(L[0])+100>hx-6, lb=el("text",{x:X(L[0])+(clash?-4:6),y:Y(L[1])+(clash?20:-6),fill:"#000","font-size":11,"font-weight":700,"pointer-events":"none"});lb.textContent="deterministic";s.appendChild(lb)}
  if(byI)t.pts.slice(0,-1).forEach((p,i)=>{const q=t.pts[i+1], ln=el("line",{x1:X(p[0]),y1:Y(p[1]),x2:X(q[0]),y2:Y(q[1]),stroke:CLSC[clsOf(p[2])],
    "stroke-width":on?3.6:det?2.8:top?3:1.8,"stroke-linecap":"round",opacity:.95,"pointer-events":"none"}); if(on&&HFM)ln.setAttribute("mask",HFM); s.appendChild(ln)});
  const path=el("path",{fill:"none",stroke:on?"#111":det?"#000":TIERC[tierOf(t)[0]],"stroke-width":on?3.6:det?2.8:(top?3:1+2.2*tierOf(t)[1]),d:d,
    "stroke-dasharray":det&&!on?"9 4":"","stroke-linejoin":"round",opacity:(tierOf(t)[0]===0&&!top&&!on&&!det)?.45:.95});
  if(on&&HFM)path.setAttribute("mask",HFM);
  if(byI||sq){path.setAttribute("stroke-opacity",0);path.setAttribute("stroke-width",8);path.setAttribute("pointer-events","stroke")}
  const clickLine=ev=>{if(moved)return;
   if(on&&t.wf){const pt=s.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const q=pt.matrixTransform(s.getScreenCTM().inverse());
    const lon=lo0+q.x/W*(lo1-lo0), lat=la0+(H-q.y)/H*(la1-la0), kx=Math.cos(lat*Math.PI/180);
    let best=[1e18,0,0];
    for(let i=0;i<t.pts.length-1;i++){const a=t.pts[i],b=t.pts[i+1],ax=(b[0]-a[0])*kx,ay=b[1]-a[1],L2=ax*ax+ay*ay;
     const f=L2>0?Math.max(0,Math.min(1,((lon-a[0])*kx*ax+(lat-a[1])*ay)/L2)):0, ex=(a[0]+f*(b[0]-a[0])-lon)*kx, ey=a[1]+f*(b[1]-a[1])-lat;
     if(ex*ex+ey*ey<best[0])best=[ex*ex+ey*ey,i,f]}
    selH=t.wf[best[1]][0]+best[2]*(t.wf[best[1]+1][0]-t.wf[best[1]][0])}
   else{sel=(sel===t.m?null:t.m);selH=null}
   drawMap();chart()};
  path.style.cursor="pointer"; path.onclick=clickLine;
  (t.others||[]).forEach(o=>{s.appendChild(el("path",{fill:"none",stroke:on?"#555":"#999","stroke-width":on?1.6:0.8,"stroke-dasharray":"5 4",
    opacity:on?0.9:0.35,d:o.pts.map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join(" ")}))});
  path.onmouseenter=()=>$("#maphint").innerHTML=BASIC?`Closest to Hong Kong: <b>${Math.round(t.ca[0])} km</b>. Click the line to see how windy Hong Kong gets along it.`:on&&t.wf
    ?`<b>${memLab(t.m)}</b>: click anywhere on its line, drag the time bar or press play to see the storm${""} at any moment (the charts below follow).`
    :`<b>${memLab(t.m)}</b>${top?(ens==="deepmind"?" — median wind index":t.m===TR.top?" — most threatening":""):""}: closest ${Math.round(t.ca[0])} km at ${hkC(t.ca[1])}, ${(lv=>lv>=3?`signal ${lv===9?"near No. 10":"No. "+lv}`:"no signal")(tierOf(t)[0])}${""}. Click to see it below.`;
  s.appendChild(path);
  if(on&&t.wf){const hit=el("path",{fill:"none",stroke:"#000","stroke-opacity":0,"stroke-width":14,d:d,"pointer-events":"stroke"});
   hit.style.cursor="crosshair";hit.onclick=clickLine;hit.onmouseenter=path.onmouseenter;s.appendChild(hit)}
  if(on&&(t.rad||PUB)){const RX=r=>r/(111.32*Math.cos(.389))*(W/(lo1-lo0)), RY=r=>r/110.57*(H/(la1-la0));

   MC={t:t,X:X,Y:Y,RX:RX,RY:RY,W:W,H:H}}
  const hOf=i=>t.wf?t.wf[i][0]:labH(t.pts[i][3]);
  if(top||on)t.pts.forEach((p,i)=>{if(i%2)return;
    const c=el("circle",{cx:X(p[0]),cy:Y(p[1]),r:3.2,fill:sq?SIGC[sigAt(t,labH(p[3]),SQ)]:PUB?"#555":CLSC[clsOf(p[2])],stroke:"#222","stroke-width":.6});
    c.style.cursor="pointer";
    c.onclick=ev=>{ev.stopPropagation();if(moved)return;const h=hOf(i);sel=t.m;selH=(selH!==null&&Math.abs(selH-h)<1e-6)?null:h;drawMap();chart()};
    c.onmouseenter=()=>$("#maphint").innerHTML=`${memLab(t.m)} at <b>${hkL(p[3])}</b>: ${""}${Math.round(dist(p[0],p[1]))} km from Hong Kong${sq?` · expected signal: <b>${SIGN[sigAt(t,labH(p[3]),SQ)]}</b>`:""}. Click the dot to mark this time below.`;
    s.appendChild(c)});
  if(top||on){const L=t.pts[t.pts.length-1];
   const ex=el("path",{d:`M${X(L[0])-5} ${Y(L[1])-5}L${X(L[0])+5} ${Y(L[1])+5}M${X(L[0])+5} ${Y(L[1])-5}L${X(L[0])-5} ${Y(L[1])+5}`,
     stroke:"#111","stroke-width":1.8,fill:"none"});
   ex.onmouseenter=()=>$("#maphint").innerHTML=`${memLab(t.m)}: the model stops tracking this storm at <b>${hkL(L[3])}</b>, ${Math.round(dist(L[0],L[1]))} km from Hong Kong${"."}`;
   s.appendChild(ex);}
 });
if(false&&!byI&&W>=820){const lx=W-222, items=[[1,"No. 1"],[3,"No. 3"],[8,"No. 8"],[9,"No. 9"],[10,"No. 10"],[0,"none"]];
  s.appendChild(el("rect",{x:lx-8,y:8,width:222,height:18*items.length+26,rx:0,fill:"#fff",opacity:.9,stroke:"#999","stroke-width":.6,"pointer-events":"none"}));
  const hd=el("text",{x:lx,y:24,fill:"#111","font-size":11,"font-weight":600,"pointer-events":"none"});hd.textContent=BASIC?"signal expected along each path":"signal along each track";s.appendChild(hd);
  items.forEach(([k,lab],i)=>{const yy=42+18*i; s.appendChild(el("line",{x1:lx,x2:lx+26,y1:yy-4,y2:yy-4,stroke:SIGC[k],"stroke-width":3.4,"pointer-events":"none"}));
   const tx=el("text",{x:lx+34,y:yy,fill:"#111","font-size":11,"pointer-events":"none"});tx.textContent=lab;s.appendChild(tx)})}
 const TRU=truthNow();
 if(TRU&&TRU.track&&TRU.track.length){const dd=TRU.track.map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join(" ");
  if(BT) s.appendChild(el("rect",{x:0,y:0,width:W,height:H,fill:"#fff",opacity:.62,"pointer-events":"none"}));
  s.appendChild(el("path",{fill:"none",stroke:"#fff","stroke-width":BT?7:5,d:dd,opacity:.8,"pointer-events":"none"}));
  if(!BT) s.appendChild(el("path",{fill:"none",stroke:"#000","stroke-width":2.4,"stroke-dasharray":"7 4",d:dd,"pointer-events":"none"}));
  else TRU.track.slice(0,-1).forEach((p,i)=>{const q=TRU.track[i+1], g=sigIn(TRU,isoH(p[3]),isoH(q[3]));
   s.appendChild(el("line",{x1:X(p[0]),y1:Y(p[1]),x2:X(q[0]),y2:Y(q[1]),stroke:SIGC[g]||SIGC[0],"stroke-width":4,"stroke-linecap":"round","pointer-events":"none"}))});
  TRU.track.forEach(p=>s.appendChild(el("circle",{cx:X(p[0]),cy:Y(p[1]),r:2.4,fill:"#000","pointer-events":"none"})));
  const lg=el("rect",{x:8,y:sel!==null||BT?60:8,width:330,height:22,rx:0,fill:"#fff",opacity:.9,stroke:"#999","stroke-width":.6,"data-btlg":1});s.appendChild(lg);
  const lt=el("text",{x:16,y:sel!==null||BT?75:23,fill:"#000","font-size":11.5,"font-weight":600});lt.textContent=BT?"HKO best track, coloured by the signal HKO had up":`Dashed line, ${TRU.source.split(" (")[0]}`;s.appendChild(lt);
  const hasC=TRU.track.some(p=>p[5]>0), lc=hasC?el("text",{x:16,y:(sel!==null||BT?75:23)+16,fill:"#000","font-size":W<500?10.5:11.5}):null;
  if(lc){lc.textContent="Circles show gale (green), storm (orange) and hurricane (red) winds"; s.appendChild(lc); lg.setAttribute("height",38)}
  try{lg.setAttribute("width",Math.min(W-16,Math.max(lt.getComputedTextLength(),lc?lc.getComputedTextLength():0)+18))}catch(e){}
  OXY={X:X,Y:Y,W:W,H:H,RX:r=>r/(111.32*Math.cos(.389))*(W/(lo1-lo0)),RY:r=>r/110.57*(H/(la1-la0))}; OG=el("g",{"pointer-events":"none"}); s.appendChild(OG); drawObs()}
 else{OG=null; OXY=null}
 if(BT)$("#maphint").textContent="Press Play to follow the storm along HKO's best track. Click any path to go back to the forecast.";
 stationDots(s,X,Y,lo1-lo0);
 if(lo1-lo0>=5){
  s.appendChild(el("circle",{cx:hx,cy:hy,r:6,fill:"#f2c200",stroke:"#333","stroke-width":1.2}));
  const t=el("text",{x:hx+9,y:hy+4,fill:"#111","font-size":12,"font-weight":600,"text-anchor":"start"});t.textContent="Hong Kong";s.appendChild(t)}
 if(MIX&&sel!==null)$("#maphint").textContent=`ECMWF physics (IFS) path: ${memLab(sel,1)}${MIX.cyc===cyc?"":", its run of "+fmtc(cyc)}. The chances on this page stay Google DeepMind's.`;
 
 MG=el("g",{"pointer-events":"none"});s.appendChild(MG);drawMoment();syncPlayer();
 AXY={X:X,Y:Y,W:W,H:H,only:only}; AG=el("g",{"pointer-events":"none"}); s.appendChild(AG); drawAll();
}
