(function(){
 var R=document.documentElement, K="hk_theme";
 function saved(){try{var t=localStorage.getItem(K); return t==="light"||t==="dark"?t:""}catch(e){return ""}}
 function sys(){return window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}
 function now(){return R.getAttribute("data-theme")||sys()}
 function sunHK(d){var N=Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(d.getFullYear(),0,0))/864e5), g=2*Math.PI/365*(N-0.5),
  eq=229.18*(0.000075+0.001868*Math.cos(g)-0.032077*Math.sin(g)-0.014615*Math.cos(2*g)-0.040849*Math.sin(2*g)),
  de=0.006918-0.399912*Math.cos(g)+0.070257*Math.sin(g)-0.006758*Math.cos(2*g)+0.000907*Math.sin(2*g)-0.002697*Math.cos(3*g)+0.00148*Math.sin(3*g),
  la=22.3*Math.PI/180, ha=Math.acos(Math.cos(90.833*Math.PI/180)/(Math.cos(la)*Math.cos(de))-Math.tan(la)*Math.tan(de))*180/Math.PI, noon=720-4*114.17-eq+480;
  return [noon-4*ha, noon+4*ha]}
 function byTime(){var d=new Date(), m=d.getHours()*60+d.getMinutes(), r=sunHK(d); return m>=r[0]&&m<r[1]?"light":"dark"}
 function mq(){var t=R.getAttribute("data-theme"); return t==="dark"?"all":t==="light"?"not all":"(prefers-color-scheme: dark)"}
 function pics(){var s=document.querySelectorAll("source[media*='prefers-color-scheme'],source[data-dkmq]");
  for(var i=0;i<s.length;i++){if(!s[i].hasAttribute("data-dkmq"))s[i].setAttribute("data-dkmq","1"); s[i].setAttribute("media",mq())}}
 function zh(){return /^zh/.test(R.lang||"")}
 function label(){var d=now()==="dark", t=zh()?(d?"改用淺色顯示":"改用深色顯示"):(d?"Show light colours":"Show dark colours");
  var b=document.getElementById("themesw"); if(b){b.textContent=zh()?(d?"淺色":"深色"):(d?"Light":"Dark"); b.title=t; b.setAttribute("aria-label",t)}
  var n=document.getElementById("themenav"); if(n)n.textContent=zh()?(d?"淺色顯示":"深色顯示"):(d?"Light colours":"Dark colours")}
 function apply(t){if(t)R.setAttribute("data-theme",t); else R.removeAttribute("data-theme");
  pics(); label(); try{window.dispatchEvent(new Event("hk-theme"))}catch(e){}
  var fr=document.querySelectorAll("iframe");
  for(var i=0;i<fr.length;i++){try{var w=fr[i].contentWindow; if(w&&w.HKTHEME)w.HKTHEME.apply(t)}catch(e){}}}
 function set(t){try{if(t)localStorage.setItem(K,t); else localStorage.removeItem(K)}catch(e){} apply(t)}
 var t0=saved(); R.setAttribute("data-theme",t0||byTime());
 setInterval(function(){if(!saved()){var t=byTime(); if(t!==R.getAttribute("data-theme"))apply(t)}},300000);
 window.HKTHEME={now:now, dark:function(){return now()==="dark"}, mq:mq, apply:apply};
 function mount(){
  pics();
  var band=document.querySelector(".mast .band"); if(!band||document.getElementById("themesw"))return;
  if(window.top!==window.self)return;
  var go=function(){set(now()==="dark"?"light":"dark")};
  var b=document.createElement("button"); b.type="button"; b.id="themesw"; b.className="themesw"; b.onclick=go;
  var menu=band.querySelector(".menu"); band.insertBefore(b,menu||null);
  var nav=band.querySelector("nav"); if(nav){var n=document.createElement("button"); n.type="button"; n.id="themenav"; n.className="themenav"; n.onclick=go; nav.appendChild(n)}
  var st=document.createElement("style");
  st.textContent=".mast nav .themenav{display:none}@media (max-width:860px){.mast .band>.themesw{display:none}"
   +".mast nav .themenav{display:block;width:100%;text-align:left;background:none;border:0;border-radius:0;color:var(--bandink);font:400 17px/1.2 var(--body);padding:12px 0;cursor:pointer}}";
  document.head.appendChild(st); label()}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount); else mount();

})();
