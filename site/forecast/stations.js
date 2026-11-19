const gdots=(n,hi)=>`<span class="gd" aria-hidden="true">${[...Array(8)].map((_,i)=>`<i class="${i<n?"f":i<hi?"p":""}"></i>`).join("")}</span>`;
const SGN=[["CCH","Cheung Chau"],["HKA","Chek Lap Kok"],["KTK","Kai Tak"],["LFS","Lau Fau Shan"],["SKG","Sai Kung"],["SHA","Sha Tin"],["TKL","Ta Kwu Ling"],["TYS","Tsing Yi"]];
const ivs=(g,s,h)=>{const c=[[g,63],[s,88],[h,118]].filter(([p])=>p>0.02&&p<0.98).sort((a,b)=>Math.abs(a[0]-.5)-Math.abs(b[0]-.5));
 return c.length?c[0][1]-10.5+20*c[0][0]:g<=0.02?50:s<=0.02?75.5:h<=0.02?103:999};
const ivw=s=>Math.min(1,Math.max(0,2*s-1));
const ivt=v=>v<=50?"<53":v===999?"118+":v===75.5?"73–78":v===103?"98–108":Math.round(v);
const beaufort=v=>{const b=[2,7,13,20,31,41,52,63,76,88,104,118];v=Math.round(v);let i=0;while(i<b.length&&v>=b[i])i++;return i};
const windLabel=v=>typeof v==="number"?`${Math.round(v)} (F${beaufort(v)})`:v;
const SGNOTE="A rough guide read from each station's chances, not a wind forecast. Median over members (10–90% in brackets); 10-minute mean. HKO: the highest 10-minute mean recorded.";
function stationGuide(){if(!TR)return "";
 const k=DEFM(), ts=TR.tracks.filter(x=>x.m===k), t=ts.filter(x=>x.gst).sort((a,b)=>(b.gale||0)-(a.gale||0))[0]||(TR.tracks.some(x=>x.gst)?ts[0]:null); if(!t)return "";
 const act=window.HK_DEMO?null:casesOf(cyc).map(c=>HKOWIND[c]).find(x=>x);
 const rows=SGN.map(([key,nm],i)=>{const {g,guide,range}=stationWind(t,i);
  return `<tr><td>${nm}</td><td>${Math.round(100*g)}%</td><td>${guide}</td>${act?`<td>${act[i]!=null?windLabel(act[i]):"–"}</td>`:""}</tr>`}).join("");
 const who=memLab(t.m,0).replace(/^the /,"")+(k!==52&&k!==51?defTag(t.m):"");
 return `<details class="nums"><summary>Stations — ${who}</summary><table class="sg"><tr><th>Station</th><th>Gale chance</th><th>Wind guide, km/h</th>${act?"<th>HKO</th>":""}</tr>${rows}</table>${rank8Member(t)}`
  +`</details>`}
const SGC=[[22.2011,114.0267],[22.3094,113.9219],[22.3097,114.2133],[22.4689,113.9836],[22.3756,114.2744],[22.4025,114.21],[22.5286,114.1567],[22.3467,114.0864]];
const WCAT=[["#9e9e9e","below 53 km/h"],["#2ca25f","strong 53–62"],["#2171b5","gale 63–87"],["#f28e2b","storm 88–117"],["#d73027","hurricane 118+"]];
const windCat=(fv,fb)=>{if(fv!=null)return fv>=118?4:fv>=88?3:fv>=63?2:fv>=53?1:0; if(!fb)return 0; const lo=fb[0]; return lo>=118?4:lo>=88?3:lo>=63?2:0};
function stationDots(s,X,Y,span){if(!TR||!GA||span>14)return;
 const t=stationTrack(); if(!t)return;
 SGC.forEach(([la,lo],i)=>{const w=stationWind(t,i), k=windCat(w.fv,w.fb), c=el("circle",{cx:X(lo),cy:Y(la),r:span<5?6:4,fill:WCAT[k][0],stroke:"#222","stroke-width":1});
  const tt=el("title",{}); tt.textContent=`${SGN[i][1]} (${memLab(t.m,1)}): expected wind ${w.text} km/h · chance of gale ${Math.round(100*w.g)}%, storm ${Math.round(100*w.s)}%, hurricane ${Math.round(100*w.h)}%`;
  c.appendChild(tt); s.appendChild(c);
  if(span<5){const tx=el("text",{x:X(lo)+8,y:Y(la)+4,fill:"#111","font-size":11,"pointer-events":"none",stroke:"#fff","stroke-width":3,"paint-order":"stroke","stroke-linejoin":"round"}), nm=el("tspan",{}), fo=el("tspan",{"font-weight":700,dx:4});
   nm.textContent=SGN[i][1]; fo.textContent=w.fv!=null?`F${beaufort(w.fv)}`:{"<53":"≤F7","73–78":"F8–9","98–108":"F10–11","118+":"F12"}[w.text]||"";
   tx.appendChild(nm); tx.appendChild(fo); s.appendChild(tx)}});
 if(span<5){const lg=el("g",{"pointer-events":"none"});
  const bl=s.querySelector("[data-btlg]"), y0=bl?(+bl.getAttribute("y"))+(+bl.getAttribute("height"))+16:(sel!==null||BT?74:20);
  WCAT.forEach(([c,t],k)=>{lg.appendChild(el("circle",{cx:14,cy:y0+16*k,r:5,fill:c,stroke:"#222","stroke-width":1}));const tx=el("text",{x:24,y:y0+4+16*k,fill:"#111","font-size":11});tx.textContent=t;lg.appendChild(tx)});
  s.appendChild(lg)}}
function diffCell(fv,fb,hk){if(hk==null)return ""; hk=Math.round(hk); const sg=d=>d>0?`+${d}`:d<0?`−${-d}`:"0", c=d=>d<0?"dr":d>0?"dg":"";
 if(fv!=null){const d=fv-hk; return `<span class="${c(d)}">${sg(d)}</span>`}
 if(!fb)return ""; const [lo,hi]=fb; if(hk>=lo&&hk<=hi)return `<span>in range</span>`;
 if(!isFinite(lo)||!isFinite(hi)){const d=hk>hi?hi-hk:lo-hk; return `<span class="${c(d)}">${sg(d)} or more</span>`}
 const d=Math.round((lo+hi)/2-hk); return `<span class="${c(d)}">≈ ${sg(d)}</span>`}
function stationTrack(){if(!TR)return null; const k=sel??DEFM(), ts=TR.tracks.filter(x=>x.m===k); return ts.filter(x=>x.gst).sort((a,b)=>(b.gale||0)-(a.gale||0))[0]||ts[0]||null}
function stationWind(t,i){const r=TR.wx_range||[1,1], fmt=v=>`${Math.round(v)} (F${beaufort(v)})`;
 const g=t.gst&&t.gst[i]||0, s=t.sst&&t.sst[i]||0, h=t.hst&&t.hst[i]||0, x=ivs(g,s,h);
 const SH=[5,6,7].includes(i), w0=t.wx?ivw(SH?Math.max(s,...(t.sst||[]).map(v=>v||0)):s):0, w=SH&&w0>0&&x<=50&&x+w0*Math.max(t.wx[i]-x,0)<53?0:w0;
 let guide,range="",fv=null,fb=null,text;
 if(w>0&&t.wx){const b=x===999?118:x, up=q=>b+w*Math.max(q-b,0); fv=Math.round(up(t.wx[i])); guide=fmt(up(t.wx[i])); text=`${fv}`; range=` <span class="rng">(${Math.round(up(t.wx[i]*r[0]))}–${Math.round(up(t.wx[i]*r[1]))})</span>`}
 else {const v=ivt(x), BF={"<53":"<53 (F7 or less)","118+":"118+ (F12)","73–78":"73–78 (F8–9)","98–108":"98–108 (F10–11)"}; guide=typeof v==="number"?windLabel(v):(BF[v]||v); text=String(v); if(typeof v==="number")fv=Math.round(v); else fb={"<53":[-Infinity,52],"73–78":[73,78],"98–108":[98,108],"118+":[118,Infinity]}[v]||null}
 return {g,s,h,fv,fb,guide,range,text}}
function stationDist(i,t0,Wp){const M=(GA&&GA.members)||50, best={}, hko=casesOf(cyc).map(c=>HKOWIND[c]).find(Boolean);
 TR.tracks.forEach(t=>{if(t.m===52&&M>1)return; const c=best[t.m]; if(!c||(t.gst&&(!c.gst||(t.gale||0)>(c.gale||0))))best[t.m]=t});
 const F=v=>Math.max(7,Math.min(12,beaufort(v)));
 const forceOf=t=>{if(!t||!t.gst)return 7; const w=stationWind(t,i); if(w.fv!=null)return F(w.fv); const b=w.fb; if(!b)return 7;
  const lo=isFinite(b[0])?b[0]:40, hi=isFinite(b[1])?b[1]:130; return F((lo+hi)/2)};
 const n={7:0,8:0,9:0,10:0,11:0,12:0}; let k=0; Object.values(best).forEach(t=>{n[forceOf(t)]++;k++}); n[7]+=Math.max(0,M-k);
 const bins=[[7,"F7 or less","below 63","#9e9e9e"],[8,"F8","63–75","#2171b5"],[9,"F9","76–87","#2171b5"],[10,"F10","88–103","#f28e2b"],[11,"F11","104–117","#f28e2b"],[12,"F12","118+","#d73027"]];
 const me=forceOf(t0), act=hko&&hko[i]!=null?F(hko[i]):null, mx=Math.max(1,...Object.values(n));
 const W=Math.max(300,Math.min(640,Math.round(Wp||600))),nar=W<480,H=226,L=8,B=46,T=46,bw=(W-2*L)/bins.length; let g="";
 bins.forEach(([f,lab,kmh,col],j)=>{const x=L+j*bw+8, w=bw-16, h=(H-B-T)*n[f]/mx, y=H-B-h;
  g+=`<rect x="${x}" y="${y}" width="${w}" height="${Math.max(h,n[f]?2:0)}" rx="4" fill="${col}" opacity=".9"></rect>`;
  if(f===me)g+=`<rect x="${x-3}" y="${y-3}" width="${w+6}" height="${Math.max(h,2)+6}" rx="6" fill="none" style="stroke:var(--ink)" stroke-width="2"></rect>`;
  g+=`<text x="${x+w/2}" y="${y-7}" text-anchor="middle" font-size="14" font-weight="700" style="fill:var(--ink)">${n[f]}</text>`;
  g+=`<text x="${x+w/2}" y="${H-B+18}" text-anchor="middle" font-size="13.5" font-weight="600" style="fill:var(--ink)">${nar&&f===7?"≤ F7":lab}</text>`;
  g+=`<text x="${x+w/2}" y="${H-B+34}" text-anchor="middle" font-size="${nar?11:12}" style="fill:var(--mut)">${nar&&f===7?"&lt;63":kmh}</text>`;
  if(act===f)g+=`<text x="${x+w/2}" y="${y-26}" text-anchor="middle" font-size="12.5" font-weight="700" style="fill:var(--ink)">▼ HKO</text>`});
 const who=t0.m===52?"the deterministic run":memLab(t0.m,0).replace(/^the /,"");
 return `<div class="sgdist"><p class="sgdh"><b>${SGN[i][1]}</b>: forecast wind force in each of the ${M} members; the ${(window.HKTHEME?HKTHEME.dark():matchMedia("(prefers-color-scheme: dark)").matches)?"white":"dark"} outline marks ${who}'s force${act!=null?`; ▼ what HKO recorded (${Math.round(hko[i])} km/h)`:""}.</p>
  <svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${SGN[i][1]}: members by expected wind force">${g}</svg></div>`}
let RKGRP="89";
const RKIN=g=>r=>g==="all"||(g==="10"?r.sig===10:g==="89"?r.sig===8||r.sig===9:r.sig<8);
const RKGRPS=[["10","No. 10","十號"],["89","No. 8 or No. 9","八號或九號"],["3","No. 3","三號"],["all","All","全部"]];
document.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("a[data-rktab]"); if(!a||!$("#tabs"))return; e.preventDefault();
 tab="rk"; drawTabs(); chart(); try{$("#chead").scrollIntoView({behavior:"smooth",block:"start"})}catch(x){}});
const FILLF=true, C16=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
function caInfo(t){const P=(t&&t.pts)||[]; if(P.length<2)return {}; const S=[];
 for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],ha=labH(a[3]),hb=labH(b[3]),K=Math.max(1,Math.round((hb-ha)*2));
  for(let k=0;k<K;k++){const f=k/K; S.push({lo:a[0]+(b[0]-a[0])*f,la:a[1]+(b[1]-a[1])*f,h:ha+(hb-ha)*f,v:a[2]!=null&&b[2]!=null?a[2]+(b[2]-a[2])*f:null})}}
 const Z=P[P.length-1]; S.push({lo:Z[0],la:Z[1],h:labH(Z[3]),v:Z[2]});
 const m=S.reduce((x,y)=>dist(y.lo,y.la)<dist(x.lo,x.la)?y:x,S[0]), km=dist(m.lo,m.la);
 const dx=(m.lo-114.174)*Math.cos(22.302*Math.PI/180)*111.32, dy=(m.la-22.302)*110.57, dir=C16[Math.round(((Math.atan2(dx,dy)*180/Math.PI+360)%360)/22.5)%16];
 const vs=S.filter(s=>Math.abs(s.h-m.h)<=3+1e-6&&s.v!=null).map(s=>s.v), v=vs.length?Math.max(...vs):null;
 const cat=null;
 return {dir, km:km<50?Math.max(5,Math.round(km/5)*5):Math.round(km/10)*10, cat}}
const caQ=t=>{const c=caInfo(t); return c.dir?`&cd=${c.dir}&ca=${c.km}${c.cat?"&cc="+c.cat:""}`:""};
function rankView(t){const R=(window.RANKT||[]).concat(RKOLD?window.RANKOLD||[]:[]).sort((a,b)=>b.a10-a.a10), ZH=/^zh/.test(document.documentElement.lang||""), T_=(e,z)=>ZH?z:e, NAR=innerWidth<700;
 const SHOWCAT=false;
 const CAT={SuperT:["Super Typhoon","超強颱風"],ST:["Severe Typhoon","強颱風"],T:["Typhoon","颱風"],STS:["Severe Tropical Storm","強烈熱帶風暴"],TS:["Tropical Storm","熱帶風暴"],TD:["Tropical Depression","熱帶低氣壓"]};
 const DIRZ={N:"北",NNE:"東北偏北",NE:"東北",ENE:"東北偏東",E:"東",ESE:"東南偏東",SE:"東南",SSE:"東南偏南",S:"南",SSW:"西南偏南",SW:"西南",WSW:"西南偏西",W:"西",WNW:"西北偏西",NW:"西北",NNW:"西北偏北"}, SIGZ={3:"三號",8:"八號",9:"九號",10:"十號"};
 const v=t.gst?r8val(t):null, g=t.gale!=null?Math.round(t.gale):null, me=(casesOf(cyc)[0]||"").toLowerCase(), key=r=>`${r.n} ${r.y}`.toLowerCase();
 const rows=R.filter(RKIN(RKGRP)), rk=v==null?null:1+rows.filter(r=>r.a10>v).length, n=rows.length+(v==null?0:1);
 const gT=g==null?"–":`${g}`;
 const who=BASIC?T_("this path","此路徑"):ZH?memLab(t.m).replace(/^the deterministic run$/,"高解像度預報").replace(/^the control run$/,"控制預報").replace(/^member (\d+)$/,"成員 $1"):memLab(t.m);
 const sgB=s=>`<span class="rksg rksg${s}">${ZH?SIGZ[s]:"No. "+s}</span>`, sigOf=r=>r.sig===10?10:r.sig===9?9:r.sig>=8?8:3;
 const rowW=(r,i)=>{const s=sigOf(r), pre=r.pre?"<sup>#</sup>":"", mine=me&&key(r)===me, nm=`${r.y} ${ZH?r.zh:r.n}${r.old?`<sup title="${T_(`Before 2007, from ${r.srck==="hko"?"HKO's annual report":"Wikipedia's station table"}${r.avg==="hour"?" (hourly means converted to 10-minute)":""}${r.nst<8?", "+(8-r.nst)+" station"+(r.nst<7?"s":"")+" filled in":""}${r.cor?", old Kai Tak, Chek Lap Kok and Cheung Chau scaled to today's sites":""}`,`2007 年以前，資料來自${r.srck==="hko"?"天文台年刊":"維基百科的測風站表格"}${r.avg==="hour"?"（每小時平均風速換算為十分鐘平均）":""}${r.nst<8?`，${8-r.nst} 個測風站按其他測風站推算`:""}${r.cor?"，昔日啟德、赤鱲角及長洲的讀數已換算至現址水平":""}`)}">${r.avg==="hour"?"h":"≈"}</sup>${r.rough?` <span class="rkrough" title="${T_(`Only ${r.nst} of the 8 stations have a record, so this average is a rough estimate`,`八個測風站中只有 ${r.nst} 個有紀錄，此平均值僅屬粗略估算`)}">${T_("rough","粗略")}</span>`:""}`:""||""}${mine?` <span class="mut">${T_("· this storm","· 本熱帶氣旋")}</span>`:""}`;
  return `<tr class="${s===10?"s10":s===9?"s9":""}${mine?" me":""}"><td>${i}</td><td class="l">${nm}${NAR?sgB(s):""}</td>${NAR?"":`<td>${sgB(s)}</td>${SHOWCAT?`<td>${r.cat?(ZH?CAT[r.cat][1]:CAT[r.cat][0])+pre+(r.catbt?`<sup title="${T_("category from the Observatory’s best track","按天文台最佳路徑估計")}">≈</sup>`:""):"–"}</td>`:""}<td>${r.dir?(ZH?DIRZ[r.dir]:r.dir)+pre:"–"} ${r.km!=null?r.km+pre:""}</td><td>${r.a60!=null?r.a60.toFixed(1):"–"}</td>`}<td><b>${r.a10.toFixed(1)}</b></td><td>${r.g}${r.old&&r.nst<8?T_(` of ${r.nst}`,`／${r.nst}`):""||""}</td></tr>`};
 const FC=FILLF?caInfo(t):{};
 const rowF=i=>`<tr class="fc"><td>${i}</td><td class="l">${BASIC?T_("This path","此路徑"):T_("This forecast","本預報")} <span class="mut">${BASIC?"":who}</span></td>${NAR?"":`<td><span class="rksg rksgf">${T_("forecast","預測")}</span></td>${SHOWCAT?`<td>${FC.cat?(ZH?CAT[FC.cat][1]:CAT[FC.cat][0]):"–"}</td>`:""}<td>${FC.dir?(ZH?DIRZ[FC.dir]:FC.dir)+" "+FC.km:"–"}</td><td>–</td>`}<td>${Math.round(v)}</td><td>${gT}</td></tr>`;
 let body="", i=0, put=v==null; rows.forEach(r=>{if(!put&&r.a10<=v){i++; put=true; body+=rowF(i)} i++; body+=rowW(r,i)}); if(!put){i++; body+=rowF(i)}
 const head=NAR?`<tr><th>#</th><th class="l">${T_("Tropical cyclone","熱帶氣旋")}</th><th>${T_("8-station average, highest 10-min mean (km/h)","8 站最高十分鐘平均風速的平均（公里/小時）")}</th><th>${T_("Stations at gale (of 8)","達烈風站數")}</th></tr>`
  :`<tr><th rowspan="2">#</th><th rowspan="2" class="l">${T_("Tropical cyclone","熱帶氣旋")}</th><th rowspan="2">${T_("Highest signal","最高信號")}</th><th colspan="${SHOWCAT?2:1}">${T_("At closest approach","最接近香港天文台時")}</th><th colspan="2">${T_("8-station average of the highest mean wind (km/h)","8 個參考測風站最高平均風速的平均值（公里/小時）")}</th><th rowspan="2">${T_("Stations reaching gale (of 8)","達烈風站數（8 站中）")}</th></tr>`
   +`<tr>${SHOWCAT?`<th>${T_("Category","強度")}</th>`:""}<th>${T_("Direction and distance (km)","方位及距離（公里）")}</th><th>${T_("60-minute","60 分鐘")}</th><th>${T_("10-minute","10 分鐘")}</th></tr>`;
 return `<div class="rk" translate="no"><p class="rkfc">${v==null?T_(`This forecast (${who}): its storm stays too far from Hong Kong for station estimates, so it has no place in the table.${WH()?"":" Pick another member on the map, or see the past storms below."}`,`本預報（${who}）：熱帶氣旋距離香港太遠，沒有測風站估算，因此未能放入下表。${WH()?"":"可在地圖上選擇其他成員，或查看下表的過往熱帶氣旋。"}`):T_(`${BASIC?"This path":`This forecast (${who})`}: 8-station average about <b>${Math.round(v)} km/h</b>, gale at <b>${gT}</b> of the 8 stations — it would rank <b>${ordE(rk)}</b> of the ${n} below.${v<R8MIN?` Below ${R8MIN} km/h the estimate cannot place weaker storms finely: a rough position only.`:""}`,
   `${BASIC?"此路徑":`本預報（${who}）`}：8 站平均約 <b>${Math.round(v)} 公里/小時</b>，<b>${gT}</b> 個測風站達烈風 —— 在下表 ${n} 個熱帶氣旋中排第 <b>${rk}</b> 位。${v<R8MIN?`低於每小時 ${R8MIN} 公里時，這個估算未能精確區分較弱的熱帶氣旋，位置僅供大概參考。`:""}`)}</p>`
  +`<div class="rkctl"><span class="seg">${RKGRPS.map(([k,e,z])=>`<button type="button" data-rkgrp="${k}" class="${RKGRP===k?"on":""}">${T_(e,z)} (${R.filter(RKIN(k)).length})</button>`).join("")}</span>${`<button type="button" class="rkold${RKOLD?" on":""}" data-rkold="1">${RKOLD?"✓ ":""}${T_(`Include storms before 2007 (${(window.RANKOLD||[]).length})`,`包括 2007 年以前的熱帶氣旋（${(window.RANKOLD||[]).length}）`)}</button>`||""}</div>`
  +`<div class="rktw"><table class="rkt${NAR?" nar":""}"><thead>${head}</thead><tbody>${body}</tbody></table></div>`
  +`<p class="note">${T_(`Ranked by the 10-minute average, the one this site estimates (the Observatory's own table ranks by the 60-minute column). No. 8 or higher: the Observatory's 2007–2026 comparison table (cases in 2012 or earlier use the Lau Fau Shan station; # = preliminary). No. 3: the Observatory's tropical cyclone reports as compiled on Wikipedia. The forecast row is a reference only: one member's estimated station winds, averaged.${RKOLD?T_(" Storms before 2007 (marked h or ≈) come from Wikipedia's station tables or HKO's annual reports. Hourly means are converted to 10-minute equivalents with the ratio measured at these stations, and a station without a record is filled in from the others, scaled by its usual exposure, so their averages are estimates. Their gale count covers only the stations with a record. Storms with records from only 2 or 3 of the 8 stations are marked rough. Tested on storms since 2007 with every station known, the filled-in average is off by about 3 km/h with 2 or 3 stations (5 to 6 km/h for the strongest storms) and by under 1 km/h with 7. Before 1986 three stations read differently from today's sites, measured against Waglan Island in storms on similar tracks. Kai Tak read about 40% higher, Chek Lap Kok (then a hill station on the island) about 30% higher and Cheung Chau about 7% lower, so for 1979 to 1985 these three are scaled to today's sites before averaging.","2007 年以前的熱帶氣旋（標示 h 或 ≈）資料來自維基百科的測風站表格或天文台年刊。每小時平均風速按這些測風站的實測比率換算為十分鐘平均風速；缺少紀錄的測風站則按其他測風站的數值及該站一般的受風程度推算，故平均值只屬估算。烈風站數只計算有紀錄的測風站。八個測風站中只有兩或三個有紀錄的熱帶氣旋標示為「粗略」。以 2007 年以來所有測風站均有紀錄的熱帶氣旋測試，只有兩或三個測風站時，推算的平均值約相差每小時 3 公里（最強的熱帶氣旋相差 5 至 6 公里），有七個測風站時則相差不足 1 公里。1986 年以前，以橫瀾島作比較，在路徑相近的熱帶氣旋中，啟德的讀數約高出 40%，赤鱲角（當時為島上山頭的測風站）約高出 30%，長洲則約低 7%，因此 1979 至 1985 年這三站先換算至現址水平才計算平均值。"):""||""}`,
   `按 10 分鐘平均值排列（即本網站估算的數值；天文台的原表按 60 分鐘欄排列）。八號或以上：天文台 2007 至 2026 年比較表（2012 年或以前的個案以流浮山測風站統計；# 為初步數據）。三號：天文台熱帶氣旋報告（維基百科整理）。預測一行僅供參考：為單一成員估算的各站風速平均。`)}</p></div>`}
function memberStationGuide(t){
 if(!t.gst&&t.gale!=null&&Math.round(t.gale)>=1){$("#chead").textContent=`${memLab(t.m,1)} — estimated wind`;
  $("#stationchart").innerHTML=`<p class="note">Station numbers are not ready for this run yet.</p>`; $("#cnote").textContent=""; return}
 const hko=window.HK_DEMO?null:casesOf(cyc).map(c=>HKOWIND[c]).find(Boolean), rows=[];
 const pct=v=>v==null?"–":`${Math.round(100*v)}%`;
 const count=(label,v,lo,hi)=>{if(v==null)return ""; const rg=lo!=null&&hi!=null&&lo!==hi?` <span class="rng">(10th–90th percentile: ${lo}–${hi})</span>`:""; return `<span class="kv"><b>${label}</b> <b>${Math.round(v)}</b> of 8${rg}</span>`};
 for(let i=0;i<SGN.length;i++){
  const {g,s,h,fv,fb,guide,range}=stationWind(t,i);
  rows.push(`<tr class="sgrow" data-i="${i}" title="click: ${SGN[i][1]} in every member"><td>${SGN[i][1]}</td><td>${pct(g)}</td><td>${pct(s)}</td><td>${pct(h)}</td><td>${guide}</td>${window.HK_DEMO?"":`<td>${hko&&hko[i]!=null?windLabel(hko[i]):""}</td>`}${hko?`<td>${diffCell(fv,fb,hko[i])}</td>`:""}</tr>`);
 }
 $("#chead").textContent=`${memLab(t.m,1)}${defTag(t.m)} — estimated wind`;
 $("#stationchart").innerHTML=`<div class="gh">Forecast, at any time from this run onward</div><div class="sgcounts">${count("Reference stations reaching gale force",t.gale,t.gale_lo,t.gale_hi)}${count("Reference stations reaching storm force",t.storm_n,t.storm_lo,t.storm_hi)}${count("Reference stations reaching hurricane force",t.hur_n,t.hur_lo,t.hur_hi)}</div><table class="sgm"><thead><tr><th>Station</th><th>Gale</th><th>Storm</th><th>Hurricane</th><th>Wind guide, km/h</th>${window.HK_DEMO?"":"<th>HKO, km/h</th>"}${hko?"<th>Difference, km/h</th>":""}</tr></thead><tbody>${rows.join("")}</tbody></table>${rank8Member(t)}<div class="sgdistbox"></div><p class="note sghint">${BASIC?"Click a station to see the spread of possible winds there.":`Click a station to see its wind in each of the ${(GA&&GA.members)||50} members.`}</p>`;
 $("#cnote").textContent="";
}
function fillGale(){const f=document.getElementById("galeF"); if(!f)return;
 if(!TR||!TR.tracks||!GA){f.innerHTML="";return}
 const M=GA.members;
 const row=(k,lab)=>{const by={}; TR.tracks.forEach(t=>{if(t.m!==52||M<=1)by[t.m]=Math.max(by[t.m]||0,t[k]==null?0:Math.round(t[k]))});
  const v=Object.values(by); while(v.length<M)v.push(0); if(!v.length)return ""; v.sort((a,b)=>a-b);
  const q=p=>v[Math.min(v.length-1,Math.round(p*(v.length-1)))], md=q(.5), lo=q(.1), hi=q(.9);
  const dt=TR.tracks.find(t=>t.m===52&&M>1), dg=dt?(dt[k]==null?0:Math.round(dt[k])):null;
  return `<div><span class="gl">${lab}</span> ${gdots(md,GA.one?md:hi)} <b class="gn">${md}</b> of 8${GA.one||lo===hi?"":` <span class="rng">(10th–90th percentile: ${lo}–${hi})</span>`}${dg!=null?` <span class="rng">· deterministic run: ${dg}</span>`:""}</div>`};
 f.innerHTML=`<div class="gh">Reference stations, forecast (any time from this run)</div>`+row("gale","Gale force")+(TR.tracks.some(t=>t.storm_n!=null)?row("storm_n","Storm force")+row("hur_n","Hurricane force"):"")+stationGuide()}
{const sc=document.getElementById("stationchart"); if(sc)sc.addEventListener("click",e=>{const tr=e.target.closest("tr.sgrow"); if(!tr||!TR)return;
 const box=sc.querySelector(".sgdistbox"), was=tr.classList.contains("sgon"); sc.querySelectorAll("tr.sgon").forEach(r=>r.classList.remove("sgon"));
 if(!box)return; if(was){box.innerHTML="";return}
 const t=stationTrack(); if(!t)return; tr.classList.add("sgon"); box.innerHTML=stationDist(+tr.dataset.i,t,box.clientWidth-26);
 try{box.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(x){}})}
