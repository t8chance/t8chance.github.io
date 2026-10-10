// Live charts for 'How good is it?' (build_verify_charts.py, 2026-10-10): each check drawn in the page instead of a picture.
// Data: inputs/check_points.js (strength, reach: the same points as check.html) and verify/verify_points.js (gale stations, wind-index
// peaks). x = what HKO recorded, y = what this site gave, dashed line = same as HKO. Hover or tap a dot for details.
(()=>{
// styles live here so every page that loads this script draws the same charts (How good is it?, Inputs by year); colours from the page's
// --ink / --mut / --line / --card, own tokens with dark values
const ST=document.createElement("style"); ST.textContent=`
:root{--vdot:#2b6cb0;--vgrid:#ececec;--vcat:#d9d9d9;--vsoft:#efece6;--vraise:#fff}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--vdot:#6fa8e8;--vgrid:#262626;--vcat:#3a3a3a;--vsoft:#2a2a2a;--vraise:#3a3a3a}}
:root[data-theme="dark"]{--vdot:#6fa8e8;--vgrid:#262626;--vcat:#3a3a3a;--vsoft:#2a2a2a;--vraise:#3a3a3a}
.vc .pick{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin:12px 0 0} .vc .pick .lbl{color:var(--mut);font-size:13px}
.vc .seg{display:inline-flex;flex-wrap:wrap;gap:2px;padding:3px;background:var(--vsoft);border-radius:12px}
.vc .seg button{font:inherit;font-size:14px;border:0;background:transparent;border-radius:9px;padding:7px 13px;color:var(--mut);cursor:pointer}
.vc .seg button:hover{color:var(--ink)} .vc .seg button.on{background:var(--vraise);color:var(--ink);box-shadow:0 1px 3px rgba(0,0,0,.16)}
.vc .vsub{color:var(--mut);font-size:13.5px;margin:8px 0 6px} .vc .vread{color:var(--mut);font-size:13px;margin:4px 0 6px;max-width:72ch}
.vc .vbody{display:grid;grid-template-columns:minmax(0,600px) minmax(0,240px);gap:6px 22px;align-items:start}
.vc .vtiles{display:flex;flex-direction:column;gap:10px;margin:6px 0 0}
.vc .vtiles>div{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 14px;font-size:13.5px;color:var(--mut);min-width:0}
.vc .vtiles .n{display:block;font-size:26px;font-weight:700;color:var(--ink);line-height:1.1;font-variant-numeric:tabular-nums}
@media (max-width:860px){.vc .vbody{grid-template-columns:minmax(0,1fr)} .vc .vside{order:-1} .vc .vtiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px}
 .vc .vtiles>div{padding:8px 10px;font-size:12.5px} .vc .seg button{padding:7px 10px}}
.vc svg{width:100%;max-width:600px;height:auto;display:block;background:var(--card);border:1px solid var(--line);border-radius:12px;margin:6px 0;touch-action:pan-y}
.vc svg text{fill:var(--mut);font-size:11px;font-variant-numeric:tabular-nums} .vc svg .axl{font-size:12px} .vc svg .catl{font-size:10px}
.vc svg .gr{stroke:var(--vgrid)} .vc svg .cat{stroke:var(--vcat)} .vc svg .ax{fill:none;stroke:var(--line)} .vc svg .one{stroke:var(--ink);stroke-dasharray:5 4;opacity:.7}
.vc svg .d{fill:var(--vdot);fill-opacity:.35} .vc svg .dense .d{fill-opacity:.1} .vc svg .b{fill:var(--vdot);fill-opacity:.3;stroke:var(--vdot);stroke-width:1.2}
.vc svg .bn{fill:var(--ink);font-size:11px;font-weight:600} .vc svg .lab{fill:var(--ink);font-size:11px;paint-order:stroke;stroke:var(--card);stroke-width:3px}
.vc svg .ring{fill:none;stroke:var(--ink);stroke-width:1.6}
.vtip{position:fixed;z-index:10;max-width:260px;background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:10px;padding:7px 10px;font-size:12.5px;line-height:1.4;box-shadow:0 4px 16px rgba(0,0,0,.18);pointer-events:none}`;
document.head.appendChild(ST);
const NS="http://www.w3.org/2000/svg", C=window.CHECK||{methods:{},names:{}}, P=window.VPTS||{gale:{},wipeak:{}};
const el=(t,a={})=>{const e=document.createElementNS(NS,t); for(const k in a)e.setAttribute(k,a[k]); return e};
const esc=s=>String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const nm=k=>C.names[k]||String(k).replace(/_(\d{4})$/," $1").replace(/_/g," ").toLowerCase().replace(/\b\w/g,x=>x.toUpperCase());
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const run=r=>`${+r.slice(6,8)} ${MON[+r.slice(4,6)-1]} ${r.slice(0,4)}, ${r.slice(8,10)}Z`;
const FC=[["ifs2025","ECMWF"],["aifs2025","ECMWF AI"],["ifs2024","ECMWF 2024"],["pangu","Pangu-Weather"],["tigge","Old ECMWF"]];
const CLS=[[34,"storm"],[48,"severe storm"],[64,"typhoon"],[81,"severe typhoon"],[100,"super typhoon"]];
const WIB=[[14,"fresh"],[25,"strong"],[45,"very strong"],[75,"extreme"]];
const bias=(b,u,hi,lo)=>Math.round(b)===0?[`0 ${u}`,"about right on average"]:[`${Math.abs(Math.round(b))} ${u}`,`too ${b>0?hi:lo} on average`];
function xy(m,lim,u,what,keys,hi,lo){   // strength / reach points of check_points.js
 return {pts:m.pts.map(p=>({x:p[0],y:p[1],t:nm(keys[p[2]]),s:`forecast from ${run(p[3])}, for ${p[4]}Z`,v:`HKO ${Math.round(p[0])} ${u} · this site ${Math.round(p[1])} ${u}`})),
  tiles:[[m.stats[2],"storms"],bias(m.stats[0],u,hi,lo),[`${Math.round(m.stats[1])} ${u}`,"typical miss"]]}}
const CM=window.CMPTS||{};   // Inputs by year, section 4: the methods compared on the old ECMWF forecasts (inputs/compare_points.js)
function cmp(v,k,lim,step,u,cats,xl,yl,hi,lo){const e=(CM[v]||[])[+k]; if(!e)return null; const nc=key=>(CM.names||{})[key]||nm(key);
 return {sub:`${e.title} · ${e.sub}`,lo:0,lim,step,cats,xl,yl,pts:e.pts.map(p=>({x:p[0],y:p[1],t:nc(e.keys[p[2]]),s:"",v:`HKO ${Math.round(p[0])} ${u} · estimate ${Math.round(p[1])} ${u}`})),
  tiles:[[e.stats[2],"storms"],bias(e.stats[0],u,hi,lo),[`${Math.round(e.stats[1])} ${u}`,"typical miss"]],read:`On the dashed line = same as HKO; above = too ${hi}, below = too ${lo}.`}}
const KINDS={
 cmp_strength:{opts:[["0","From the pressure"],["1","S2"],["2","S3"]],def:"1",get:k=>cmp("strength",k,150,20,"kt",CLS,"HKO's recorded strength (knots)","estimated strength (knots)","strong","weak")},
 cmp_reach:{opts:[["0","R2"],["1","R1"]],def:"1",get:k=>cmp("reach",k,500,100,"km",null,"HKO's gale-wind reach toward Hong Kong (km)","reach drawn (km)","far","short")},
 strength:{opts:FC,def:"ifs2025",get:k=>{const m=C.methods[k]; if(!m)return null; return Object.assign(xy(m.strength,150,"kt","strength",m.strength.keys,"strong","weak"),
  {sub:`${m.title} · ${m.sub.strength}`,lo:0,lim:150,step:20,cats:CLS,xl:"HKO's recorded strength (knots)",yl:"strength this site used (knots)",
   read:"On the dashed line = same as HKO; above = too strong, below = too weak."})}},
 reach:{opts:FC,def:"ifs2025",get:k=>{const m=C.methods[k]; if(!m)return null; return Object.assign(xy(m.reach,500,"km","reach",m.reach.keys,"far","short"),
  {sub:`${m.title} · ${m.sub.reach}`,lo:0,lim:500,step:100,xl:"HKO's gale-wind reach toward Hong Kong (km)",yl:"reach this site drew (km)",
   read:"On the dashed line = same as HKO; above = too far, below = too short."})}},
 gale:{opts:FC,def:"ifs2025",get:k=>{const g=P.gale[k]; if(!g||!g.pts.length)return null; const by={};
  g.pts.forEach(([o,m,c])=>{const q=by[o+","+m]||(by[o+","+m]={x:o,y:m,n:0,c:[]}); q.n++; q.c.push(c)});
  const e=g.pts.map(p=>p[1]-p[0]), right=e.filter(v=>v===0).length/e.length, miss=e.reduce((a,v)=>a+Math.abs(v),0)/e.length;
  return {sub:`${g.title} · runs made before HKO's highest signal`,lo:-.5,lim:8.5,step:1,xl:"stations with gale, HKO",yl:"stations with gale, this site (middle version)",
   pts:Object.values(by).map(q=>{const u=[...new Set(q.c)]; return {x:q.x,y:q.y,n:q.n,t:`HKO ${q.x}, this site ${q.y}`,s:`${q.n} run${q.n>1?"s":""}`,v:u.slice(0,5).join(", ")+(u.length>5?` and ${u.length-5} more`:"")}}),
   tiles:[[g.pts.length,"runs"],[`${Math.round(100*right)}%`,"exactly right"],[miss.toFixed(1),"stations off on average"]],
   read:"Each circle = runs with the same pair of numbers; bigger = more runs. On the dashed line = same as HKO."}}},
 wipeak:{opts:[["recent","Since Aug 2021"],["old","2004 to Jul 2021"]],def:"recent",get:k=>{const w=P.wipeak[k]; if(!w)return null;
  const e=w.map(p=>p[1]-p[0]), b=e.reduce((a,v)=>a+v,0)/e.length, miss=e.reduce((a,v)=>a+Math.abs(v),0)/e.length, mx=Math.max(...w.map(p=>Math.max(p[0],p[1])));
  const top=[...w].sort((a,c)=>c[0]-a[0]).slice(0,3).map(p=>p[2]);
  return {sub:k==="old"?`${w.length} storms, against the peaks HKCOC published`:`${w.length} storms, against the index from HKO's station winds`,
   lo:0,lim:Math.max(100,Math.ceil((mx+5)/10)*10),step:20,cats:WIB,xl:k==="old"?"HKCOC's published peak (km/h)":"observed peak, from HKO's station winds (km/h)",yl:"peak this site estimates (km/h)",
   pts:w.map(p=>({x:p[0],y:p[1],t:p[2],s:"",v:`observed ${Math.round(p[0])} km/h · this site ${Math.round(p[1])} km/h`,lab:top.includes(p[2])?p[2]:""})),
   tiles:[[w.length,"storms"],bias(b,"km/h","high","low"),[`${Math.round(miss)} km/h`,"typical miss"]],
   read:"Each dot = one storm's highest wind index. On the dashed line = same as observed; above = too high, below = too low."}}}};
const tip=document.createElement("div"); tip.className="vtip"; tip.hidden=true; document.body.appendChild(tip);
const hideTip=()=>{tip.hidden=true; document.querySelectorAll(".vc .ring").forEach(r=>r.style.display="none")};
document.addEventListener("pointerdown",e=>{if(!e.target.closest(".vc svg"))hideTip()});
function draw(box,k){
 const K=KINDS[box.dataset.kind], D=K.get(k), svg=box.querySelector("svg"); box.dataset.v=k;
 box.querySelectorAll(".seg button").forEach(b=>b.classList.toggle("on",b.dataset.v===k)); svg.innerHTML=""; hideTip();
 box.querySelector(".vsub").textContent=D?D.sub:"No numbers for this forecast."; box.querySelector(".vread").textContent=D?D.read+" Hover or tap a dot for details.":"";
 box.querySelector(".vtiles").innerHTML=D?D.tiles.map(([n,l])=>`<div><span class="n">${esc(n)}</span>${esc(l)}</div>`).join(""):""; if(!D)return;
 const W=Math.max(320,Math.min(600,Math.round(box.querySelector(".vbody").clientWidth||600))),H=Math.round(W*.93); svg.setAttribute("viewBox",`0 0 ${W} ${H}`);   // drawn at its real width: text stays 11 px on a phone
 const L=58,R=16,T=16,B=48,pw=W-L-R,ph=H-T-B,lo=D.lo,lim=D.lim,X=v=>L+(Math.min(v,lim)-lo)/(lim-lo)*pw,Y=v=>T+ph-(Math.min(v,lim)-lo)/(lim-lo)*ph;
 for(let v=Math.ceil(lo/D.step)*D.step;v<=lim+1e-9;v+=D.step){
  svg.appendChild(el("line",{x1:X(v),x2:X(v),y1:Y(lo),y2:Y(lim),class:"gr"})); svg.appendChild(el("line",{x1:X(lo),x2:X(lim),y1:Y(v),y2:Y(v),class:"gr"}));
  const tx=el("text",{x:X(v),y:Y(lo)+17,"text-anchor":"middle"}); tx.textContent=v; svg.appendChild(tx);
  const ty=el("text",{x:L-8,y:Y(v)+4,"text-anchor":"end"}); ty.textContent=v; svg.appendChild(ty)}
 (D.cats||[]).forEach(([v,lab],i)=>{if(v>=lim)return; svg.appendChild(el("line",{x1:X(v),x2:X(v),y1:Y(lo),y2:Y(lim),class:"cat"}));
  const t=el("text",{x:X(v)+4,y:T+13+(i%2)*13,class:"catl"}); t.textContent=lab; svg.appendChild(t)});   // staggered: no overlap
 svg.appendChild(el("rect",{x:L,y:T,width:pw,height:ph,class:"ax"}));
 svg.appendChild(el("line",{x1:X(lo),y1:Y(lo),x2:X(lim),y2:Y(lim),class:"one"}));
 const xl=el("text",{x:L+pw/2,y:H-8,"text-anchor":"middle",class:"axl"}); xl.textContent=D.xl; svg.appendChild(xl);
 const yl=el("text",{x:15,y:T+ph/2,"text-anchor":"middle",class:"axl",transform:`rotate(-90 15 ${T+ph/2})`}); yl.textContent=D.yl; svg.appendChild(yl);
 const g=el("g",{class:D.pts.length>3000?"dense":""}), marks=D.pts.map(p=>{const r=p.n?Math.min(4+3.4*Math.sqrt(p.n),26):3,cx=X(p.x),cy=Y(p.y); g.appendChild(el("circle",{cx,cy,r,class:p.n?"b":"d"}));
  if(p.n&&r>=10){const t=el("text",{x:cx,y:cy+4,"text-anchor":"middle",class:"bn"}); t.textContent=p.n; g.appendChild(t)} return {cx,cy,r,p}});
 svg.appendChild(g);
 marks.filter(m=>m.p.lab).forEach(m=>{const left=m.cx+7+6.4*m.p.lab.length>W-R, t=el("text",{x:left?m.cx-7:m.cx+7,y:m.cy-6,class:"lab","text-anchor":left?"end":"start"});
  t.textContent=m.p.lab; svg.appendChild(t)});   // flipped to the left near the right edge
 const ring=el("circle",{class:"ring",r:6}); ring.style.display="none"; svg.appendChild(ring);
 const pick=e=>{const pt=svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; const q=pt.matrixTransform(svg.getScreenCTM().inverse()), sc=W/svg.getBoundingClientRect().width;
  let best=null,bd=1e9; for(const m of marks){const d=Math.max(0,Math.hypot(m.cx-q.x,m.cy-q.y)-m.r); if(d<bd){bd=d;best=m}}
  if(!best||bd>14*sc){hideTip();return} ring.setAttribute("cx",best.cx); ring.setAttribute("cy",best.cy); ring.setAttribute("r",best.r+3.5); ring.style.display="";
  tip.innerHTML=`<b>${esc(best.p.t)}</b>${best.p.s?`<br>${esc(best.p.s)}`:""}<br>${esc(best.p.v)}`; tip.hidden=false;
  const tw=tip.offsetWidth, th=tip.offsetHeight; tip.style.left=Math.max(8,Math.min(e.clientX+14,innerWidth-tw-8))+"px"; tip.style.top=(e.clientY+16+th>innerHeight?e.clientY-th-12:e.clientY+16)+"px"};
 svg.onpointermove=pick; svg.onpointerdown=pick; svg.onpointerleave=e=>{if(e.pointerType==="mouse")hideTip()};
}
document.querySelectorAll(".vc").forEach(box=>{const K=KINDS[box.dataset.kind]; if(!K)return;
 box.innerHTML=`<div class="pick"><span class="lbl">${box.dataset.kind==="wipeak"?"Period":box.dataset.kind.startsWith("cmp_")?"Method":"Forecast"}</span><span class="seg">${K.opts.map(([v,l])=>`<button type="button" data-v="${v}">${l}</button>`).join("")}</span></div>`
  +`<p class="vsub"></p><div class="vbody"><svg viewBox="0 0 600 560" role="img" aria-label="this site against HKO's record"></svg><div class="vside"><div class="vtiles"></div><p class="vread"></p></div></div>`;
 box.querySelectorAll(".seg button").forEach(b=>b.onclick=()=>draw(box,b.dataset.v)); draw(box,K.def)});
let rt; addEventListener("resize",()=>{clearTimeout(rt); rt=setTimeout(()=>document.querySelectorAll(".vc").forEach(b=>b.dataset.v&&draw(b,b.dataset.v)),150)});
})();
