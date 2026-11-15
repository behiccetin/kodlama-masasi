/* ====================== ÇİZİM: GENEL ====================== */
function metinleriYaz(){
  document.documentElement.lang=S.dil;
  $$('[data-t]').forEach(e=>e.textContent=t(e.dataset.t));
  $$('[data-tp]').forEach(e=>e.placeholder=t(e.dataset.tp));
  $$('[data-tg]').forEach(e=>{const [g,k]=e.dataset.tg.split('.');e.textContent=tAlt(g,k)});
  $$('[data-ta]').forEach(e=>{e.setAttribute('aria-label',t(e.dataset.ta));e.title=t(e.dataset.ta)});
  $$('[data-ip]').forEach(e=>e.innerHTML=ip(e.dataset.ip));ipKapat();
  $('#sekmelerMobil').innerHTML=$('#sekmeler').innerHTML;
  $$('#sekmelerMobil [data-sekme]').forEach(b=>b.onclick=()=>sekmeAc(b.dataset.sekme));
  $('#kayitDurum').textContent=S.kaydedildi?t('saved'):'';
  $('#dilSecM').innerHTML=$('#dilSec').innerHTML=Object.entries(DILLER).sort((a,b)=>a[1]._ad.localeCompare(b[1]._ad)).map(([k,v])=>`<option value="${esc(k)}" ${k===S.dil?'selected':''}>${esc(v._ad||k)}</option>`).join('');
  const ub=$('#uBirim').value;$('#uBirim').innerHTML=`<option value="p">${esc(t('unitPara'))}</option><option value="c">${esc(t('unitSent'))}</option>`;if(ub)$('#uBirim').value=ub;
  sekmeIsaretle()}
function sekmeIsaretle(){$$('[role=tab][data-sekme]').forEach(b=>{const on=b.dataset.sekme===S.sekme;b.classList.toggle('tab-active',on);b.setAttribute('aria-selected',on)})}
function sekmeAc(s){S.sekme=s;$$('.sekme').forEach(e=>e.classList.add('hidden'));$('#s-'+s).classList.remove('hidden');$('#cekmece').classList.toggle('lg:drawer-open',s!=='giris');$('#yan-menu').checked=false;sekmeIsaretle();kutuKapat();$('main').scrollTop=0;ciz()}
function ciz(){
  $('#projeAd').value=P().ad||'';
  $('#kodlayiciBtn').innerHTML=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg><span class="truncate">${esc(P().kodlayici)}</span>`;
  $('#kodlayiciBtn').title=t('coderBtn',P().kodlayici);$('#kodlayiciAd').value=P().kodlayici;$('#kodlayiciAdM').value=P().kodlayici;
  const kds=kodlayicilar();if(P().gorunur&&!kds.includes(P().gorunur))P().gorunur='';
  $('#gorunur').innerHTML=`<option value="">${esc(t('allCoders'))}</option>`+kds.map(k=>`<option ${k===P().gorunur?'selected':''}>${esc(k)}</option>`).join('');
  $('#gorunur').disabled=!!P().kor;$('#korSec').checked=!!P().kor;$('#korRozet').classList.toggle('hidden',!P().kor);
  cizBelgeler();cizKodlar();
  ({giris:cizGiris,kod:cizOkuyucu,alinti:cizAlintilar,analiz:cizAnaliz,uyum:cizUyum,rapor:()=>{cizUyum();cizYontemKart()}})[S.sekme]()}

/* ---- sol panel ---- */
function cizBelgeler(){const L=P().belgeler;
  $('#belgeListe').innerHTML=L.length?L.map(b=>{const n=P().bolumler.filter(x=>x.b===b.id&&gorunurBolum(x)).length;
    return `<li><a href="#" class="${b.id===S.belge&&S.sekme==='kod'?'menu-active':''} flex" data-belge="${b.id}" title="${esc(b.ad)}"><span class="truncate flex-1">${esc(b.ad)}</span><span class="badge badge-ghost badge-sm">${n}</span></a></li>`}).join('')
    :`<li class="text-sm text-base-content/60 px-2 py-1">${esc(t('noDoc'))}</li>`;
  $$('#belgeListe [data-belge]').forEach(a=>{a.onclick=e=>{e.preventDefault();S.belge=a.dataset.belge;S.noktaBolumler=null;if(S.sekme!=='kod')sekmeAc('kod');else ciz();$('#yan-menu').checked=false};a.ondblclick=()=>belgeDuzenle(a.dataset.belge)})}
function kodSayilari(){const m={};P().bolumler.forEach(b=>{if(gorunurBolum(b))m[b.k]=(m[b.k]||0)+1});return m}
let surukKod=null;
function cizKodlar(){const m=kodSayilari(),ara=kucukHarf($('#kodAra').value||'');
  const L=siraliKodlar().filter(k=>!ara||kucukHarf(k.ad).includes(ara));
  $('#kodAgac').innerHTML=L.length?L.map(k=>`<li><div class="flex items-center gap-2 ${S.odakKod===k.id?'menu-active':''}" style="padding-left:${0.75+kodDerinlik(k.id)}rem" data-kod="${k.id}" draggable="true" title="${esc(k.tanim||k.ad)}">
      <span class="kod-nokta" style="background:${k.renk}"></span><span class="truncate flex-1">${esc(k.ad)}</span><span class="badge badge-ghost badge-sm">${m[k.id]||0}</span>
      <button class="btn btn-ghost btn-xs btn-square opacity-50 hover:opacity-100" data-kodduz="${k.id}" aria-label="${esc(t('editCodeTitle'))}" title="${esc(t('editCodeTitle'))}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button></div></li>`).join('')
    :`<li class="text-sm text-base-content/60 px-2 py-1">${esc(P().kodlar.length?'-':t('noCode'))}</li>`;
  $$('#kodAgac [data-kod]').forEach(e=>{
    e.onclick=ev=>{if(ev.target.closest('[data-kodduz]'))return;S.odakKod=S.odakKod===e.dataset.kod?null:e.dataset.kod;
      if(S.sekme==='alinti'){S.secKod=new Set(S.odakKod?($('#fAlt').checked?torunlar(S.odakKod):[S.odakKod]):[])}ciz()};
    e.ondragstart=ev=>{surukKod=e.dataset.kod;ev.dataTransfer.effectAllowed='move';ev.dataTransfer.setData('text/plain',surukKod);$('#kokBirak').classList.remove('hidden');$('#kodAra').classList.add('hidden')};
    e.ondragend=()=>{surukKod=null;$('#kokBirak').classList.add('hidden');$('#kodAra').classList.remove('hidden');$$('.surukle-hedef').forEach(x=>x.classList.remove('surukle-hedef'))};
    e.ondragover=ev=>{if(surukKod&&!torunlar(surukKod).includes(e.dataset.kod)){ev.preventDefault();e.classList.add('surukle-hedef')}};
    e.ondragleave=()=>e.classList.remove('surukle-hedef');
    e.ondrop=ev=>{ev.preventDefault();const id=surukKod,hedef=e.dataset.kod;if(id&&!torunlar(id).includes(hedef))islem(()=>{kod(id).ust=hedef})}});
  $$('#kodAgac [data-kodduz]').forEach(b=>b.onclick=()=>kodDuzenle(b.dataset.kodduz))}
const kok=$('#kokBirak');kok.ondragover=e=>{if(surukKod){e.preventDefault();kok.classList.add('bg-primary/10')}};kok.ondragleave=()=>kok.classList.remove('bg-primary/10');
kok.ondrop=e=>{e.preventDefault();kok.classList.remove('bg-primary/10');const id=surukKod;if(id)islem(()=>{kod(id).ust=null})};

/* ====================== OKUYUCU ====================== */
function rgba(hex,a){const h=hex.replace('#','');const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`}
function cizOkuyucu(){
  const b=belge(S.belge)||P().belgeler[0];S.belge=b?b.id:null;
  const ok=$('#okuyucu'),se=$('#serit');
  if(!b){$('#belgeBaslik').textContent=t('noDoc');$('#belgeOzet').textContent='';se.innerHTML='';
    ok.innerHTML=`<div class="font-sans py-8 max-w-md" style="white-space:normal"><p class="text-base-content/70">${esc(t('noDocHint'))}</p><div class="flex flex-wrap gap-2 mt-5"><button class="btn btn-primary btn-sm" id="bosEkle">${esc(t('addDoc'))}</button><button class="btn btn-sm" id="bosOrnek">${esc(t('loadSample'))}</button></div></div>`;
    $('#bosEkle').onclick=belgeEkle;$('#bosOrnek').onclick=ornekYukle;$('#ayrinti').innerHTML=`<div class="text-sm text-base-content/60">${guvenliHtml(tAlt('helpBody','genel'))}</div>`;return}
  const segs=P().bolumler.filter(x=>x.b===b.id&&gorunurBolum(x)).sort((x,y)=>x.s-y.s||y.e-x.e);
  $('#belgeBaslik').textContent=b.ad;$('#belgeOzet').textContent=t('docStats',sayi(b.metin.length),segs.length);
  const nk=new Set([0,b.metin.length]);segs.forEach(s=>{nk.add(s.s);nk.add(s.e)});const N=[...nk].sort((x,y)=>x-y);
  let h='';
  for(let i=0;i<N.length-1;i++){const a=N[i],e=N[i+1],parca=b.metin.slice(a,e);const akt=segs.filter(s=>s.s<=a&&s.e>=e);
    if(!akt.length){h+=`<span data-o="${a}">${esc(parca)}</span>`;continue}
    const renk=[...new Set(akt.map(s=>(kod(s.k)||{}).renk||'#999'))].slice(0,3);const al=.42;
    let st;if(renk.length===1)st=`background:${rgba(renk[0],al)}`;else{const p=100/renk.length;st='background:linear-gradient(to bottom,'+renk.map((r,j)=>`${rgba(r,al)} ${j*p}% ${(j+1)*p}%`).join(',')+')'}
    const vurgu=S.odakKod&&akt.some(s=>s.k===S.odakKod);
    h+=`<span data-o="${a}" class="isaret${vurgu?' vurgu':''}" data-seg="${akt.map(s=>s.id).join(',')}" style="${st}">${esc(parca)}</span>`}
  ok.innerHTML=h;
  requestAnimationFrame(()=>seritCiz(segs));
  cizAyrinti()}
function seritCiz(segs){
  const se=$('#serit'),ok=$('#okuyucu');se.innerHTML='';if(!segs.length)return;
  const gen=se.clientWidth,ust=se.getBoundingClientRect().top,dar=gen<60;
  const spanlar=[...ok.querySelectorAll('[data-o]')];const offs=spanlar.map(s=>+s.dataset.o);
  /* aynı kod aynı aralıkta birden çok kodlayıcıdan gelmişse tek şerit */
  const tekil=[];const gor=new Map();segs.forEach(s=>{const a=s.k+':'+s.s+':'+s.e;if(gor.has(a)){gor.get(a).kim.push(s.kd);return}const o={s,kim:[s.kd]};gor.set(a,o);tekil.push(o)});
  const kulvar=[];const ser=[];
  tekil.forEach(o=>{const s=o.s;let i=offs.findIndex(x=>x>=s.s);if(i<0)return;let j=i;while(j+1<spanlar.length&&offs[j+1]<s.e)j++;
    const r1=spanlar[i].getClientRects(),r2=spanlar[j].getClientRects();if(!r1.length||!r2.length)return;
    const y1=r1[0].top-ust,y2=r2[r2.length-1].bottom-ust;let l=kulvar.findIndex(b=>b<y1-2);if(l<0){l=kulvar.length;kulvar.push(0)}kulvar[l]=y2;ser.push({...o,y1,y2,l})});
  const adim=dar?7:9,genis=kulvar.length*adim;let sonAlt=-99;
  ser.sort((a,b)=>a.y1-b.y1||a.l-b.l).forEach(({s,kim,y1,y2,l})=>{const k=kod(s.k)||{renk:'#999',ad:'?'};const sag=6+l*adim;
    const ac=()=>{S.noktaBolumler=P().bolumler.filter(x=>x.k===s.k&&x.s===s.s&&x.e===s.e&&x.b===s.b&&gorunurBolum(x)).map(x=>x.id);cizAyrinti()};
    const d=document.createElement('div');d.className='serit';d.style.cssText=`top:${y1}px;height:${Math.max(6,y2-y1)}px;right:${sag}px;background:${k.renk}`;d.title=`${kodYolu(s.k)} (${kim.join(', ')})`;d.onclick=ac;se.appendChild(d);
    if(!dar){const y=Math.max(y1,sonAlt+1);if(y<=Math.max(y2,y1+18)){const e=document.createElement('div');e.className='serit-ad';e.style.cssText=`top:${y}px;right:${10+genis}px;max-width:${Math.max(40,gen-20-genis)}px`;e.textContent=k.ad;e.title=d.title;e.onclick=ac;se.appendChild(e);sonAlt=y+15}}})}

/* ---- seçim ve kodlama ---- */
function konum(node,off){const ok=$('#okuyucu');
  if(node.nodeType===3){const sp=node.parentElement.closest('[data-o]');if(!sp||!ok.contains(sp))return null;return +sp.dataset.o+off}
  if(node===ok){const c=ok.childNodes[off];if(c&&c.dataset&&c.dataset.o!=null)return +c.dataset.o;return belge(S.belge).metin.length}
  const sp=node.closest&&node.closest('[data-o]');if(sp&&ok.contains(sp)){return +sp.dataset.o+(off>0?sp.textContent.length:0)}return null}
function secimAl(){const sel=getSelection();if(!sel.rangeCount||sel.isCollapsed||!belge(S.belge))return null;const r=sel.getRangeAt(0);const ok=$('#okuyucu');
  if(!ok.contains(r.commonAncestorContainer))return null;let s=konum(r.startContainer,r.startOffset),e=konum(r.endContainer,r.endOffset);if(s==null||e==null)return null;
  if(s>e)[s,e]=[e,s];const m=belge(S.belge).metin;while(s<e&&/\s/.test(m[s]))s++;while(e>s&&/\s/.test(m[e-1]))e--;if(e<=s)return null;return {s,e,rect:r.getBoundingClientRect()}}
let kkSecili=0;
const kutuAcik=()=>!$('#kodKutu').classList.contains('hidden');
function kutuAc(rect){const k=$('#kodKutu');k.classList.remove('hidden');const w=304,h=k.offsetHeight||320;let x=Math.min(rect.left,innerWidth-w-12),y=rect.bottom+8;if(y+h>innerHeight-8)y=Math.max(8,rect.top-h-8);k.style.left=Math.max(8,x)+'px';k.style.top=y+'px';$('#kkAra').value='';kkSecili=0;kutuListe();
  if(matchMedia('(pointer:fine)').matches)$('#kkAra').focus()}
function kutuKapat(){$('#kodKutu').classList.add('hidden');S.secim=null}
function kutuAdaylar(){const q=kucukHarf($('#kkAra').value.trim());
  const son=[...P().bolumler].sort((a,b)=>(b.t||0)-(a.t||0)).map(b=>b.k);const sira=k=>{const i=son.indexOf(k.id);return i<0?1e9:i};
  return siraliKodlar().filter(k=>!q||kucukHarf(k.ad).includes(q)).sort((a,b)=>q?0:sira(a)-sira(b))}
function kutuListe(){const L=kutuAdaylar(),q=$('#kkAra').value.trim();const tam=L.some(k=>kucukHarf(k.ad)===kucukHarf(q));
  let h=L.map((k,i)=>`<li><button class="${i===kkSecili?'menu-active':''}" data-uygula="${k.id}"><span class="kod-nokta" style="background:${k.renk}"></span><span class="truncate flex-1 text-left">${esc(kodYolu(k.id))}</span>${!q&&i<9?`<kbd class="kbd kbd-xs">${i+1}</kbd>`:''}</button></li>`).join('');
  if(q&&!tam)h+=`<li><button class="${L.length===0?'menu-active':''}" data-yeni="1">+ "${esc(q)}"</button></li>`;
  $('#kkListe').innerHTML=h;$$('#kkListe [data-uygula]').forEach(b=>b.onmousedown=e=>{e.preventDefault();uygula(b.dataset.uygula)});const y=$('#kkListe [data-yeni]');if(y)y.onmousedown=e=>{e.preventDefault();uygula(null,q)}}
function uygula(kid,yeniAd){const s=S.secim;if(!s)return;const b=S.belge;
  islem(()=>{if(!kid)kid=yeniKod(yeniAd).id;if(!P().bolumler.some(x=>x.b===b&&x.k===kid&&x.s===s.s&&x.e===s.e&&x.kd===P().kodlayici))P().bolumler.push({id:uid(),b,k:kid,s:s.s,e:s.e,kd:P().kodlayici,not:'',t:Date.now()});
    getSelection().removeAllRanges();kutuKapat()})}

/* ---- sağ panel ---- */
function cizAyrinti(){const a=$('#ayrinti'),b=belge(S.belge);if(!b){return}
  const nb=(S.noktaBolumler||[]).map(id=>P().bolumler.find(x=>x.id===id)).filter(Boolean);
  if(nb.length){a.innerHTML=`<div class="flex items-center justify-between gap-2 mb-3"><h2 class="font-semibold">${esc(t('codingsHere'))}</h2><button class="btn btn-ghost btn-xs" id="geri">${esc(t('backToDoc'))}</button></div>`+
    nb.map(x=>{const k=kod(x.k)||{};return `<div class="border border-base-300 rounded-box p-3 mb-3">
      <div class="flex items-center gap-2"><span class="kod-nokta" style="background:${k.renk}"></span><b class="text-sm">${esc(kodYolu(x.k))}</b></div>
      <p class="text-xs text-base-content/60 mt-1">${esc(t('by',x.kd))}</p>
      <blockquote class="metin-serif text-sm border-l-4 pl-3 my-2" style="border-color:${k.renk}">${esc(kisalt(b.metin.slice(x.s,x.e),260))}</blockquote>
      <label class="text-xs font-medium" for="not-${x.id}">${esc(t('memo'))}</label>
      <textarea id="not-${x.id}" class="textarea textarea-sm w-full mt-1" rows="2" data-bnot="${x.id}">${esc(x.not||'')}</textarea>
      <div class="flex flex-wrap gap-2 mt-2"><select class="select select-xs flex-1 min-w-0" data-bdeg="${x.id}" aria-label="${esc(t('changeCode'))}">${siraliKodlar().map(c=>`<option value="${c.id}" ${c.id===x.k?'selected':''}>${esc(kodYolu(c.id))}</option>`).join('')}</select>
      <button class="btn btn-xs btn-outline btn-error" data-bsil="${x.id}">${esc(t('removeCoding'))}</button></div></div>`}).join('');
    $('#geri').onclick=()=>{S.noktaBolumler=null;cizAyrinti()};
    $$('[data-bnot]').forEach(e=>{e.onfocus=()=>once();e.oninput=()=>{P().bolumler.find(x=>x.id===e.dataset.bnot).not=e.value;kaydet()}});
    $$('[data-bdeg]').forEach(e=>e.onchange=()=>islem(()=>{P().bolumler.find(x=>x.id===e.dataset.bdeg).k=e.value}));
    $$('[data-bsil]').forEach(e=>e.onclick=()=>islem(()=>{P().bolumler=P().bolumler.filter(x=>x.id!==e.dataset.bsil);S.noktaBolumler=S.noktaBolumler.filter(i=>i!==e.dataset.bsil)}));return}
  const oz=b.ozellik||{};
  a.innerHTML=`<div class="flex items-center justify-between gap-2"><h2 class="font-semibold">${esc(t('docInfo'))}</h2><button class="btn btn-ghost btn-xs" id="bDuz">${esc(t('editDoc'))}</button></div>
    <p class="text-sm text-base-content/60 mt-3">${esc(t('selectHint'))}</p>
    <div class="flex items-center gap-1 mt-6"><h3 class="font-medium text-sm">${esc(t('attributes'))}</h3>${ip('ozellikler')}</div>
    <div class="space-y-2 mt-2" id="ozListe">${Object.entries(oz).map(([k,v],i)=>`<div class="join w-full"><input class="input input-xs join-item w-1/2" value="${esc(k)}" data-ozk="${i}" aria-label="${esc(t('attrKey'))}"><input class="input input-xs join-item w-1/2" value="${esc(v)}" data-ozv="${i}" aria-label="${esc(t('attrVal'))}"></div>`).join('')}</div>
    <button class="btn btn-ghost btn-xs mt-2" id="ozEkle">+ ${esc(t('addAttr'))}</button>
    <div class="flex items-center gap-1 mt-6 mb-1"><h3 class="font-medium text-sm"><label for="bNot">${esc(t('docMemo'))}</label></h3>${ip('belgeNot')}</div><textarea id="bNot" class="textarea textarea-sm w-full" rows="6">${esc(b.not||'')}</textarea>`;
  $('#bDuz').onclick=()=>belgeDuzenle(b.id);
  $('#bNot').onfocus=()=>once();$('#bNot').oninput=e=>{b.not=e.target.value;kaydet()};
  const ozOku=()=>{once();const o={};$$('#ozListe .join').forEach(j=>{const k=j.querySelector('[data-ozk]').value.trim(),v=j.querySelector('[data-ozv]').value.trim();if(k)o[k]=v});b.ozellik=o;kaydet()};
  $$('#ozListe input').forEach(i=>i.onchange=ozOku);
  $('#ozEkle').onclick=()=>{const d=document.createElement('div');d.className='join w-full';d.innerHTML=`<input class="input input-xs join-item w-1/2" data-ozk placeholder="${esc(t('attrKey'))}"><input class="input input-xs join-item w-1/2" data-ozv placeholder="${esc(t('attrVal'))}">`;$('#ozListe').appendChild(d);d.querySelectorAll('input').forEach(i=>i.onchange=ozOku);d.querySelector('input').focus()}}

/* ---- belge ve kod pencereleri ---- */
async function belgeEkle(){
  await pencere(t('newDocTitle'),`<label class="text-sm font-medium" for="yAd">${esc(t('docName'))}</label><input id="yAd" class="input w-full mt-1" placeholder="${esc(t('docNamePh'))}">
    <label class="text-sm font-medium block mt-4" for="yMetin">${esc(t('pasteText'))}</label><textarea id="yMetin" class="textarea w-full mt-1 metin-serif" rows="10"></textarea>
    <div class="flex flex-wrap items-center gap-3 mt-3 text-sm"><span class="text-base-content/70">${esc(t('orFile'))}</span><button class="btn btn-sm" id="yDosya">${esc(t('chooseFile'))}</button><span id="yDosyaAd" class="text-base-content/60 truncate"></span></div>
    <p id="yHata" class="text-error text-sm mt-2"></p>`,
    [{ad:t('cancel'),d:false},{ad:t('save'),c:'btn-primary',d:true,f:()=>{const ad=$('#yAd').value.trim()||('#'+(P().belgeler.length+1)),m=normalMetin($('#yMetin').value);
      if(!m){$('#yHata').textContent=t('textRequired');return false}islem(()=>{const b={id:uid(),ad,metin:m,ozellik:{},not:''};P().belgeler.push(b);S.belge=b.id;S.noktaBolumler=null});if(S.sekme!=='kod')sekmeAc('kod')}}],{ip:'belgeler',acilinca:()=>{
      $('#yDosya').onclick=async()=>{const f=await dosyaOku('.txt,.md,.docx,.pdf,text/plain,application/pdf');if(!f)return;$('#yDosyaAd').textContent=t('reading');$('#yHata').textContent='';
        try{const m=await dosyadanMetin(f);$('#yMetin').value=normalMetin(m);$('#yDosyaAd').textContent=f.name;if(!$('#yAd').value)$('#yAd').value=f.name.replace(/\.[^.]+$/,'')}
        catch(err){$('#yDosyaAd').textContent='';$('#yHata').textContent=/\.pdf$/i.test(f.name)?t('pdfFail'):t('fileReadFail',f.name)}}}})}
async function belgeDuzenle(id){const b=belge(id);if(!b)return;const n=P().bolumler.filter(x=>x.b===id).length;
  const r=await pencere(t('editDoc'),`<label class="text-sm font-medium" for="dAd">${esc(t('docName'))}</label><input id="dAd" class="input w-full mt-1" value="${esc(b.ad)}"><p class="text-xs text-base-content/60 mt-2">${esc(t('editDocWarn'))}</p>`,
    [{ad:t('delete'),c:'btn-ghost text-error mr-auto',d:'sil'},{ad:t('cancel'),d:false},{ad:t('save'),c:'btn-primary',d:true,f:()=>{const v=$('#dAd').value.trim();if(v&&v!==b.ad)islem(()=>{b.ad=v})}}]);
  if(r==='sil'&&await sor(t('deleteDocQ',b.ad,n),t('delete'),1))islem(()=>{P().belgeler=P().belgeler.filter(x=>x.id!==id);P().bolumler=P().bolumler.filter(x=>x.b!==id);if(S.belge===id)S.belge=null;gunlukEkle(t('lDelDoc',b.ad))})}
function renkSecici(sec){return `<div class="flex flex-wrap gap-2 mt-1">${RENKLER.map(r=>`<label class="cursor-pointer"><input type="radio" name="renk" value="${r}" class="sr-only peer" ${r===sec?'checked':''}><span class="block w-7 h-7 rounded-field border-2 border-transparent peer-checked:border-base-content peer-focus-visible:outline-2 peer-focus-visible:outline-primary" style="background:${r}" title="${r}"></span></label>`).join('')}</div>`}
async function kodDuzenle(id){const yeni=!id;const k=yeni?{ad:'',renk:RENKLER[P().kodlar.length%RENKLER.length],ust:S.odakKod||null,tanim:'',not:''}:kod(id);
  const yasak=yeni?[]:torunlar(id);const n=yeni?0:P().bolumler.filter(x=>x.k===id).length;
  const ustler=siraliKodlar().filter(c=>!yasak.includes(c.id));
  const r=await pencere(t(yeni?'newCodeTitle':'editCodeTitle'),`<div class="grid sm:grid-cols-2 gap-4"><div><label class="text-sm font-medium" for="kAd">${esc(t('codeName'))}</label><input id="kAd" class="input w-full mt-1" value="${esc(k.ad)}"></div>
    <div><label class="text-sm font-medium" for="kUst">${esc(t('parent'))}</label><select id="kUst" class="select w-full mt-1"><option value="">${esc(t('noParent'))}</option>${ustler.map(c=>`<option value="${c.id}" ${c.id===k.ust?'selected':''}>${esc(kodYolu(c.id))}</option>`).join('')}</select></div></div>
    <p class="text-sm font-medium mt-4">${esc(t('color'))}</p>${renkSecici(k.renk)}
    <div class="flex items-center gap-1 mt-4"><label class="text-sm font-medium" for="kTanim">${esc(t('definition'))}</label>${ip('kodTanim')}</div><textarea id="kTanim" class="textarea w-full mt-1" rows="2">${esc(k.tanim||'')}</textarea>
    <div class="flex items-center gap-1 mt-3"><label class="text-sm font-medium" for="kNot">${esc(t('codeMemo'))}</label>${ip('kodNot')}</div><textarea id="kNot" class="textarea w-full mt-1" rows="2">${esc(k.not||'')}</textarea>
    ${yeni?'':`<label class="text-sm font-medium block mt-4" for="kBirles">${esc(t('mergeInto'))}</label><select id="kBirles" class="select w-full mt-1"><option value="">${esc(t('mergeNone'))}</option>${siraliKodlar().filter(c=>!yasak.includes(c.id)).map(c=>`<option value="${c.id}">${esc(kodYolu(c.id))}</option>`).join('')}</select>`}
    <p id="kHata" class="text-error text-sm mt-2"></p>`,
    [...(yeni?[]:[{ad:t('delete'),c:'btn-ghost text-error mr-auto',d:'sil'}]),{ad:t('cancel'),d:false},{ad:t('save'),c:'btn-primary',d:true,f:()=>{
      const ad=$('#kAd').value.trim();if(!ad){$('#kHata').textContent=t('nameRequired');return false}
      if(P().kodlar.some(c=>c.id!==id&&kucukHarf(c.ad)===kucukHarf(ad)&&(c.ust||'')===($('#kUst').value||''))){$('#kHata').textContent=t('codeExists');return false}
      const bir=!yeni&&$('#kBirles').value;
      islem(()=>{const hedef=yeni?yeniKod(ad):k;hedef.ad=ad;hedef.renk=(document.querySelector('[name=renk]:checked')||{}).value||hedef.renk;hedef.ust=$('#kUst').value||null;hedef.tanim=$('#kTanim').value.trim();hedef.not=$('#kNot').value.trim();
        if(bir&&!torunlar(id).includes(bir)){const hk=kod(bir);P().bolumler.forEach(x=>{if(x.k===id)x.k=bir});P().kodlar.forEach(c=>{if(c.ust===id)c.ust=bir});P().kodlar=P().kodlar.filter(c=>c.id!==id);if(S.odakKod===id)S.odakKod=bir;gunlukEkle(t('lMergeCode',ad,hk.ad))}})}}]);
  if(r==='sil'&&await sor(t('deleteCodeQ',k.ad,n),t('delete'),1))islem(()=>{P().kodlar.forEach(c=>{if(c.ust===id)c.ust=k.ust||null});P().kodlar=P().kodlar.filter(c=>c.id!==id);P().bolumler=P().bolumler.filter(x=>x.k!==id);S.secKod.delete(id);if(S.odakKod===id)S.odakKod=null;gunlukEkle(t('lDelCode',k.ad,n))})}

/* ====================== ANA SAYFA ====================== */
function demoHtml(){const p=ornekProje(),b=p.belgeler[0],segs=p.bolumler.filter(x=>x.b===b.id&&x.kd===p.kodlayici);const kd=id=>p.kodlar.find(k=>k.id===id);
  let o=0;return b.metin.split('\n').map(satir=>{const bas=o;o+=satir.length+1;return {satir,bas}}).slice(1,5).map(({satir,bas})=>{const son=bas+satir.length;
    const L=segs.filter(x=>x.s<son&&x.e>bas).sort((a,b)=>a.s-b.s);let h='',i=bas;L.forEach(x=>{const s=Math.max(x.s,bas),e=Math.min(x.e,son);if(s>i)h+=esc(b.metin.slice(i,s));h+=`<span class="isaret" style="background:${rgba(kd(x.k).renk,.42)}">${esc(b.metin.slice(s,e))}</span>`;i=e});h+=esc(b.metin.slice(i,son));
    const k=L[0]&&kd(L[0].k);return `<div class="grid grid-cols-[6.5rem_6px_minmax(0,1fr)] sm:grid-cols-[8rem_6px_minmax(0,1fr)] gap-x-3 items-stretch"><span class="text-[0.7rem] leading-tight text-right text-base-content/60 pt-1.5 truncate font-sans">${k?esc(k.ad):''}</span><span class="rounded-full" style="background:${k?k.renk:'transparent'}"></span><p class="metin-serif text-[0.95rem] leading-7">${h}</p></div>`}).join('')}
function cizGiris(){const g=k=>tAlt('giris',k),p=P(),dolu=p.belgeler.length>0;
  const dugme=(arac,ad,cls)=>`<button class="btn ${cls}" data-garac="${arac}">${esc(ad)}</button>`;
  const devam=dolu?`<div class="bg-base-100 border border-base-300 rounded-box p-5 flex flex-wrap items-center gap-4">
      <div class="flex-1 min-w-48"><p class="text-sm text-base-content/60">${esc(g('devam'))}</p><p class="font-semibold text-lg">${esc(p.ad)}</p><p class="text-sm text-base-content/60">${esc(g('devamOzet').replace('{0}',sayi(p.belgeler.length)).replace('{1}',sayi(p.kodlar.length)).replace('{2}',sayi(p.bolumler.length)))}</p></div>
      <button class="btn btn-primary" data-garac="devam">${esc(g('devamBtn'))}</button></div>`:'';
  $('#s-giris').innerHTML=`<div class="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-16">
    <div class="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 items-center">
      <div>
        <div class="flex items-center gap-3 mb-6"><svg width="40" height="40" viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="5" width="20" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 12h10M8 17h7M8 22h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="21" y="3" width="6" height="18" rx="2" transform="rotate(25 24 12)" fill="#F5C518"/></svg><span class="text-lg font-semibold">Kodlama Masası</span><span class="badge badge-ghost badge-sm">v${SURUM}</span><button class="btn btn-xs btn-ghost ml-1" data-garac="atif">${esc(tAlt('atif','dugme'))}</button></div>
        <h1 class="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight max-w-xl">${esc(g('baslik'))}</h1>
        <p class="mt-5 text-base-content/75 leading-relaxed max-w-xl">${esc(g('alt'))}</p>
        <div class="flex flex-wrap gap-2 mt-8">${dugme('yeni',t('newProject'),'btn-primary')}${dugme('ornek',t('loadSample'),'btn-outline')}${dugme('ac',t('openProject'),'btn-ghost')}${dugme('qdpxAl',t('qdpxImport').replace(/\s*\(\.qdpx\)/,''),'btn-ghost')}</div>
        ${dolu?'':`<p class="text-sm text-base-content/60 mt-4 max-w-xl">${esc(g('ornekNot'))}</p>`}
      </div>
      <div class="bg-base-100 border border-base-300 rounded-box p-5 sm:p-7 shadow-sm" aria-hidden="true">
        <div class="flex items-center gap-2 mb-4 text-sm font-sans"><span class="font-semibold">${esc(ornekProje().belgeler[0].ad)}</span><span class="text-base-content/50">${esc(t('tabCode'))}</span></div>
        <div class="space-y-1.5">${demoHtml()}</div>
      </div>
    </div>
    ${devam}
    <div class="grid lg:grid-cols-[16rem_minmax(0,1fr)] gap-6"><h2 class="text-2xl font-semibold">${esc(g('neBaslik'))}</h2>
      <div class="space-y-4 text-base-content/80 leading-relaxed max-w-3xl"><p>${esc(g('ne1'))}</p><p>${esc(g('ne2'))}</p></div></div>
    <div><h2 class="text-2xl font-semibold mb-6">${esc(g('adimBaslik'))}</h2>
      <ol class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${(g('adimlar')||[]).map(([b,a],i)=>`<li class="bg-base-100 border border-base-300 rounded-box p-5"><span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-content font-semibold text-sm">${i+1}</span><h3 class="font-semibold mt-3">${esc(b)}</h3><p class="text-sm text-base-content/70 mt-1 leading-relaxed">${esc(a)}</p></li>`).join('')}</ol></div>
    <div><h2 class="text-2xl font-semibold mb-6">${esc(g('ozBaslik'))}</h2>
      <div class="grid md:grid-cols-3 gap-8">${(g('ozGruplar')||[]).map(([b,L])=>`<div><h3 class="font-semibold pb-2 mb-3 border-b border-base-300">${esc(b)}</h3><ul class="space-y-2 text-sm text-base-content/80">${L.map(x=>`<li class="flex gap-2"><svg class="mt-0.5 flex-none text-primary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg><span>${esc(x)}</span></li>`).join('')}</ul></div>`).join('')}</div></div>
    <div class="grid md:grid-cols-2 gap-10">
      <div><h2 class="text-2xl font-semibold mb-4">${esc(g('kimBaslik'))}</h2><ul class="space-y-3 text-base-content/80">${(g('kimler')||[]).map(x=>`<li class="border-l-2 border-primary pl-3">${esc(x)}</li>`).join('')}</ul></div>
      <div><h2 class="text-2xl font-semibold mb-4">${esc(g('guvenBaslik'))}</h2><div class="space-y-3 text-base-content/80 leading-relaxed">${(g('guven')||[]).map(x=>`<p>${esc(x)}</p>`).join('')}</div></div>
    </div>
    <div class="bg-base-100 border border-base-300 rounded-box p-6 flex flex-wrap items-center gap-4"><p class="font-semibold text-lg flex-1 min-w-48">${esc(g('basla'))}</p><div class="flex flex-wrap gap-2">${dugme('yeni',t('newProject'),'btn-primary')}${dugme('ornek',t('loadSample'),'btn-outline')}${dugme('ac',t('openProject'),'btn-ghost')}</div></div>
    ${girisAtifHtml()}
  </div>`;
  $$('[data-gkop]').forEach(b=>b.onclick=()=>kopyala(atifMetinleri()[b.dataset.gkop]));
  $$('[data-garac]').forEach(b=>b.onclick=async()=>{const a=b.dataset.garac;
    if(a==='devam'){sekmeAc('kod');return}
    if(a==='atif'){atifPencere();return}
    if(a==='yeni'){if(P().belgeler.length&&!(await sor(t('newProjectQ'),t('newProject'),1)))return;once();S.P=bosProje();S.belge=null;S.secKod=new Set();S.odakKod=null;kaydet();sekmeAc('kod');belgeEkle();return}
    if(a==='ornek'){if(P().belgeler.length&&!(await sor(t('sampleQ'),t('loadSample'))))return;once();S.P=ornekProje();S.belge=null;S.noktaBolumler=null;S.odakKod=null;S.secKod=new Set(P().kodlar.map(k=>k.id));kaydet();sekmeAc('kod');return}
    const once_=P();await ARAC[a]();if(P()!==once_)sekmeAc('kod')})}
