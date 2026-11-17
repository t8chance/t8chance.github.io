(function(){
 var R=document.documentElement, K="hk_theme";
 function saved(){try{var t=localStorage.getItem(K); return t==="light"||t==="dark"?t:""}catch(e){return ""}}
 function sys(){return window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}
 function now(){return R.getAttribute("data-theme")||sys()}
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
 var t0=saved(); if(t0)R.setAttribute("data-theme",t0);
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
 if(window.matchMedia){var m=matchMedia("(prefers-color-scheme: dark)"), f=function(){if(!R.getAttribute("data-theme")){label(); try{window.dispatchEvent(new Event("hk-theme"))}catch(e){}}};
  if(m.addEventListener)m.addEventListener("change",f); else if(m.addListener)m.addListener(f)}
})();
