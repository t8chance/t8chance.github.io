function fillBasic(){const b=document.getElementById("bclose"); if(!b)return; const bx=document.getElementById("bmapbox"), k=REFK(); b.innerHTML=""; if(bx)bx.innerHTML="";
 if(!k){if(EASY)areaMap(bx);return} const go=()=>{if(REFK()!==k||document.getElementById("bclose")!==b)return; const T=wrapT((window.HKT||{})[k]), R=refOf(T,k); if(!R){if(EASY)areaMap(bx);return}
  const top=bx?+bx.dataset.top||0:0, sg=T.tracks.filter(t=>t!==R&&t.m!==52&&t.pts&&t.pts.length&&tierOf(t)[0]>=3);
  if(top&&sg.length>=3&&sg.filter(t=>sameStorm(R,t)).length<sg.length/2){if(EASY)areaMap(bx);return}
  const yr=+k.slice(0,4), [md,hm]=String(R.ca[1]).split(" "), [mo,dd]=md.split("-").map(Number), [hh,mi]=hm.split(":").map(Number);
  const t=new Date(Date.UTC(mo<+k.slice(4,6)?yr+1:yr,mo-1,dd,hh,mi)+8*36e5), DWK=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const who=k.endsWith("_aifsens")?"the control run of ECMWF's AI model":ens==="pangu"?"this forecast":"ECMWF's main forecast";
  const day=`<b>${DWK[t.getUTCDay()]} ${t.getUTCDate()} ${MON[t.getUTCMonth()]}</b>, about <b>${KM10(R.ca[0])} km</b> away.`;
  b.innerHTML=ens==="gefs"?"":ens==="era5"?`On HKO's best track, the storm came closest to Hong Kong on ${day}`:`In ${who}, the storm comes closest to Hong Kong on ${day}`
   +(ens==="deepmind"?" Google DeepMind does not make a main forecast.":"");
  if(EASY&&bx)drawBasicMap(bx,T,R,k)};
 if((window.HKT||{})[k])go(); else{const s=document.createElement("script"); s.src=`../data/tracks_${k}.js`; s.onload=go; document.head.appendChild(s)}}
function drawBasicMap(bx,T,R,k){
 const at=new Map(); if(R.m===51||R.m===52)T.tracks.filter(t=>t!==R&&t.m!==52&&t.pts&&t.pts.length>1&&sameStorm(R,t)).forEach(t=>t.pts.forEach(p=>{const L=String(p[3]); if(!at.has(L))at.set(L,[]); at.get(L).push(p)}));
 const sh=R.pts.map(p=>{const q=at.get(String(p[3]))||[]; if(q.length<10)return null; const d=q.map(x=>kmP(p,x)).sort((a,b)=>a-b); return d[Math.ceil(.7*d.length)-1]});
 let L0=114.174,L1=L0,B0=22.302,B1=B0;
 R.pts.forEach((p,i)=>{if(dist(p[0],p[1])>1500)return; const r=Math.min(sh[i]||0,300), dy=r/110.57, dx=r/(111.32*Math.cos(p[1]*Math.PI/180));
  L0=Math.min(L0,p[0]-dx); L1=Math.max(L1,p[0]+dx); B0=Math.min(B0,p[1]-dy); B1=Math.max(B1,p[1]+dy)});
 {const o=obsAt(0); if(o&&!o.none&&dist(o.lon,o.lat)<=1500){const r=Math.min(o.gale>0?o.gale:0,400), dy=r/110.57, dx=r/(111.32*Math.cos(o.lat*Math.PI/180));
  L0=Math.min(L0,o.lon-dx); L1=Math.max(L1,o.lon+dx); B0=Math.min(B0,o.lat-dy); B1=Math.max(B1,o.lat+dy)}}
 const cx=(L0+L1)/2, cy=(B0+B1)/2, kx=Math.cos(cy*Math.PI/180), nar=(bx.parentNode.clientWidth||innerWidth)<600, A0=nar?.72:.55, A1=nar?.85:.68;
 let w=Math.max(L1-L0+2,10), h=Math.max(B1-B0+2,7);
 if(h*110.57>A1*w*111.32*kx) w=h*110.57/(A1*111.32*kx); else if(h*110.57<A0*w*111.32*kx) h=A0*w*111.32*kx/110.57;
 const SQ=sqOf(R), LVS=[...new Set(R.pts.slice(0,-1).flatMap((p,i)=>{const a=labH(p[3]),b=labH(R.pts[i+1][3]);return [sigAt(R,a+1e-3,SQ),...SQ.map(x=>labH(x[0])).filter(x=>x>a&&x<b).map(x=>sigAt(R,x+1e-3,SQ))]}))].sort((a,b)=>a-b);
 const OB=obsAt(0), ai=k.endsWith("_aifsens"), S=[ens==="deepmind"?"The line and the shaded area come from ECMWF's physics model, because Google DeepMind does not make a main forecast."
   :ai?"The line is the control run of ECMWF's AI model.":ens==="pangu"?"The line is this forecast's path of the storm.":"The line is ECMWF's main forecast of the storm's path.",
  "Its colour shows the signal expected in Hong Kong as the storm passes.", "The dots mark the centre at 08:00 Hong Kong time each day.",
  ...(sh.some(x=>x!=null)?[ai?"The shaded area is where seven of every ten of the AI model's computer forecasts put the centre of the storm.":"The shaded area is where seven of every ten of ECMWF's computer forecasts put the centre of the storm."]:[]),
  ...(OB&&!OB.none?[OB.gale>0?"The white dot marks the storm on HKO's best track when this forecast started, and the circles show how far its gale (green), storm (orange) and hurricane (red) winds reached."
   :"The white dot marks the storm on HKO's best track when this forecast started."]:[])];
 const KL=[`<span class="kt">Signal expected in Hong Kong as the storm passes</span><span class="ks">${LVS.map(l=>`<span><i style="background:${SIGC[l]}"></i>${l?SIGN[l]:"no signal"}</span>`).join("")}</span>`,
  `<span><i class="kln"></i>${ens==="deepmind"?"ECMWF physics main forecast":ai?"Control run of the AI model":ens==="pangu"?"This forecast":"ECMWF's main forecast"}</span>`,
  sh.some(x=>x!=null)?`<span><i class="ksh"></i>Seven in ten forecasts</span>`:"",
  OB&&!OB.none&&OB.gale>0?`<span><i class="krg"></i>Gale, storm and hurricane winds on HKO's best track at the start</span>`:""].filter(Boolean);
 bx.innerHTML=`<div class="figh"><h2>Expected path of the storm</h2><a class="howto" href="guide.html?mode=easy#e2">Don't know how to use the map? Read the guide</a></div><div class="frame"><svg></svg><div class="key">${KL.join("")}</div></div>`;
 const s=bx.querySelector("svg"), {W,H,X,Y,hx,hy,lo0,lo1,la0,la1}=mapBase(s,[cx-w/2,cx+w/2,cy-h/2,cy+h/2]), pr=r=>r/110.57*(H/(la1-la0));
 const g=el("g",{opacity:.2,fill:"#2f5d8a"});
 R.pts.forEach((p,i)=>{if(sh[i]==null)return; const x0=X(p[0]),y0=Y(p[1]),r0=pr(sh[i]); g.appendChild(el("circle",{cx:x0,cy:y0,r:r0}));
  const q=R.pts[i+1]; if(!q||sh[i+1]==null)return; const x1=X(q[0]),y1=Y(q[1]),r1=pr(sh[i+1]),L=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/L,ny=(x1-x0)/L;
  g.appendChild(el("polygon",{points:[[x0+nx*r0,y0+ny*r0],[x1+nx*r1,y1+ny*r1],[x1-nx*r1,y1-ny*r1],[x0-nx*r0,y0-ny*r0]].map(a=>a[0].toFixed(1)+","+a[1].toFixed(1)).join(" ")}))});
 s.appendChild(g);
 s.appendChild(el("path",{fill:"none",stroke:"#fff","stroke-width":7,"stroke-linejoin":"round","stroke-linecap":"round",d:R.pts.map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join(" ")}));
 const SB=SQ.map(p=>labH(p[0]));
 for(let i=0;i<R.pts.length-1;i++){const a=R.pts[i],b=R.pts[i+1],ha=labH(a[3]),hb=labH(b[3]),dh=hb-ha||1,cuts=[ha,...SB.filter(x=>x>ha+1e-6&&x<hb-1e-6),hb];
  for(let j=0;j<cuts.length-1;j++){const f0=(cuts[j]-ha)/dh,f1=(cuts[j+1]-ha)/dh,lv=sigAt(R,cuts[j]+1e-3,SQ);
   s.appendChild(el("line",{x1:X(a[0]+(b[0]-a[0])*f0),y1:Y(a[1]+(b[1]-a[1])*f0),x2:X(a[0]+(b[0]-a[0])*f1),y2:Y(a[1]+(b[1]-a[1])*f1),stroke:SIGC[lv],"stroke-width":3.8,"stroke-linecap":"round"}))}}
 if(OB&&!OB.none) obsDraw(e=>s.appendChild(e),X,Y,r=>r/(111.32*Math.cos(.389))*(W/(lo1-lo0)),pr,OB,false);
 s.appendChild(el("circle",{cx:hx,cy:hy,r:6,fill:"#f2c200",stroke:"#333","stroke-width":1.2}));
 {const t=el("text",{x:hx+9,y:hy+4,fill:"#111","font-size":12,"font-weight":600,stroke:"#fff","stroke-width":3,"paint-order":"stroke"}); t.textContent="Hong Kong"; s.appendChild(t)}
 const PL=[]; const hit=(a,b)=>a[0]<b[2]&&b[0]<a[2]&&a[1]<b[3]&&b[1]<a[3], HKB=[hx+6,hy-13,hx+90,hy+8]; PL.push(HKB);
 R.pts.forEach(p=>{if(!/ 00$/.test(String(p[3]).replace("/"," ")))return; const x=X(p[0]), y=Y(p[1]); if(x<0||x>W||y<0||y>H)return;
  s.appendChild(el("circle",{cx:x,cy:y,r:4,fill:"#fff",stroke:"#222","stroke-width":1.5}));
  const at=[[x+7,y-8,"start"],[x+7,y+19,"start"],[x-7,y-8,"end"],[x-7,y+19,"end"]].map(([ax,ay,an])=>{const x0=an==="end"?ax-48:ax; return [ax,ay,an,[x0,ay-13,x0+48,ay+3]]})
   .find(([,,,bx_])=>bx_[0]>=2&&bx_[2]<=W-2&&bx_[1]>=0&&bx_[3]<=H&&!PL.some(q=>hit(bx_,q))); if(!at)return; PL.push(at[3]);
  const d=new Date(T0()+labH(p[3])*36e5+8*36e5), t=el("text",{x:at[0],y:at[1],"text-anchor":at[2],fill:"#111","font-size":12,"font-weight":600,stroke:"#fff","stroke-width":3,"paint-order":"stroke"});
  t.textContent=`${d.getUTCDate()} ${MON[d.getUTCMonth()]}`; s.appendChild(t)})}
const dist=(lo,la)=>Math.hypot((lo-114.174)*Math.cos(22.302*Math.PI/180)*111.32,(la-22.302)*110.57);
const wrapT=T=>{if(T&&!T._w){(T.tracks||[]).forEach(t=>[t.pts,...(t.others||[]).map(o=>o.pts)].forEach(P=>(P||[]).forEach(p=>{if(p[0]<0)p[0]+=360}))); T._w=1} return T};
let HEAT=false; const HEATK=()=>cyc+"_"+ens, heatData=()=>((window.HKHEAT||{})[HEATK()])||null;
function heatLoad(cb){const k=HEATK(); if((window.HKHEAT||{})[k]){cb(true);return}
 const sc=document.createElement("script"); sc.src=`../data/heat_${k}.js`; sc.onload=()=>cb(!!(window.HKHEAT||{})[k]); sc.onerror=()=>cb(false); document.head.appendChild(sc)}
function heatCPA(t){let b=[1e18,t.pts[0][0],t.pts[0][1]];
 for(let i=0;i<t.pts.length-1;i++){const a=t.pts[i],c=t.pts[i+1]; for(let f=0;f<=1.0001;f+=.05){const lo=a[0]+f*(c[0]-a[0]),la=a[1]+f*(c[1]-a[1]),d=dist(lo,la); if(d<b[0])b=[d,lo,la]}}
 return b}
function heatAnchor(t){
 const P=(t.pts||[]).map(p=>[labH(p[3]),p[0],p[1]]).filter(p=>isFinite(p[0])).sort((x,y)=>x[0]-y[0]);
 const at=h=>{for(let i=0;i<P.length;i++){const x=P[i],y=P[i+1]; if(h===x[0])return [x[1],x[2]]; if(y&&h>x[0]&&h<y[0]){const f=(h-x[0])/(y[0]-x[0]); return [x[1]+f*(y[1]-x[1]),x[2]+f*(y[2]-x[2])]}} return null};
 const lv=tierOf(t)[0], order=[{0:"3",3:"8",8:"10",9:"10",10:"10"}[lv]||"3"]; if(lv>=3){const own=lv>=9?"10":String(lv); if(!order.includes(own))order.push(own)}
 for(const sig of order){const S=t["s"+sig]||[]; if(!S.length)continue; const mx=Math.max(...S.map(x=>+x[1]||0)); if(!(mx>=.05))continue;
  let best=null; for(const [k,v] of S){if((+v||0)<mx-.005)continue; const q=at(labH(k)); if(!q)continue; const d=dist(q[0],q[1]); if(!best||d<best[0])best=[d,q[0],q[1]]}
  if(best)return best}
 return heatCPA(t)}
function heatAt(HD,m,sig,dx,dy){const v=HD.m[String(m)]; if(!v)return 0; const A=v[sig], i0=HD.shifts.indexOf(0), r=Math.hypot(dx,dy); if(r>50)return null;
 const tm=(TR&&TR.tracks||[]).find(x=>x.m===m), c0=HD.drawn_only?A[0][i0]:(tm&&tm["p"+sig]!=null?+tm["p"+sig]:A[0][i0]);
 let ang=Math.atan2(dy,dx)*180/Math.PI; if(ang<0)ang+=360;
 const a=ang/30, k0=Math.floor(a)%12, k1=(k0+1)%12, fa=a-Math.floor(a), q=r/10, j0=Math.min(Math.floor(q),5), j1=Math.min(j0+1,5), fr=q-j0;
 const val=(k,j)=>j===0?c0:A[k%6][HD.shifts.indexOf(k<6?j*10:-j*10)];
 return (1-fa)*(1-fr)*val(k0,j0)+fa*(1-fr)*val(k1,j0)+(1-fa)*fr*val(k0,j1)+fa*fr*val(k1,j1)}
const heatLv=(p3,p8,p10)=>p10>=.4?10:p8>=.3?8:p3>=.3?3:0;

const weakT=t=>t.wk===1||(t.wk==null&&!!t.pts&&t.pts.length>0&&t.pts.every(p=>p[2]!=null&&p[2]<21.5));
const T0=()=>Date.UTC(+cyc.slice(0,4),+cyc.slice(4,6)-1,+cyc.slice(6,8),+cyc.slice(8,10));
const labH=lab=>{const [d,h]=String(lab).replace("/"," ").split(" ").map(Number),a=new Date(T0());
 let u=Date.UTC(a.getUTCFullYear(),a.getUTCMonth(),d,h); if(u<T0()-864e5) u=Date.UTC(a.getUTCFullYear(),a.getUTCMonth()+1,d,h); return (u-T0())/36e5};
const caH=c=>{const [md,hm]=String(c).split(" "),[mo,d]=md.split("-").map(Number),[h,mi]=hm.split(":").map(Number),a=new Date(T0());
 let u=Date.UTC(a.getUTCFullYear(),mo-1,d,h,mi); if(u<T0()-30*864e5) u=Date.UTC(a.getUTCFullYear()+1,mo-1,d,h,mi); return (u-T0())/36e5};
const fmtH=h=>hktS(T0()+Math.round(h*60)*6e4), hkL=lab=>fmtH(labH(lab)), hkC=c=>fmtH(caH(c));
const hkS=lab=>{const d=new Date(T0()+Math.round(labH(lab)*60)*6e4+288e5),z=n=>String(n).padStart(2,"0");return `${d.getUTCDate()}/${d.getUTCMonth()+1} ${z(d.getUTCHours())}:${z(d.getUTCMinutes())}`};

let showWHK=false, showWIMean=false, showWIDist=false, BIN=null;
