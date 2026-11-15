/* ====================== ALINTILAR ====================== */
function alintilar(){const ara=kucukHarf($('#fAra').value||''),fb=$('#fBelge').value,fo=$('#fOzellik').value,fk=$('#fKodlayici').value;
  const [ok,ov]=fo?JSON.parse(fo):[null,null];
  return P().bolumler.filter(x=>gorunurBolum(x)&&S.secKod.has(x.k)&&(!fb||x.b===fb)&&(!fk||x.kd===fk)).filter(x=>{const b=belge(x.b);if(!b)return false;if(ok&&(b.ozellik||{})[ok]!==ov)return false;
    return !ara||kucukHarf(b.metin.slice(x.s,x.e)).includes(ara)||kucukHarf(x.not||'').includes(ara)})
    .sort((a,b)=>P().belgeler.findIndex(d=>d.id===a.b)-P().belgeler.findIndex(d=>d.id===b.b)||a.s-b.s)}
function cizAlintilar(){
  const sb=$('#fBelge').value,so=$('#fOzellik').value,sk=$('#fKodlayici').value;
  $('#fBelge').innerHTML=`<option value="">${esc(t('allText'))}</option>`+P().belgeler.map(b=>`<option value="${b.id}" ${b.id===sb?'selected':''}>${esc(b.ad)}</option>`).join('');
  const oz=[];P().belgeler.forEach(b=>Object.entries(b.ozellik||{}).forEach(([k,v])=>{if(!oz.some(o=>o[0]===k&&o[1]===v))oz.push([k,v])}));oz.sort((a,b)=>a.join().localeCompare(b.join(),S.dil));
  $('#fOzellik').innerHTML=`<option value="">-</option>`+oz.map(o=>`<option value="${esc(JSON.stringify(o))}" ${JSON.stringify(o)===so?'selected':''}>${esc(o[0]+': '+o[1])}</option>`).join('');
  $('#fKodlayici').innerHTML=`<option value="">${esc(t('allCoders'))}</option>`+kodlayicilar().map(k=>`<option ${k===sk?'selected':''}>${esc(k)}</option>`).join('');$('#fKodlayici').disabled=!!P().kor;
  $('#fKodlar').innerHTML=siraliKodlar().map(k=>`<label class="flex items-center gap-2 text-sm cursor-pointer" style="padding-left:${kodDerinlik(k.id)}rem"><input type="checkbox" class="checkbox checkbox-xs" data-fk="${k.id}" ${S.secKod.has(k.id)?'checked':''}><span class="kod-nokta" style="background:${k.renk}"></span><span class="truncate">${esc(k.ad)}</span></label>`).join('');
  $$('[data-fk]').forEach(c=>c.onchange=()=>{const ids=$('#fAlt').checked?torunlar(c.dataset.fk):[c.dataset.fk];ids.forEach(i=>c.checked?S.secKod.add(i):S.secKod.delete(i));cizAlintilar()});
  const L=alintilar();$('#alintiSayi').textContent=t('quotesCount',sayi(L.length));
  $('#alintiListe').innerHTML=L.length?L.map(x=>{const b=belge(x.b),k=kod(x.k)||{};const oz=Object.entries(b.ozellik||{}).map(([a,v])=>`${a}: ${v}`).join(', ');
    return `<li class="bg-base-100 border border-base-300 rounded-box p-4"><div class="flex flex-wrap items-center gap-2 text-sm"><span class="kod-nokta" style="background:${k.renk}"></span><b>${esc(kodYolu(x.k))}</b><span class="text-base-content/60">${esc(b.ad)}${oz?' ('+esc(oz)+')':''}, ${esc(x.kd)}</span><button class="btn btn-ghost btn-xs ml-auto" data-goster="${x.id}">${esc(t('showInDoc'))}</button></div>
      <blockquote class="metin-serif mt-2 border-l-4 pl-3 whitespace-pre-wrap" style="border-color:${k.renk}">${esc(b.metin.slice(x.s,x.e))}</blockquote>${x.not?`<p class="text-sm text-base-content/70 mt-2">${esc(t('memo'))}: ${esc(x.not)}</p>`:''}</li>`}).join('')
    :`<li class="text-base-content/60">${esc(t('noQuotes'))}</li>`;
  $$('[data-goster]').forEach(b=>b.onclick=()=>belgedeGoster(b.dataset.goster))}
function belgedeGoster(id){const x=P().bolumler.find(y=>y.id===id);if(!x)return;S.belge=x.b;S.noktaBolumler=[id];if(P().gorunur&&P().gorunur!==x.kd)P().gorunur='';sekmeAc('kod');
  requestAnimationFrame(()=>{const sp=[...$$('#okuyucu [data-seg]')].find(e=>e.dataset.seg.split(',').includes(id));if(sp){sp.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});sp.classList.add('parla');setTimeout(()=>sp.classList.remove('parla'),2600)}})}
function alintiMetin(L){return L.map(x=>{const b=belge(x.b);return `[${kodYolu(x.k)}] ${b.ad} (${x.kd})\n"${b.metin.slice(x.s,x.e)}"${x.not?'\n'+t('memo')+': '+x.not:''}`}).join('\n\n')}
function bolumSatirlari(L){const ozA=[...new Set(P().belgeler.flatMap(b=>Object.keys(b.ozellik||{})))];
  return [[t('csvDoc'),...ozA,t('csvCode'),t('csvPath'),t('csvCoder'),t('csvStart'),t('csvEnd'),t('csvText'),t('csvMemo')],...L.map(x=>{const b=belge(x.b),k=kod(x.k)||{};return [b.ad,...ozA.map(a=>(b.ozellik||{})[a]||''),k.ad,kodYolu(x.k),x.kd,x.s,x.e,b.metin.slice(x.s,x.e),x.not||'']})]}

/* ====================== ANALİZ ====================== */
function cizAnaliz(){
  const B=P().bolumler.filter(gorunurBolum),bel=P().belgeler,K=siraliKodlar();
  const kapsam=bel.reduce((a,b)=>{const m=new Uint8Array(b.metin.length);B.filter(x=>x.b===b.id).forEach(x=>m.fill(1,x.s,x.e));return [a[0]+m.reduce((p,c)=>p+c,0),a[1]+b.metin.length]},[0,0]);
  $('#ozetIstat').innerHTML=[[t('statDocs'),bel.length],[t('statCodes'),K.length],[t('statSegs'),B.length],[t('statCoders'),new Set(B.map(x=>x.kd)).size],[t('statCover'),'%'+sayi(kapsam[1]?kapsam[0]/kapsam[1]*100:0,1)]].map(([a,v])=>`<div class="stat"><div class="stat-title">${esc(a)}</div><div class="stat-value text-2xl">${typeof v==='number'?sayi(v):v}</div></div>`).join('');
  kelimeCiz(B);
  if(!K.length){$('#frekans').innerHTML=`<tbody><tr><td>${esc(t('noData'))}</td></tr></tbody>`;$('#matris').innerHTML='';$('#esgorunum').innerHTML='';$('#harita').innerHTML=`<p class="p-4 text-sm text-base-content/60">${esc(t('noData'))}</p>`;return}
  const say=K.map(k=>{const L=B.filter(x=>x.k===k.id);return {k,n:L.length,d:new Set(L.map(x=>x.b)).size}});const mx=Math.max(1,...say.map(s=>s.n));
  const kodHucre=k=>`<span class="inline-flex items-center gap-2" style="padding-left:${kodDerinlik(k.id)}rem"><span class="kod-nokta" style="background:${k.renk}"></span>${esc(k.ad)}</span>`;
  $('#frekans').innerHTML=`<thead><tr><th>${esc(t('colCode'))}</th><th class="text-right">${esc(t('colSegs'))}</th><th class="text-right">${esc(t('colDocs'))}</th><th class="text-right">${esc(t('colDocPct'))}</th><th class="w-1/4"></th></tr></thead><tbody>`+
    say.map(s=>`<tr><td>${kodHucre(s.k)}</td><td class="text-right tabular-nums">${s.n}</td><td class="text-right tabular-nums">${s.d}</td><td class="text-right tabular-nums">${sayi(bel.length?s.d/bel.length*100:0)}</td><td><div class="cubuk" style="width:${s.n/mx*100}%"></div></td></tr>`).join('')+
    `</tbody><tfoot><tr><th>${esc(t('total'))}</th><th class="text-right">${B.length}</th><th></th><th></th><th></th></tr></tfoot>`;
  const hucre=(n,m)=>{if(!n)return `<td class="text-center text-base-content/30">0</td>`;const y=Math.round(12+n/m*68);return `<td class="text-center isi tabular-nums" style="--y:${y}%" data-k="${y>55?1:0}">${n}</td>`};
  const M=K.map(k=>bel.map(b=>B.filter(x=>x.k===k.id&&x.b===b.id).length)),mm=Math.max(1,...M.flat());
  $('#matris').innerHTML=`<thead><tr><th>${esc(t('colCode'))}</th>${bel.map(b=>`<th class="text-center whitespace-nowrap">${esc(kisalt(b.ad,18))}</th>`).join('')}<th class="text-center">${esc(t('total'))}</th></tr></thead><tbody>`+
    K.map((k,i)=>`<tr><td class="whitespace-nowrap">${kodHucre(k)}</td>${M[i].map(n=>hucre(n,mm)).join('')}<td class="text-center font-semibold">${M[i].reduce((a,b)=>a+b,0)}</td></tr>`).join('')+'</tbody>';
  const E=esGorunum(B,K),me=Math.max(1,...E.flat().filter(v=>v!=null));
  $('#esgorunum').innerHTML=`<thead><tr><th></th>${K.map(k=>`<th class="text-center"><span class="kod-nokta" style="background:${k.renk}" title="${esc(k.ad)}"></span><span class="block text-xs font-normal max-w-20 truncate">${esc(k.ad)}</span></th>`).join('')}</tr></thead><tbody>`+
    K.map((k,i)=>`<tr><td class="whitespace-nowrap"><span class="inline-flex items-center gap-2"><span class="kod-nokta" style="background:${k.renk}"></span>${esc(k.ad)}</span></td>${E[i].map(v=>v==null?'<td class="bg-base-200"></td>':hucre(v,me)).join('')}</tr>`).join('')+'</tbody>';
  $('#harita').innerHTML=haritaSvg(K,say,E)}
function esGorunum(B,K){const E=K.map(a=>K.map(b=>a.id===b.id?null:0));const ix=new Map(K.map((k,i)=>[k.id,i]));
  P().belgeler.forEach(d=>{const L=B.filter(x=>x.b===d.id);for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){const x=L[i],y=L[j];if(x.k!==y.k&&x.s<y.e&&y.s<x.e){const a=ix.get(x.k),b=ix.get(y.k);if(a!=null&&b!=null){E[a][b]++;E[b][a]++}}}});return E}
function haritaSvg(K,say,E,disa){const cs=getComputedStyle(document.documentElement);const yazi=disa?'#1e2134':cs.getPropertyValue('--color-base-content').trim()||'#1e2134';const cizgi=disa?'#9aa0b4':'color-mix(in oklab,'+yazi+' 35%,transparent)';
  const satir=34,ust=24,derin=Math.max(0,...K.map(k=>kodDerinlik(k.id))),xAd=i=>24+i*150,maxN=Math.max(1,...say.map(s=>s.n));
  const r=n=>5+Math.sqrt(n/maxN)*11,y=i=>ust+i*satir;const etiketSon=xAd(derin)+220,yayX=etiketSon+40;
  let kenar='',dugum='',yay='';
  K.forEach((k,i)=>{const d=kodDerinlik(k.id);if(k.ust){const pi=K.findIndex(x=>x.id===k.ust);if(pi>=0){kenar+=`<path d="M${xAd(d-1)} ${y(pi)+r(say[pi].n)} V${y(i)} H${xAd(d)-r(say[i].n)}" fill="none" stroke="${cizgi}" stroke-width="1.5"/>`}}
    dugum+=`<circle cx="${xAd(d)}" cy="${y(i)}" r="${r(say[i].n).toFixed(1)}" fill="${k.renk}" stroke="${yazi}" stroke-opacity=".25"/><text x="${xAd(d)+r(say[i].n)+8}" y="${y(i)+4}" font-size="13" fill="${yazi}" ${k.ust?'':'font-weight="600"'}>${esc(kisalt(k.ad,26))} <tspan fill-opacity=".55" font-size="11">${say[i].n}</tspan></text>`});
  const mE=Math.max(1,...E.flat().filter(v=>v));
  for(let i=0;i<K.length;i++)for(let j=i+1;j<K.length;j++){const v=E[i][j];if(!v)continue;const y1=y(i),y2=y(j),bo=(y2-y1)/2;yay+=`<path d="M${yayX} ${y1} A ${bo} ${bo} 0 0 1 ${yayX} ${y2}" fill="none" stroke="${K[i].renk}" stroke-opacity=".75" stroke-width="${(1+v/mE*4).toFixed(1)}"><title>${esc(K[i].ad)} + ${esc(K[j].ad)}: ${v}</title></path>`}
  const enYay=Math.max(0,...K.map((_,i)=>K.map((__,j)=>j>i&&E[i][j]?(y(j)-y(i))/2:0)).flat());
  const W_=yayX+enYay+30,H=ust+K.length*satir;
  return `<svg class="harita-svg" xmlns="http://www.w3.org/2000/svg" width="${W_}" height="${H}" viewBox="0 0 ${W_} ${H}" font-family="system-ui,Segoe UI,Arial,sans-serif" role="img" aria-label="${esc(t('codeMap'))}">${disa?`<rect width="100%" height="100%" fill="#fff"/>`:''}${kenar}${yay}${dugum}</svg>`}
function kelimeCiz(B){const sel=$('#kelimeKapsam'),v=sel.value||'tum';
  sel.innerHTML=`<option value="tum">${esc(t('allText'))}</option><option value="kodlu">${esc(t('codedText'))}</option>`+(S.odakKod?`<option value="odak">${esc(t('selectedCode',(kod(S.odakKod)||{}).ad))}</option>`:'');sel.value=[...sel.options].some(o=>o.value===v)?v:'tum';
  let metin='';if(sel.value==='tum')metin=P().belgeler.map(b=>b.metin).join('\n');
  else{const L=B.filter(x=>sel.value==='kodlu'||torunlar(S.odakKod).includes(x.k));metin=L.map(x=>{const b=belge(x.b);return b?b.metin.slice(x.s,x.e):''}).join('\n')}
  if($('#kelimeGor').checked)metin=metin.split('\n').filter(l=>!/^\s*(görüşmeci|araştırmacı|soru|interviewer|researcher|question)\s*:/i.test(l)).join('\n');
  metin=metin.replace(/^\s*[\p{L}]{0,3}\d{0,3}\s*:/gmu,'');
  const dur=new Set([...Object.values(DILLER).map(d=>d.stop||'')].join(' ').split(/\s+/));
  const sayac={};(kucukHarf(metin).match(/[\p{L}\p{N}'’-]+/gu)||[]).forEach(w=>{w=w.replace(/^['’-]+|['’-]+$/g,'').replace(/['’].*$/,'');if(w.length<3||dur.has(w)||/^\d+$/.test(w))return;sayac[w]=(sayac[w]||0)+1});
  const L=Object.entries(sayac).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],S.dil)).slice(0,30);const mx=L.length?L[0][1]:1;
  $('#kelimeler').innerHTML=L.length?`<ol class="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">${L.map(([w,n])=>`<li class="grid grid-cols-[1fr_auto] gap-x-2 items-center"><span class="truncate">${esc(w)}</span><span class="tabular-nums text-base-content/60">${n}</span><div class="col-span-2 cubuk opacity-40" style="width:${n/mx*100}%;height:2px"></div></li>`).join('')}</ol>`:`<p class="text-base-content/60 text-sm">${esc(t('noData'))}</p>`}

/* ====================== UYUM ====================== */
function birimler(m,tur){const o=[];const re=tur==='c'?/[^.!?…\n]+[.!?…]*/g:/[^\n]+/g;let r;while((r=re.exec(m))){const s=r.index,e=s+r[0].length;if(r[0].trim())o.push([s,e])}return o}
const kesisir=(doc,s,e)=>x=>x.s<e&&s<x.e&&doc.metin.slice(Math.max(s,x.s),Math.min(e,x.e)).trim().length>0;
function uyumHesap(A,Bk,tur){const K=siraliKodlar(),sonuc=K.map(k=>({k,a:0,b:0,c:0,d:0,ay:[]}));let birimSay=0,belgeSay=0;
  P().belgeler.forEach(doc=>{const L=P().bolumler.filter(x=>x.b===doc.id);const LA=L.filter(x=>x.kd===A),LB=L.filter(x=>x.kd===Bk);
    if(!LA.length||!LB.length)return; /* yalnızca ikisinin de kodladığı belgeler */
    belgeSay++;const U=birimler(doc.metin,tur);birimSay+=U.length;
    U.forEach(([s,e])=>{const ks=kesisir(doc,s,e);const kA=new Set(LA.filter(ks).map(x=>x.k)),kB=new Set(LB.filter(ks).map(x=>x.k));
      sonuc.forEach(r=>{const a=kA.has(r.k.id),b=kB.has(r.k.id);if(a&&b)r.a++;else if(a){r.b++;r.ay.push({doc,s,e,kim:A})}else if(b){r.c++;r.ay.push({doc,s,e,kim:Bk})}else r.d++})})});
  return {sonuc:sonuc.filter(r=>r.a+r.b+r.c>0),birimSay,belgeSay}}
function kappa(a,b,c,d){const n=a+b+c+d;if(!n)return null;const po=(a+d)/n,pe=((a+b)*(a+c)+(c+d)*(b+d))/(n*n);return pe===1?(po===1?1:null):(po-pe)/(1-pe)}
/* Krippendorff alfa (nominal, eksik veri destekli): her belgeyi kodlayan kodlayıcılar o belgenin birimlerinde değer verir. */
function alfaHesap(tur){const kd=kodlayicilar();const K=siraliKodlar();const birimV=K.map(()=>[]);
  P().belgeler.forEach(doc=>{const L=P().bolumler.filter(x=>x.b===doc.id);const katilan=kd.filter(c=>L.some(x=>x.kd===c));if(katilan.length<2)return;
    birimler(doc.metin,tur).forEach(([s,e])=>{const ks=kesisir(doc,s,e);const var_=new Map(katilan.map(c=>[c,new Set(L.filter(x=>x.kd===c&&ks(x)).map(x=>x.k))]));
      K.forEach((k,i)=>birimV[i].push(katilan.map(c=>var_.get(c).has(k.id)?1:0)))})});
  const alfa=birimLer=>{let o00=0,o01=0,o11=0;birimLer.forEach(v=>{const m=v.length;if(m<2)return;const n1=v.reduce((a,b)=>a+b,0),n0=m-n1;o00+=n0*(n0-1)/(m-1);o11+=n1*(n1-1)/(m-1);o01+=n0*n1/(m-1)});
    const n0=o00+o01,n1=o11+o01,n=n0+n1;if(n<2)return null;const De=2*n0*n1;if(!De)return o01===0?1:null;return 1-(n-1)*(2*o01)/De};
  const satir=K.map((k,i)=>({k,a:alfa(birimV[i]),kul:birimV[i].some(v=>v.some(x=>x))})).filter(r=>r.kul);
  return {satir,genel:alfa(birimV.flat()),kodlayiciSay:kd.length}}
function cizUyum(){const kd=kodlayicilar(),sa=$('#uA').value,sb=$('#uB').value;
  $('#uA').innerHTML=kd.map(k=>`<option ${k===sa?'selected':''}>${esc(k)}</option>`).join('');$('#uB').innerHTML=kd.map((k,i)=>`<option ${k===sb||(!sb&&i===1)?'selected':''}>${esc(k)}</option>`).join('');
  const A=$('#uA').value,B=$('#uB').value,o=$('#uSonuc');$('#uAlfa').innerHTML='';
  if(P().kor){o.innerHTML=`<div role="alert" class="alert alert-warning">${esc(t('blindAgree'))}</div>`;return}
  if(kd.length<2||!A||!B||A===B){o.innerHTML=`<div role="alert" class="alert">${esc(t('needTwoCoders'))}</div>`;return}
  const tur=$('#uBirim').value;const {sonuc,birimSay,belgeSay}=uyumHesap(A,B,tur);
  const top=sonuc.reduce((s,r)=>({a:s.a+r.a,b:s.b+r.b,c:s.c+r.c,d:s.d+r.d}),{a:0,b:0,c:0,d:0});
  const yuzde=v=>v==null?'-':'%'+sayi(v*100,1),kp=v=>v==null?'-':sayi(v,2);
  const rozet=v=>v==null?'':v>=.81?'badge-success':v>=.61?'badge-info':v>=.41?'badge-warning':'badge-error';
  const th=(k,ipk)=>`<th class="text-right whitespace-nowrap">${esc(t(k))}${ip(ipk||k)}</th>`;
  const satir=(ad,r,kal)=>{const n=r.a+r.b+r.c+r.d,mh=r.a+r.b+r.c?r.a/(r.a+r.b+r.c):null,k=kappa(r.a,r.b,r.c,r.d);
    return `<tr class="${kal?'font-semibold':''}"><td>${ad}</td><td class="text-right tabular-nums">${r.a}</td><td class="text-right tabular-nums">${r.b}</td><td class="text-right tabular-nums">${r.c}</td><td class="text-right tabular-nums">${r.d}</td><td class="text-right tabular-nums">${yuzde(n?(r.a+r.d)/n:null)}</td><td class="text-right tabular-nums">${yuzde(mh)}</td><td class="text-right"><span class="badge badge-sm ${rozet(k)}">${kp(k)}</span></td></tr>`};
  o.innerHTML=`<p class="text-sm text-base-content/70 mb-2">${esc(t('units',belgeSay,birimSay))}</p>
    <div class="overflow-x-auto bg-base-100 border border-base-300 rounded-box"><table class="table table-sm"><thead><tr><th>${esc(t('colCode'))}</th>${th('colBoth')}${th('colOnlyA')}${th('colOnlyB')}${th('colNeither')}${th('colAgree')}${th('colMH')}${th('colKappa')}</tr></thead>
    <tbody>${sonuc.map(r=>satir(`<span class="inline-flex items-center gap-2"><span class="kod-nokta" style="background:${r.k.renk}"></span>${esc(kodYolu(r.k.id))}</span>`,r)).join('')}</tbody><tfoot>${satir(esc(t('overall')),top,1)}</tfoot></table></div>
    <p class="text-xs text-base-content/60 mt-3 max-w-3xl">${esc(t('kappaBand'))}</p><p class="text-xs text-base-content/60 mt-1 max-w-3xl">${esc(t('mhNote'))}</p>
    <div class="mt-8"><div class="flex flex-wrap items-center gap-2"><h3 class="font-semibold">${esc(t('disagreeTitle'))}</h3>${ip('ayrisma')}<select id="uAyKod" class="select select-sm w-auto">${sonuc.filter(r=>r.ay.length).map(r=>`<option value="${r.k.id}">${esc(kodYolu(r.k.id))} (${r.ay.length})</option>`).join('')}</select></div>
    <ul id="uAyListe" class="space-y-2 mt-3"></ul></div>`;
  const ayCiz=()=>{const r=sonuc.find(x=>x.k.id===($('#uAyKod')||{}).value);$('#uAyListe').innerHTML=r?r.ay.map(u=>`<li class="bg-base-100 border border-base-300 rounded-box p-3"><p class="text-xs text-base-content/60">${esc(u.doc.ad)}: ${esc(t(u.kim===A?'onlyA':'onlyB',u.kim))}</p><p class="metin-serif mt-1">${esc(kisalt(u.doc.metin.slice(u.s,u.e).trim(),400))}</p></li>`).join(''):''};
  o.insertAdjacentHTML('beforeend',uyumAciklamaHtml(uyumOzet()));
  if($('#uAyKod'))$('#uAyKod').onchange=ayCiz;ayCiz();
  const al=alfaHesap(tur);
  $('#uAlfa').innerHTML=`<div class="mt-4"><div class="flex items-center gap-1"><h3 class="font-semibold">${esc(t('alphaTitle'))}</h3>${ip('alfa')}</div><p class="text-sm text-base-content/60 mb-2">${esc(t('alphaCoders',al.kodlayiciSay))}</p>
    <div class="overflow-x-auto bg-base-100 border border-base-300 rounded-box max-w-xl"><table class="table table-sm"><thead><tr><th>${esc(t('colCode'))}</th><th class="text-right">${esc(t('alphaCol'))}</th></tr></thead><tbody>${al.satir.map(r=>`<tr><td><span class="inline-flex items-center gap-2"><span class="kod-nokta" style="background:${r.k.renk}"></span>${esc(kodYolu(r.k.id))}</span></td><td class="text-right"><span class="badge badge-sm ${r.a==null?'':r.a>=.8?'badge-success':r.a>=.667?'badge-warning':'badge-error'}">${kp(r.a)}</span></td></tr>`).join('')}</tbody>
    <tfoot><tr class="font-semibold"><td>${esc(t('overall'))}</td><td class="text-right">${kp(al.genel)}</td></tr></tfoot></table></div><p class="text-xs text-base-content/60 mt-2">${esc(t('alphaNote'))}</p></div>`}
async function kodlayiciBirlestir(){const f=await dosyaOku('.json,application/json');if(!f)return;let g;try{g=projeDuzelt(JSON.parse(await f.text()))}catch(e){g=null}
  if(!g||g.tur!=='kodlama-masasi'){tost(t('badProject'),'error');return}
  once();const anah=m=>normalMetin(m);const eslesme={};let atla=0;
  g.belgeler.forEach(gb=>{const b=P().belgeler.find(x=>anah(x.metin)===anah(gb.metin))||P().belgeler.find(x=>x.ad===gb.ad&&x.metin.length===gb.metin.length);if(b)eslesme[gb.id]=b.id;else atla++});
  const kodEs={};const gk=id=>g.kodlar.find(k=>k.id===id);
  const kodBul=id=>{if(kodEs[id])return kodEs[id];const k=gk(id);if(!k)return null;const ust=k.ust?kodBul(k.ust):null;
    let m=P().kodlar.find(c=>kucukHarf(c.ad)===kucukHarf(k.ad)&&(c.ust||null)===ust)||P().kodlar.find(c=>kucukHarf(c.ad)===kucukHarf(k.ad));
    if(!m){m=yeniKod(k.ad,ust);m.renk=k.renk||m.renk;m.tanim=k.tanim||''}return kodEs[id]=m.id};
  const benimkiler=new Set(kodlayicilar());const adDegis={};let n=0;const gelen=new Set();
  g.bolumler.forEach(x=>{if(!eslesme[x.b])return;let kd=x.kd;if(kd===P().kodlayici&&!adDegis[kd]){let i=2;while(benimkiler.has(kd+' ('+i+')'))i++;adDegis[kd]=kd+' ('+i+')';tost(t('mergeSame',kd,adDegis[kd]),'warning')}kd=adDegis[kd]||kd;
    const kid=kodBul(x.k);if(!kid)return;const yeni={...x,id:uid(),b:eslesme[x.b],k:kid,kd};
    if(!P().bolumler.some(y=>y.b===yeni.b&&y.k===yeni.k&&y.s===yeni.s&&y.e===yeni.e&&y.kd===yeni.kd)){P().bolumler.push(yeni);n++;gelen.add(kd)}});
  gunlukEkle(t('lMergeCoder',n));kaydet();tost(t('mergeDone',n,gelen.size,atla));ciz()}
