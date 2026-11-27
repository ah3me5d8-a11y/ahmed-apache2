/* آية اليوم — script مستقل تمامًا (IIFE، لا يلمس أي عنصر خارج ayahday*) */
(function(){
  "use strict";
  var VERSES=[
    {t:"قُلْ هُوَ ٱللَّهُ أَحَدٌ",s:"الإخلاص",a:1,n:4},
    {t:"ٱللَّهُ ٱلصَّمَدُ",s:"الإخلاص",a:2,n:4},
    {t:"إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ",s:"الكوثر",a:1,n:3},
    {t:"فَصَلِّ لِرَبِّكَ وَٱنْحَرْ",s:"الكوثر",a:2,n:3},
    {t:"وَٱلْعَصْرِ",s:"العصر",a:1,n:3},
    {t:"إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ",s:"العصر",a:2,n:3},
    {t:"ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",s:"الفاتحة",a:2,n:7},
    {t:"إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",s:"الشرح",a:6,n:8},
    {t:"مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",s:"الضحى",a:3,n:11},
    {t:"إِنَّآ أَنزَلْنَٰهُ فِى لَيْلَةِ ٱلْقَدْرِ",s:"القدر",a:1,n:5},
    {t:"فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ",s:"الزلزلة",a:7,n:8},
    {t:"قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",s:"الفلق",a:1,n:5},
    {t:"قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",s:"الناس",a:1,n:6},
    {t:"وَقُل رَّبِّ زِدْنِى عِلْمًا",s:"طه",a:114,n:135},
    {t:"فَٱذْكُرُونِىٓ أَذْكُرْكُمْ وَٱشْكُرُوا۟ لِى وَلَا تَكْفُرُونِ",s:"البقرة",a:152,n:286}
  ];
  function pick(){
    for(var i=0;i<VERSES.length;i++){ if(!(VERSES[i].a>=1&&VERSES[i].a<=VERSES[i].n)) return null; }
    var d=new Date(); var seed=d.getFullYear()*1000+d.getMonth()*40+d.getDate();
    return VERSES[seed%VERSES.length];
  }
  function render(v){
    var t=document.getElementById("ayahdayText"), m=document.getElementById("ayahdayMeta");
    if(!t||!m||!v) return; t.textContent=v.t; m.textContent="سورة "+v.s+" • آية "+v.a;
  }
  document.addEventListener("DOMContentLoaded",function(){
    render(pick());
    var b=document.getElementById("ayahdayBtn");
    if(b) b.addEventListener("click",function(){
      var v=VERSES[Math.floor(Math.random()*VERSES.length)]; render(v);
    });
  });
  render(pick());
  var bb=document.getElementById("ayahdayBtn");
  if(bb) bb.addEventListener("click",function(){
    var v=VERSES[Math.floor(Math.random()*VERSES.length)]; render(v);
  });
})();

(function(){
"use strict";
/* قدرات الـ runtime المستخدمة: sample (قراءة الصور بالذكاء الاصطناعي عبر generateText مع صورة) و downloads (تنزيل الصور عبر روابط blob). لا شبكات خارجية ولا تخزين. */
var PASS_HASH="3aaa46d7e7cb167245a8dc75a7edf450a29362b520c50ce027c096d71bd8be2f";
function normAr(s){
  s=String(s==null?"":s);
  s=s.replace(/[ً-ْٰـ]/g,"");
  s=s.replace(/[أإآء]/g,"ا").replace(/ؤ/g,"و").replace(/ئ/g,"ي").replace(/ى/g,"ي").replace(/ة/g,"ه");
  try{ s=s.replace(/[^\p{L}\p{N} ]+/gu," "); }catch(e){ s=s.replace(/[^A-Za-z0-9\u0600-\u06FF ]+/g," "); }
  return s.replace(/\s+/g," ").trim();
}
async function sha256hex(str){
  var b=new TextEncoder().encode(str);
  var h=await crypto.subtle.digest("SHA-256",b);
  return Array.from(new Uint8Array(h)).map(function(x){return x.toString(16).padStart(2,"0")}).join("");
}
function $(id){return document.getElementById(id)}
function R(){ return null; /* نسخة الملفات المستقلة: لا يوجد Perchance runtime */ }
function AI_AVAILABLE(){ var r=R(); return !!(r&&r.generateText); }

/* viewport-fit=cover للصفحة المنشورة */
try{var m=document.querySelector('meta[name=viewport]');if(m){var c=m.getAttribute("content")||"";if(c.indexOf("viewport-fit")<0){m.setAttribute("content",c+(c?", ":"")+"viewport-fit=cover");}}}catch(e){}

/* ---------- القفل ---------- */
var lockScreen=$("lockScreen"),app=$("app"),lockInput=$("lockInput"),lockBtn=$("lockBtn"),lockErr=$("lockErr");
async function tryUnlock(){
  var v=lockInput.value||"";
  if(!v.trim()){lockErr.textContent="اكتب الجملة أولًا.";return}
  lockErr.textContent="جارٍ التحقق…";
  try{
    var h=await sha256hex(normAr(v));
    if(h===PASS_HASH){lockScreen.hidden=true;app.hidden=false;lockErr.textContent="";try{lockInput.value=""}catch(e){}}
    else lockErr.textContent="الجملة غير مطابقة. انسخها من البطاقة أعلاه والصقها.";
  }catch(e){lockErr.textContent="تعذّر التحقق في هذا المتصفح."}
}
lockBtn.addEventListener("click",tryUnlock);
lockInput.addEventListener("keydown",function(e){if(e.key==="Enter")tryUnlock()});

/* ---------- الحالة ---------- */
var ORDER=["cardFront","cardBack","licFront","licBack","personal"];
var LABEL={cardFront:"بطاقة أمامي",cardBack:"بطاقة خلفي",licFront:"رخصة أمامي",licBack:"رخصة خلفي",personal:"صورة شخصية"};
var state={imgs:{},data:null,zoneRaw:"",zoneInfo:null,assign:"new",extractDate:null,lectureOpened:false,needDouble:false,genHandles:[]};
window.__app={state:state};
function hasLicense(){return !!(state.imgs.licFront||state.imgs.licBack)}
function updateExtractBtn(){$("extractBtn").disabled=!(state.imgs.cardFront&&state.imgs.cardBack)}

/* ---------- الصور ---------- */
function renderSlots(){
  ORDER.forEach(function(k){
    var slot=document.querySelector('.slot[data-key="'+k+'"]');if(!slot)return;
    var ph=slot.querySelector(".ph");var it=state.imgs[k];
    ph.innerHTML="";
    slot.classList.toggle("filled",!!(it&&it.url));
    if(it&&it.url){var im=document.createElement("img");im.src=it.url;im.alt=LABEL[k];ph.appendChild(im)}
    else{var s=document.createElement("span");s.textContent="لا صورة";ph.appendChild(s)}
  });
  renderImgList();updateExtractBtn();
}
function fileToResizedBlob(file){
  return new Promise(function(res,rej){
    var img=new Image();
    var url=URL.createObjectURL(file);
    img.onload=function(){
      try{
        var w=img.naturalWidth||1600,h=img.naturalHeight||1200;
        var sc=Math.min(1,1800/Math.max(w,h));
        var cw=Math.max(1,Math.round(w*sc)),ch=Math.max(1,Math.round(h*sc));
        var cv=document.createElement("canvas");cv.width=cw;cv.height=ch;
        cv.getContext("2d").drawImage(img,0,0,cw,ch);
        URL.revokeObjectURL(url);
        if(cv.toBlob)cv.toBlob(function(b){b?res(b):rej(new Error("resize"))},"image/jpeg",0.85);
        else rej(new Error("canvas"));
      }catch(e){rej(e)}
    };
    img.onerror=function(){URL.revokeObjectURL(url);rej(new Error("load"))};
    img.src=url;
  });
}
async function setSlot(key,file){
  var blob=file;
  try{ if(file&&file.type&&file.type.indexOf("image/")===0){blob=await fileToResizedBlob(file)} }catch(e){blob=file}
  if(state.imgs[key]&&state.imgs[key].url){try{URL.revokeObjectURL(state.imgs[key].url)}catch(e){}}
  state.imgs[key]={blob:blob,url:URL.createObjectURL(blob)};
  renderSlots();
}
function clearSlot(key){
  if(state.imgs[key]&&state.imgs[key].url){try{URL.revokeObjectURL(state.imgs[key].url)}catch(e){}}
  delete state.imgs[key];renderSlots();
}
function emptyKeys(){return ORDER.filter(function(k){return !state.imgs[k]})}
async function distributeFiles(files){
  var list=Array.prototype.slice.call(files||[]).filter(function(f){return f&&(f.type||"").indexOf("image/")===0});
  if(!list.length)return;
  var empt=emptyKeys();
  for(var i=0;i<list.length&&i<empt.length;i++){await setSlot(empt[i],list[i])}
}
document.querySelectorAll('input[type=file][data-slot]').forEach(function(inp){
  inp.addEventListener("change",function(){if(inp.files&&inp.files[0])setSlot(inp.getAttribute("data-slot"),inp.files[0]);inp.value=""});
});
document.querySelectorAll('.slot [data-act]').forEach(function(b){
  b.addEventListener("click",function(){
    var k=b.getAttribute("data-slot"),a=b.getAttribute("data-act");
    if(a==="del")clearSlot(k);
    else{var s=document.querySelector('.slot[data-key="'+k+'"] input[data-slot]');if(s)s.click()}
  });
});
document.querySelectorAll(".slot").forEach(function(slot){
  ["dragenter","dragover"].forEach(function(ev){slot.addEventListener(ev,function(e){e.preventDefault();slot.classList.add("drag")})});
  ["dragleave","drop"].forEach(function(ev){slot.addEventListener(ev,function(e){e.preventDefault();slot.classList.remove("drag")})});
  slot.addEventListener("drop",function(e){
    var k=slot.getAttribute("data-key");
    if(e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files.length){
      var f=e.dataTransfer.files[0];
      if((f.type||"").indexOf("image/")===0)setSlot(k,f);
    }
  });
});
var dropTop=$("dropTop"),topFiles=$("topFiles");
["dragenter","dragover"].forEach(function(ev){dropTop.addEventListener(ev,function(e){e.preventDefault();dropTop.classList.add("over")})});
["dragleave","drop"].forEach(function(ev){dropTop.addEventListener(ev,function(e){e.preventDefault();dropTop.classList.remove("over")})});
dropTop.addEventListener("drop",function(e){if(e.dataTransfer&&e.dataTransfer.files)distributeFiles(e.dataTransfer.files)});
dropTop.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();topFiles.click()}});
topFiles.addEventListener("change",function(){distributeFiles(topFiles.files);topFiles.value=""});
document.addEventListener("paste",function(e){
  if(lockScreen&&!lockScreen.hidden)return;
  if(e.clipboardData&&e.clipboardData.files&&e.clipboardData.files.length)distributeFiles(e.clipboardData.files);
});

/* ---------- أدوات التاريخ والأرقام ---------- */
function arToLat(s){return String(s==null?"":s).replace(/[٠-٩]/g,function(d){return "٠١٢٣٤٥٦٧٨٩".indexOf(d)}).replace(/[۰-۹]/g,function(d){return "۰۱۲۳۴۵۶۷۸۹".indexOf(d)})}
function cairoParts(d){
  try{
    var p=new Intl.DateTimeFormat("en-CA",{timeZone:"Africa/Cairo",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
    var a=p.split("-");return {y:+a[0],m:+a[1],d:+a[2]};
  }catch(e){return {y:d.getFullYear(),m:d.getMonth()+1,d:d.getDate()}}
}
function cairoToday(){return cairoParts(new Date())}
function cairoTomorrow(base){
  var b=base||new Date();
  var p=cairoParts(b);
  var noonUTC=new Date(Date.UTC(p.y,p.m-1,p.d+1,12,0,0));
  return cairoParts(noonUTC);
}
function fmtDMY(y,m,d){return String(d).padStart(2,"0")+"/"+String(m).padStart(2,"0")+"/"+y}
function parseDMY(s){
  s=arToLat(String(s||"").trim()).replace(/[-.]/g,"/").replace(/\s+/g,"/");
  var m=s.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);if(!m)return null;
  var d=+m[1],mo=+m[2],y=+m[3];if(y<100)y+=y>=30?1900:2000;
  if(mo<1||mo>12||d<1||d>31)return null;
  var dt=new Date(Date.UTC(y,mo-1,d));
  if(dt.getUTCFullYear()!==y||dt.getUTCMonth()!==mo-1||dt.getUTCDate()!==d)return null;
  return {y:y,m:mo,d:d};
}
function isFutureYMD(o){var t=cairoToday();if(o.y!==t.y)return o.y>t.y;if(o.m!==t.m)return o.m>t.m;return o.d>t.d}
function isExpiredDMY(s){var o=parseDMY(s);if(!o)return false;var t=cairoToday();if(o.y!==t.y)return o.y<t.y;if(o.m!==t.m)return o.m<t.m;return o.d<t.d}

/* ---------- الرقم القومي الذكي + الهاتف ---------- */
var GOV=new Set(["01","02","03","04","11","12","13","14","15","16","17","18","19","21","22","23","24","25","26","27","28","29","31","32","33","34","35","88"]);
var GOV_NAME={"01":"القاهرة","02":"الإسكندرية","03":"بورسعيد","04":"السويس","11":"دمياط","12":"الدقهلية","13":"الشرقية","14":"القليوبية","15":"كفر الشيخ","16":"الغربية","17":"المنوفية","18":"البحيرة","19":"الإسماعيلية","21":"الجيزة","22":"بني سويف","23":"الفيوم","24":"المنيا","25":"أسيوط","26":"سوهاج","27":"قنا","28":"أسوان","29":"الأقصر","31":"البحر الأحمر","32":"الوادي الجديد","33":"مطروح","34":"شمال سيناء","35":"جنوب سيناء","88":"خارج الجمهورية"};
function cleanNID(s){
  s=arToLat(String(s==null?"":s));
  s=s.replace(/[Oo]/g,"0").replace(/[lI|!]/g,"1");
  s=s.replace(/\D/g,"");
  if(s.length>14){var m=s.match(/[23]\d{13}/);if(m)s=m[0];else s=s.slice(0,14)}
  return s;
}
function cleanPhone(s){return arToLat(String(s==null?"":s)).replace(/\D/g,"")}
function carrierOf(p){
  if(/^010/.test(p))return "فودافون";
  if(/^011/.test(p))return "اتصالات e&";
  if(/^012/.test(p))return "أورانج";
  if(/^015/.test(p))return "WE";
  return "";
}
function validatePhone(p){
  p=cleanPhone(p);
  if(!p)return {ok:false,reason:"empty",clean:""};
  if(!/^01\d{9}$/.test(p)){
    if(p.length!==11)return {ok:false,reason:"لازم 11 رقمًا ويبدأ بـ 01",clean:p};
    return {ok:false,reason:"مقدمة غير مصرية (010/011/012/015)",clean:p};
  }
  if(!/^01[0125]/.test(p))return {ok:false,reason:"الرقم الثالث لازم 0 أو 1 أو 2 أو 5",clean:p};
  return {ok:true,clean:p,carrier:carrierOf(p)};
}
function birthFromNID(nid){
  var c=+nid[0];var yy=+nid.slice(1,3),mm=+nid.slice(3,5),dd=+nid.slice(5,7);
  var full=(c===2?1900:2000)+yy;
  return {y:full,m:mm,d:dd};
}
function validDateYMD(y,m,d){
  if(m<1||m>12||d<1||d>31)return false;
  var dt=new Date(Date.UTC(y,m-1,d));
  return dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d;
}
function calcAge(b){
  try{var t=cairoToday();var a=t.y-b.y;if(t.m<b.m||(t.m===b.m&&t.d<b.d))a--;return a}catch(e){return null}
}
function validateNID(nid){
  nid=cleanNID(nid);
  if(!nid)return {ok:false,reason:"فارغ",clean:""};
  if(nid.length<14)return {ok:false,reason:"ناقص — "+nid.length+"/14",clean:nid};
  if(!/^\d{14}$/.test(nid))return {ok:false,reason:"ليس 14 رقمًا",clean:nid};
  if(nid[0]!=="2"&&nid[0]!=="3")return {ok:false,reason:"الأول لازم 2 أو 3",clean:nid,first:nid[0]};
  var b=birthFromNID(nid);
  if(!validDateYMD(b.y,b.m,b.d))return {ok:false,reason:"تاريخ ميلاد داخل الرقم غير صحيح",clean:nid};
  if(isFutureYMD(b))return {ok:false,reason:"تاريخ الميلاد مستقبلي",clean:nid};
  var gov=nid.slice(7,9);
  if(!GOV.has(gov))return {ok:false,reason:"كود المحافظة («"+gov+"») غير صحيح",clean:nid};
  return {ok:true,birth:b,clean:nid};
}
function parseNIDSmart(raw){
  var c=cleanNID(raw);
  var v=validateNID(c);
  if(!v.ok)return {ok:false,clean:c,reason:v.reason};
  var nid=v.clean,b=v.birth;
  var gd=+nid[12],gender=(gd%2===1)?"ذكر":"أنثى";
  var gov=nid.slice(7,9);
  return {ok:true,clean:nid,birth:b,birthStr:fmtDMY(b.y,b.m,b.d),age:calcAge(b),gov:gov,govName:GOV_NAME[gov]||gov,gender:gender,century:nid[0]==="2"?"مواليد 1900s":"مواليد 2000s",serial:nid.slice(9,13)};
}
function smartVoteNID(n1,n2){
  n1=cleanNID(n1||"");n2=cleanNID(n2||"");
  var v1=n1?validateNID(n1):null,v2=n2?validateNID(n2):null;
  if(n1&&n2){
    if(n1===n2&&v1&&v1.ok)return {nid:n1,warn:"",both:true};
    if(n1===n2)return {nid:"",warn:"القراءتان متطابقتان لكن التركيب غير صحيح («"+(v1?v1.reason:"")+"») — صوّر صورة أوضح.",both:true};
    var diffs=[],L=Math.max(n1.length,n2.length);
    for(var i=0;i<L;i++){if((n1[i]||"")!==(n2[i]||""))diffs.push(i+1)}
    var pos=diffs.slice(0,6).join("، ");
    if(v1&&v1.ok&&!(v2&&v2.ok))return {nid:n1,warn:"اعتمدنا القراءة الأولى (الثانية غير صالحة) — راجعها بعناية. الاختلاف في خانة: "+pos,diff:diffs};
    if(v2&&v2.ok&&!(v1&&v1.ok))return {nid:n2,warn:"اعتمدنا القراءة الثانية (الأولى غير صالحة) — راجعها بعناية. الاختلاف في خانة: "+pos,diff:diffs};
    if(v1&&v1.ok&&v2&&v2.ok)return {nid:"",warn:"القراءتان صالحتان لكن مختلفتان في "+diffs.length+" خانات ("+pos+") — اترك فارغًا وصوّر أوضح.",diff:diffs};
    return {nid:"",warn:"القراءتان مختلفتان وغير صالحتين (خانات: "+pos+") — صوّر أوضح.",diff:diffs};
  }else if(n1&&!n2){
    if(v1&&v1.ok)return {nid:n1,warn:"قُرئ مرة واحدة — راجع إملاءه بعناية.",single:true};
    return {nid:"",warn:"قراءة واحدة غير صحيحة («"+v1.reason+"») — صوّر أوضح.",single:true};
  }else if(!n1&&n2){
    if(v2&&v2.ok)return {nid:n2,warn:"قُرئ مرة واحدة — راجع إملاءه بعناية.",single:true};
    return {nid:"",warn:"قراءة واحدة غير صحيحة («"+v2.reason+"») — صوّر أوضح.",single:true};
  }
  return {nid:"",warn:"تعذّرت قراءة الرقم القومي — صوّر أوضح."};
}
window.__app.validateNID=validateNID;
window.__app.parseNIDSmart=parseNIDSmart;window.__app.validatePhone=validatePhone;window.__app.smartVoteNID=smartVoteNID;window.__app.carrierOf=carrierOf;
window.__app._setSlot=setSlot;window.__app._render=renderSlots;window.__app._apply=applyExtraction;window.__app._sync=syncPanelsFromData;window.__app._rebuild=rebuildAll;window.__app._dates={cairoParts:cairoParts,cairoTomorrow:cairoTomorrow,parseDMY:parseDMY,isExpiredDMY:isExpiredDMY};

/* ---------- الزون ---------- */
var ZONE_GROUPS=[
  {keys:["مصر الجديده","مصر الجديدة"],hq:"مدينة نصر",sup:"بلال",tpl:"cairo"},
  {keys:["مدينه نصر","مدينة نصر"],hq:"مدينة نصر",sup:"بلال",tpl:"cairo"},
  {keys:["عين شمس"],hq:"مدينة نصر",sup:"بلال",tpl:"cairo"},
  {keys:["المهندسين"],hq:"المهندسين",sup:"عبدالله طارق",tpl:"cairo"},
  {keys:["شبرا مصر","شبرا"],hq:"المهندسين",sup:"عبدالله طارق",tpl:"cairo"},
  {keys:["الهرم"],hq:"الهرم",sup:"عبدالله طارق",tpl:"cairo"},
  {keys:["التحرير"],hq:"الهرم",sup:"عبدالله طارق",tpl:"cairo"},
  {keys:["التجمع"],hq:"التجمع",sup:"محمد سامي",tpl:"cairo"},
  {keys:["الشيخ زايد"],hq:"أكتوبر",sup:"عبدالرحمن سامي",tpl:"cairo"},
  {keys:["زايد"],hq:"أكتوبر",sup:"عبدالرحمن سامي",tpl:"cairo"},
  {keys:["اكتوبر","أكتوبر"],hq:"أكتوبر",sup:"عبدالرحمن سامي",tpl:"cairo"},
  {keys:["بالم هيلز","بالم"],hq:"أكتوبر",sup:"عبدالرحمن سامي",tpl:"cairo"},
  {keys:["المعادي"],hq:"المعادي",sup:"عمر شعبان",tpl:"maadi",opening:"المعادي"},
  {keys:["حلوان"],hq:"المعادي",sup:"عمر شعبان",tpl:"maadi",opening:"حلوان"},
  {keys:["اسكندريه","الإسكندرية","الاسكندريه","alexandria"],hq:"",sup:"سيف",tpl:"alex"}
];
function normZone(s){
  s=String(s||"").toLowerCase();
  s=s.replace(/[ً-ْٰـ]/g,"");
  s=s.replace(/[أإآء]/g,"ا").replace(/ؤ/g,"و").replace(/ئ/g,"ي").replace(/ى/g,"ي").replace(/ة/g,"ه");
  try{s=s.replace(/[^\p{L}\p{N} ]+/gu," ")}catch(e){s=s.replace(/[^A-Za-z0-9\u0600-\u06FF ]+/g," ")}
  return s.replace(/\s+/g," ").trim();
}
var NORM_GROUPS=ZONE_GROUPS.map(function(g){return {nkeys:g.keys.map(normZone),hq:g.hq,sup:g.sup,tpl:g.tpl,opening:g.opening||null}});
function matchZone(raw){
  var n=normZone(String(raw||"").replace(/زون/g," "));
  if(!n)return {hq:"",sup:"عبدالله طارق",tpl:"cairo",opening:"",warn:"الزون فارغ — استخدمت القاهرة الافتراضية والمشرف عبدالله طارق."};
  var best=null;
  NORM_GROUPS.forEach(function(g){
    g.nkeys.forEach(function(k){
      if(k&&n.indexOf(k)>=0){if(!best||k.length>best.k.length)best={g:g,k:k}}
    });
  });
  if(!best)return {hq:"",sup:"عبدالله طارق",tpl:"cairo",opening:"",warn:"الزون غير مدرج («"+String(raw).slice(0,40)+"») — استخدمت القاهرة الافتراضية والمشرف عبدالله طارق."};
  return {hq:best.g.hq,sup:best.g.sup,tpl:best.g.tpl,opening:best.g.opening||"",warn:""};
}
window.__app.matchZone=matchZone;window.__app.normZone=normZone;
var FORM_ZONES=["التجمعات","العبور","مدينة نصر","عين شمس","مصر الجديدة","المعادى","المقطم","شبرا","الهرم","التحرير","المهندسين","بالم","الشيخ زايد","اكتوبر","الواحات","حلوان","اسكندرية","حدايق القبه","حدايق الاهرام","مدينتى","الشروق","الرحاب","جولدن اسكوير","القرية الذكية"];
function zoneToFormChoice(raw){
  var n=" "+normZone(raw)+" ";
  function has(){for(var i=0;i<arguments.length;i++){if(n.indexOf(" "+normZone(arguments[i])+" ")>=0||n.indexOf(normZone(arguments[i]))>=0)return true}return false}
  if(n.indexOf("تجمع")>=0)return "التجمعات";
  if(n.indexOf("شبرا")>=0)return "شبرا";
  if(n.indexOf("بالم")>=0)return "بالم";
  if(n.indexOf("مدينه نصر")>=0)return "مدينة نصر";
  if(n.indexOf("عين شمس")>=0)return "عين شمس";
  if(n.indexOf("مصر الجديده")>=0)return "مصر الجديدة";
  if(n.indexOf("معاد")>=0)return "المعادى";
  if(n.indexOf("حلوان")>=0)return "حلوان";
  if(n.indexOf("هرم")>=0&&n.indexOf("حدايق الاهرام")<0)return "الهرم";
  if(n.indexOf("تحرير")>=0)return "التحرير";
  if(n.indexOf("مهندسين")>=0)return "المهندسين";
  if(n.indexOf("شيخ زايد")>=0)return "الشيخ زايد";
  if(n.indexOf("زايد")>=0)return "الشيخ زايد";
  if(n.indexOf("اكتوبر")>=0)return "اكتوبر";
  if(n.indexOf("اسكندريه")>=0||n.indexOf("alexandria")>=0)return "اسكندرية";
  for(var i=0;i<FORM_ZONES.length;i++){if(n.indexOf(normZone(FORM_ZONES[i]))>=0)return FORM_ZONES[i]}
  return "";
}
var FORM_EYES=["مريم محمود","كريم","رحاب","روان","شروق","مشرفين المكتب","احمد حسن","احمد اميز","دعاء","وعد","عبدالحميد","هشام هيثم","محمود مصطفي","مهند","ملك اسكندريه","مصطفي احمد","عمر جمال","حفصه"];
var FORM_BONUS=["4000","بدون","5000"];
var FORM_HOURS=["6","7","8","9","10","11","12"];
var FORM_OPS=["مكتب خالد هلال","مكتب حسنى","مكتب ابراهيم","مكتب حسن شعبان","فهد (اسكندرية)","مكتب طه البطل","كريم امام مقر اكتوبر","زياد وليد","خالد هاني مدينه نصر","مكتب رجب","محمد رضا تجمع","مكتب اسامه عسكر","مكتب بهجت","مكتب احمد العالمي","مكتب عشري","نصار المعادي","مكتب تايسون"];
var FORM_SUPS=["حسني طه ( مكتب )","سيف اسكندرية","كريم امام (بالم)","خالد هاني ( مصر الجديدة ج)","عمر شعبان ( موتوسيكلات)","زياد اسكندرية","ابراهيم مصطفي ( مكتب)","رضا جمال ( بالم هيلز)","فهد ( اسكندرية ق)","مكتب (حسن شعبان)","محمود عشري (زايد)","حسين (زايد)","احمد عبدالفتاح(زايد)","عبدالله شعبان (الشيخ زايد)","شعبان الهرم","حسام حته اكتوبر","سامح شبل المهندسين","عماد التحرير","احمد عادل حلوان","عمر اشرف المعادي","عبدالرحمن المنوفي التجمع","محمد طارق شبرا","محمود الهرم","يوسف مصر الجديده","خالد هاني مشرف عين شمس","كريم مرجان","مكتب طه البطل","مكتب خالد هلال","مكتب حسن شعبان","مكتب عشري","مكتب احمد العالمي","مكتب بهجت","مهاب مشرف مدينه نصر","مكتب رجب","مكتب اسامه","مكتب تايسون","عبدالرحمن منتصر"];
function supToFormChoice(sup){
  sup=normZone(sup||"");if(!sup)return "";
  var hits=FORM_SUPS.filter(function(o){return normZone(o).indexOf(sup)>=0||sup.indexOf(normZone(o))>=0});
  if(hits.length===1)return hits[0];
  /* احتياط: عمر شعبان وسيف فقط كما في المواصفة */
  if(sup.indexOf(normZone("عمر شعبان"))>=0)return "عمر شعبان ( موتوسيكلات)";
  if(sup===normZone("سيف"))return "سيف اسكندرية";
  return "";
}
function fillSelect(el,items,allowEmpty){
  el.innerHTML="";
  if(allowEmpty!==false){var o=document.createElement("option");o.value="";o.textContent="— اختر —";el.appendChild(o)}
  items.forEach(function(v){var o=document.createElement("option");o.value=v;o.textContent=v;el.appendChild(o)});
}
fillSelect($("fZone"),FORM_ZONES);fillSelect($("fEye"),FORM_EYES);fillSelect($("fBonus"),FORM_BONUS);fillSelect($("fHours"),FORM_HOURS);fillSelect($("fOps"),FORM_OPS);fillSelect($("fSup"),FORM_SUPS);
$("fHours").value="8";$("fHours").dataset.manual="1";

/* ---------- القوالب (حرفيًا) ---------- */
var NOM_LINK="https://to.talabat.com/a/95u772b";
function buildCairo(d,zi,assign,lic){
  var L=[];
  L.push("فورم المحاضرات","","اسم المشرف : "+(d.supervisor||""),"","الاسم الأول : "+(d.nameAr||""),"","عنوان الطيار : "+(d.address||""),"","الرقم القومي : "+(d.nid||""),"تاريخ الميلاد : "+(d.birth||""),"","تاريخ انتهاء البطاقة : "+(d.cardExp||""),"","رقم التليفون : "+(d.phone||""),"نوع المركبة : "+(lic?"مكنة":"عجلة"),"");
  if(lic){L.push("نمره المركبه : "+(d.plate||""),"","تاريخ انتهاء الرخصه : "+(d.licExp||""),"")}
  L.push("مقر حضور : "+(zi.hq||""),"","الزون : "+(state.zoneRaw||""),"","نوع التعيين : "+(assign==="new"?"جديد":"إعادة تعيين"));
  if(assign==="new")L.push("","كود الترشيح : "+NOM_LINK);
  return L.join("\n");
}
function buildMaadi(d,zi,assign,lic){
  var L=[];
  L.push("اسم المكتب: أباتشى","اسم المشرف: عمر شعبان","نوع التعيين: "+(assign==="new"?"جديد":"إعادة تعيين"),"اسم مقر طلبات الذي سيتم حضور المحاضرة من خلال: مقر المعادي","","البيانات الشخصية:","• الاسم رباعي: "+(d.nameAr||""),"• رقم التليفون : "+(d.phone||""),"• الرقم  القومي: "+(d.nid||""),"بيانات المركبة:","• نوع المركبة: "+(lic?"مكنة":"عجلة"));
  if(lic){L.push("• نمرة المركبه : "+(d.plate||""),"• تاريخ انتهاء الرخصه : "+(d.licExp||""))}
  L.push("• نقطة الفتح: "+(zi.opening||""),"","البيانات الإضافية:","• تاريخ انتهاء البطاقة: "+(d.cardExp||""),"• تاريخ عيد الميلاد: "+(d.birth||""),"• العنوان كامل في البطاقه : "+(d.address||""));
  if(assign==="new")L.push("• لينك الترشيح : "+NOM_LINK);
  return L.join("\n");
}
function buildAlex(d,zoneRaw,assign,lic){
  var L=[];
  var _fd=($("fDate")&&$("fDate").value)?$("fDate").value:"";
  var _ld="";
  if(_fd){var _a=_fd.split("-");if(_a.length===3)_ld=_a[2]+"/"+_a[1]+"/"+_a[0]}
  if(!_ld){var _t=cairoTomorrow(new Date());_ld=fmtDMY(_t.y,_t.m,_t.d)}
  L.push("اسم المكتب: Apache","","اسم المشرف: سيف","","نوع التعيين: "+(assign==="new"?"جديد":"إعادة تعيين"),"","محاضرة يوم: "+_ld,"","الاسم رباعي: "+(d.nameEn||""),"","رقم التليفون: "+(d.phone||""),"","رقم القومي : "+(d.nid||""),"","نوع المركبة : "+(lic?"مكنة":"عجلة"),"","المنطقة : "+(zoneRaw||""),"","نقطه الفتح : اسكندرية","","تاريخ انتهاء البطاقة: "+(d.cardExp||""),"","تاريخ الميلاد : "+(d.birth||""));
  if(lic)L.push("","تاريخ انتهاء الرخصة: "+(d.licExp||""),"","رقم اللوحه : "+(d.plate||""));
  L.push("","العنوان: "+(d.address||""));
  return L.join("\n");
}
window.__app.build={buildCairo:buildCairo,buildMaadi:buildMaadi,buildAlex:buildAlex};

/* ---------- الذكاء الاصطناعي ---------- */
function stitchBlobs(items){
  /* items: [{blob,label}] حتى 4 — شبكة 2×2 بعناوين، JPEG واحد (البلجن يقبل صورة واحدة) */
  return new Promise(function(res,rej){
    var imgs=[];
    var done=0;
    if(!items.length){rej(new Error("empty"));return}
    items.forEach(function(it,i){
      var im=new Image();var u=URL.createObjectURL(it.blob);
      im.onload=function(){URL.revokeObjectURL(u);imgs[i]={im:im,label:it.label};if(++done===items.length)draw()};
      im.onerror=function(){URL.revokeObjectURL(u);imgs[i]=null;if(++done===items.length)draw()};
      im.src=u;
    });
    function draw(){
      var cols=items.length>1?2:1,rows=Math.ceil(items.length/cols);
      var cw=900,ch=700;
      var cv=document.createElement("canvas");cv.width=cols*cw;cv.height=rows*(ch+34);
      var cx=cv.getContext("2d");cx.fillStyle="#fff";cx.fillRect(0,0,cv.width,cv.height);
      cx.fillStyle="#000";cx.font="bold 24px Arial";cx.textAlign="center";
      imgs.forEach(function(o,i){
        if(!o)return;
        var c=i%cols,r=Math.floor(i/cols),x=c*cw,y=r*(ch+34);
        cx.fillText(o.label,x+cw/2,y+24);
        var iw=o.im.naturalWidth||cw,ih=o.im.naturalHeight||ch;
        var s=Math.min(cw/iw,ch/ih);
        var w=iw*s,h=ih*s;
        cx.drawImage(o.im,x+(cw-w)/2,y+34+(ch-h)/2,w,h);
      });
      if(cv.toBlob)cv.toBlob(function(b){b?res(b):rej(new Error("stitch"))},"image/jpeg",0.85);
      else rej(new Error("canvas"));
    }
  });
}
var PROMPT1="اقرأ صور بطاقة الرقم القومي المصرية ورخصة الموتوسيكل بدقة حرف-حرف. ممنوع التخمين وممنوع أي بيانات تجريبية: أعد null لأي حرف غير واضح. القواعد: (1) الرقم القومي 14 رقمًا متتاليًا على الوجه الأمامي — انقله رقمًا رقمًا من اليسار لليمين بنفس الترتيب، وحوّل الأرقام الهندية (٠-٩) والفارسية إلى 0-9. (2) الخانة الأولى 2 أو 3 فقط، والخانات 2-7 تاريخ ميلاد DDMMYY ضمني. (3) التواريخ يوم/شهر/سنة. أعد JSON فقط بهذا الشكل بالضبط: {\"nameAr\": الاسم كما هو مطبوع أو null, \"nameEn\": الاسم بالتهجئة المصرية المعتادة أو null, \"address\": سطر واحد أو null, \"nid\": 14 رقمًا أو null, \"printedBirth\": تاريخ الميلاد المطبوع أو null, \"cardExp\": تاريخ انتهاء البطاقة من ضهر البطاقة مكتوب جنب كلمة سارية أو null, \"plate\": رقم لوحة المكنة أو null, \"licenseNo\": رقم الرخصة أو null, \"licExp\": تاريخ انتهاء الرخصة أو null, \"unreadable\": [قائمة الحقول غير المقروءة]}";
var PROMPT2="مهمة واحدة فقط: الرقم القومي المصري على الوجه الأمامي للبطاقة. انقل الـ 14 رقمًا رقمًا رقمًا من اليسار لليمين بترتيبها، بدون مسافات. حوّل أي أرقام عربية/هندية إلى لاتينية. ممنوع التخمين: إن كان أي رقم غير واضح أو مقطوع أعد null. أعد JSON فقط: {\"nid\": \"الرقم المكون من 14 خانة\" أو null}";
async function aiRead(prompt,blob){
  var rt=R();
  if(window.__mockAI&&window.__mockAI.enabled){
    await new Promise(function(r){setTimeout(r,50)});
    if(prompt===PROMPT2)return window.__mockAI.call2;
    return window.__mockAI.call1;
  }
  var p=rt.generateText({instruction:[prompt,blob]});
  try{state.genHandles.push(p)}catch(e){}
  var out=await p;
  var txt=String((out&&out.text!=null?out.text:out)||"");
  var s=txt.indexOf("{"),e=txt.lastIndexOf("}");
  if(s<0||e<=s)throw new Error("bad-ai");
  return JSON.parse(txt.slice(s,e+1));
}
function setStatus(t,busy){var el=$("aiStatus");el.textContent=t||"";el.classList.toggle("busy",!!busy);var pr=$("aiProgress");if(pr)pr.classList.toggle("show",!!busy)}
var stopFlag=false;
$("stopBtn").addEventListener("click",function(){
  stopFlag=true;
  state.genHandles.forEach(function(p){try{if(p&&p.stop)p.stop()}catch(e){}});
  setStatus("تم الإيقاف.");
  $("stopBtn").hidden=true;
});
$("extractBtn").addEventListener("click",async function(){
  if(!(state.imgs.cardFront&&state.imgs.cardBack)){setStatus("ارفع وجهي البطاقة أولًا.");return}
  if(!AI_AVAILABLE()){setStatus("نسخة الملفات المستقلة: القراءة بالذكاء الاصطناعي متاحة في نسخة Perchance فقط — أدخل البيانات يدويًا في الخانات الذكية بالأعلى.");$("extractBtn").disabled=false;$("stopBtn").hidden=true;updateExtractBtn();return}
  stopFlag=false;state.genHandles=[];
  $("extractBtn").disabled=true;$("stopBtn").hidden=false;setStatus("جارٍ قراءة الصور بالذكاء الاصطناعي… (نداء 1 من 2)",true);
  try{
    var items=[];
    if(state.imgs.cardFront)items.push({blob:state.imgs.cardFront.blob,label:"CARD FRONT"});
    if(state.imgs.cardBack)items.push({blob:state.imgs.cardBack.blob,label:"CARD BACK"});
    if(state.imgs.licFront)items.push({blob:state.imgs.licFront.blob,label:"LICENSE FRONT"});
    if(state.imgs.licBack)items.push({blob:state.imgs.licBack.blob,label:"LICENSE BACK"});
    var stitched=await stitchBlobs(items);
    if(stopFlag)return;
    var j1=await aiRead(PROMPT1,stitched);
    if(stopFlag)return;
    setStatus("جارٍ التحقق الذكي من الرقم القومي… (نداء 2 من 2)",true);
    var j2=await aiRead(PROMPT2,state.imgs.cardFront.blob);
    if(stopFlag)return;
    applyExtraction(j1,j2);
    setStatus("اكتمل الاستخراج بنجاح ✓");
  }catch(e){setStatus("تعذّرت القراءة — أعد المحاولة بصور أوضح. ("+String(e&&e.message||e)+")")}
  $("extractBtn").disabled=false;$("stopBtn").hidden=true;updateExtractBtn();
});
function valOrEmpty(v){return v==null?"":String(v).trim()}
function applyExtraction(j1,j2){
  j1=j1||{};j2=j2||{};
  var raw1=(j1.nid==null?"":String(j1.nid)),raw2=(typeof j2==="string"?j2:(j2.nid==null?"":String(j2.nid)));
  var vote=smartVoteNID(raw1,raw2);
  var nid=vote.nid||"",nidWarn=vote.warn||"";
  /* لو المستخدم كاتب رقمًا يدويًا صالحًا في الخانة الذكية، فضّله دائمًا على قراءة مختلفة */
  try{
    var manualTop=cleanNID($("topNid")?$("topNid").value:"");
    if(manualTop&&validateNID(manualTop).ok){
      if(!nid){nid=manualTop;nidWarn="اعتمدنا الرقم المكتوب يدويًا (القراءة الآلية ناقصة)."}
      else if(manualTop!==nid){nid=manualTop;nidWarn="اعتمدنا الرقم المكتوب يدويًا (يختلف عن قراءة الذكاء الاصطناعي)."}
    }
  }catch(e){}
  var birth="";
  if(nid){var b=birthFromNID(nid);birth=fmtDMY(b.y,b.m,b.d)}
  var printed=valOrEmpty(j1.printedBirth);
  var birthWarn="";
  if(printed&&birth){
    var p=parseDMY(printed),q=parseDMY(birth);
    if(p&&q&&(p.y!==q.y||p.m!==q.m||p.d!==q.d))birthWarn="تاريخ الميلاد المطبوع ("+printed+") يختلف عن المستخرج من الرقم القومي ("+birth+").";
  }
  /* الهاتف: لا تمسح ما كتبه المستخدم — خذ الموجود في الخانات أولًا */
  var existingPhone="";
  try{existingPhone=cleanPhone($("topPhone").value||$("fPhone").value||$("aMobile").value||(state.data&&state.data.phone)||"")}catch(e){}
  var pv=validatePhone(existingPhone);
  var d={
    nameAr:valOrEmpty(j1.nameAr),nameEn:capEn(valOrEmpty(j1.nameEn)),
    address:valOrEmpty(j1.address),nid:nid,birth:birth,printedBirth:printed,
    cardExp:valOrEmpty(j1.cardExp),plate:valOrEmpty(j1.plate),licenseNo:valOrEmpty(j1.licenseNo),licExp:valOrEmpty(j1.licExp),
    supervisor:"",hq:"",phone:(pv.ok?pv.clean:existingPhone)
  };
  d._nidWarn=nidWarn;d._birthWarn=birthWarn;d._unreadable=Array.isArray(j1.unreadable)?j1.unreadable:[];
  state.data=d;state.extractDate=new Date();
  refreshZone(false);
  /* تاريخ الغد تلقائيًا */
  var t=cairoTomorrow(state.extractDate);
  if(!$("fDate").dataset.manual)$("fDate").value=t.y+"-"+String(t.m).padStart(2,"0")+"-"+String(t.d).padStart(2,"0");
  rebuildAll("تم الاستخراج وبناء النص.");
  syncPanelsFromData();
}
function capEn(s){
  if(!s)return "";
  return s.split(/\s+/).map(function(w){return w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()}).join(" ");
}

/* ---------- الزون والتعيين ---------- */
function patchZoneLines(tpl,zi,raw){
  try{
    var el=$("finalText");if(!el||!el.value)return false;
    var t=el.value;
    if(tpl==="cairo"){
      t=t.replace(/^اسم المشرف : .*/m,"اسم المشرف : "+(zi.sup||""));
      t=t.replace(/^مقر حضور : .*/m,"مقر حضور : "+(zi.hq||""));
      t=t.replace(/^الزون : .*/m,"الزون : "+(raw||""));
    }else if(tpl==="alex"){
      t=t.replace(/^المنطقة : .*/m,"المنطقة : "+(raw||""));
    }else{
      t=t.replace(/^• نقطة الفتح: .*/m,"• نقطة الفتح: "+(zi.opening||""));
    }
    el.value=t;return true;
  }catch(e){return false}
}
function refreshZone(fromUser){
  var oldTpl=state.zoneInfo?state.zoneInfo.tpl:null;
  state.zoneRaw=$("zoneInput").value||"";
  state.zoneInfo=matchZone(state.zoneRaw);
  var h=[];
  if(state.zoneInfo.tpl==="cairo")h.push("القالب: القاهرة");
  else if(state.zoneInfo.tpl==="maadi")h.push("القالب: المعادي/حلوان");
  else h.push("القالب: الإسكندرية (الاسم بالإنجليزي)");
  h.push("المشرف: "+(state.zoneInfo.sup||"—"));
  h.push("المقر: "+(state.zoneInfo.hq||"—"));
  if(state.zoneInfo.opening)h.push("نقطة الفتح: "+state.zoneInfo.opening);
  if(state.zoneInfo.tpl==="alex")h.push("الميعاد: الغد دائمًا • نقطة الفتح: اسكندرية");
  if(state.zoneInfo.warn)h.push("⚠ "+state.zoneInfo.warn);
  $("zoneHint").textContent=h.join(" • ");
  /* الإسكندرية: الميعاد الغد دائمًا — يُفرض ويُقفل */
  var _tm=cairoTomorrow(new Date());
  var _tmISO=_tm.y+"-"+String(_tm.m).padStart(2,"0")+"-"+String(_tm.d).padStart(2,"0");
  if(state.zoneInfo.tpl==="alex"){
    $("fDate").value=_tmISO;$("fDate").dataset.manual="1";$("fDate").disabled=true;$("fDate").title="ميعاد المحاضرة للإسكندرية الغد دائمًا";
  }else{
    $("fDate").disabled=false;$("fDate").title="";
  }
  if(state.data){
    if(oldTpl&&fromUser&&oldTpl===state.zoneInfo.tpl){
      patchZoneLines(state.zoneInfo.tpl,state.zoneInfo,state.zoneRaw);
      var dd=Object.assign({},state.data);renderWarningsFor(dd);
      $("assignMsg").textContent="تغيّر الزون — حُدّثت سطور المشرف والمقر ونقطة الفتح والزون مع بقاء تعديلاتك اليدوية.";
    }else{
      rebuildAll(fromUser?(oldTpl&&oldTpl!==state.zoneInfo.tpl?"تغيّر القالب — أُعيد بناء النص من البيانات.":"تغيّر الزون — حُدّثت سطور المشرف والمقر ونقطة الفتح والزون."):"");
    }
    syncPanelsFromData();
  }
}
function renderWarningsFor(dd){
  var d=Object.assign({},state.data,dd||{});
  renderWarnings(d,hasLicense());
}
$("zoneInput").addEventListener("input",function(){refreshZone(true)});
function setAssign(a,msg){
  state.assign=a;
  $("assignNewBtn").classList.toggle("on",a==="new");
  $("assignReBtn").classList.toggle("on",a==="re");
  if(state.data){rebuildAll(msg||(a==="new"?"نوع التعيين: جديد — أُعيد بناء النص.":"نوع التعيين: إعادة تعيين — أُعيد بناء النص (حُذف سطر الرابط، والبونص بدون)."));syncPanelsFromData()}
  else if(msg)$("assignMsg").textContent=msg;
}
$("assignNewBtn").addEventListener("click",function(){setAssign("new")});
$("assignReBtn").addEventListener("click",function(){setAssign("re")});
function bonusFor(){if(state.assign==="re")return "بدون";return hasLicense()?"4000":"بدون"}
window.__app.bonusFor=bonusFor;

/* ---------- بناء النص والتحذيرات ---------- */
function currentTemplate(){
  if(!state.zoneInfo)return "cairo";
  return state.zoneInfo.tpl;
}
function rebuildAll(msg){
  if(!state.data)return;
  var d=Object.assign({},state.data);
  d.supervisor=state.zoneInfo?state.zoneInfo.sup:"";
  d.hq=state.zoneInfo?state.zoneInfo.hq:"";
  if(currentTemplate()==="maadi"){d.supervisor="عمر شعبان";d.hq="المعادي"}
  if(currentTemplate()==="alex"){d.supervisor="سيف"}
  var lic=hasLicense();
  var txt=currentTemplate()==="maadi"?buildMaadi(d,Object.assign({},state.zoneInfo,{opening:state.zoneInfo.opening}),state.assign,lic)
    :currentTemplate()==="alex"?buildAlex(d,state.zoneRaw,state.assign,lic)
    :buildCairo(d,state.zoneInfo,state.assign,lic);
  $("finalText").value=txt;
  renderWarnings(d,lic);
  if(msg)$("assignMsg").textContent=msg;
}
$("finalText").addEventListener("input",function(){$("finalText").dataset.manual="1"});
function renderWarnings(d,lic){
  var w=$("warnings");w.innerHTML="";
  function add(txt,err){
    var dv=document.createElement("div");dv.className=err?"e":"w";dv.textContent=txt;w.appendChild(dv);
  }
  if(!d.nameAr)add("الاسم بالعربي فارغ — راجع الصورة.",true);
  if(currentTemplate()==="alex"){
    if(!d.nameEn)add("الاسم بالإنجليزي فارغ — اكتبه يدويًا وكل كلمة بحرف كبير، وراجع إملاءه.",true);
    else add("راجع إملاء الاسم بالإنجليزي حرفًا حرفًا: "+d.nameEn);
  }
  if(!d.nid)add((d._nidWarn||"الرقم القومي فارغ.")+" — لا يُخمَّن.",true);
  else{
    if(d._nidWarn)add(d._nidWarn);
    var pi=parseNIDSmart(d.nid);
    if(pi.ok)add("الرقم القومي سليم ✓ — "+pi.govName+" • "+pi.gender+" • الميلاد "+pi.birthStr+(pi.age!=null?" (العمر "+pi.age+")":""));
  }
  if(d._birthWarn)add(d._birthWarn);
  if(!d.address)add("العنوان فارغ.");
  if(!d.cardExp)add("تاريخ انتهاء البطاقة فارغ.");
  else if(isExpiredDMY(d.cardExp))add("البطاقة منتهية (انتهت "+d.cardExp+").",true);
  if(lic){
    if(!d.plate&&!d.licenseNo)add("اللوحة ورقم الرخصة فارغان — صوّر الرخصة أوضح.");
    if(!d.licExp)add("تاريخ انتهاء الرخصة فارغ.");
    else if(isExpiredDMY(d.licExp))add("الرخصة منتهية (انتهت "+d.licExp+").",true);
  }
  if(!d.phone&&false)add("x");
  var curPhone=$("topPhone")?($("topPhone").value||document.querySelector("#fPhone").value):document.querySelector("#fPhone").value;
  var phv=validatePhone(curPhone||"");
  if(!curPhone)add("رقم التليفون فارغ — اكتبه أنت في الخانة الجديدة بالأعلى.");
  else if(!phv.ok)add("رقم التليفون («"+phv.clean+"») غير صحيح: "+phv.reason+".",true);
  else add("رقم التليفون سليم ✓ ("+phv.carrier+")");
  (d._unreadable||[]).forEach(function(f){add("تعذّرت قراءة «"+f+"» — صوّر صورة أوضح.")});
  if(state.zoneInfo&&state.zoneInfo.warn)add(state.zoneInfo.warn);
  if(state.assign==="re")add("إعادة تعيين: حُذف سطر الرابط، والبونص «بدون».");
}
$("copyBtn").addEventListener("click",async function(){
  var t=$("finalText").value||"";
  try{await navigator.clipboard.writeText(t);$("copyMsg").textContent="تم النسخ."}
  catch(e){
    $("finalText").focus();$("finalText").select();
    try{var ok=document.execCommand("copy");$("copyMsg").textContent=ok?"تم النسخ.":"تعذّر النسخ التلقائي — حدّد النص وانسخه يدويًا."}
    catch(e2){$("copyMsg").textContent="تعذّر النسخ التلقائي — حدّد النص وانسخه يدويًا."}
  }
});
$("clearBtn").addEventListener("click",function(){
  ORDER.forEach(function(k){if(state.imgs[k]&&state.imgs[k].url){try{URL.revokeObjectURL(state.imgs[k].url)}catch(e){}}});
  state.imgs={};state.data=null;state.zoneRaw="";state.zoneInfo=null;state.extractDate=null;
  state.lectureOpened=false;state.needDouble=false;
  $("zoneInput").value="";$("zoneHint").textContent="";$("finalText").value="";$("finalText").dataset.manual="";
  $("warnings").innerHTML="";$("copyMsg").textContent="";$("assignMsg").textContent="";
  ["fDelegate","fNid","fPhone","fNotes","aPilot","aMobile","aNid","aLicNo","aAddr","topNid","topPhone"].forEach(function(id){var el=$(id);if(el){el.value="";el.dataset.manual="";el.classList.remove("ok","bad")}});
  ["fZone","fEye","fHours","fOps","fSup"].forEach(function(id){var el=$(id);if(el){el.value="";el.dataset.manual=""}});
  if($("fHours")){$("fHours").value="8";$("fHours").dataset.manual="1"}
  if($("fBonus")){$("fBonus").value="";$("fBonus").dataset.manual=""}
  setAssignSilent("new");
  renderSlots();setStatus("");
  renderNidInfo("");renderPhoneHint("");
  $("fWarn").innerHTML="";$("aWarn").innerHTML="";$("lectureMsg").textContent="";$("assignFormMsg").textContent="";
  var t=cairoTomorrow(new Date());$("fDate").value=t.y+"-"+String(t.m).padStart(2,"0")+"-"+String(t.d).padStart(2,"0");$("fDate").dataset.manual="";$("fDate").disabled=false;$("fDate").title="";
  $("aOffice").value="Apache";$("aType").value="New Hire";$("aVehicle").value="Bicycle";
});
function setAssignSilent(a){state.assign=a;$("assignNewBtn").classList.toggle("on",a==="new");$("assignReBtn").classList.toggle("on",a==="re")}

/* ---------- اللوحات ---------- */
["fDelegate","fNid","fPhone","fZone","fEye","fBonus","fHours","fOps","fSup","fNotes","fDate"].forEach(function(id){
  var el=$(id);if(el)el.addEventListener("input",function(){el.dataset.manual="1"});
});
["aOffice","aType","aSup","aTalabat","aPilot","aMobile","aNid","aLicNo","aAddr","aVehicle"].forEach(function(id){
  var el=$(id);if(el)el.addEventListener("input",function(){el.dataset.manual="1"});
});
/* (رقم الرخصة يتبع القومي في onSmartNid أدناه) */
function syncPanelsFromData(){
  if(!state.data)return;
  var d=state.data,lic=hasLicense();
  function set(id,v){var el=$(id);if(el&&!el.dataset.manual)el.value=v||""}
  set("fDelegate",d.nameAr);set("fNid",d.nid);
  if(currentTemplate()==="alex"){var _s=cairoTomorrow(new Date());$("fDate").value=_s.y+"-"+String(_s.m).padStart(2,"0")+"-"+String(_s.d).padStart(2,"0");$("fDate").disabled=true}
  if($("fHours")){$("fHours").value="8";$("fHours").dataset.manual="1"}
  if($("topNid")&&(!$("topNid").dataset.manual||!$("topNid").value))$("topNid").value=d.nid||$("topNid").value||"";
  var ph=d.phone||cleanPhone($("topPhone")?$("topPhone").value:"")||cleanPhone($("fPhone").value||$("aMobile").value||"");
  if($("topPhone")&&!$("topPhone").dataset.manual)$("topPhone").value=ph||"";
  if(!$("fPhone").dataset.manual||!$("fPhone").value)$("fPhone").value=ph||"";
  if(!$("aMobile").dataset.manual||!$("aMobile").value)$("aMobile").value=ph||"";
  renderNidInfo($("topNid")?$("topNid").value:d.nid);renderPhoneHint(ph);
  var zc=zoneToFormChoice(state.zoneRaw);
  if(! $("fZone").dataset.manual)$("fZone").value=zc;
  if(!$("fBonus").dataset.manual)$("fBonus").value=bonusFor();
  var sc=supToFormChoice(d.supervisor||(state.zoneInfo?state.zoneInfo.sup:""));
  if(!$("fSup").dataset.manual)$("fSup").value=sc;
  set("aPilot",d.nameAr);set("aNid",d.nid);set("aAddr",d.address);
  if(!$("aSup").dataset.manual)$("aSup").value=state.zoneInfo?(currentTemplate()==="maadi"?"عمر شعبان":currentTemplate()==="alex"?"سيف":state.zoneInfo.sup):"";
  if(!$("aTalabat").dataset.manual){
    if(currentTemplate()==="alex")$("aTalabat").value="مكتب طلبات الأسكندريه";
    else if(state.zoneInfo&&state.zoneInfo.hq)$("aTalabat").value="مكتب طلبات "+state.zoneInfo.hq;
    else $("aTalabat").value="";
  }
  if(!$("aType").dataset.manual)$("aType").value=state.assign==="new"?"New Hire":"Reactivation";
  if(!$("aVehicle").dataset.manual)$("aVehicle").value=lic?"Bike":"Bicycle";
  if(!$("aLicNo").dataset.manual){
    if(d.plate)$("aLicNo").value=d.plate;
    else if(d.licenseNo)$("aLicNo").value=d.licenseNo;
    else if(!lic&&d.nid)$("aLicNo").value=cleanNID(d.nid).slice(-7);
    else $("aLicNo").value="";
  }
  renderPanelWarns();
}
/* ---------- القراءة الذكية للخانات اليدوية + مزامنة الهاتف ---------- */
var _syncing=false;
function escHtml(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function renderNidInfo(raw){
  var box=$("nidInfo");if(!box)return;
  var inp=$("topNid");
  raw=(raw==null?(inp?inp.value:""):raw);
  var c=cleanNID(raw||"");
  ["stNid","stBirth","stGov"].forEach(function(id){var e=$(id);if(e)e.classList.remove("done")});
  if(!c){box.className="hint info";box.textContent="الصق الرقم القومي هنا — يقبل الأرقام العربية والمسافات والشرطات.";if(inp)inp.classList.remove("ok","bad");return}
  var p=parseNIDSmart(c);
  if(p.ok){
    if(inp){inp.classList.remove("bad");inp.classList.add("ok")}
    box.className="hint ok";
    box.innerHTML='<span class="pill">✓ سليم</span><span class="pill">'+escHtml(p.birthStr)+(p.age!=null?" (العمر "+p.age+")":"")+'</span><span class="pill amber">'+escHtml(p.govName)+'</span><span class="pill gray">'+escHtml(p.gender)+' • '+escHtml(p.century)+'</span>';
    ["stNid","stBirth","stGov"].forEach(function(id){var e=$(id);if(e)e.classList.add("done")});
  }else{
    if(inp){inp.classList.remove("ok");inp.classList.add("bad")}
    box.className="hint bad";
    var left=(c.length<14)?" — ناقص "+(14-c.length)+" أرقام":"";
    box.textContent="⚠ "+(p.reason||"غير صالح")+left+" ("+c.length+"/14)";
  }
  window.__app.lastNidParse=p;
}
function renderPhoneHint(raw){
  var box=$("phoneHint");if(!box)return;
  var inp=$("topPhone");
  raw=(raw==null?(inp?inp.value:""):raw);
  var c=cleanPhone(raw||"");
  var st=$("stPhone");if(st)st.classList.remove("done");
  if(!c){box.className="hint info";box.textContent="اكتب رقمك هنا — ينسخ تلقائيًا لخانتي الفورمين ولسطر «رقم التليفون».";if(inp)inp.classList.remove("ok","bad");return}
  var v=validatePhone(c);
  if(v.ok){
    if(inp){inp.classList.remove("bad");inp.classList.add("ok")}
    box.className="hint ok";box.innerHTML='<span class="pill">✓ سليم</span><span class="pill amber">'+escHtml(v.carrier)+'</span><span class="pill gray" dir="ltr">'+escHtml(v.clean)+'</span>';
    if(st)st.classList.add("done");
  }else{
    if(inp){inp.classList.remove("ok");inp.classList.add("bad")}
    box.className="hint bad";box.textContent="⚠ "+v.reason+" ("+(v.clean||c).length+"/11)";
  }
}
function patchDataLines(){
  /* تحديث سطور الرقم القومي والهاتف والميلاد في النص دون مسح تعديلاتك اليدوية */
  try{
    var el=$("finalText");if(!el||!el.value||!state.data)return false;
    var t=el.value;
    var nid=state.data.nid||"",ph=state.data.phone||"",br=state.data.birth||"";
    t=t.replace(/^الرقم القومي : .*$/m,"الرقم القومي : "+nid);
    t=t.replace(/^• الرقم\s+القومي: .*$/m,"• الرقم  القومي: "+nid);
    t=t.replace(/^رقم القومي : .*$/m,"رقم القومي : "+nid);
    t=t.replace(/^رقم التليفون : .*$/m,"رقم التليفون : "+ph);
    t=t.replace(/^• رقم التليفون : .*$/m,"• رقم التليفون : "+ph);
    t=t.replace(/^رقم التليفون:.*$/m,"رقم التليفون: "+ph);
    t=t.replace(/^نقطه الفتح : .*$/m,"نقطه الفتح : اسكندرية");
    var _ff=($("fDate")&&$("fDate").value)?$("fDate").value:"";
    if(_ff){var _fa=_ff.split("-");if(_fa.length===3)t=t.replace(/^محاضرة يوم:.*$/m,"محاضرة يوم: "+_fa[2]+"/"+_fa[1]+"/"+_fa[0])}
    t=t.replace(/^تاريخ الميلاد : .*$/m,"تاريخ الميلاد : "+br);
    t=t.replace(/^• تاريخ عيد الميلاد: .*$/m,"• تاريخ عيد الميلاد: "+br);
    el.value=t;return true;
  }catch(e){return false}
}
function onSmartNid(from){
  if(_syncing)return;_syncing=true;
  try{
    var raw=from==="top"?$("topNid").value:from==="f"?$("fNid").value:$("aNid").value;
    var c=cleanNID(raw);
    if(from==="top"){$("fNid").value=c;$("aNid").value=c}
    else if(from==="f"){$("topNid").value=c;$("aNid").value=c}
    else{$("topNid").value=c;$("fNid").value=c}
    if(state.data){
      var v=validateNID(c);
      if(v.ok){state.data.nid=v.clean;state.data.birth=fmtDMY(v.birth.y,v.birth.m,v.birth.d);state.data._nidWarn="";patchDataLines();renderWarnings(Object.assign({},state.data),hasLicense())}
      else if(!state.data.nid){state.data.nid=c;patchDataLines();renderWarnings(Object.assign({},state.data),hasLicense())}
    }
    renderNidInfo(c);
    if($("aLicNo")&&!$("aLicNo").dataset.manual&&!hasLicense()){$("aLicNo").value=c.length>=7?c.slice(-7):""}
    renderPanelWarns();
  }finally{_syncing=false}
}
function onSmartPhone(from){
  if(_syncing)return;_syncing=true;
  try{
    var raw=from==="top"?$("topPhone").value:from==="f"?$("fPhone").value:$("aMobile").value;
    var c=cleanPhone(raw);
    if(from==="top"){$("fPhone").value=c;$("aMobile").value=c}
    else if(from==="f"){$("topPhone").value=c;$("aMobile").value=c;$("topPhone").dataset.manual="1"}
    else{$("topPhone").value=c;$("fPhone").value=c;$("topPhone").dataset.manual="1"}
    if(state.data){var v=validatePhone(c);state.data.phone=v.ok?v.clean:c;patchDataLines();renderWarnings(Object.assign({},state.data),hasLicense())}
    renderPhoneHint(c);
    renderPanelWarns();
  }finally{_syncing=false}
}
if($("topNid"))$("topNid").addEventListener("input",function(){$("topNid").dataset.manual="1";onSmartNid("top")});
if($("topPhone"))$("topPhone").addEventListener("input",function(){$("topPhone").dataset.manual="1";onSmartPhone("top")});
if($("fNid"))$("fNid").addEventListener("input",function(){onSmartNid("f")});
if($("aNid"))$("aNid").addEventListener("input",function(){
  onSmartNid("a");
  if($("aLicNo").dataset.manual)return;
  if(!hasLicense()){var n=cleanNID($("aNid").value);$("aLicNo").value=n.length>=7?n.slice(-7):""}
});
if($("fPhone"))$("fPhone").addEventListener("input",function(){onSmartPhone("f")});
if($("aMobile"))$("aMobile").addEventListener("input",function(){onSmartPhone("a")});
function requiredEmptyLecture(){
  var miss=[];
  if(!$("fDate").value)miss.push("التاريخ");
  if(!$("fDelegate").value)miss.push("اسم المندوب");
  if(!$("fNid").value)miss.push("رقم البطاقة");
  if(!$("fPhone").value)miss.push("رقم التليفون");
  if(!$("fZone").value)miss.push("الزون");
  if(!$("fEye").value)miss.push("اسم العين");
  if(!$("fBonus").value)miss.push("البونص");
  if(!$("fHours").value)miss.push("عدد الساعات");
  if(!$("fOps").value)miss.push("مدير التشغيل");
  return miss;
}
function renderPanelWarns(){
  var fw=$("fWarn");fw.innerHTML="";
  requiredEmptyLecture().forEach(function(m){var dv=document.createElement("div");dv.textContent="حقل مطلوب فارغ: "+m+" — لا يُخمَّن.";fw.appendChild(dv)});
  var aw=$("aWarn");aw.innerHTML="";
  ["aPilot","aNid","aAddr"].forEach(function(id){
    if(!$(id).value){var dv=document.createElement("div");dv.textContent="حقل فارغ في فورم التعيينات: "+$(id).previousSibling.textContent.trim();aw.appendChild(dv)}
  });
  if(!$("aMobile").value){var dv=document.createElement("div");dv.textContent="رقم الموبايل فارغ — اكتبه أنت.";aw.appendChild(dv)}
}
["fDate","fDelegate","fNid","fPhone","fZone","fEye","fBonus","fHours","fOps","fSup","aPilot","aMobile","aNid","aAddr"].forEach(function(id){
  var el=$(id);if(el)el.addEventListener("input",renderPanelWarns);
});
function lectureURL(){
  var base="https://docs.google.com/forms/d/e/1FAIpQLSd9Ssj6nzLz28V_qdkgH-LcPs7OJczxx9gNVPgy9xWtBrEjkQ/viewform?usp=pp_url";
  var q=[];
  function add(k,v){if(v!=null&&String(v)!=="")q.push("entry."+k+"="+encodeURIComponent(String(v)))}
  var dt=$("fDate").value||"";
  var a=dt.split("-");
  if(a.length===3){q.push("entry.27016418_year="+encodeURIComponent(a[0]));q.push("entry.27016418_month="+encodeURIComponent(String(+a[1])));q.push("entry.27016418_day="+encodeURIComponent(String(+a[2])))}
  add("1506067816",$("fDelegate").value);add("922456920",$("fNid").value);add("370073738",$("fPhone").value);
  add("1522582597",$("fZone").value);add("556085332",$("fEye").value);add("1365563112",$("fBonus").value);
  add("1929987285","8");add("1364068549",$("fOps").value);add("1732492293",$("fSup").value);
  add("2010819927",$("fNotes").value);
  return base+(q.length?"&"+q.join("&"):"");
}
$("openLectureBtn").addEventListener("click",function(){
  if(state.needDouble&&!$("openLectureBtn").dataset.armed){
    $("openLectureBtn").dataset.armed="1";
    $("lectureMsg").textContent="اضغط مرة أخرى للتأكيد (منع الإرسال المزدوج).";
    setTimeout(function(){delete $("openLectureBtn").dataset.armed},6000);
    return;
  }
  delete $("openLectureBtn").dataset.armed;
  renderPanelWarns();
  var url=lectureURL();
  var w=null;
  try{w=window.open(url,"_blank","noopener")}catch(e){}
  if(!w){
    $("lectureMsg").textContent="منع المتصفح فتح النافذة — انسخ الرابط وافتحه يدويًا.";
    $("copyLectureLinkBtn").hidden=false;$("copyLectureLinkBtn").dataset.url=url;
  }else{
    $("lectureMsg").textContent="فُتح الفورم معبأً في تبويب جديد — أكمل المراجعة ثم اضغط «إرسال» داخل Google. رسالة التأكيد هناك هي التأكيد الحقيقي.";
    $("copyLectureLinkBtn").hidden=true;
    state.lectureOpened=true;state.needDouble=true;
  }
});
$("copyLectureLinkBtn").addEventListener("click",async function(){
  var u=$("copyLectureLinkBtn").dataset.url||lectureURL();
  try{await navigator.clipboard.writeText(u);$("lectureMsg").textContent="تم نسخ الرابط."}
  catch(e){prompt("انسخ الرابط:",u)}
});
function assignURL(){
  var base="https://docs.google.com/forms/d/e/1FAIpQLSeOLPp1wR7MPqwORaW6mZLmOYL46gi6J7PWOn6c2Ch6B_1KbQ/viewform?usp=pp_url";
  var q=[];
  function add(k,v){if(v!=null&&String(v)!=="")q.push("entry."+k+"="+encodeURIComponent(String(v)))}
  add("906839457",$("aOffice").value);add("84659457",$("aType").value);add("1966936407",$("aSup").value);
  add("1305847536",$("aTalabat").value);add("53427921",$("aPilot").value);add("89197182",$("aMobile").value);
  add("1139169754",$("aNid").value);add("912246586",$("aLicNo").value);add("516517283",$("aAddr").value);
  add("1526140493",$("aVehicle").value);
  return base+(q.length?"&"+q.join("&"):"");
}
$("openAssignBtn").addEventListener("click",function(){
  renderPanelWarns();
  var url=assignURL();var w=null;
  try{w=window.open(url,"_blank","noopener")}catch(e){}
  if(!w){$("assignFormMsg").textContent="منع المتصفح فتح النافذة — انسخ الرابط.";$("copyAssignLinkBtn").hidden=false;$("copyAssignLinkBtn").dataset.url=url}
  else{$("assignFormMsg").textContent="فُتح فورم التعيينات معبأً — ارفع الصور يدويًا داخله ثم اضغط «إرسال» بنفسك.";$("copyAssignLinkBtn").hidden=true}
});
$("copyAssignLinkBtn").addEventListener("click",async function(){
  var u=$("copyAssignLinkBtn").dataset.url||assignURL();
  try{await navigator.clipboard.writeText(u);$("assignFormMsg").textContent="تم نسخ الرابط."}
  catch(e){prompt("انسخ الرابط:",u)}
});

/* ---------- التنزيلات ---------- */
var ORDER_DL=[["cardFront","1_card_front.jpg"],["cardBack","2_card_back.jpg"],["licFront","3_license_front.jpg"],["licBack","4_license_back.jpg"],["personal","5_personal.jpg"]];
function nidName(){var n=cleanNID((state.data&&state.data.nid)||$("fNid").value||$("aNid").value||"");return n||"no-nid"}
function renderImgList(){
  var ol=$("imgList");if(!ol)return;ol.innerHTML="";
  ORDER_DL.forEach(function(pair){
    var k=pair[0],fname=pair[1];
    var li=document.createElement("li");
    var has=!!state.imgs[k];
    li.textContent=LABEL[k]+" ("+fname+") — "+(has?"جاهزة":"لا صورة");
    if(has){
      var b=document.createElement("button");b.type="button";b.textContent="تنزيل";
      b.addEventListener("click",function(){dlOne(k,fname)});
      li.appendChild(document.createTextNode(" "));li.appendChild(b);
    }
    ol.appendChild(li);
  });
}
function dlOne(key,suggestName){
  var it=state.imgs[key];if(!it)return;
  var a=document.createElement("a");
  var ext="jpg";
  a.href=it.url;a.download=nidName()+"_"+suggestName;
  document.body.appendChild(a);a.click();setTimeout(function(){a.remove()},500);
}
$("dlAllBtn").addEventListener("click",function(){
  ORDER_DL.forEach(function(pair,i){
    setTimeout(function(){if(state.imgs[pair[0]])dlOne(pair[0],pair[1])},i*400);
  });
});

/* ---------- تهيئة ---------- */
(function init(){
  var t=cairoTomorrow(new Date());
  $("fDate").value=t.y+"-"+String(t.m).padStart(2,"0")+"-"+String(t.d).padStart(2,"0");
  refreshZone(false);renderSlots();renderPanelWarns();renderNidInfo("");renderPhoneHint("");
})();
})();
