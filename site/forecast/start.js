const DEMO=(location.search.match(/[?&]demo=(play|member|map|stations|toolbar|answer|headline|timeline|stationtable)\b/)||[])[1]||"";
if(DEMO){window.HK_DEMO=DEMO; document.documentElement.classList.add("demo","demo-"+DEMO);
 const KEEP={toolbar:[".toolbar"],answer:["#status"],headline:["#status"],timeline:["#status"],stationtable:["#chead","#tabs","#stationchart","#cnote"]}[DEMO]||[".mapcard"];
 const hide=c=>c.classList.add("dhide");
 const W=document.querySelector(".wrap"); [...document.body.children].forEach(c=>{if(c!==W&&c.tagName!=="SCRIPT")hide(c)});
 if(W)[...W.children].forEach(c=>{if(!KEEP.some(k=>c.matches(k)||c.querySelector(k)))hide(c)});
 {const sh=document.querySelector(".sheet"); if(sh)[...sh.children].forEach(c=>{if(!KEEP.some(k=>c.matches(k)||c.querySelector(k)))hide(c)})}
 const noLink=e=>{const a=e.target.closest&&e.target.closest("a[href]"); if(a){e.preventDefault(); e.stopPropagation()}};
 addEventListener("click",noLink,true); addEventListener("auxclick",noLink,true);
 if(W&&/^(toolbar|answer|headline|timeline|stationtable)$/.test(DEMO)){W.inert=true; W.style.pointerEvents="none"}
 const post=()=>{try{const b=[...document.querySelectorAll(".wrap>*")].filter(c=>!c.classList.contains("dhide")&&c.getClientRects().length)
   .reduce((m,c)=>Math.max(m,c.getBoundingClientRect().bottom+scrollY),0);
  parent.postMessage({hkDemoH:b>0?Math.ceil(b+4):document.documentElement.scrollHeight},"*")}catch(x){}};
 try{new ResizeObserver(post).observe(document.body)}catch(x){} setTimeout(post,300);
 const setup=(n=0)=>{if(!TR){if(n<30)setTimeout(()=>setup(n+1),400);return}
  if(DEMO==="member"){sel=TR.top; selH=null; drawMap(); chart()}
  if(DEMO==="stations"){view="hk"; VB=[113.55,114.75,21.95,22.75]; HOME=VB.slice(); $("#zoomBtn").textContent="zoom out"; drawMap()}
  if(DEMO==="stationtable"){tab="sg"; drawTabs(); chart()}};
 setTimeout(setup,300);
 const go=(n=0)=>{if(!TR){if(n<20)setTimeout(()=>go(n+1),500);return}
  if(DEMO==="play"){const b=$("#allPlay"); if(allPlaying)allStop(); allH=null; b.click()}
  else if(DEMO==="member"){if(sel===null){sel=TR.top; drawMap(); chart()} if(!playing){selH=null; $("#play").click()}}};
 const halt=()=>{if(allPlaying)allStop(); if(DEMO==="member"&&playing)$("#play").click()};
 addEventListener("message",e=>{if(!e.data||!e.data.hkDemo)return; if(e.data.hkDemo==="play")go(); else halt()});
 if(parent===window&&(DEMO==="play"||DEMO==="member"))setTimeout(go,1200)
 const tour=(n=0)=>{const d=(HK[cyc]||{})[ens]; if(!d||!TR){if(n<40)setTimeout(()=>tour(n+1),500);return}
  const E=d.event||{}, M=d.members||51, MJ=Math.floor(M/2)+1, nOf=sg=>E[sg]?E[sg].n:(d[sg]&&d[sg].any?d[sg].any[0]:0);
  const top=[["No10",10],["No8",8],["No3",3]].find(([sg])=>nOf(sg)>=MJ), x=top&&E[top[0]];
  let st=null; const t=stationTrack();
  if(t)SGN.forEach(([k,nm],i)=>{const w=stationWind(t,i), v=w.fv!=null?w.fv:(w.fb?((isFinite(w.fb[0])?w.fb[0]:40)+(isFinite(w.fb[1])?w.fb[1]:130))/2:46);
   const f=w.fv!=null?`F${beaufort(w.fv)}`:{"<53":"≤F7","73–78":"F8–9","98–108":"F10–11","118+":"F12"}[w.text]||""; if(f&&(!st||v>st.v))st={nm,f,v}});
  try{parent.postMessage({hkTourRun:{cyc,ens,past:(pastOf(cyc)||"").split(" — ")[0],M,top:top?top[1]:0,n:top?nOf(top[0]):nOf("No3"),
   h:x&&x.hours?x.hours[1]:null,st:st&&[st.nm,st.f]}},"*")}catch(e){}};
 if(parent!==window)setTimeout(tour,600)}
try{const q=new URLSearchParams(location.search), f=q.get("f"); let r=q.get("run");
 if(r==="storm") r=cycles.find(c=>HK[c].ifsens&&!HK[c].ifsens.quiet)||cycles[0];
 if(r&&!HK[r]&&DROPPED[r]){const w=PAST.filter(p=>r>=p[0]&&r<=p[1]), L=cycles.filter(c=>w.some(p=>c>=p[0]&&c<=p[1])).sort(), a=L.filter(c=>c>r); r=(f&&a.find(c=>HK[c][f]))||a[0]||L[L.length-1]||r}
 if(r&&HK[r]){cyc=r; if(f&&HK[r][f]){ens=f; mode=modeOf(f)||mode; CHOSEN=true} else{const e2=DEFE(r)||(DROPPED[r]&&ORDER.find(e=>HK[r][e])); if(e2){ens=e2; mode=modeOf(ens)||mode}}}}catch(e){}
head();load();
setTimeout(hkoNow,0); setInterval(hkoNow,6e5);
