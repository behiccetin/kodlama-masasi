/* ====================== ATIF VE YÖNTEM METNİ ====================== */
const DEPO='https://github.com/behiccetin/kodlama-masasi';
const DOI='10.5281/zenodo.24248757';
const DOI_TUM='10.5281/zenodo.24248756';
const KAYNAK_URL=DOI?'https://doi.org/'+DOI:DEPO;
const ga=(grup,k)=>tAlt(grup,k);
function atifMetinleri(){const tr=S.dil==='tr';const y=ga('atif','yazilim'),sv=ga('atif','surum');
  const yay=DOI?'Zenodo. ':'';
  return {apa:`Çetin, B. (2026). Kodlama Masası (${sv} ${SURUM}) [${y}]. ${yay}${KAYNAK_URL}`,
    isnad:`Çetin, Behiç. Kodlama Masası. ${sv} ${SURUM}. ${y}. ${DOI?'Zenodo, ':''}2026. ${KAYNAK_URL}`,
    bibtex:`@software{cetin2026kodlama,\n  author = {Çetin, Behiç},\n  title = {Kodlama Masası},\n  year = {2026},\n  version = {${SURUM}},\n  publisher = {Zenodo},\n  url = {${KAYNAK_URL}}${DOI?`,\n  doi = {${DOI}}`:''}\n}`}}
const YONTEM_KAYNAK=['Cohen, J. (1960). A coefficient of agreement for nominal scales. Educational and Psychological Measurement, 20(1), 37-46. https://doi.org/10.1177/001316446002000104',
  'Krippendorff, K. (2004). Content analysis: An introduction to its methodology (2nd ed.). Sage.',
  'Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. Biometrics, 33(1), 159-174. https://doi.org/10.2307/2529310',
  'Miles, M. B., & Huberman, A. M. (1994). Qualitative data analysis: An expanded sourcebook (2nd ed.). Sage.'];
function kappaYorum(k){const L=ga('aciklama','kappaSonuc')||[];return k==null?'-':L[k<=.2?0:k<=.4?1:k<=.6?2:k<=.8?3:4]||''}
function mhYorum(m){const L=ga('aciklama','mhSonuc')||[];return m==null?'-':L[m<.7?0:m<.8?1:m<.9?2:3]||''}
function alfaYorum(a){const L=ga('aciklama','alfaSonuc')||[];return a==null?'-':L[a<.667?0:a<.8?1:2]||''}
function uyumOzet(){const kd=kodlayicilar();if(kd.length<2)return null;
  const A=kd.includes($('#uA').value)?$('#uA').value:kd[0],B=kd.includes($('#uB').value)&&$('#uB').value!==A?$('#uB').value:kd.find(x=>x!==A);
  const tur=$('#uBirim').value||'p';const u=uyumHesap(A,B,tur);if(!u.belgeSay)return null;
  const r=u.sonuc.reduce((s,x)=>({a:s.a+x.a,b:s.b+x.b,c:s.c+x.c,d:s.d+x.d}),{a:0,b:0,c:0,d:0});const n=r.a+r.b+r.c+r.d;
  const po=n?(r.a+r.d)/n:null,pe=n?((r.a+r.b)*(r.a+r.c)+(r.c+r.d)*(r.b+r.d))/(n*n):null;
  return {A,B,tur,...u,r,n,po,pe,mh:r.a+r.b+r.c?r.a/(r.a+r.b+r.c):null,k:kappa(r.a,r.b,r.c,r.d),alfa:alfaHesap(tur).genel}}
function yontemMetni(){const p=P(),K=p.kodlar,tema=K.filter(k=>!k.ust&&K.some(c=>c.ust===k.id)).length;const o=[];
  o.push(ga('yontem','p1').replace('{0}',sayi(p.belgeler.length)).replace('{1}',sayi(K.length)).replace('{2}',sayi(p.bolumler.length)).replace('{3}',tema?ga('yontem','temalar').replace('{0}',sayi(tema)):''));
  const u=uyumOzet();
  if(u){o.push(ga('yontem','p2').replace('{0}',u.A).replace('{1}',u.B).replace('{2}',sayi(u.belgeSay)).replace('{3}',ga('yontem',u.tur==='c'?'cumle':'paragraf')).replace('{4}',sayi(u.birimSay)).replace('{5}',u.mh==null?'-':sayi(u.mh*100,1)).replace('{6}',u.k==null?'-':sayi(u.k,2)).replace('{7}',kappaYorum(u.k)));
    if(u.alfa!=null)o.push(ga('yontem','p3').replace('{0}',sayi(u.alfa,2)));o.push(ga('yontem','p4'))}
  return o}
function kaynakcaListesi(){return [atifMetinleri().apa,...(uyumOzet()?YONTEM_KAYNAK:[])].sort((a,b)=>a.localeCompare(b,'tr'))}
/* uyum sekmesindeki açıklama: kullanıcının kendi sayılarıyla */
function uyumAciklamaHtml(u){if(!u)return '';const g=k=>ga('aciklama',k);const y=v=>'%'+sayi(v*100,1);
  const kutu=(ad,ne,hesap,sonuc,ek)=>`<div class="bg-base-100 border border-base-300 rounded-box p-4"><h4 class="font-semibold">${esc(ad)}</h4><p class="text-sm text-base-content/75 mt-1">${esc(ne)}</p>
    ${hesap?`<p class="font-mono text-sm mt-3 bg-base-200 rounded-field px-3 py-2 overflow-x-auto">${esc(hesap)}</p>`:''}<p class="text-sm mt-3 font-medium">${esc(g('sonuc').replace('{0}',sonuc))}</p>${ek?`<p class="text-xs text-base-content/60 mt-2">${esc(ek)}</p>`:''}</div>`;
  const r=u.r;
  return `<details class="collapse collapse-arrow bg-base-200 border border-base-300 rounded-box mt-6" open><summary class="collapse-title font-semibold">${esc(g('baslik'))}</summary><div class="collapse-content space-y-4">
    <p class="text-sm leading-relaxed">${esc(g('giris').replace('{0}',sayi(u.n)).replace('{1}',sayi(r.a)).replace('{2}',sayi(r.b)).replace('{3}',sayi(r.c)).replace('{4}',sayi(r.d)).replace('{5}',u.A).replace('{6}',u.B))}</p>
    <div class="grid md:grid-cols-2 gap-4">
    ${kutu(g('basitAd'),g('basitNe'),g('basitHesap').replace('{0}',sayi(r.a)).replace('{1}',sayi(r.d)).replace('{2}',sayi(u.n)).replace('{3}',u.po==null?'-':y(u.po)),u.po==null?'-':y(u.po),g('basitUyari'))}
    ${kutu(g('mhAd'),g('mhNe'),g('mhHesap').replaceAll('{0}',sayi(r.a)).replace('{1}',sayi(r.b)).replace('{2}',sayi(r.c)).replace('{3}',u.mh==null?'-':y(u.mh)),u.mh==null?'-':`${y(u.mh)}, ${mhYorum(u.mh)}`,g('mhEsik'))}
    ${kutu(g('kappaAd'),g('kappaNe'),u.k==null?'':g('kappaHesap').replaceAll('{0}',sayi(u.po,3)).replaceAll('{1}',sayi(u.pe,3)).replace('{2}',sayi(u.k,2)),u.k==null?'-':`${sayi(u.k,2)}, ${kappaYorum(u.k)}`,t('kappaBand'))}
    ${kutu(g('alfaAd'),g('alfaNe'),u.alfa==null?'':g('alfaHesap').replace('{0}',sayi(u.alfa,2)),u.alfa==null?'-':`${sayi(u.alfa,2)}, ${alfaYorum(u.alfa)}`,t('alphaNote'))}
    </div><p class="text-sm bg-base-100 border-l-4 border-primary rounded-field p-3">${esc(g('hangisi'))}</p></div></details>`}
async function kopyala(m){try{await navigator.clipboard.writeText(m);tost(t('copied'))}catch(e){const a=document.createElement('textarea');a.value=m;document.body.appendChild(a);a.select();try{document.execCommand('copy');tost(t('copied'))}catch(_){}a.remove()}}
function atifPencere(){const a=atifMetinleri();const blok=(k,v)=>`<div class="mt-4"><div class="flex items-center justify-between"><h4 class="text-sm font-semibold">${esc(ga('atif',k))}</h4><button class="btn btn-xs" data-kop="${k}">${esc(ga('atif','kopyala'))}</button></div><pre class="mt-1 bg-base-200 rounded-field p-3 text-sm whitespace-pre-wrap break-words font-mono">${esc(v)}</pre></div>`;
  pencere(ga('atif','baslik'),`<p class="text-sm text-base-content/75">${esc(ga('atif','ne'))}</p>${doiSatiri()}${blok('apa',a.apa)}${blok('isnad',a.isnad)}${blok('bibtex',a.bibtex)}`,null,{acilinca:()=>$$('[data-kop]').forEach(b=>b.onclick=()=>kopyala(a[b.dataset.kop]))})}
function cizYontemKart(){const k=$('#yontemKart');if(!k)return;const L=yontemMetni();
  k.innerHTML=`<div class="space-y-3 text-sm leading-relaxed">${L.map(x=>`<p>${esc(x)}</p>`).join('')}</div><h4 class="font-semibold text-sm mt-5">${esc(ga('yontem','kaynakca'))}</h4><ul class="text-sm space-y-1 mt-1 text-base-content/80">${kaynakcaListesi().map(x=>`<li class="pl-6 -indent-6">${esc(x)}</li>`).join('')}</ul>`}

/* DOI satırı: sürüm DOI'si ve tüm sürümler DOI'si */
function doiSatiri(){if(!DOI)return '';const l=(d,ad)=>`<a class="link link-primary font-mono" href="https://doi.org/${d}" target="_blank" rel="noopener noreferrer">${esc(d)}</a><span class="text-base-content/60"> ${esc(ad)}</span>`;
  return `<div class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm"><span><span class="badge badge-primary badge-sm mr-2">DOI</span>${l(DOI,ga('atif','buSurum').replace('{0}',SURUM))}</span><span>${l(DOI_TUM,ga('atif','tumSurum'))}</span></div>`}
/* ana sayfanın en altındaki atıf bölümü */
function girisAtifHtml(){const a=atifMetinleri();
  return `<section class="border-t border-base-300 pt-10 grid lg:grid-cols-[16rem_minmax(0,1fr)] gap-6"><h2 class="text-2xl font-semibold">${esc(ga('atif','baslik'))}</h2>
    <div class="max-w-3xl"><p class="text-base-content/80 leading-relaxed">${esc(ga('atif','ne'))}</p>${doiSatiri()}
    <div class="mt-4 bg-base-100 border border-base-300 rounded-box p-4"><div class="flex items-center justify-between gap-3"><h3 class="text-sm font-semibold">${esc(ga('atif','apa'))}</h3><button class="btn btn-xs" data-gkop="apa">${esc(ga('atif','kopyala'))}</button></div>
    <p class="mt-2 text-sm leading-relaxed pl-6 -indent-6 break-words">${esc(a.apa)}</p></div>
    <button class="btn btn-sm btn-ghost mt-3" data-garac="atif">${esc(ga('atif','digerBicim'))}</button></div></section>`}
