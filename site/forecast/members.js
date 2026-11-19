const WI_FAR=14;
function wiEnsemble(){
 const M=TR.tracks.filter(x=>!(x.m===52&&(ens==="ifsens"||ens==="tigge"))), W=M.map(x=>new Map((x.wix||[]).map(([h,v])=>[Math.round(h),v])));
 let h0=Infinity,h1=-Infinity; W.forEach(m=>m.forEach((v,h)=>{if(h<h0)h0=h;if(h>h1)h1=h}));
 if(!isFinite(h0)) return null; const rows=[];
 for(let h=h0;h<=h1;h++){const v=W.map(m=>m.has(h)?m.get(h):WI_FAR).sort((a,b)=>a-b), n=v.length, q=p=>v[Math.round(p*(n-1))];
  rows.push({h, mean:v.reduce((a,b)=>a+b,0)/n, lo:q(.1), hi:q(.9), near:W.filter(m=>m.has(h)).length})}
 return {n:M.length, rows};
}
const memLab=(m,cap)=>m===52&&(ens==="ifsens"||ens==="tigge")?(cap?"Deterministic run":"the deterministic run"):m===51&&ens==="aifsens"?(cap?"Control run":"the control run"):`${cap?"Member":"member"} ${m}`;
const medM=()=>{const pk={}; TR.tracks.forEach(t=>{const v=t.wix&&t.wix.length?Math.max(...t.wix.map(w=>w[1])):WI_FAR; pk[t.m]=Math.max(pk[t.m]??-1,v)});
 const a=Object.entries(pk).map(([m,v])=>[+m,v]).sort((x,y)=>x[1]-y[1]||x[0]-y[0]); return a.length?a[Math.floor((a.length-1)/2)][0]:TR.top};
const DEFM=()=>{if(!TR)return null;const has=m=>TR.tracks.some(t=>t.m===m);return (ens==="ifsens"||ens==="tigge")&&has(52)?52:ens==="aifsens"&&has(51)?51:ens==="deepmind"?medM():TR.top};
const defTag=m=>!TR?"":ens==="deepmind"?(m===DEFM()?" (median wind index)":""):(m===TR.top?" (most threatening)":"");
const tierOf=t=>(t.p10||0)>=.4?[10,t.p10]:t.t9===9?[9,t.p10hi||t.p10||0]:(t.p8||0)>=.3?[8,t.p8]:(t.p3||0)>=.3?[3,t.p3]:[0,Math.max(t.p3||0,t.p8||0)];
const TIERC={0:"#b9b9b9",3:"#d98c1a",8:"#cc2255",9:"#7f0000",10:"#54278f"};
const truthNow=()=>{if(!window.HKTRUTH) return null; const cs=casesOf(cyc).filter(c=>window.HKTRUTH[c]); if(!cs.length) return null;
 const t=cs.length>1&&TR?TR.tracks.find(x=>x.m===(sel??DEFM())):null; if(!t) return window.HKTRUTH[cs[0]];
 let best=cs[0],bd=Infinity;
 for(const c of cs){let sm=0,n=0; t.pts.forEach(p=>{const q=truthAt(window.HKTRUTH[c],labH(p[3])); if(q){sm+=Math.hypot((p[0]-q.lon)*0.92,p[1]-q.lat);n++}});
  const m=n?sm/n:Infinity; if(m<bd){bd=m;best=c}}
 return window.HKTRUTH[best]};
const isoH=z=>(Date.parse(z+":00Z")-T0())/36e5;
function truthAt(tr,h){const k=tr.track; if(!k||!k.length) return null; const th=k.map(p=>isoH(p[3]));
 if(h<th[0]||h>th[th.length-1]) return null; let i=0; while(i<th.length-2&&h>th[i+1]) i++;
 const j=Math.min(i+1,k.length-1), f=j>i?(h-th[i])/Math.max(th[j]-th[i],1e-6):0, Lp=(a,b)=>a+(b-a)*f;
 const rec=k.map((p,n)=>n).filter(n=>k[n][5]>=0); let a=-1,b=-1; rec.forEach(n=>{if(th[n]<=h+1e-9)a=n; if(b<0&&th[n]>=h-1e-9)b=n});
 const R_=(c)=>a<0||b<0?-1:(a===b?k[a][c]:k[a][c]+(k[b][c]-k[a][c])*(h-th[a])/Math.max(th[b]-th[a],1e-6));
 return {lon:Lp(k[i][0],k[j][0]),lat:Lp(k[i][1],k[j][1]),v:Lp(k[i][2],k[j][2]),strong:R_(4),gale:R_(5),storm:R_(6),hur:R_(7)}}
const sigIn=(tr,h0,h1)=>{let m=0;(tr.signals||[]).forEach(([a,b,g])=>{if(isoH(a)<h1&&isoH(b)>h0)m=Math.max(m,g)});return m};
const labOfH=h=>{const d=new Date(T0()+Math.round(h)*36e5),z=n=>String(n).padStart(2,"0");return `${z(d.getUTCDate())} ${z(d.getUTCHours())}`};
const WIREF=[["Mangkhut",2018,98,1],["Hato",2017,78,1],["Ragasa",2025,77,0],["Wipha",2025,70,0],["Noul",2026,55,0]];
const WIOLD="† HKCOC's published peak (older index)";
const WIMARK={1:["†",WIOLD,"HKCOC's published peak, older index"]};
WIREF.push(["Ellen",1983,109,2],["Hope",1979,97,2],["York",1999,93,2]); WIMARK[2]=["*","* estimated from the storm's 8-station average (no wind index record before 2003)","estimated from its 8-station average, no wind index record before 2003"];
const wiRefs=()=>{const cs=casesOf(cyc); return WIREF.filter(r=>r[3]===2||!cs.includes(`${r[0]} ${r[1]}`))};
const wiTint=v=>(.016+.017*Math.min(9,Math.floor(v/10))).toFixed(3);
const wiRefTxt=r=>`${r[0]} ${r[1]} (${r[2]})`;
const wiCmp=v=>{const R=wiRefs().slice().sort((a,b)=>a[2]-b[2]), u=Math.round(v); if(!R.length)return "";
 const near=R.filter(r=>Math.abs(u-r[2])<=2); if(near.length)return `close to ${near.map(wiRefTxt).join(" and ")}`;
 const lo=R.filter(r=>r[2]<u).pop(), hi=R.find(r=>r[2]>u); return !lo?`below ${wiRefTxt(hi)}`:!hi?`above ${wiRefTxt(lo)}`:`between ${wiRefTxt(lo)} and ${wiRefTxt(hi)}`};
const spreadLab=(a,gap,lo,hi)=>{a.sort((x,y)=>x.c-y.c); a.forEach(o=>o.p=o.c);
 for(let it=0;it<80;it++){let mv=false;
  for(let i=0;i+1<a.length;i++){const need=(a[i].w+a[i+1].w)/2+gap, d=a[i+1].p-a[i].p; if(d<need-.01){a[i].p-=(need-d)/2; a[i+1].p+=(need-d)/2; mv=true}}
  a.forEach(o=>{o.p=Math.max(lo+o.w/2,Math.min(hi-o.w/2,o.p))}); if(!mv)break}
 return a};
const wiRefLab=(r,yr,fs,attrs)=>{const tx=el("text",Object.assign({"font-size":fs,fill:"var(--ink)"},attrs)), n=el("tspan",{"font-weight":600}); n.textContent=r[0]; tx.appendChild(n);
 if(yr||r[3]){const y=el("tspan",{fill:"var(--mut)"}); y.textContent=(yr?" "+r[1]:"")+(r[3]?WIMARK[r[3]][0]:""); tx.appendChild(y)}
 const t=el("title"); t.textContent=`${r[0]} ${r[1]}: ${r[2]} km/h`+(r[3]?" ("+WIMARK[r[3]][2]+")":""); tx.appendChild(t); return tx};
function wiRefLines(s,L,x1,y,mx,W,H,NARROW){const R=wiRefs().filter(r=>r[2]<=mx); if(!R.length)return;
 const fs=NARROW?10:10.5, a=spreadLab(R.map(r=>({r,c:y(r[2]),w:fs+1.5})),0,16,y(0));
 a.forEach(({r,p})=>{const yy=y(r[2]).toFixed(1);
  s.appendChild(el("line",{x1:L,x2:x1,y1:yy,y2:yy,stroke:"var(--ink)","stroke-opacity":.38,"stroke-width":1}));
  s.appendChild(el("path",{d:`M${x1} ${yy} L${x1+4} ${yy} L${x1+9} ${p.toFixed(1)}`,fill:"none",stroke:"var(--ink)","stroke-opacity":.38,"stroke-width":1}));
  s.appendChild(wiRefLab(r,true,fs,{x:x1+11,y:(p+fs*.36).toFixed(1)}))});
 if(R.some(r=>r[3])){const f=el("text",{x:W-8,y:H-2,"font-size":9.5,fill:"var(--mut)","text-anchor":"end"}); f.textContent=[...new Set(R.filter(r=>r[3]).map(r=>r[3]))].map(k=>WIMARK[k][1]).join(" · "); s.appendChild(f)}}
const WIR8=[-8.1599,1.05516];
function wiC2(){if(!TR||TR._c2)return; TR._c2=1;
 TR.tracks.forEach(t=>{if(!t.wix||!t.wix.length)return; let v8; try{v8=r8val(t)}catch(e){return} if(!(v8>=55))return;
  const pk=Math.max(...t.wix.map(w=>w[1])); if(!(pk>0))return; const k=(WIR8[0]+WIR8[1]*v8)/pk;
  t.wix0=t.wix; t.wix=t.wix.map(([hh,v])=>[hh,Math.round(v*(1+(k-1)*Math.pow(v/pk,4))*10)/10])})}
const wiAt=(t,h)=>{const w=t.wix; if(!w||!w.length||h<w[0][0]-1e-6||h>w[w.length-1][0]+1e-6) return null;
 let i=0; while(i<w.length-2&&h>w[i+1][0]) i++; const j=Math.min(i+1,w.length-1);
 if(j>i&&w[j][0]-w[i][0]>1.5) return null;
 const f=j>i?(h-w[i][0])/(w[j][0]-w[i][0]):0; return w[i][1]+(w[j][1]-w[i][1])*Math.max(0,Math.min(1,f))};
function stateAt(t,h){const w=t.wf,P=t.pts; if(!w||!w.length) return null;
 let i=0; while(i<w.length-2&&h>w[i+1][0]) i++;
 const j=Math.min(i+1,w.length-1), f=j>i?Math.max(0,Math.min(1,(h-w[i][0])/Math.max(w[j][0]-w[i][0],1e-6))):0, L=(a,b)=>a+(b-a)*f;
 const v=L(w[i][1],w[j][1]), on=(k,thr)=>v>=thr-0.5?L(w[i][k],w[j][k]):0;
 return {h:L(w[i][0],w[j][0]),lon:L(P[i][0],P[j][0]),lat:L(P[i][1],P[j][1]),v:v,strong:on(2,22),gale:on(3,34),storm:on(4,48),hur:on(5,64)}}
let MC=null, MG=null, playing=false, playM=null, lastTs=0, lastChart=0;
const momentH=t=>selH!==null?selH:(t.wf?caH(t.ca[1]):null);
function momentState(t){
 if(t.wf) return stateAt(t,momentH(t));
 const jc=t.pts.reduce((b,p,i)=>dist(p[0],p[1])<dist(t.pts[b][0],t.pts[b][1])?i:b,0);
 const mi=selH!==null?t.pts.reduce((b,p,i)=>Math.abs(labH(p[3])-selH)<Math.abs(labH(t.pts[b][3])-selH)?i:b,0):jc, P=t.pts[mi];
 return {h:labH(P[3]),lon:P[0],lat:P[1],v:P[2],strong:t.rad22?t.rad22[mi]||0:0,gale:t.rad[mi]||0,storm:t.rad50?t.rad50[mi]||0:0,hur:t.rad64?t.rad64[mi]||0:0}}
function drawMoment(){
 if(!MC||!MG) return; while(MG.firstChild) MG.removeChild(MG.firstChild);
 const {t,X,Y,RX,RY,W,H}=MC, S=momentState(t), add=e=>MG.appendChild(e), cx=X(S.lon), cy=Y(S.lat), dk=dist(S.lon,S.lat), sgx=sigAt(t,S.h);
 const lines=[[`${fmtH(S.h)}${selH===null?" (closest)":""}: ${Math.round(dk)} km from HK`,null]];
 if(sgx>=1) lines.push([`expected signal: ${SIGN[sgx]}`,SIGC[sgx]]);
 const wiv=wiAt(t,S.h); if(wiv!==null) lines.push([`wind index at HK: about ${Math.round(wiv)} km/h`,null]);
 const TRU=truthNow(), A=TRU?truthAt(TRU,S.h):null;
 if(A){obsDraw(add,X,Y,RX,RY,A,false);
  const sg=sigIn(TRU,S.h,S.h+1e-6); lines.push([`actual: ${Math.round(dist(A.lon,A.lat))} km from HK${sg?`, HKO No. ${sg} up`:", no HKO signal"}`,null]);
  lines.push([`HKO best track: ${OBSC[clsOf(A.v)]}, about ${obsK(A.v)} km/h`,null])}
 const bw=Math.min(W-16,Math.max(A?300:262,...lines.map(([x,c])=>6.6*x.length+(c?40:16)))),bh=16*lines.length+10,bx=W-bw-8,by=H-bh-8;
 add(el("rect",{x:bx,y:by,width:bw,height:bh,rx:0,fill:"#fff",opacity:.92,stroke:"#999","stroke-width":.7}));
 lines.forEach(([txt,col],k)=>{const yy=by+18+16*k;
  if(col)add(el("line",{x1:bx+8,x2:bx+24,y1:yy-4,y2:yy-4,stroke:col,"stroke-width":4}));
  const tx=el("text",{x:bx+(col?30:8),y:yy,fill:"#111","font-size":11.5,"font-weight":/^(expected|wind index|actual:)/.test(txt)?600:400});tx.textContent=txt;add(tx)});
 add(el("circle",{cx:cx,cy:cy,r:5.5,fill:sgx>=1?SIGC[sgx]:"#555",stroke:"#111","stroke-width":1.8}));
 const lx=cx+9, ly=cy-6, tt=el("text",{x:lx+2,y:ly,fill:"#111","font-size":11});
 add(el("rect",{x:lx-3,y:ly-13,width:168,height:20,rx:0,fill:"#fff",opacity:.9,stroke:"#222","stroke-width":.7}));
 tt.textContent=`${Math.round(dk)} km from HK, ${fmtH(S.h)}`; add(tt);
 $("#ptime").textContent=`${fmtH(S.h)}${selH===null?" (closest approach)":""} · ${Math.round(dk)} km from Hong Kong${sgx>=1?` · expected ${SIGN[sgx]}`:""}${wiv!==null?` · wind index ${Math.round(wiv)}`:""}`;
 if(t.wf) $("#slider").value=S.h}
function syncPlayer(){const t=MC&&MC.t, pl=$("#player");
 if(BT){btSync(); return}
 playLabel();
 if(!t||!t.wf){pl.style.display="none"; if(playing) stopPlay(); return}
 if(playing&&t.m!==playM) stopPlay();
 pl.style.display=""; const sl=$("#slider"); sl.min=t.wf[0][0]; sl.max=t.wf[t.wf.length-1][0]; sl.value=momentH(t)}
function stopPlay(){playing=false; $("#play").textContent="Play"; playLabel()}
function step(){if(!playing) return; const t=MC&&MC.t; if(!t||!t.wf||t.m!==playM){stopPlay();return}
 const b=t.wf[t.wf.length-1][0], ts=performance.now();
 if(lastTs) selH=Math.min(b,selH+(+$("#speed").value)*(ts-lastTs)/1000); lastTs=ts;
 drawMoment(); if(ts-lastChart>120){chart();lastChart=ts}
 if(selH>=b-1e-6){stopPlay();chart();return} setTimeout(step,40)}
$("#play").onclick=()=>{if(playing){stopPlay();chart();return}
 const t=MC&&MC.t; if(!t||!t.wf) return; const a=t.wf[0][0], b=t.wf[t.wf.length-1][0];
 if(selH===null||selH>=b-1e-6) selH=a;
 playing=true; playM=t.m; lastTs=0; lastChart=0; $("#play").textContent="Pause"; playLabel(); step()};
$("#slider").oninput=e=>{selH=+e.target.value; drawMoment(); chart()};
function refM(){if(!TR)return null; const has=m=>TR.tracks.some(t=>t.m===m); return (ens==="ifsens"||ens==="tigge")&&has(52)?52:ens==="aifsens"&&has(51)?51:null}
let allH=null, allPlaying=false, allTs=0, allStart=0, allEnd=0, AG=null, AXY=null; const ALLSPD=BASIC?48:24;
function drawAll(){drawObs(); if(!AG||!AXY)return; while(AG.firstChild)AG.removeChild(AG.firstChild); if(allH===null||!TR)return;
 const {X,Y,W,H,only}=AXY, byI=false, det=t=>t.m===52&&(ens==="ifsens"||ens==="tigge");
 TR.tracks.filter(t=>t.wf&&t.pts&&t.wf.length===t.pts.length&&t.wf.length>1&&(!only||t.ca[0]<150)&&(det(t)||t.m===DEFM()||!weakT(t))).sort((a,b)=>det(a)-det(b)).forEach(t=>{const w=t.wf;
  if(allH<w[0][0]-1e-6||allH>w[w.length-1][0]+1e-6)return;
  let i=0; while(i<w.length-2&&w[i+1][0]<allH)i++;
  const f=w[i+1][0]>w[i][0]?Math.min(1,Math.max(0,(allH-w[i][0])/(w[i+1][0]-w[i][0]))):0, a=t.pts[i], b=t.pts[i+1];
  const lon=a[0]+f*(b[0]-a[0]), lat=a[1]+f*(b[1]-a[1]), v=a[2]+f*(b[2]-a[2]);
  AG.appendChild(el("circle",{cx:X(lon),cy:Y(lat),r:det(t)?6:4.2,fill:det(t)?"#000":byI?CLSC[clsOf(v)]:SIGC[sigAt(t,allH)],stroke:"#fff","stroke-width":1.3}))});
 const txt=`all members · ${fmtH(allH)} (+${Math.round(allH)} h)`, bw=8.2*txt.length+16;
 AG.appendChild(el("rect",{x:W/2-bw/2,y:H-32,width:bw,height:24,rx:0,fill:"#fff",opacity:.92,stroke:"#999","stroke-width":.7}));
 const tx=el("text",{x:W/2,y:H-15,fill:"#111","font-size":13,"font-weight":700,"text-anchor":"middle"}); tx.textContent=txt; AG.appendChild(tx)}
function allStop(){allPlaying=false; playLabel()}
function allStep(){if(!allPlaying)return; const ts=performance.now();
 if(allTs) allH=Math.min(allEnd,allH+ALLSPD*(ts-allTs)/1000); allTs=ts; drawAll();
 if(allH>=allEnd-1e-6){allStop();return} setTimeout(allStep,40)}
try{new ResizeObserver(()=>{const w=$("#map").getBoundingClientRect().width; if(TR&&MAPW&&Math.abs(w-MAPW)>24)drawMap()}).observe(document.querySelector(".mapwrap"))}catch(e){}
$("#allPlay").onclick=()=>{if(allPlaying){allStop();return} if(!TR)return;
 const hs=TR.tracks.filter(t=>t.wf&&t.wf.length>1).map(t=>[t.wf[0][0],t.wf[t.wf.length-1][0]]); if(!hs.length)return;
 allStart=Math.min(...hs.map(x=>x[0])); allEnd=Math.max(...hs.map(x=>x[1]));
 if(allH===null||allH>=allEnd-1e-6) allH=allStart;
 if(sel!==null){sel=null;selH=null;const h0=allH;drawMap();chart();allH=h0}
 allPlaying=true; allTs=0; $("#allPlay").textContent="Pause"; allStep()};
