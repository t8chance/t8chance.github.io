
const SIGLV=[0,1,3,8,9,10], SIGN={0:"none",1:"No. 1",3:"No. 3",8:"No. 8",9:"No. 9",10:"No. 10"},
      SIGC={0:"#bbb",1:"#666",3:"#d98c1a",8:"#cc2255",9:"#7f0000",10:"#54278f"},
      SIGV={0:"#bbb",1:"#666",3:"var(--no3)",8:"var(--no8)",9:"var(--no9)",10:"var(--no10)"};
const SQC=new WeakMap(), sqOf=t=>{if(!SQC.has(t))SQC.set(t,memberSignal(t)); return SQC.get(t)};
function sigAt(t,h,SQ){SQ=SQ||sqOf(t); if(!SQ.length) return 0; let v=0;
 for(const p of SQ){if(labH(p[0])<=h+1e-6) v=p[1]; else break} return v}
function memberSignal(t){
 const m3=new Map(t.s3||[]),m8=new Map(t.s8||[]),m10=new Map(t.s10||[]);
 const keys=((t.s3&&t.s3.length?t.s3:t.s8)||[]).map(p=>p[0]); if(!keys.length) return [];
 const pd=new Map(t.pts.map(p=>[String(p[3]).replace("/"," "),dist(p[0],p[1])])); let last=9999;
 const out=keys.map(k=>{const kk=String(k).replace("/"," "); if(pd.has(kk)) last=pd.get(kk);
   const p3=m3.get(k)||0,p8=m8.get(k)||0,p10=m10.get(k)||0;
   return [k, p10>=.4?10:p8>=.3?8:p3>=.3?3:(last<=800?1:0), {3:p3,8:p8,10:p10}]});
 const lv=out.map(p=>p[1]); let lowered=false;
 for(let i=1;i<lv.length;i++){const raw=lv[i], cur=lv[i-1];
   if(raw<cur){if(cur>=3) lowered=true; continue}
   if(raw>cur&&lowered&&raw>=3&&!((out[i][2][raw]||0)>0.8)) lv[i]=cur}
 let hold3=0;
 for(let i=1;i<lv.length;i++){
   if(lv[i-1]===10&&lv[i]<8) lv[i]=8;
   if((lv[i-1]===8||lv[i-1]===9)&&lv[i]<3){lv[i]=3; hold3=1}
   else if(hold3>0&&lv[i]<3){lv[i]=3; hold3--}
   else if(lv[i]!==3) hold3=0;
 }
 lv.forEach((v,i)=>out[i][1]=v);
 for(let i=1;i<out.length;i++) if(out[i][1]===10&&out[i-1][1]<10) out[i-1][1]=9;
 return out;
}
addEventListener("resize",()=>{clearTimeout(window._chr);window._chr=setTimeout(()=>{if(TR)chart()},200)});
function wiDist(s){
 const PW=Math.round((s.parentNode&&s.parentNode.clientWidth)||1000), NARROW=PW<700, W=NARROW?Math.max(320,PW):1000,H=NARROW?260:300,L=NARROW?40:54,B=40,R=NARROW?16:24;
 s.setAttribute("viewBox",`0 0 ${W} ${H}`);
 const M=TR.tracks.filter(x=>!(x.m===52&&(ens==="ifsens"||ens==="tigge")));
 if(!M.some(x=>x.wix)){$("#chead").textContent="Peak Hong Kong wind index";$("#cnote").textContent="no wind index for this run (runs exported before it was added)";return}
 const J=a=>a.filter(Boolean).map(s=>`<span class="kv">${s}</span>`).join(""), pk=M.map(x=>x.wix&&x.wix.length?Math.max(...x.wix.map(w=>w[1])):WI_FAR);
 if(!pk.length){$("#cnote").textContent="";return}
 const dm=TR.tracks.find(x=>x.m===DEFM()), dpk=dm&&dm.wix&&dm.wix.length?Math.max(...dm.wix.map(w=>w[1])):null;
 const TRU=truthNow(), obs=TRU&&TRU.wi&&TRU.wi.length?Math.max(...TRU.wi.map(w=>w[1])):null;
 const top=Math.max(100,...WIREF.map(r=>Math.ceil((r[2]+1)/10)*10),Math.ceil((Math.max(...pk,dpk||0,obs||0)+5)/10)*10), bw=5, nb=top/bw, cnt=new Array(nb).fill(0);
 pk.forEach(v=>cnt[Math.min(nb-1,Math.floor(v/bw))]++); const cm=Math.max(...cnt,1);
 const X=v=>L+(W-L-R)*v/top, Y=c=>H-B-(H-B-26)*c/cm;
 for(let v=0;v<top;v+=10) s.appendChild(el("rect",{x:X(v)+.5,y:20,width:Math.max(0,X(v+10)-X(v)-1),height:H-B-20,fill:"var(--wib)","fill-opacity":wiTint(v)}));
 const RF=wiRefs().filter(r=>r[2]<=top);
 spreadLab(RF.map(r=>({r,c:X(r[2]),w:(NARROW?r[0].length*5.3:(r[0].length+5)*5.6)+(r[3]?5:0)})),6,L,W-R).forEach(({r,p})=>{const xx=X(r[2]).toFixed(1);
  s.appendChild(el("line",{x1:xx,x2:xx,y1:20,y2:H-B,stroke:"var(--ink)","stroke-opacity":.38,"stroke-width":1}));
  s.appendChild(el("path",{d:`M${p.toFixed(1)} 13 L${xx} 20`,fill:"none",stroke:"var(--ink)","stroke-opacity":.38,"stroke-width":1}));
  s.appendChild(wiRefLab(r,!NARROW,NARROW?9.5:10,{x:p.toFixed(1),y:10,"text-anchor":"middle"}))});
 const binOf=v=>Math.min(nb-1,Math.floor(v/bw));
 cnt.forEach((c,i)=>{if(!c)return; const on=BIN&&BIN.i===i, r=el("rect",{x:X(i*bw)+1,y:Y(c),width:Math.max(1,X(bw)-X(0)-2),height:H-B-Y(c),fill:"var(--wil)",stroke:"var(--ink)","stroke-opacity":on?1:.25,"stroke-width":on?2.5:1,opacity:BIN&&!on?.4:1});
  r.style.cursor="pointer"; const tt=el("title"); tt.textContent=`${c} member${c>1?"s":""} at ${i*bw}–${(i+1)*bw} km/h`; r.appendChild(tt);
  r.onclick=()=>{BIN=on?null:{i,lo:i*bw,hi:(i+1)*bw,ms:new Set(M.filter((x,k)=>binOf(pk[k])===i).map(x=>x.m))}; sel=null; selH=null; drawMap(); chart()};
  s.appendChild(r)});
 for(let v=0;v<=top;v+=NARROW?20:10){const tx=el("text",{x:X(v),y:H-B+16,fill:"var(--mut)","font-size":11,"text-anchor":"middle"});tx.textContent=v;s.appendChild(tx)}
 const yl=el("text",{x:(L+W-R)/2,y:H-6,fill:"var(--mut)","font-size":11,"text-anchor":"middle"});yl.textContent="peak wind index (km/h)";s.appendChild(yl);
 [0,Math.round(cm/2),cm].filter((v,i,a)=>a.indexOf(v)===i).forEach(c=>{const tx=el("text",{x:L-8,y:Y(c)+4,fill:"var(--mut)","font-size":11,"text-anchor":"end"});tx.textContent=c;s.appendChild(tx)});
 const yl2=el("text",{x:12,y:(H-B+26)/2,fill:"var(--mut)","font-size":11,"text-anchor":"middle",transform:`rotate(-90 12 ${(H-B+26)/2})`});yl2.textContent="members";s.appendChild(yl2);
 const mark=(v,lab,dash,row)=>{s.appendChild(el("line",{x1:X(v),x2:X(v),y1:22,y2:H-B,stroke:"var(--ink)","stroke-width":dash?2.4:1.6,"stroke-dasharray":dash||""}));
  const tx=el("text",{x:X(v)+5,y:36+row*15,fill:"var(--ink)","font-size":11,"font-weight":600});tx.textContent=lab;s.appendChild(tx);
  try{if(X(v)+5+tx.getBBox().width>W-R){tx.setAttribute("x",X(v)-5);tx.setAttribute("text-anchor","end")}}catch(e){}};
 if(dpk!==null) mark(dpk,memLab(DEFM(),1),"",0); if(obs!==null) mark(obs,"HKO observed","6 3",dpk!==null?1:0);
 const vm=sel??DEFM(), vt=vm!==DEFM()?TR.tracks.find(x=>x.m===vm):null, vpk=vt?(vt.wix&&vt.wix.length?Math.max(...vt.wix.map(w=>w[1])):WI_FAR):null;
 if(vpk!==null){const i=Math.min(nb-1,Math.floor(vpk/bw)), c=Math.max(cnt[i],1), x0=X(i*bw), x1=X((i+1)*bw), xm=(x0+x1)/2, row=(dpk!==null)+(obs!==null);
  s.appendChild(el("rect",{x:x0-1,y:Y(c)-3,width:x1-x0+2,height:H-B-Y(c)+3,fill:"none",stroke:"var(--ink)","stroke-width":2.2}));
  s.appendChild(el("path",{d:`M${xm-5} ${Y(c)-12} L${xm+5} ${Y(c)-12} L${xm} ${Y(c)-5} Z`,fill:"var(--ink)"}));
  const tx=el("text",{x:xm+5,y:36+row*15,fill:"var(--ink)","font-size":11,"font-weight":600});tx.textContent=memLab(vm,1);s.appendChild(tx);
  try{if(xm+5+tx.getBBox().width>W-R){tx.setAttribute("x",xm-5);tx.setAttribute("text-anchor","end")}}catch(e){}}
 const v=pk.slice().sort((a,b)=>a-b), q=p=>v[Math.round(p*(v.length-1))];
 $("#chead").textContent=`Peak Hong Kong wind index in each of the ${pk.length} members`;
 $("#cnote").innerHTML=J([`median <b>${Math.round(q(.5))} km/h</b>`,`10–90%: ${Math.round(q(.1))}–${Math.round(q(.9))} km/h`]
  .concat([BIN?`map: <b>${BIN.ms.size}</b> member${BIN.ms.size>1?"s":""} at ${BIN.lo}–${BIN.hi} km/h · click the bar again for all`:"click a bar to see its tracks"])
  .concat(vpk!==null?[`${memLab(vm,1)}: ${Math.round(vpk)} km/h`]:[]).concat(dpk!==null?[`${memLab(DEFM(),0).replace(/^the /,"")}: ${Math.round(dpk)} km/h`]:[]).concat(obs!==null?[`HKO observed: ${Math.round(obs)} km/h`]:[]).concat([...new Set(RF.filter(r=>r[3]).map(r=>r[3]))].map(k=>WIMARK[k][1])));
}
function chart(){
 const s=$("#chart"), sg=$("#stationchart");s.innerHTML="";sg.innerHTML="";
 if(BT){btChart();return}
 if(BASIC){if(!["signal","wi","sg","rk"].includes(tab)){tab="signal"; drawTabs(); tab="signal"} document.body.classList.toggle("bsel",sel!==null); document.body.classList.toggle("tab-wi",tab==="wi");
  if(sel===null){window._bsel=null; return}
  if(window._bsel!==sel){window._bsel=sel; setTimeout(()=>{try{$("#chead").scrollIntoView({behavior:"smooth",block:"nearest"})}catch(e){}},60)}}
 if(tab==="rk"){s.style.display="none"; sg.style.display=""; const t=stationTrack(); $("#cnote").textContent="";
  if(t&&(t.gst||!(t.gale!=null&&Math.round(t.gale)>=1))){$("#chead").textContent=BASIC?"Along this path: how it compares with past storms":`${memLab(t.m,1)}${defTag(t.m)} — storm ranking`; sg.innerHTML=rankView(t);
   sg.querySelectorAll("[data-rkgrp]").forEach(b=>b.onclick=()=>{RKGRP=b.dataset.rkgrp; chart()}); sg.querySelectorAll("[data-rkold]").forEach(b=>b.onclick=()=>{RKOLD=!RKOLD; chart()})}
  else {$("#chead").textContent="Storm ranking"; sg.innerHTML=`<p class="note">Station numbers are not ready for this run yet.</p>`}
  return}
 if(tab==="signal"){s.style.display="none"; sg.style.display=""; $("#cnote").textContent=""; const t=TR&&TR.tracks.find(x=>x.m===(sel??DEFM()));
  if(!t){$("#chead").textContent="Expected signal"; sg.innerHTML=""; return}
  $("#chead").textContent=BASIC?"Along this path: the signals expected":`${memLab(t.m,1)}${defTag(t.m)} — expected signal`; sg.innerHTML=sigTable(t); return}
 if(tab==="sg"){
  s.style.display="none"; sg.style.display="";
  const t=stationTrack();
  if(t){memberStationGuide(t); if(BASIC)$("#chead").textContent="Along this path: estimated wind at Hong Kong's reference stations"} else {$("#chead").textContent="Estimated wind";$("#cnote").textContent="no member for this run"}
  return;
 }
 s.style.display=""; sg.style.display="none"; if(!TR)return;
 if(BASIC){showWIMean=false; showWIDist=false}
 if(tab==="wi"&&showWIDist){wiDist(s);return}
 const t=TR.tracks.find(x=>x.m===(sel??DEFM())); if(!t){$("#cnote").textContent="";return}
 const PW=Math.round((s.parentNode&&s.parentNode.clientWidth)||1000), NARROW=PW<700;
 const W=NARROW?Math.max(320,PW):1000,H=NARROW?280:320,L=NARROW?44:54,B=40,R=tab==="wi"?(NARROW?86:108):64; s.setAttribute("viewBox",`0 0 ${W} ${H}`);
 const EW=tab==="wi"&&showWIMean?wiEnsemble():null;
 let series=EW?EW.rows.map(r=>[labOfH(r.h),r.mean]):tab==="signal"?memberSignal(t):tab==="wi"?(t.wix||[]).map(([h,v])=>[labOfH(h),v]):((tab==="p3"?t.s3:tab==="p8"?t.s8:t.s10)||[]);
 $("#chead").textContent=EW?`Ensemble mean of ${EW.n} members — Hong Kong wind index through time`:`${memLab(t.m,1)}${defTag(t.m)} — ${tab==="signal"?"expected signal":tab==="p3"?"chance of No. 3":tab==="p8"?"chance of No. 8":tab==="wi"?"Hong Kong wind index":"chance of No. 10"} through time`;
 if(BASIC)$("#chead").textContent="Along this path: how windy Hong Kong gets";
 if(!series.length){$("#cnote").textContent=BASIC&&tab==="wi"?"Along this path the storm stays more than 800 km from Hong Kong.":tab==="wi"?(t.wix?"this member's storm never comes within 800 km of Hong Kong, the range the wind index covers":"no wind index for this run (runs exported before it was added)"):"no values for this member in this run";return}
 if(NARROW&&!EW&&tab!=="wi"&&true){const on=memberSignal(t).filter(p=>p[1]>=1).map(p=>labH(p[0]));
  if(on.length){const a=Math.min(...on)-12, b=Math.max(...on)+15, k=series.filter(p=>{const h=labH(p[0]); return h>=a&&h<=b}); if(k.length>=2) series=k}}
 const hs=series.map((p,i)=>labH(p[0]));
 let mk=-1;
 if(selH!==null&&sel===t.m){for(let i=0;i<hs.length;i++){if(hs[i]<=selH+1e-6)mk=i;else break}
  if(selH>hs[hs.length-1]+(tab==="wi"?0:3)+1e-6) mk=-1}
 const markTxt=(txt,xm)=>{const lb=el("text",{x:Math.min(Math.max(xm,L+110),W-R-110),y:16,fill:"var(--ink)","font-size":11,"text-anchor":"middle","font-weight":600});
  lb.textContent=txt;s.appendChild(lb)};
 if(tab==="signal"){
  const ly=v=>H-B-(H-B-22)*SIGLV.indexOf(v)/(SIGLV.length-1), xs=i=>L+(W-L-R)*i/(series.length||1);
  SIGLV.forEach(v=>{s.appendChild(el("line",{x1:L,x2:W-R,y1:ly(v),y2:ly(v),stroke:"var(--line)"}));
   const tx=el("text",{x:6,y:ly(v)+4,fill:"var(--mut)","font-size":11});tx.textContent=SIGN[v];s.appendChild(tx)});
  series.forEach((p,i)=>{if(!p[1])return; s.appendChild(el("rect",{x:xs(i),y:ly(p[1]),width:Math.max(1,xs(i+1)-xs(i)),height:ly(0)-ly(p[1]),fill:SIGV[p[1]],opacity:.85}))});
  const step=Math.max(1,Math.round(series.length/(NARROW?4:7)));
  series.forEach((p,i)=>{if(i%step)return;const tx=el("text",{x:xs(i),y:H-14,fill:"var(--mut)","font-size":11,"text-anchor":"middle"});tx.textContent=NARROW?hkS(p[0]):hkL(p[0]);s.appendChild(tx)});
  const runs=[];series.forEach((p,i)=>{if(!runs.length||runs[runs.length-1].v!==p[1])runs.push({v:p[1],a:p[0],b:p[0]});else runs[runs.length-1].b=p[0]});
  const hkR=(a,b)=>{const x=hkL(a), y=hkL(b); return a===b?x:x.slice(0,-6)===y.slice(0,-6)?`${x}–${y.slice(-5)}`:`${x}–${y}`};
  const seq=runs.filter(r=>r.v>=1).map(r=>`<b style="color:${SIGV[r.v]}">${SIGN[r.v]}</b> ${hkR(r.a,r.b)}`).join(" → ");
  const TRU=truthNow();
  $("#cnote").innerHTML=(seq?`Sequence: ${seq}`:"no signal")+(t.other_driver?` · ⚠ also ${t.other_driver.storm} (dashed)`:"")+(TRU&&TRU.signals?" · black dashed = what HKO actually issued":"")+(t.wix&&t.wix.length?" · teal = wind index (km/h)":"");
  if(TRU&&TRU.signals){let dd="";series.forEach((p,i)=>{const dh=(i+1<hs.length?hs[i+1]-hs[i]:3)||3, g=sigIn(TRU,hs[i],hs[i]+dh);
     dd+=(i?"L":"M")+xs(i).toFixed(1)+" "+ly(g).toFixed(1)+"L"+xs(i+1).toFixed(1)+" "+ly(g).toFixed(1)});
   s.appendChild(el("path",{fill:"none",stroke:"var(--ink)","stroke-width":2.4,"stroke-dasharray":"6 3",d:dd}));}
  const xOfT=h=>{let i=0;while(i<hs.length-1&&h>=hs[i+1])i++;const dh=(i+1<hs.length?hs[i+1]-hs[i]:3)||3;return xs(i)+(xs(i+1)-xs(i))*Math.max(0,Math.min(1,(h-hs[i])/dh))};
  if(t.wix&&t.wix.length&&hs.length){
   const wmx=Math.max(80,Math.max(...t.wix.map(w=>w[1]))+10), wy=v=>H-B-(H-B-22)*v/wmx;
   [0,20,40,60,80,100].filter(v=>v<wmx).forEach(v=>{const tx=el("text",{x:W-R+6,y:wy(v)+4,fill:"var(--wil)","font-size":10});tx.textContent=v;s.appendChild(tx)});
   const yl2=el("text",{x:W-10,y:H/2,fill:"var(--wil)","font-size":11,"text-anchor":"middle",transform:`rotate(90 ${W-10} ${H/2})`});yl2.textContent="wind index (km/h)";s.appendChild(yl2);
   let d="",pen=false,prev=null;
   t.wix.forEach(([h,v])=>{if(h<hs[0]||h>hs[hs.length-1]+3){pen=false;return}
     if(prev!==null&&h-prev>1.5) pen=false; prev=h;
     d+=(pen?"L":"M")+xOfT(h).toFixed(1)+" "+wy(v).toFixed(1); pen=true});
   if(d) s.appendChild(el("path",{fill:"none",stroke:"var(--wil)","stroke-width":2.2,d:d}));}
  if(mk>=0){const dh=(mk+1<hs.length?hs[mk+1]-hs[mk]:3)||3, xm=xs(mk)+(xs(mk+1)-xs(mk))*Math.min(1,(selH-hs[mk])/dh);
   s.appendChild(el("line",{x1:xm,x2:xm,y1:22,y2:ly(0),stroke:"var(--ink)","stroke-dasharray":"4 3","stroke-width":1.4}));
   const wv=wiAt(t,selH); markTxt(`${fmtH(selH)}: ${SIGN[series[mk][1]]}`+(wv!==null?` · wind index ${Math.round(wv)}`:""),xm)}
  return;
 }
 const mx=tab==="wi"?Math.max(100,...WIREF.map(r=>Math.ceil((r[2]+1)/10)*10),Math.ceil((Math.max(...series.map(p=>p[1]),...(EW?EW.rows.map(r=>r.hi):[]))+5)/10)*10):1;
 const x=i=>L+(W-L-R)*i/(series.length-1||1), y=v=>H-B-(H-B-22)*v/mx;
if(tab==="wi"){
  for(let v=0;v<mx;v+=10){const hi=Math.min(v+10,mx);
   s.appendChild(el("rect",{x:L,y:y(hi)+.5,width:W-L-R,height:Math.max(0,y(v)-y(hi)-1),fill:"var(--wib)","fill-opacity":wiTint(v)}))}
  for(let v=0;v<=mx;v+=20){const tx=el("text",{x:L-6,y:y(v)+4,fill:"var(--mut)","font-size":11,"text-anchor":"end"});tx.textContent=v;s.appendChild(tx)}
  wiRefLines(s,L,W-R,y,mx,W,H,NARROW);
 } else {
  const thr=tab==="p10"?.4:.3;
  [0,thr,.5,1].forEach(v=>{s.appendChild(el("line",{x1:L,x2:W-R,y1:y(v),y2:y(v),stroke:"var(--line)","stroke-dasharray":v===thr?"5 4":""}));
   const tx=el("text",{x:L-6,y:y(v)+4,fill:"var(--mut)","font-size":11,"text-anchor":"end"});tx.textContent=v.toFixed(1);s.appendChild(tx)});
  const th=el("text",{x:W-R+6,y:y(thr)+4,fill:"var(--mut)","font-size":10});th.textContent=thr.toFixed(2);s.appendChild(th);
 }
 const col=tab==="wi"?"var(--wil)":(tab==="p3"?"var(--no3)":tab==="p8"?"var(--no8)":"var(--no10)");
 if(tab!=="wi")s.appendChild(el("path",{fill:col,opacity:.16,
   d:`M${L} ${y(0)} `+series.map((p,i)=>"L"+x(i).toFixed(1)+" "+y(p[1]).toFixed(1)).join(" ")+` L${x(series.length-1).toFixed(1)} ${y(0)} Z`}));
 if(EW){
  s.appendChild(el("path",{fill:col,opacity:.18,d:EW.rows.map((r,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(r.hi).toFixed(1)).join(" ")
    +" "+EW.rows.map((r,i)=>"L"+x(i).toFixed(1)+" "+y(r.lo).toFixed(1)).reverse().join(" ")+" Z"}));
  if(sel!==null&&t.wix&&t.wix.length){const h0=EW.rows[0].h;
   s.appendChild(el("path",{fill:"none",stroke:col,"stroke-width":1.2,opacity:.8,"stroke-dasharray":"3 2",
     d:t.wix.map(([h,v],i)=>(i?"L":"M")+x(Math.round(h)-h0).toFixed(1)+" "+y(v).toFixed(1)).join(" ")}))}
  const lg=el("text",{x:L+8,y:34,fill:col,"font-size":11,"font-weight":600});
  lg.textContent=`ensemble mean · shaded: 10–90% of members`+(sel!==null&&t.wix&&t.wix.length?` · dotted: ${memLab(t.m,1)}`:"");s.appendChild(lg)}
 s.appendChild(el("path",{fill:"none",stroke:col,"stroke-width":2.4,d:series.map((p,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(p[1]).toFixed(1)).join(" ")}));

 let whkPk=null;

 const step=Math.max(1,Math.round(series.length/(NARROW?4:7)));
 series.forEach((p,i)=>{if(i%step)return;const tx=el("text",{x:x(i),y:H-14,fill:"var(--mut)","font-size":11,"text-anchor":"middle"});
   tx.textContent=NARROW?hkS(p[0]):hkL(p[0]);s.appendChild(tx)});
 const yl=el("text",{x:12,y:H/2,fill:"var(--mut)","font-size":11,"text-anchor":"middle",transform:`rotate(-90 12 ${H/2})`});
 yl.textContent=tab==="wi"?"wind index (km/h)":"probability for this member";s.appendChild(yl);
 const TRU=truthNow();
 if(TRU&&hs.length>1){
  const xT=h=>{let i=0;while(i<hs.length-2&&h>hs[i+1])i++;const j=Math.min(i+1,hs.length-1),f=j>i?(h-hs[i])/Math.max(hs[j]-hs[i],1e-6):0;return x(i)+(x(j)-x(i))*Math.max(0,Math.min(1,f))};
  const inR=h=>h>=hs[0]-1e-6&&h<=hs[hs.length-1]+1e-6, line=pts=>{let dd="",pen=false;pts.forEach(([h,v])=>{if(!inR(h)){pen=false;return}dd+=(pen?"L":"M")+xT(h).toFixed(1)+" "+y(Math.min(v,mx)).toFixed(1);pen=true});return dd};
  let lab="";
if(tab==="wi"){const dd=line((TRU.wi||[]).map(([z,v])=>[isoH(z),v]));
   if(dd){s.appendChild(el("path",{fill:"none",stroke:"var(--ink)","stroke-width":2.6,"stroke-dasharray":"6 3",d:dd}));lab="- - observed wind index (HKO station winds)"}
   else if(TRU.wi_peak!=null){const yy=y(Math.min(TRU.wi_peak,mx)).toFixed(1);
    s.appendChild(el("path",{fill:"none",stroke:"var(--ink)","stroke-width":2.2,"stroke-dasharray":"2 4",d:`M${xT(hs[0]).toFixed(1)} ${yy} L${xT(hs[hs.length-1]).toFixed(1)} ${yy}`}));
    lab=`··· storm peak ${Math.round(TRU.wi_peak)} km/h (${TRU.wi_peak_src||"HKCOC"})`}}
  else{const lvl=tab==="p3"?3:tab==="p8"?8:10;
   (TRU.signals||[]).filter(([a,b,g])=>g>=lvl).forEach(([a,b,g])=>{const h0=Math.max(isoH(a),hs[0]),h1=Math.min(isoH(b),hs[hs.length-1]);
    if(h1>h0){s.appendChild(el("rect",{x:xT(h0),y:22,width:Math.max(1,xT(h1)-xT(h0)),height:y(0)-22,fill:"var(--ink)",opacity:.16}));lab=`shaded: HKO had No. ${lvl} or higher in force`}})}
  if(lab){const lt=el("text",{x:W-R-8,y:NARROW?50:34,fill:"var(--ink)","font-size":11,"font-weight":600,"text-anchor":"end"});lt.textContent=lab;s.appendChild(lt)}}
 if(mk>=0){const k2=Math.min(mk+1,series.length-1), f=k2>mk?Math.min(1,(selH-hs[mk])/Math.max(hs[k2]-hs[mk],1e-6)):0, xm=x(mk)+(x(k2)-x(mk))*f;
  s.appendChild(el("line",{x1:xm,x2:xm,y1:22,y2:y(0),stroke:"var(--ink)","stroke-dasharray":"4 3","stroke-width":1.2}));
  if(tab==="wi"){const vv=series[mk][1]+(series[k2][1]-series[mk][1])*f;
   s.appendChild(el("circle",{cx:xm,cy:y(vv),r:6,fill:"none",stroke:"var(--ink)","stroke-width":2}));
   markTxt(`${fmtH(selH)}: ${Math.round(vv)} km/h`,xm)}

  else{s.appendChild(el("circle",{cx:x(mk),cy:y(series[mk][1]),r:6,fill:"none",stroke:"var(--ink)","stroke-width":2}));
   markTxt(`${fmtH(selH)}: ${series[mk][1].toFixed(2)} (the 3 hours from ${hkL(series[mk][0])})`,xm)}}
 const pk=t.pts?Math.max(...t.pts.map(p=>p[2])):0, ca=t.ca?`closest ${Math.round(t.ca[0])} km, ${hkC(t.ca[1])}`:"";
 const thrT=tab==="p10"?.4:.3, first=((tab==="p3"?t.s3:tab==="p8"?t.s8:t.s10)||[]).find(p=>p[1]>=thrT);
 const nG=Math.round(t.gale), rng=(t.gale_lo!=null&&t.gale_hi!=null&&t.gale_hi>t.gale_lo)?` (${t.gale_lo}–${t.gale_hi})`:"";
 const J=a=>a.filter(Boolean).map(s=>`<span class="kv">${s}</span>`).join("");
 const flag=t.oor&&t.oor.length?` <span title="outside the range of the past storms this estimate covers: ${t.oor.join(", ")}">⚠</span>`:"";
 const hur="";
 const wind=t.gale!=null
  ? J([t.t9===10?`<b>No. 10 tier</b>`:t.t9===9?`<b>near No. 10</b>`:"",
       `gale stations <b>${nG}</b>${rng}${flag}${t.sev?` at ${hkC(t.sev[1])}, ${t.sev[0]} km${""}`:""}`,
"",
       hur,
       t.gsig?`past storms at ${nG}: ${Object.entries(t.gsig.counts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`No. ${k} ${Math.round(v/t.gsig.n*100)}%`).join(", ")}${t.gsig.n<6?" (few)":""}`:""])
  : `gale stations: none estimated (beyond ${(TR||{}).gale_max_km||722} km)`;
 const drv=t.other_driver?`⚠ No. 8 from ${t.other_driver.storm} (${t.other_driver.p8.toFixed(2)}, dashed)`:"";
 const TRo=truthNow(), obs=TRo?(tab==="wi"&&!(TRo.wi&&TRo.wi.length)&&TRo.wi_peak!=null?"dotted = HKCOC's published storm peak":"dashed = observed"):"";
 const wpk=tab==="wi"?series.reduce((b,p)=>p[1]>b[1]?p:b,series[0]):null;
 const epk=EW?EW.rows.reduce((b,r)=>r.mean>b.mean?r:b,EW.rows[0]):null;
 $("#cnote").innerHTML=EW
  ? J([`<b>Ensemble mean</b> peak <b>${Math.round(epk.mean)} km/h</b> ${fmtH(epk.h)}`,wiCmp(epk.mean),`members ${Math.round(epk.lo)}–${Math.round(epk.hi)} km/h (10–90%)`,`${epk.near} of ${EW.n} within 800 km`])
  : tab==="wi"
  ? J([`<b>${t.storm}</b>`,`peak wind index <b>${Math.round(wpk[1])} km/h</b> ${hkL(wpk[0])}`,wiCmp(wpk[1]),ca,drv,obs])
  : J([`<b>${t.storm}</b>`,
       `peak ${Math.max(...series.map(p=>p[1])).toFixed(2)}${first?`, ≥ ${thrT.toFixed(2)} from ${hkL(first[0])}`:`, stays below ${thrT.toFixed(2)}`}`,
       `${ca}${""}`,

       drv, obs])+`<br>${wind}`;
 if(BASIC&&tab==="wi"&&wpk){const d=new Date(T0()+labH(wpk[0])*36e5+8*36e5), z=n=>String(n).padStart(2,"0");
  const cmp=wiCmp(wpk[1]);
  $("#cnote").innerHTML=`Peak <b>${Math.round(wpk[1])} km/h</b>, around ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${z(d.getUTCHours())}:00 (Hong Kong time)`+(cmp?` · ${cmp}`:"")+(truthNow()?" · dashed line: what Hong Kong really had":"")}
}
