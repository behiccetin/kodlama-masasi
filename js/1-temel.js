/* Kodlama Masası · Öğr. Gör. Dr. Behiç ÇETİN · MIT Lisansı */

/* ====================== DURUM ====================== */
const SURUM='2.0.1';
const KAYIT='kodlamaMasasi.v1';
const RENKLER=['#F5C518','#FF8FA3','#7BD389','#6EC5FF','#C49BFF','#FFA552','#4FD1C5','#F28482','#A3E635','#93A5FF','#E879F9','#D4A373'];
const S={P:null,dil:'tr',sekme:'kod',belge:null,secKod:new Set(),noktaBolumler:null,secim:null,odakKod:null,kilit:false,kaydedildi:false};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3);
const uuid=()=>{const b=crypto.getRandomValues(new Uint8Array(16));b[6]=b[6]&15|64;b[8]=b[8]&63|128;const h=[...b].map(x=>x.toString(16).padStart(2,'0')).join('');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`};
const kisalt=(s,n)=>s.length>n?s.slice(0,n-1)+'…':s;

/* ====================== DİL ====================== */
let DILLER={...GOMULU_DILLER};
function t(k,...a){const zin=[DILLER[S.dil],DILLER.en,DILLER.tr];let v;for(const d of zin){if(d&&d[k]!==undefined){v=d[k];break}}if(v===undefined)v=k;if(typeof v==='string')v=v.replace(/\{(\d)\}/g,(_,i)=>a[i]??'');return v}
function tAlt(grup,k){for(const d of [DILLER[S.dil],DILLER.en,DILLER.tr]){if(d&&d[grup]&&d[grup][k]!==undefined)return d[grup][k]}return ''}
const sayi=(n,ond=0)=>Number(n).toLocaleString(S.dil,{minimumFractionDigits:ond,maximumFractionDigits:ond});
/* Dil dosyalarından gelen biçimli metin: yalnızca zararsız etiketler kalır, öznitelikler silinir. */
function guvenliHtml(s){const tp=document.createElement('template');tp.innerHTML=String(s??'');const izin=new Set(['P','B','STRONG','I','EM','OL','UL','LI','BR','CODE','KBD']);
  const gez=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===1){if(!izin.has(c.tagName)){c.replaceWith(document.createTextNode(c.textContent))}else{[...c.attributes].forEach(a=>c.removeAttribute(a.name));gez(c)}}else if(c.nodeType!==3)c.remove()})};
  gez(tp.content);const d=document.createElement('div');d.appendChild(tp.content);return d.innerHTML}
/* "?" düğmesi: tıklayınca öğenin yanında kısa açıklama */
function ip(k){if(!tAlt('ipucu',k))return '';return `<button type="button" class="btn btn-ghost btn-circle btn-xs text-base-content/50 hover:text-base-content ipucu-btn align-middle" data-ipk="${esc(k)}" aria-expanded="false" aria-label="${esc(t('whatIsThis'))}" title="${esc(t('whatIsThis'))}"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg></button>`}
/* Açıklama kutusu: sayfanın üstünde ayrı katmanda açılır, panel ya da tablo kenarında kesilmez. */
let ipAcik=null;
function ipKapat(){const k=$('#ipucuKutu');k.classList.add('hidden');if(ipAcik){ipAcik.setAttribute('aria-expanded','false');ipAcik=null}}
document.addEventListener('click',e=>{const b=e.target.closest('.ipucu-btn');const k=$('#ipucuKutu');
  if(!b){if(ipAcik&&!e.target.closest('#ipucuKutu'))ipKapat();return}
  e.preventDefault();e.stopPropagation();if(ipAcik===b){ipKapat();return}ipKapat();
  k.innerHTML=guvenliHtml(tAlt('ipucu',b.dataset.ipk));k.classList.remove('hidden');
  const r=b.getBoundingClientRect(),w=k.offsetWidth,h=k.offsetHeight;let x=r.left+r.width/2-w/2,y=r.bottom+6;
  x=Math.max(8,Math.min(x,innerWidth-w-8));if(y+h>innerHeight-8)y=Math.max(8,r.top-h-6);k.style.left=x+'px';k.style.top=y+'px';
  b.setAttribute('aria-expanded','true');ipAcik=b},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ipAcik)ipKapat()});
addEventListener('scroll',()=>ipAcik&&ipKapat(),true);

/* ====================== PROJE YARDIMCILARI ====================== */
function bosProje(){return {tur:'kodlama-masasi',v:2,ad:t('untitled'),kodlayici:S.dil==='tr'?'Kodlayıcı 1':'Coder 1',gorunur:'',kor:false,belgeler:[],kodlar:[],bolumler:[],gunluk:[],olusturma:new Date().toISOString(),rev:0}}
const P=()=>S.P;
function projeDuzelt(p){p.v=2;p.belgeler=p.belgeler||[];p.kodlar=p.kodlar||[];p.bolumler=p.bolumler||[];p.gunluk=p.gunluk||[];p.rev=p.rev||0;
  p.belgeler.forEach(b=>{b.ozellik=b.ozellik||{};b.not=b.not||''});p.kodlar.forEach(k=>{k.ust=k.ust||null;k.tanim=k.tanim||'';k.not=k.not||''});
  /* bozuk üst kod zincirlerini onar (eski sürümdeki birleştirme hatasından kalmış olabilir) */
  const ids=new Set(p.kodlar.map(k=>k.id));p.kodlar.forEach(k=>{if(k.ust&&(!ids.has(k.ust)||k.ust===k.id))k.ust=null});
  p.kodlar.forEach(k=>{const gor=new Set([k.id]);let u=k.ust,g=0;while(u&&g++<50){if(gor.has(u)){k.ust=null;break}gor.add(u);u=(p.kodlar.find(x=>x.id===u)||{}).ust}});
  return p}
const belge=id=>P().belgeler.find(b=>b.id===id);
const kod=id=>P().kodlar.find(k=>k.id===id);
const altKodlar=id=>P().kodlar.filter(k=>k.ust===id);
function torunlar(id){const o=[id];altKodlar(id).forEach(k=>o.push(...torunlar(k.id)));return o}
function kodYolu(id){const p=[];let k=kod(id),g=0;while(k&&g++<20){p.unshift(k.ad);k=kod(k.ust)}return p.join(' > ')}
function kodDerinlik(id){let d=0,k=kod(id),g=0;while(k&&k.ust&&g++<20){d++;k=kod(k.ust)}return d}
function siraliKodlar(){const o=[];const gez=ust=>P().kodlar.filter(k=>(k.ust||null)===ust).sort((a,b)=>a.ad.localeCompare(b.ad,S.dil)).forEach(k=>{o.push(k);gez(k.id)});gez(null);return o}
const kodlayicilar=()=>[...new Set(P().bolumler.map(b=>b.kd))].sort((a,b)=>a.localeCompare(b,S.dil));
function gorunurBolum(b){if(P().kor)return b.kd===P().kodlayici;return !P().gorunur||b.kd===P().gorunur}
function yeniKod(ad,ust=null){const k={id:uid(),ad:ad.trim(),renk:RENKLER[P().kodlar.length%RENKLER.length],ust,tanim:'',not:''};P().kodlar.push(k);S.secKod.add(k.id);return k}
function gunlukEkle(m,oto=true){P().gunluk.push({t:new Date().toISOString(),m,oto,kd:P().kodlayici})}
const normalMetin=s=>String(s).replace(/\r\n?/g,'\n').replace(/ /g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
/* Harf harf küçültme: uzunluk değişmez, böylece konumlar kaymaz (İ, ı gibi harfler için güvenli). */
function kucukHarf(s){let o='';for(const c of s){const l=c.toLocaleLowerCase(S.dil);o+=l.length===c.length?l:c}return o}

/* ====================== KALICI KAYIT (IndexedDB) ====================== */
const VT={db:null,
  ac(){return new Promise(res=>{try{const r=indexedDB.open('kodlama-masasi',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>{VT.db=r.result;res(true)};r.onerror=()=>res(false)}catch(e){res(false)}})},
  al(k){return new Promise(res=>{if(!VT.db)return res(null);try{const r=VT.db.transaction('kv').objectStore('kv').get(k);r.onsuccess=()=>res(r.result??null);r.onerror=()=>res(null)}catch(e){res(null)}})},
  koy(k,v){return new Promise((res,rej)=>{if(!VT.db)return rej(new Error('db'));try{const tx=VT.db.transaction('kv','readwrite');tx.objectStore('kv').put(v,k);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)}catch(e){rej(e)}})}};
const ls={al(k){try{return localStorage.getItem(k)}catch(e){return null}},koy(k,v){try{localStorage.setItem(k,v);return true}catch(e){return false}}};
const OTURUM=uid();
let kayitZ=null;
function kaydet(){if(S.kilit)return;clearTimeout(kayitZ);kayitZ=setTimeout(async()=>{P().rev=(P().rev||0)+1;const veri=JSON.stringify(P());
  let tamam=false;try{await VT.koy('proje',veri);tamam=true}catch(e){tamam=ls.koy(KAYIT,veri)}
  if(tamam){S.kaydedildi=true;$('#kayitDurum').textContent=t('saved');sekmeHaber()}else tost(t('saveFail'),'warning')},350)}
async function projeYukle(){let s=await VT.al('proje');if(!s){s=ls.al(KAYIT)}if(!s)return null;try{const p=JSON.parse(s);if(p&&p.tur==='kodlama-masasi')return projeDuzelt(p)}catch(e){}return null}
/* Aynı proje iki sekmede açıksa: biri kaydedince diğeri kilitlenir. */
let kanal=null;try{kanal=new BroadcastChannel('kodlama-masasi');kanal.onmessage=e=>{if(e.data&&e.data.o!==OTURUM)sekmeKilitle()}}catch(e){}
function sekmeHaber(){const m={o:OTURUM,r:P().rev};try{kanal&&kanal.postMessage(m)}catch(e){}ls.koy(KAYIT+'.nabiz',JSON.stringify(m))}
addEventListener('storage',e=>{if(e.key===KAYIT+'.nabiz'&&e.newValue){try{if(JSON.parse(e.newValue).o!==OTURUM)sekmeKilitle()}catch(_){}}});
function sekmeKilitle(){if(S.kilit)return;S.kilit=true;clearTimeout(kayitZ);$('#sekmeUyari').classList.remove('hidden');$('#sekmeUyari').classList.add('flex')}

/* ====================== GERİ AL / YİNELE ====================== */
const GECMIS={geri:[],ileri:[]};
function once(){GECMIS.geri.push(JSON.stringify(P()));if(GECMIS.geri.length>60)GECMIS.geri.shift();GECMIS.ileri=[];gecmisDugme()}
function gecmisDugme(){$('#geriAl').disabled=!GECMIS.geri.length;$('#yinele').disabled=!GECMIS.ileri.length}
function geriAl(){if(!GECMIS.geri.length)return;GECMIS.ileri.push(JSON.stringify(P()));S.P=projeDuzelt(JSON.parse(GECMIS.geri.pop()));sonrasi();tost(t('undone'))}
function yinele(){if(!GECMIS.ileri.length)return;GECMIS.geri.push(JSON.stringify(P()));S.P=projeDuzelt(JSON.parse(GECMIS.ileri.pop()));sonrasi();tost(t('redone'))}
function sonrasi(){if(S.belge&&!belge(S.belge))S.belge=null;S.noktaBolumler=null;if(S.odakKod&&!kod(S.odakKod))S.odakKod=null;gecmisDugme();kaydet();ciz()}
/* Değişiklik yapan her işlem bundan geçer: önce anlık görüntü, sonra işlem, sonra kayıt ve çizim. */
function islem(fn){once();const r=fn();kaydet();ciz();return r}

/* ====================== ARAYÜZ YARDIMCILARI ====================== */
function tost(m,tur='success'){const d=document.createElement('div');d.className='alert '+({warning:'alert-warning',error:'alert-error'}[tur]||'alert-success')+' text-sm py-2 max-w-sm';d.setAttribute('role','status');d.textContent=m;$('#tost').appendChild(d);setTimeout(()=>d.remove(),4200)}
function pencere(baslik,icerik,dugmeler,o={}){$('#pBaslik').textContent=baslik;$('#pYardim').innerHTML=o.ip?ip(o.ip):'';$('#pIcerik').innerHTML=icerik;const pd=$('#pDugmeler');pd.innerHTML='';
  $('#pencere .modal-box').classList.toggle('max-w-4xl',!!o.genis);$('#pencere .modal-box').classList.toggle('max-w-2xl',!o.genis);
  return new Promise(res=>{const dlg=$('#pencere');let sonuc=null;(dugmeler||[{ad:t('close'),d:null}]).forEach(b=>{const e=document.createElement('button');e.className='btn '+(b.c||'');e.textContent=b.ad;if(b.id)e.id=b.id;e.onclick=async()=>{if(b.f){const r=await b.f();if(r===false)return}sonuc=b.d;dlg.close()};pd.appendChild(e)});
    dlg.onclose=()=>{if(dlg.open)return;res(sonuc)};dlg.showModal();if(o.acilinca)o.acilinca()})}
const sor=(m,evet,tehlike)=>pencere(t('project'),`<p>${esc(m)}</p>`,[{ad:t('cancel'),d:false},{ad:evet||'OK',d:true,c:tehlike?'btn-error':'btn-primary'}]);
function indir(ad,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=ad;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(a.href)},2000)}
const dosyaAd=s=>(String(s||'proje').replace(/ı/g,'i').replace(/İ/g,'I').normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[^\w-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').toLowerCase()||'proje');
function dosyaOku(kabul){return new Promise(res=>{const i=$('#dosyaSec');i.value='';i.accept=kabul||'';i.onchange=()=>res(i.files[0]||null);i.click()})}

/* ====================== ZIP ====================== */
async function zipAc(buf){const u=new Uint8Array(buf),dv=new DataView(u.buffer,u.byteOffset,u.byteLength);let e=u.length-22;
  while(e>=0&&dv.getUint32(e,true)!==0x06054b50)e--;if(e<0)throw new Error('zip');
  const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const dec=new TextDecoder(),o={};
  for(let i=0;i<n;i++){if(dv.getUint32(p,true)!==0x02014b50)break;
    const yon=dv.getUint16(p+10,true),cb=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lh=dv.getUint32(p+42,true);
    const ad=dec.decode(u.subarray(p+46,p+46+nl));const ln=dv.getUint16(lh+26,true),lx=dv.getUint16(lh+28,true),bas=lh+30+ln+lx;
    o[ad]={yon,veri:u.subarray(bas,bas+cb)};p+=46+nl+xl+cl}
  o.oku=async ad=>{const f=o[ad];if(!f)return null;const b=f.yon===0?f.veri:new Uint8Array(await new Response(new Blob([f.veri]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());return new TextDecoder().decode(b)};
  return o}
const CRC=(()=>{const tb=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;tb[n]=c>>>0}return d=>{let c=0xFFFFFFFF;for(let i=0;i<d.length;i++)c=tb[(c^d[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}})();
function zipYap(files,tip){const enc=new TextEncoder(),parca=[],merkez=[];let off=0;const n=new Date(),dt=((n.getFullYear()-1980)<<9)|((n.getMonth()+1)<<5)|n.getDate(),tm=(n.getHours()<<11)|(n.getMinutes()<<5)|(n.getSeconds()>>1);
  for(const f of files){const ad=enc.encode(f.ad),d=typeof f.veri==='string'?enc.encode(f.veri):f.veri,c=CRC(d);
    const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(10,tm,true);h.setUint16(12,dt,true);h.setUint32(14,c,true);h.setUint32(18,d.length,true);h.setUint32(22,d.length,true);h.setUint16(26,ad.length,true);
    parca.push(new Uint8Array(h.buffer),ad,d);
    const m=new DataView(new ArrayBuffer(46));m.setUint32(0,0x02014b50,true);m.setUint16(4,20,true);m.setUint16(6,20,true);m.setUint16(8,0x0800,true);m.setUint16(12,tm,true);m.setUint16(14,dt,true);m.setUint32(16,c,true);m.setUint32(20,d.length,true);m.setUint32(24,d.length,true);m.setUint16(28,ad.length,true);m.setUint32(42,off,true);
    merkez.push(new Uint8Array(m.buffer),ad);off+=30+ad.length+d.length}
  const cs=merkez.reduce((a,b)=>a+b.length,0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cs,true);e.setUint32(16,off,true);
  return new Blob([...parca,...merkez,new Uint8Array(e.buffer)],{type:tip||'application/zip'})}

/* ====================== DOSYA OKUYUCULAR ====================== */
const W='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
async function docxMetin(buf){const z=await zipAc(buf);const xml=await z.oku('word/document.xml');if(!xml)throw new Error('document.xml');
  const d=new DOMParser().parseFromString(xml,'application/xml');
  /* Metin kutuları hem kendi paragrafında hem eski (VML) yedeğinde yer alır; yedekleri ve iç içe tekrarları atla. */
  const yedekte=n=>{for(let a=n.parentNode;a&&a.nodeType===1;a=a.parentNode){if(a.localName==='Fallback')return true}return false};
  return [...d.getElementsByTagNameNS(W,'p')].filter(p=>!yedekte(p)).map(pp=>{let s='';const gez=nd=>{for(const c of nd.childNodes){if(c.nodeType!==1)continue;
      if(c.localName==='txbxContent'||c.localName==='Fallback')continue;
      if(c.namespaceURI===W){if(c.localName==='t')s+=c.textContent;else if(c.localName==='tab')s+='\t';else if(c.localName==='br'||c.localName==='cr')s+='\n';else if(c.localName!=='instrText'&&c.localName!=='delText')gez(c)}else gez(c)}};
    gez(pp);return s}).join('\n')}
async function xlsxSatirlar(buf){const z=await zipAc(buf);const P_=s=>new DOMParser().parseFromString(s,'application/xml');
  const ss=[];const sx=await z.oku('xl/sharedStrings.xml');if(sx){[...P_(sx).getElementsByTagNameNS('*','si')].forEach(si=>ss.push([...si.getElementsByTagNameNS('*','t')].map(x=>x.textContent).join('')))}
  let yol='xl/worksheets/sheet1.xml';try{const wb=P_(await z.oku('xl/workbook.xml')),sh=wb.getElementsByTagNameNS('*','sheet')[0];const rid=sh.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id');
    const rel=P_(await z.oku('xl/_rels/workbook.xml.rels'));const r=[...rel.getElementsByTagNameNS('*','Relationship')].find(x=>x.getAttribute('Id')===rid);if(r){const h=r.getAttribute('Target');yol=h.startsWith('/')?h.slice(1):'xl/'+h.replace(/^\.\//,'')}}catch(e){}
  const sxml=await z.oku(yol);if(!sxml)throw new Error('sheet');const sat=[];
  const kol=r=>{let n=0;for(const c of r.replace(/\d+/g,''))n=n*26+c.charCodeAt(0)-64;return n-1};
  [...P_(sxml).getElementsByTagNameNS('*','row')].forEach(row=>{const s=[];[...row.getElementsByTagNameNS('*','c')].forEach(c=>{const tip=c.getAttribute('t'),v=c.getElementsByTagNameNS('*','v')[0];
    let val='';if(tip==='s'&&v)val=ss[+v.textContent]??'';else if(tip==='inlineStr')val=[...c.getElementsByTagNameNS('*','t')].map(x=>x.textContent).join('');else if(v)val=v.textContent;
    s[kol(c.getAttribute('r')||'A')]=val});sat.push([...s].map(x=>x??''))});return sat}
function csvSatirlar(m){m=m.replace(/^﻿/,'');const ilk=m.split('\n')[0];const ay=[';','\t',','].sort((a,b)=>ilk.split(b).length-ilk.split(a).length)[0];
  const o=[];let s=[],h='',tr=false;for(let i=0;i<m.length;i++){const c=m[i];if(tr){if(c==='"'){if(m[i+1]==='"'){h+='"';i++}else tr=false}else h+=c}
    else if(c==='"')tr=true;else if(c===ay){s.push(h);h=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&m[i+1]==='\n')i++;s.push(h);o.push(s);s=[];h=''}else h+=c}
  if(h||s.length){s.push(h);o.push(s)}return o.filter(r=>r.some(x=>String(x).trim()))}
async function pdfMetin(buf){if(!window.pdfjsLib)throw new Error('pdf');
  const doc=await pdfjsLib.getDocument({data:new Uint8Array(buf),isEvalSupported:false,disableFontFace:true,useSystemFonts:false}).promise;let o=[];
  for(let i=1;i<=doc.numPages;i++){const pg=await doc.getPage(i);const tc=await pg.getTextContent();let s='';tc.items.forEach(it=>{s+=it.str;if(it.hasEOL)s+='\n';else if(it.str&&!/\s$/.test(it.str))s+=''});o.push(s)}
  const m=o.join('\n\n');if(!m.trim())throw new Error('bos');return m.replace(/([^\n])\n(?=[a-zçğıöşü])/g,'$1 ')}
async function dosyadanMetin(f){const ad=f.name.toLowerCase();if(ad.endsWith('.docx'))return docxMetin(await f.arrayBuffer());if(ad.endsWith('.pdf'))return pdfMetin(await f.arrayBuffer());return f.text()}

/* ====================== CSV YAZ ====================== */
function csv(satirlar){const ay=S.dil==='tr'?';':',';
  return new Blob(['﻿'+satirlar.map(r=>r.map(v=>{let s=String(v??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return /["\n\r;,]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}).join(ay)).join('\r\n')],{type:'text/csv;charset=utf-8'})}
