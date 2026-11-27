/* db.js — قاعدة بيانات محلية (localStorage) للنسخة المستقلة: مسودة تلقائية + سجلات مناديب. الصور لا تُخزن هنا. */
(function(){
"use strict";
var DRAFT_KEY="mandib_draft_v1", RECORDS_KEY="mandib_records_v1";
var FIELD_IDS=["zoneInput","topNid","topPhone","finalText","fDate","fDelegate","fNid","fPhone","fZone","fEye","fBonus","fOps","fSup","fNotes","aOffice","aType","aSup","aTalabat","aPilot","aMobile","aNid","aLicNo","aAddr","aVehicle"];
function $(id){return document.getElementById(id);}
function loadJSON(k,f){try{var v=localStorage.getItem(k);return v?JSON.parse(v):f;}catch(e){return f;}}
function saveJSON(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
var t=null;
function collect(){var d={};FIELD_IDS.forEach(function(id){var el=$(id);if(el)d[id]=el.value;});var nb=$("assignNewBtn");d.assign=(nb&&nb.classList.contains("on"))?"new":"re";return d;}
function schedule(){if(t)clearTimeout(t);t=setTimeout(function(){saveJSON(DRAFT_KEY,collect());},400);}
function restore(){
  var d=loadJSON(DRAFT_KEY,null);if(!d)return;
  FIELD_IDS.forEach(function(id){if(d[id]==null)return;var el=$(id);if(!el)return;el.value=d[id];el.dataset.manual="1";});
  try{
    var z=$("zoneInput");if(z&&d.zoneInput!=null)z.dispatchEvent(new Event("input",{bubbles:true}));
    ["topNid","topPhone"].forEach(function(id){var el=$(id);if(el&&el.value)el.dispatchEvent(new Event("input",{bubbles:true}));});
    if(d.assign==="re"){var rb=$("assignReBtn");if(rb)rb.click();}else{var nb=$("assignNewBtn");if(nb)nb.click();}
  }catch(e){}
}
function getRecords(){var r=loadJSON(RECORDS_KEY,[]);return Array.isArray(r)?r:[];}
function msg(t){var m=$("dbMsg");if(m)m.textContent=t||"";}
function render(){
  var tb=$("dbTableBody");if(!tb)return;tb.innerHTML="";
  var recs=getRecords();
  if(!recs.length){var tr=document.createElement("tr");var td=document.createElement("td");td.colSpan=6;td.style.textAlign="center";td.textContent="لا توجد سجلات محفوظة — املأ البيانات ثم اضغط «حفظ السجل الحالي».";tr.appendChild(td);tb.appendChild(tr);return;}
  recs.forEach(function(r){
    var tr=document.createElement("tr");
    [r.name,r.nid,r.phone,r.zone,r.date].forEach(function(val){var td=document.createElement("td");td.textContent=val||"—";tr.appendChild(td);});
    var act=document.createElement("td");var div=document.createElement("div");div.className="row";
    var b1=document.createElement("button");b1.type="button";b1.textContent="تحميل";
    b1.addEventListener("click",function(){loadRecord(r.id);});
    var b2=document.createElement("button");b2.type="button";b2.className="danger";b2.textContent="حذف";
    b2.addEventListener("click",function(){delRecord(r.id);});
    div.appendChild(b1);div.appendChild(b2);act.appendChild(div);tr.appendChild(act);tb.appendChild(tr);
  });
}
function v(id){var el=$(id);return el?el.value:"";}
function saveRecord(){
  var s={name:v("fDelegate")||v("aPilot"),nid:v("fNid")||v("topNid"),phone:v("fPhone")||v("topPhone"),zone:v("zoneInput"),date:v("fDate"),office:v("aOffice"),type:v("aType"),sup:v("aSup"),talabat:v("aTalabat"),addr:v("aAddr"),vehicle:v("aVehicle"),notes:v("fNotes")};
  if(!s.name&&!s.nid){msg("لا يوجد ما يُحفظ — أدخل الاسم أو الرقم القومي أولًا.");return;}
  var recs=getRecords();
  recs.unshift({id:Date.now(),name:s.name,nid:s.nid,phone:s.phone,zone:s.zone,date:s.date,office:s.office,type:s.type,sup:s.sup,talabat:s.talabat,addr:s.addr,vehicle:s.vehicle,notes:s.notes});
  if(saveJSON(RECORDS_KEY,recs)){msg("تم حفظ السجل ("+recs.length+" سجلات).");render();}
  else msg("تعذّر الحفظ — مساحة localStorage ممتلئة.");
}
function loadRecord(id){
  var r=getRecords().filter(function(x){return x.id===id;})[0];if(!r)return;
  var map={fDelegate:r.name,aPilot:r.name,fNid:r.nid,aNid:r.nid,topNid:r.nid,fPhone:r.phone,aMobile:r.phone,topPhone:r.phone,zoneInput:r.zone,fDate:r.date,aOffice:r.office,aType:r.type,aSup:r.sup,aTalabat:r.talabat,aAddr:r.addr,aVehicle:r.vehicle,fNotes:r.notes};
  Object.keys(map).forEach(function(id){var el=$(id);if(el&&map[id]!=null){el.value=map[id];el.dataset.manual="1";}});
  try{
    var z=$("zoneInput");if(z)z.dispatchEvent(new Event("input",{bubbles:true}));
    ["topNid","topPhone"].forEach(function(id){var el=$(id);if(el&&el.value)el.dispatchEvent(new Event("input",{bubbles:true}));});
  }catch(e){}
  msg("تم تحميل سجل: "+(r.name||r.nid||""));
}
function delRecord(id){
  if(!window.confirm("حذف هذا السجل نهائيًا؟"))return;
  saveJSON(RECORDS_KEY,getRecords().filter(function(x){return x.id!==id;}));msg("تم حذف السجل.");render();
}
document.addEventListener("DOMContentLoaded",function(){
  FIELD_IDS.forEach(function(id){var el=$(id);if(el)el.addEventListener("input",schedule);});
  ["assignNewBtn","assignReBtn","clearBtn"].forEach(function(id){var el=$(id);if(el)el.addEventListener("click",function(){setTimeout(schedule,60);});});
  var sb=$("dbSaveBtn");if(sb)sb.addEventListener("click",saveRecord);
  var cb=$("dbClearBtn");if(cb)cb.addEventListener("click",function(){if(!window.confirm("مسح كل السجلات نهائيًا؟"))return;saveJSON(RECORDS_KEY,[]);msg("تم مسح كل السجلات.");render();});
  restore();render();
});
})();
