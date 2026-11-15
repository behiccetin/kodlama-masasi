/* ====================== WORD RAPORU ====================== */
const X=s=>String(s??'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const wR=(s,o={})=>String(s).split('\n').map((p,i)=>`<w:r><w:rPr>${o.b?'<w:b/>':''}${o.i?'<w:i/>':''}${o.c?`<w:color w:val="${o.c}"/>`:''}${o.sz?`<w:sz w:val="${o.sz}"/><w:szCs w:val="${o.sz}"/>`:''}</w:rPr>${i?'<w:br/>':''}<w:t xml:space="preserve">${X(p)}</w:t></w:r>`).join('');
const wP=(ic,o={})=>`<w:p><w:pPr>${o.st?`<w:pStyle w:val="${o.st}"/>`:''}${o.keep?'<w:keepNext/>':''}${o.ind?`<w:ind w:left="${o.ind}" w:right="${o.ind}"/>`:''}<w:spacing w:before="${o.bf??0}" w:after="${o.af??100}"/>${o.jc?`<w:jc w:val="${o.jc}"/>`:''}</w:pPr>${typeof ic==='string'?wR(ic,o):ic}</w:p>`;
const wC=(ic,o={})=>`<w:tc><w:tcPr><w:tcW w:w="${o.w}" w:type="dxa"/>${o.fill?`<w:shd w:val="clear" w:color="auto" w:fill="${o.fill}"/>`:''}<w:vAlign w:val="center"/></w:tcPr>${ic}</w:tc>`;
function wT(gen,satirlar){const k='<w:top w:val="single" w:sz="4" w:color="D6D8E2"/><w:left w:val="single" w:sz="4" w:color="D6D8E2"/><w:bottom w:val="single" w:sz="4" w:color="D6D8E2"/><w:right w:val="single" w:sz="4" w:color="D6D8E2"/><w:insideH w:val="single" w:sz="4" w:color="D6D8E2"/><w:insideV w:val="single" w:sz="4" w:color="D6D8E2"/>';
  return `<w:tbl><w:tblPr><w:tblW w:w="${gen.reduce((a,b)=>a+b,0)}" w:type="dxa"/><w:tblBorders>${k}</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${gen.map(w=>`<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>${satirlar.map((r,i)=>`<w:tr>${i===0?'<w:trPr><w:tblHeader/></w:trPr>':''}${r.map((c,j)=>{const o=typeof c==='object'&&c?c:{s:c};return wC(wP(o.s??'',{af:0,b:i===0||o.b,jc:o.jc,sz:18}),{w:gen[j],fill:i===0?'ECEAF5':o.fill})}).join('')}</w:tr>`).join('')}</w:tbl>${wP('',{af:120})}`}
const sigdir=(gen,top=9638)=>{const s=gen.reduce((a,b)=>a+b,0);return gen.map(g=>Math.floor(g*top/s))};
function wordRapor(){const V=P(),B=V.bolumler,K=siraliKodlar(),bel=V.belgeler,tarih=new Date().toLocaleDateString(S.dil);let b='';const H=s=>wP(s,{st:'Heading1',keep:1,bf:240,af:120}),H2=s=>wP(s,{st:'Heading2',keep:1,bf:160,af:80});
  b+=wP(t('reportTitle'),{b:1,sz:36,c:'3B2A8F',af:80});b+=wP(V.ad,{b:1,sz:26,af:60});b+=wP(t('reportDate',tarih),{sz:18,c:'6B6E80',af:240});
  b+=wP(t('reportSummary',bel.length,K.length,B.length,new Set(B.map(x=>x.kd)).size));
  if($('#rKitap').checked){b+=H(t('codebook'));b+=wT(sigdir([2400,4200,3000]),[[t('colCode'),t('definition'),t('codeMemo')],...K.map(k=>[{s:'  '.repeat(kodDerinlik(k.id))+k.ad,b:!k.ust},k.tanim||'-',k.not||'-'])])}
  if($('#rFrekans').checked){b+=H(t('codeFreq'));b+=wT(sigdir([5200,1400,1400,1600]),[[t('colCode'),t('colSegs'),t('colDocs'),t('colDocPct')],...K.map(k=>{const L=B.filter(x=>x.k===k.id),d=new Set(L.map(x=>x.b)).size;return [{s:'  '.repeat(kodDerinlik(k.id))+k.ad},{s:String(L.length),jc:'right'},{s:String(d),jc:'right'},{s:sayi(bel.length?d/bel.length*100:0),jc:'right'}]}),[{s:t('total'),b:1},{s:String(B.length),jc:'right',b:1},'','']])}
  if($('#rMatris').checked&&bel.length){b+=H(t('codeDocMatrix'));const gen=sigdir([3000,...bel.map(()=>900)]);
    b+=wT(gen,[[t('colCode'),...bel.map(d=>({s:kisalt(d.ad,14),jc:'center'}))],...K.map(k=>[{s:k.ad},...bel.map(d=>{const n=B.filter(x=>x.k===k.id&&x.b===d.id).length;return {s:n?String(n):'-',jc:'center',fill:n?'E6E2F7':''}})])])}
  if($('#rAlinti').checked){b+=H(t('quotesByCode'));const en=Math.max(1,+$('#rEnFazla').value||5);
    K.forEach(k=>{const L=B.filter(x=>x.k===k.id);if(!L.length)return;b+=H2(`${kodYolu(k.id)} (${L.length})`);if(k.tanim)b+=wP(k.tanim,{i:1,sz:18,c:'6B6E80'});
      const gor=new Set();L.filter(x=>{const a=x.b+':'+x.s+':'+x.e;if(gor.has(a))return false;gor.add(a);return true}).slice(0,en).forEach(x=>{const d=belge(x.b);const oz=Object.values(d.ozellik||{}).join(', ');b+=wP(`"${d.metin.slice(x.s,x.e)}"`,{i:1,ind:567,af:40});b+=wP(`(${d.ad}${oz?', '+oz:''})`,{sz:18,c:'6B6E80',ind:567,af:140,jc:'right'})})})}
  const kd=kodlayicilar();
  if($('#rUyum').checked&&kd.length>=2){const A=kd.includes($('#uA').value)?$('#uA').value:kd[0],Bk=kd.includes($('#uB').value)&&$('#uB').value!==A?$('#uB').value:kd.find(x=>x!==A);
    const tur=$('#uBirim').value||'p';const {sonuc,birimSay,belgeSay}=uyumHesap(A,Bk,tur);b+=H(t('tabAgreement'));b+=wP(`${A} / ${Bk}. ${t('unit')}: ${t(tur==='c'?'unitSent':'unitPara')}. ${t('units',belgeSay,birimSay)}`);
    const top=sonuc.reduce((s,r)=>({a:s.a+r.a,b:s.b+r.b,c:s.c+r.c,d:s.d+r.d}),{a:0,b:0,c:0,d:0});
    const sat=(ad,r,kal)=>{const mh=r.a+r.b+r.c?r.a/(r.a+r.b+r.c):null,k=kappa(r.a,r.b,r.c,r.d);return [{s:ad,b:kal},{s:String(r.a),jc:'right'},{s:String(r.b),jc:'right'},{s:String(r.c),jc:'right'},{s:mh==null?'-':'%'+sayi(mh*100,1),jc:'right'},{s:k==null?'-':sayi(k,2),jc:'right',b:kal}]};
    b+=wT(sigdir([3800,1100,1100,1100,1300,1100]),[[t('colCode'),t('colBoth'),t('colOnlyA'),t('colOnlyB'),t('colMH'),t('colKappa')],...sonuc.map(r=>sat(kodYolu(r.k.id),r)),sat(t('overall'),top,1)]);
    b+=wP(t('kappaBand'),{sz:16,c:'6B6E80'});b+=wP(t('mhNote'),{sz:16,c:'6B6E80'});
    const al=alfaHesap(tur);if(al.satir.length){b+=H2(t('alphaTitle'));b+=wP(t('alphaCoders',al.kodlayiciSay),{sz:18});b+=wT(sigdir([7000,2600]),[[t('colCode'),t('alphaCol')],...al.satir.map(r=>[kodYolu(r.k.id),{s:r.a==null?'-':sayi(r.a,2),jc:'right'}]),[{s:t('overall'),b:1},{s:al.genel==null?'-':sayi(al.genel,2),jc:'right',b:1}]]);b+=wP(t('alphaNote'),{sz:16,c:'6B6E80'})}}
  if($('#rGunluk').checked&&V.gunluk.length){b+=H(t('projectLog'));b+=wT(sigdir([2000,1800,5800]),[[t('reportDate','').replace(/[:：]\s*$/,''),t('coder'),t('memo')],...V.gunluk.map(g=>[new Date(g.t).toLocaleString(S.dil),g.kd||'',(g.oto?'['+t('logAuto')+'] ':'')+g.m])])}
  if($('#rYontem').checked){b+=H(ga('yontem','baslik'));b+=wP(ga('yontem','not'),{i:1,sz:18,c:'6B6E80'});yontemMetni().forEach(x=>{b+=wP(x,{af:140})});
    b+=H(ga('yontem','kaynakca'));kaynakcaListesi().forEach(x=>{b+=`<w:p><w:pPr><w:ind w:left="567" w:hanging="567"/><w:spacing w:after="80"/></w:pPr>${wR(x)}</w:p>`})}
  if($('#rNot').checked){const L=bel.filter(d=>(d.not||'').trim());if(L.length){b+=H(t('memos'));L.forEach(d=>{b+=H2(d.ad);b+=wP(d.not)})}}
  b+=wP(`Kodlama Masası v${SURUM}. ${t('credit')} Öğr. Gör. Dr. Behiç ÇETİN.`,{sz:14,c:'8A8DA0',bf:300});
  const doc=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${b}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const sty=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="${S.dil==='tr'?'tr-TR':'en-GB'}"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="100" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="3B2A8F"/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="160" w:after="80"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style></w:styles>`;
  return zipYap([{ad:'[Content_Types].xml',veri:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>'},
    {ad:'_rels/.rels',veri:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'},
    {ad:'word/_rels/document.xml.rels',veri:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'},
    {ad:'word/document.xml',veri:doc},{ad:'word/styles.xml',veri:sty}],'application/vnd.openxmlformats-officedocument.wordprocessingml.document')}

/* ====================== REFI-QDA (.qdpx) ====================== */
function qdpxVer(){const p=P(),g=new Map(),G=id=>{if(!g.has(id))g.set(id,uuid());return g.get(id)};const kds=[...new Set([p.kodlayici,...kodlayicilar()])];
  const kodXml=ust=>p.kodlar.filter(k=>(k.ust||null)===ust).map(k=>`<Code guid="${G('k'+k.id)}" name="${X(k.ad)}" isCodable="true" color="${X(k.renk)}">${k.tanim||k.not?`<Description>${X([k.tanim,k.not].filter(Boolean).join('\n\n'))}</Description>`:''}${kodXml(k.id)}</Code>`).join('');
  const degisken=[...new Set(p.belgeler.flatMap(b=>Object.keys(b.ozellik||{})))];
  const dosyalar=[];
  const kaynak=p.belgeler.map(b=>{const sg=G('b'+b.id);dosyalar.push({ad:`Sources/${sg}.txt`,veri:b.metin});
    return `<TextSource guid="${sg}" name="${X(b.ad)}" plainTextPath="internal://${sg}.txt">${b.not?`<Description>${X(b.not)}</Description>`:''}${p.bolumler.filter(x=>x.b===b.id).map(x=>`<PlainTextSelection guid="${G('s'+x.id)}" name="${X(kisalt(b.metin.slice(x.s,x.e),40))}" startPosition="${x.s}" endPosition="${x.e}" creatingUser="${G('u'+x.kd)}">${x.not?`<Description>${X(x.not)}</Description>`:''}<Coding guid="${uuid()}" creatingUser="${G('u'+x.kd)}"><CodeRef targetGUID="${G('k'+x.k)}"/></Coding></PlainTextSelection>`).join('')}</TextSource>`}).join('');
  const xml=`<?xml version="1.0" encoding="utf-8"?>
<Project name="${X(p.ad)}" origin="Kodlama Masasi ${SURUM}" creationDateTime="${new Date().toISOString()}" xmlns="urn:QDA-XML:project:1.0">
<Users>${kds.map(k=>`<User guid="${G('u'+k)}" name="${X(k)}"/>`).join('')}</Users>
<CodeBook><Codes>${kodXml(null)}</Codes></CodeBook>
${degisken.length?`<Variables>${degisken.map(v=>`<Variable guid="${G('v'+v)}" name="${X(v)}" typeOfVariable="Text"/>`).join('')}</Variables>
<Cases>${p.belgeler.filter(b=>Object.keys(b.ozellik||{}).length).map(b=>`<Case guid="${G('c'+b.id)}" name="${X(b.ad)}">${Object.entries(b.ozellik).map(([k,v])=>`<VariableValue><VariableRef targetGUID="${G('v'+k)}"/><TextValue>${X(v)}</TextValue></VariableValue>`).join('')}<SourceRef targetGUID="${G('b'+b.id)}"/></Case>`).join('')}</Cases>`:''}
<Sources>${kaynak}</Sources>
${p.gunluk.length?`<Notes>${p.gunluk.map(n=>`<Note guid="${uuid()}" name="${X(new Date(n.t).toLocaleString(S.dil))}" creationDateTime="${n.t}"><PlainTextContent>${X(n.m)}</PlainTextContent></Note>`).join('')}</Notes>`:''}
</Project>`;
  indir(dosyaAd(p.ad)+'.qdpx',zipYap([{ad:'project.qde',veri:xml},...dosyalar]));tost(t('qdpxDone'))}
async function qdpxAl(){const f=await dosyaOku('.qdpx,.qde');if(!f)return;try{
    let xml,z=null;if(/\.qde$/i.test(f.name))xml=await f.text();else{z=await zipAc(await f.arrayBuffer());const ad=Object.keys(z).find(n=>/\.qde$/i.test(n));xml=await z.oku(ad)}
    const d=new DOMParser().parseFromString(xml,'application/xml');const el=(n,ad)=>[...n.children].filter(c=>c.localName===ad);const tum=ad=>[...d.getElementsByTagNameNS('*',ad)];
    const kul=new Map(tum('User').map(u=>[u.getAttribute('guid'),u.getAttribute('name')||'?']));
    const p=bosProje();p.ad=d.documentElement.getAttribute('name')||f.name.replace(/\.[^.]+$/,'');p.kodlayici=[...kul.values()][0]||p.kodlayici;
    const kodG=new Map();const gez=(n,ust)=>el(n,'Code').forEach((c,i)=>{const id=uid();kodG.set(c.getAttribute('guid'),id);const ds=el(c,'Description')[0];
      p.kodlar.push({id,ad:c.getAttribute('name')||'?',renk:(c.getAttribute('color')||'').match(/^#[0-9a-f]{6}$/i)?c.getAttribute('color'):RENKLER[p.kodlar.length%RENKLER.length],ust,tanim:ds?ds.textContent:'',not:''});gez(c,id)});
    const cb=tum('Codes')[0];if(cb)gez(cb,null);
    const kayG=new Map();
    for(const s of tum('TextSource')){let m=null;const ptc=el(s,'PlainTextContent')[0];if(ptc)m=ptc.textContent;else{const yol=(s.getAttribute('plainTextPath')||'').replace(/^internal:\/\//,'');if(z){const ad=Object.keys(z).find(n=>n.endsWith('/'+yol)||n===yol);m=ad?await z.oku(ad):null}}
      if(m==null)continue;const bid=uid();kayG.set(s.getAttribute('guid'),bid);const ds=el(s,'Description')[0];
      p.belgeler.push({id:bid,ad:s.getAttribute('name')||'#',metin:m.replace(/\r\n?/g,'\n'),ozellik:{},not:ds?ds.textContent:''});
      el(s,'PlainTextSelection').forEach(sel=>{const st=+sel.getAttribute('startPosition'),en=+sel.getAttribute('endPosition');const ds2=el(sel,'Description')[0];
        el(sel,'Coding').forEach(c=>{const ref=el(c,'CodeRef')[0];const kid=ref&&kodG.get(ref.getAttribute('targetGUID'));if(!kid)return;
          p.bolumler.push({id:uid(),b:bid,k:kid,s:st,e:en,kd:kul.get(c.getAttribute('creatingUser')||sel.getAttribute('creatingUser'))||p.kodlayici,not:ds2?ds2.textContent:'',t:Date.now()})})})}
    const deg=new Map(tum('Variable').map(v=>[v.getAttribute('guid'),v.getAttribute('name')]));
    tum('Case').forEach(c=>{const ozl={};el(c,'VariableValue').forEach(vv=>{const r=el(vv,'VariableRef')[0];const v=[...vv.children].find(x=>/Value$/.test(x.localName));if(r&&v)ozl[deg.get(r.getAttribute('targetGUID'))||'?']=v.textContent});
      el(c,'SourceRef').forEach(sr=>{const b=p.belgeler.find(x=>x.id===kayG.get(sr.getAttribute('targetGUID')));if(b)Object.assign(b.ozellik,ozl)})});
    if(!p.belgeler.length)throw new Error('bos');
    if(P().belgeler.length&&!(await sor(`${t('openProject')}: ${f.name}`,t('openProject'))))return;
    once();S.P=projeDuzelt(p);gunlukEkle(t('lImport'));S.belge=null;S.secKod=new Set(p.kodlar.map(k=>k.id));kaydet();ciz();tost(t('projectLoaded'))
  }catch(e){console.warn(e);tost(t('badQdpx'),'error')}}

/* ====================== ANONİMLEŞTİRME ====================== */
function ozelAdAdaylari(){const say={};const dur=new Set([...Object.values(DILLER).map(d=>d.stop||'')].join(' ').split(/\s+/));
  /* Aday: art arda büyük harfle başlayan iki ya da daha fazla sözcük (Ahmet Bey, Antalya Havalimanı) ya da cümle ortasında büyük harfle geçen tek sözcük. */
  P().belgeler.forEach(b=>{const re=/\p{Lu}[\p{Ll}]+(?:\s+\p{Lu}[\p{Ll}]+)*/gu;let m;while((m=re.exec(b.metin))){const w=m[0],onc=b.metin.slice(Math.max(0,m.index-4),m.index);
      const basta=m.index===0||/(^|[.!?…\n]|:)\s*$/.test(onc);const cok=/\s/.test(w);const ilk=kucukHarf(w.split(/\s+/)[0]);
      if(dur.has(ilk)||w.length<3)continue;if(cok||!basta)say[w]=(say[w]||0)+1}});
  return Object.entries(say).sort((a,b)=>b[1]-a[1]||b[0].length-a[0].length).slice(0,24)}
function eslesmeler(m,kural){const o=[];kural.forEach(([bul,yer],ki)=>{if(!bul)return;const kaynak=kural.harf?m:kucukHarf(m),aranan=kural.harf?bul:kucukHarf(bul);let i=0;
  while((i=kaynak.indexOf(aranan,i))>=0){const e=i+aranan.length;const sinir=c=>!c||!/[\p{L}\p{N}]/u.test(c);if(!kural.tam||(sinir(m[i-1])&&sinir(m[e])))o.push({s:i,e,yer});i=e}});
  o.sort((a,b)=>a.s-b.s||b.e-a.e);const tek=[];let son=-1;o.forEach(x=>{if(x.s>=son){tek.push(x);son=x.e}});return tek}
/* metni değiştirirken kodlama konumlarını kaydır */
function metinDegistir(b,es){if(!es.length)return 0;let yeni='',onceki=0;const harita=[];
  es.forEach(x=>{yeni+=b.metin.slice(onceki,x.s);const ys=yeni.length;yeni+=x.yer;harita.push({s:x.s,e:x.e,ys,ye:yeni.length});onceki=x.e});yeni+=b.metin.slice(onceki);
  const tasi=(p,bas)=>{let fark=0;for(const h of harita){if(p<=h.s)break;if(p>=h.e){fark=h.ye-h.e;continue}return bas?h.ys:h.ye}return p+fark};
  P().bolumler.filter(x=>x.b===b.id).forEach(x=>{x.s=tasi(x.s,true);x.e=tasi(x.e,false);if(x.e<=x.s)x.e=Math.min(yeni.length,x.s+1)});b.metin=yeni;return es.length}
async function anonimPencere(){const aday=ozelAdAdaylari();let n=0;
  const satirHtml=(a='',y='')=>`<div class="join w-full"><input class="input input-sm join-item flex-1" data-abul value="${esc(a)}" placeholder="${esc(t('anonFind'))}"><input class="input input-sm join-item flex-1" data-ayer value="${esc(y)}" placeholder="${esc(t('anonReplace'))}"><button class="btn btn-sm join-item" data-asil aria-label="${esc(t('delete'))}">x</button></div>`;
  await pencere(t('anonTitle'),`<p class="text-sm text-base-content/70">${esc(t('anonIntro'))}</p>
    ${aday.length?`<p class="text-sm font-medium mt-4">${esc(t('anonSuggest'))}</p><div class="flex flex-wrap gap-1 mt-2">${aday.map(([w,c])=>`<button class="badge badge-outline cursor-pointer hover:badge-primary" data-aday="${esc(w)}">${esc(w)} (${c})</button>`).join('')}</div>`:''}
    <div class="grid grid-cols-2 gap-2 text-xs font-medium mt-4 px-1"><span>${esc(t('anonFind'))}</span><span>${esc(t('anonReplace'))}</span></div>
    <div id="aSatir" class="space-y-2 mt-1">${satirHtml()}</div><button class="btn btn-ghost btn-xs mt-2" id="aEkle">+ ${esc(t('anonAddRow'))}</button>
    <div class="flex flex-wrap gap-4 mt-4 text-sm"><label class="label"><input type="checkbox" class="checkbox checkbox-sm" id="aTam" checked> ${esc(t('wholeWord'))}</label><label class="label"><input type="checkbox" class="checkbox checkbox-sm" id="aHarf"> ${esc(t('anonCase'))}</label><label class="label"><input type="checkbox" class="checkbox checkbox-sm" id="aAd" checked> ${esc(t('anonNames'))}</label></div>
    <p id="aOn" class="text-sm text-base-content/70 mt-3"></p>`,
    [{ad:t('cancel'),d:false},{ad:t('apply'),c:'btn-primary',d:true,f:()=>{const k=kurallar();if(!k.length)return false;
      islem(()=>{let top=0;P().belgeler.forEach(b=>{top+=metinDegistir(b,eslesmeler(b.metin,k));if($('#aAd').checked){const deg=s=>{let o=s;eslesmeler(s,k).reverse().forEach(x=>{o=o.slice(0,x.s)+x.yer+o.slice(x.e)});return o};b.ad=deg(b.ad);Object.keys(b.ozellik).forEach(a=>b.ozellik[a]=deg(b.ozellik[a]))}});n=top;gunlukEkle(t('lAnon',top))});tost(t('anonDone',n))}}],
    {ip:'anonim',acilinca:()=>{const bagla=()=>{$$('[data-asil]').forEach(b=>b.onclick=()=>{b.parentElement.remove();onizle()});$$('#aSatir input').forEach(i=>i.oninput=onizle)};
      const ekle=(a,y)=>{const bos=[...$$('#aSatir .join')].find(j=>!j.querySelector('[data-abul]').value);if(bos){bos.querySelector('[data-abul]').value=a||'';bos.querySelector('[data-ayer]').value=y||''}else $('#aSatir').insertAdjacentHTML('beforeend',satirHtml(a,y));bagla();onizle()};
      $('#aEkle').onclick=()=>ekle('','');$$('[data-aday]').forEach((b,i)=>b.onclick=()=>{ekle(b.dataset.aday,(S.dil==='tr'?'[Ad ':'[Name ')+($$('#aSatir .join').length)+']');b.remove()});
      ['#aTam','#aHarf'].forEach(s=>$(s).onchange=onizle);bagla()}});
  function kurallar(){const k=[...$$('#aSatir .join')].map(j=>[j.querySelector('[data-abul]').value.trim(),j.querySelector('[data-ayer]').value]).filter(r=>r[0]);k.tam=$('#aTam').checked;k.harf=$('#aHarf').checked;return k}
  function onizle(){const k=kurallar();$('#aOn').textContent=k.length?t('anonPreview',P().belgeler.reduce((a,b)=>a+eslesmeler(b.metin,k).length,0)):''}}

/* ====================== ARA VE TOPLU KODLA ====================== */
async function araPencere(){let sonuc=[];
  await pencere(t('searchTitle'),`<div class="grid sm:grid-cols-[1fr_auto] gap-3 items-end"><div><label class="text-sm font-medium" for="tAra">${esc(t('searchTerm'))}</label><input id="tAra" class="input w-full mt-1" type="search"></div>
      <label class="label text-sm pb-2"><input type="checkbox" class="checkbox checkbox-sm" id="tTam"> ${esc(t('wholeWord'))}</label></div>
    <div class="grid sm:grid-cols-2 gap-3 mt-3"><div><label class="text-sm font-medium" for="tAlan">${esc(t('extendTo'))}</label><select id="tAlan" class="select w-full mt-1"><option value="m">${esc(t('extMatch'))}</option><option value="c" selected>${esc(t('extSentence'))}</option><option value="p">${esc(t('extPara'))}</option></select></div>
      <div><label class="text-sm font-medium" for="tKod">${esc(t('chooseCode'))}</label><div class="join w-full mt-1"><select id="tKod" class="select join-item w-1/2">${siraliKodlar().map(k=>`<option value="${k.id}">${esc(kodYolu(k.id))}</option>`).join('')}<option value="">+</option></select><input id="tYeni" class="input join-item w-1/2" placeholder="${esc(t('newCodePh'))}"></div></div></div>
    <p id="tSay" class="text-sm font-medium mt-4"></p><ul id="tListe" class="mt-2 space-y-1 max-h-80 overflow-auto"></ul>`,
    [{ad:t('cancel'),d:false},{ad:t('applySelected'),c:'btn-primary',d:true,f:()=>{const sec=sonuc.filter((_,i)=>($(`#tS${i}`)||{}).checked);if(!sec.length)return false;
      const ya=$('#tYeni').value.trim();let kid=$('#tKod').value;if(!kid&&!ya)return false;let n=0;
      islem(()=>{if(ya){const v=P().kodlar.find(k=>kucukHarf(k.ad)===kucukHarf(ya));kid=v?v.id:yeniKod(ya).id}
        sec.forEach(r=>{if(!P().bolumler.some(x=>x.b===r.b.id&&x.k===kid&&x.s===r.s&&x.e===r.e&&x.kd===P().kodlayici)){P().bolumler.push({id:uid(),b:r.b.id,k:kid,s:r.s,e:r.e,kd:P().kodlayici,not:'',t:Date.now()});n++}});
        gunlukEkle(t('lBulk',$('#tAra').value.trim(),(kod(kid)||{}).ad,n))});tost(t('applied',n))}}],
    {genis:1,ip:'araKodla',acilinca:()=>{let z;const bul=()=>{const q=$('#tAra').value.trim(),alan=$('#tAlan').value;sonuc=[];
        if(q.length>=2){const k=[[q,'']];k.tam=$('#tTam').checked;k.harf=false;P().belgeler.forEach(b=>{const gor=new Set();eslesmeler(b.metin,k).forEach(x=>{let s=x.s,e=x.e;
          if(alan!=='m'){const u=birimler(b.metin,alan).find(([a,c])=>a<=x.s&&x.e<=c+1);if(u){s=u[0];e=u[1]}while(e>s&&/\s/.test(b.metin[e-1]))e--;while(s<e&&/\s/.test(b.metin[s]))s++}
          const a=s+':'+e;if(gor.has(a))return;gor.add(a);sonuc.push({b,s,e,ms:x.s,me:x.e})})})}
        $('#tSay').textContent=q.length>=2?t('hits',sonuc.length,new Set(sonuc.map(r=>r.b.id)).size):'';
        $('#tListe').innerHTML=sonuc.slice(0,300).map((r,i)=>{const m=r.b.metin;const on=m.slice(Math.max(r.s,r.ms-90),r.ms),ar=m.slice(r.me,Math.min(r.e,r.me+90));
          return `<li><label class="flex gap-2 items-start p-2 rounded-field hover:bg-base-200 cursor-pointer"><input type="checkbox" class="checkbox checkbox-sm mt-1" id="tS${i}" checked><span class="text-sm"><span class="text-base-content/60">${esc(r.b.ad)}: </span><span class="metin-serif">${r.ms-90>r.s?'…':''}${esc(on)}<mark class="bg-warning/40 text-base-content rounded-sm">${esc(m.slice(r.ms,r.me))}</mark>${esc(ar)}${r.me+90<r.e?'…':''}</span></span></label></li>`}).join('')};
      $('#tAra').oninput=()=>{clearTimeout(z);z=setTimeout(bul,200)};$('#tTam').onchange=bul;$('#tAlan').onchange=bul;
      $('#tKod').onchange=()=>{if(!$('#tKod').value)$('#tYeni').focus()};$('#tAra').focus()}})}

/* ====================== KATILIMCI BİLGİLERİ (tablo) ====================== */
async function ozellikPencere(){await pencere(t('attrTitle'),`<p class="text-sm text-base-content/70">${esc(t('attrIntro'))}</p>
  <div class="flex flex-wrap gap-2 mt-4"><button class="btn btn-sm btn-primary" id="oSec">${esc(t('chooseFile'))}</button><button class="btn btn-sm" id="oSablon">${esc(t('attrTemplate'))}</button></div><p id="oSonuc" class="text-sm mt-3"></p>`,null,
  {ip:'ozellikler',acilinca:()=>{
    $('#oSablon').onclick=()=>{const oz=[...new Set(P().belgeler.flatMap(b=>Object.keys(b.ozellik||{})))];const bas=oz.length?oz:(S.dil==='tr'?['Cinsiyet','Yaş','Bölüm']:['Gender','Age','Department']);
      indir(dosyaAd(P().ad)+'-katilimcilar.csv',csv([[t('csvDoc'),...bas],...P().belgeler.map(b=>[b.ad,...bas.map(a=>(b.ozellik||{})[a]||'')])]))};
    $('#oSec').onclick=async()=>{const f=await dosyaOku('.xlsx,.csv,.tsv,.txt');if(!f)return;try{const sat=/\.xlsx$/i.test(f.name)?await xlsxSatirlar(await f.arrayBuffer()):csvSatirlar(await f.text());
      const [bas,...gov]=sat;if(!bas||bas.length<2)throw new Error('baslik');let es=0,yok=0;
      islem(()=>{gov.forEach(r=>{const ad=String(r[0]||'').trim();if(!ad)return;const b=P().belgeler.find(x=>kucukHarf(x.ad.trim())===kucukHarf(ad));if(!b){yok++;return}es++;bas.slice(1).forEach((k,i)=>{k=String(k||'').trim();const v=String(r[i+1]??'').trim();if(k&&v!=='')b.ozellik[k]=v})});gunlukEkle(t('lAttr',es))});
      $('#oSonuc').textContent=t('attrDone',es,yok)}catch(e){$('#oSonuc').textContent=t('fileReadFail',f.name)}}}})}

/* ====================== KODLAYICILAR, İKİNCİ KODLAYICI, GÜNLÜK ====================== */
async function kodlayiciPencere(){const ciz_=()=>{const kd=[...new Set([P().kodlayici,...kodlayicilar()])];
    $('#kdListe').innerHTML=kd.map((k,i)=>{const n=P().bolumler.filter(x=>x.kd===k).length;return `<li class="flex flex-wrap items-center gap-2 border border-base-300 rounded-box p-2"><input class="input input-sm flex-1 min-w-40" value="${esc(k)}" data-kdad="${i}" aria-label="${esc(t('rename'))}"><span class="text-sm text-base-content/60">${esc(t('codings',n))}</span><button class="btn btn-sm" data-kdyen="${i}">${esc(t('rename'))}</button>${n?`<button class="btn btn-sm btn-ghost text-error" data-kdsil="${i}">${esc(t('deleteCodings'))}</button>`:''}</li>`}).join('');
    $$('[data-kdyen]').forEach(b=>b.onclick=()=>{const eski=kd[+b.dataset.kdyen],yeni=$(`[data-kdad="${b.dataset.kdyen}"]`).value.trim();if(!yeni||yeni===eski)return;
      islem(()=>{P().bolumler.forEach(x=>{if(x.kd===eski)x.kd=yeni});if(P().kodlayici===eski)P().kodlayici=yeni;if(P().gorunur===eski)P().gorunur=yeni;gunlukEkle(t('lRename',eski,yeni))});ciz_()});
    $$('[data-kdsil]').forEach(b=>b.onclick=async()=>{const k=kd[+b.dataset.kdsil],n=P().bolumler.filter(x=>x.kd===k).length;$('#pencere').close();if(await sor(t('deleteCoderQ',k,n),t('delete'),1))islem(()=>{P().bolumler=P().bolumler.filter(x=>x.kd!==k);gunlukEkle(t('lDelCoder',k))});kodlayiciPencere()})};
  await pencere(t('codersTitle'),`<ul id="kdListe" class="space-y-2"></ul>`,null,{ip:'kodlayici',acilinca:ciz_})}
function ikinciDosya(){const p=JSON.parse(JSON.stringify(P()));p.bolumler=[];p.kor=true;p.gorunur='';p.kodlayici='';p.belgeler.forEach(b=>{b.not=''});p.gunluk=[...p.gunluk,{t:new Date().toISOString(),m:t('lSecond'),oto:true,kd:P().kodlayici}];
  indir(dosyaAd(p.ad)+'-ikinci-kodlayici.kodlama.json',new Blob([JSON.stringify(p,null,1)],{type:'application/json'}));islem(()=>gunlukEkle(t('lSecond')));tost(t('secondReady'))}
async function adSor(){let ad='';await pencere(t('askCoderTitle'),`<p class="text-sm text-base-content/70">${esc(t('askCoderText'))}</p><input id="adSor" class="input w-full mt-3" autocomplete="name"><p id="adHata" class="text-error text-sm mt-1"></p>`,
  [{ad:t('save'),c:'btn-primary',d:true,f:()=>{ad=$('#adSor').value.trim();if(!ad){$('#adHata').textContent=t('nameRequired');return false}}}],{acilinca:()=>$('#adSor').focus()});
  P().kodlayici=ad||(S.dil==='tr'?'Kodlayıcı 2':'Coder 2');kaydet();ciz()}
async function gunlukPencere(){const ciz_=()=>{const L=[...P().gunluk].reverse();$('#gListe').innerHTML=L.length?L.map(g=>`<li class="border-l-2 ${g.oto?'border-base-300':'border-primary'} pl-3 py-1"><p class="text-xs text-base-content/60">${esc(new Date(g.t).toLocaleString(S.dil))}${g.kd?', '+esc(g.kd):''}${g.oto?' ('+esc(t('logAuto'))+')':''}</p><p class="text-sm whitespace-pre-wrap">${esc(g.m)}</p></li>`).join(''):`<li class="text-sm text-base-content/60">${esc(t('logEmpty'))}</li>`};
  await pencere(t('logTitle'),`<p class="text-sm text-base-content/70">${esc(t('logIntro'))}</p><textarea id="gYeni" class="textarea w-full mt-3" rows="2" placeholder="${esc(t('logPh'))}"></textarea><button class="btn btn-sm btn-primary mt-2" id="gEkle">${esc(t('logAdd'))}</button><ul id="gListe" class="space-y-3 mt-5 max-h-96 overflow-auto"></ul>`,null,
    {acilinca:()=>{ciz_();$('#gEkle').onclick=()=>{const m=$('#gYeni').value.trim();if(!m)return;islem(()=>gunlukEkle(m,false));$('#gYeni').value='';ciz_()}}})}

/* ====================== DİL DOSYALARI ====================== */
function dilSablon(){const {_kod,_ad,_cevirmen,...m}=DILLER.en;indir('kodlama-masasi-dil-sablonu.json',new Blob([JSON.stringify({_kod:'xx',_ad:'Language name in its own language',_cevirmen:'Your name',...m},null,1)],{type:'application/json'}))}
async function dilYukle(){const f=await dosyaOku('.json');if(!f)return;try{let j=JSON.parse(await f.text());if(j.metin&&j.kod)j={...j.metin,_kod:j.kod,_ad:j.ad};
  if(!j._kod||!/^[a-z]{2,3}(-[A-Za-z]{2,4})?$/.test(j._kod)||typeof j.tabCode!=='string')throw 0;
  /* yalnızca metin değerleri kabul edilir */
  const temizle=x=>typeof x==='string'?x:Array.isArray(x)?x.map(temizle):(x&&typeof x==='object')?Object.fromEntries(Object.entries(x).map(([a,b])=>[a,temizle(b)])):'';
  const temiz=temizle(j);
  DILLER[j._kod]=temiz;const ek=JSON.parse(ls.al(KAYIT+'.diller')||'{}');ek[j._kod]=temiz;ls.koy(KAYIT+'.diller',JSON.stringify(ek));ls.koy(KAYIT+'.dil',j._kod);
  S.dil=j._kod;metinleriYaz();ciz();tost(t('langLoaded',temiz._ad||j._kod))}catch(e){tost(t('badLang'),'error')}}

/* ====================== ÖRNEK PROJE ====================== */
const ORNEK={
tr:{belgeler:[['Katılımcı K1',{Cinsiyet:'Kadın','Sınıf':'1'},'Görüşmeci: Uzaktan eğitim sürecini nasıl değerlendiriyorsunuz?\nK1: Açıkçası ilk haftalarda çok zorlandım. Evde internet bağlantısı sık sık kopuyordu, canlı derslerin yarısını kaçırdım.\nK1: Telefonla bağlanmak zorunda kaldım çünkü evde tek bilgisayar vardı ve kardeşim de kullanıyordu.\nGörüşmeci: Olumlu bulduğunuz yönler oldu mu?\nK1: Kayıtları istediğim saatte izleyebilmek büyük rahatlıktı. İşe gidip geldiğim için bu çok işime yaradı.\nK1: Ama hocalara soru sormak zordu, mesaj atıyordum ve cevap geç geliyordu.'],
  ['Katılımcı K2',{Cinsiyet:'Erkek','Sınıf':'2'},'Görüşmeci: Uzaktan eğitim sürecini nasıl değerlendiriyorsunuz?\nK2: Ben aslında memnun kaldım. Kendi hızımda çalışabildim, anlamadığım yeri tekrar tekrar izledim.\nK2: Sınıf arkadaşlarımla hiç tanışamadım, bu beni yalnız hissettirdi.\nGörüşmeci: Motivasyonunuzu nasıl korudunuz?\nK2: Zamanla motivasyonum düştü. Kamerayı kimse açmayınca ders bir süre sonra arka planda çalan bir radyo gibi oldu.\nK2: Bir de evde sessiz bir çalışma yerim yoktu.'],
  ['Katılımcı K3',{Cinsiyet:'Kadın','Sınıf':'2'},'Görüşmeci: Uzaktan eğitim sürecini nasıl değerlendiriyorsunuz?\nK3: Mobil veriyle derse girdiğim için kotam ay ortasında bitiyordu.\nK3: Uygulamalı derslerde ciddi eksik kaldık; simülasyonu ekrandan izlemek yapmak gibi değil.\nGörüşmeci: Öğretim elemanlarıyla iletişiminiz nasıldı?\nK3: Bazı hocalar forumda çok hızlı cevap veriyordu, bu güven verdi.\nK3: Esnek saatler sayesinde yarı zamanlı çalışmayı sürdürebildim.']],
 kodlar:[['Erişim sorunları',null,'Teknik ya da maddi nedenlerle derse katılamama.'],['İnternet bağlantısı','Erişim sorunları','Bağlantı kopması, kota, yavaşlık.'],['Cihaz yetersizliği','Erişim sorunları','Bilgisayar ya da uygun cihaz olmaması.'],['Esneklik',null,'Zaman ve hız bakımından kendi düzenini kurabilme.'],['Etkileşim',null,'Öğretim elemanı ve arkadaşlarla iletişim.'],['Motivasyon',null,'Derse ilgi ve istekte değişim.'],['Çalışma ortamı',null,'Evde ders çalışma koşulları.'],['Uygulama eksikliği',null,'Uygulamalı becerilerin uzaktan kazanılamaması.']],
 A:'Kodlayıcı A',B:'Kodlayıcı B',
 kod:[[0,'Evde internet bağlantısı sık sık kopuyordu, canlı derslerin yarısını kaçırdım.','İnternet bağlantısı','AB'],[0,'Telefonla bağlanmak zorunda kaldım çünkü evde tek bilgisayar vardı ve kardeşim de kullanıyordu.','Cihaz yetersizliği','AB'],[0,'Kayıtları istediğim saatte izleyebilmek büyük rahatlıktı. İşe gidip geldiğim için bu çok işime yaradı.','Esneklik','AB'],[0,'Ama hocalara soru sormak zordu, mesaj atıyordum ve cevap geç geliyordu.','Etkileşim','AB'],[0,'ilk haftalarda çok zorlandım','Motivasyon','B'],
  [1,'Kendi hızımda çalışabildim, anlamadığım yeri tekrar tekrar izledim.','Esneklik','AB'],[1,'Sınıf arkadaşlarımla hiç tanışamadım, bu beni yalnız hissettirdi.','Etkileşim','AB'],[1,'Sınıf arkadaşlarımla hiç tanışamadım, bu beni yalnız hissettirdi.','Motivasyon','A'],[1,'Zamanla motivasyonum düştü. Kamerayı kimse açmayınca ders bir süre sonra arka planda çalan bir radyo gibi oldu.','Motivasyon','AB'],[1,'Kamerayı kimse açmayınca','Etkileşim','A'],[1,'Bir de evde sessiz bir çalışma yerim yoktu.','Çalışma ortamı','AB'],
  [2,'Mobil veriyle derse girdiğim için kotam ay ortasında bitiyordu.','İnternet bağlantısı','AB'],[2,'Uygulamalı derslerde ciddi eksik kaldık; simülasyonu ekrandan izlemek yapmak gibi değil.','Uygulama eksikliği','AB'],[2,'Bazı hocalar forumda çok hızlı cevap veriyordu, bu güven verdi.','Etkileşim','AB'],[2,'Esnek saatler sayesinde yarı zamanlı çalışmayı sürdürebildim.','Esneklik','AB'],[2,'Mobil veriyle derse girdiğim için','Cihaz yetersizliği','B']],
 not:'Görüşme 12 Ekim, 25 dakika. Katılımcı çalışan öğrenci.',gunluk:'Kodlamaya başlamadan önce üç dökümü iki kez okuduk; ilk kod listesini birlikte oluşturduk.'},
en:{belgeler:[['Participant P1',{Gender:'Female',Year:'1'},'Interviewer: How would you describe your distance learning experience?\nP1: Honestly, the first weeks were really hard. The internet at home kept dropping and I missed half of the live classes.\nP1: I had to join from my phone because we had one computer at home and my brother used it too.\nInterviewer: Was there anything you liked?\nP1: Watching the recordings whenever I wanted was a huge relief. I commute to work, so that helped a lot.\nP1: But asking the lecturers questions was hard; I sent messages and the replies came late.'],
  ['Participant P2',{Gender:'Male',Year:'2'},'Interviewer: How would you describe your distance learning experience?\nP2: I was actually happy. I could work at my own pace and rewatch the parts I did not understand.\nP2: I never got to know my classmates, which made me feel lonely.\nInterviewer: How did you keep yourself motivated?\nP2: My motivation dropped over time. When nobody turned their camera on, the class became like a radio playing in the background.\nP2: I also had no quiet place to study at home.'],
  ['Participant P3',{Gender:'Female',Year:'2'},'Interviewer: How would you describe your distance learning experience?\nP3: I joined on mobile data, so my allowance ran out in the middle of the month.\nP3: We really missed out in the practical courses; watching a simulation on screen is not the same as doing it.\nInterviewer: How was your communication with the lecturers?\nP3: Some lecturers answered very quickly on the forum, which gave me confidence.\nP3: Flexible hours let me keep my part-time job.']],
 kodlar:[['Access problems',null,'Not being able to attend for technical or financial reasons.'],['Internet connection','Access problems','Dropouts, data allowance, slow connection.'],['Lack of devices','Access problems','No computer or suitable device.'],['Flexibility',null,'Setting one\'s own time and pace.'],['Interaction',null,'Communication with lecturers and peers.'],['Motivation',null,'Changes in interest and willingness.'],['Study environment',null,'Conditions for studying at home.'],['Lack of practice',null,'Practical skills that cannot be gained remotely.']],
 A:'Coder A',B:'Coder B',
 kod:[[0,'The internet at home kept dropping and I missed half of the live classes.','Internet connection','AB'],[0,'I had to join from my phone because we had one computer at home and my brother used it too.','Lack of devices','AB'],[0,'Watching the recordings whenever I wanted was a huge relief. I commute to work, so that helped a lot.','Flexibility','AB'],[0,'But asking the lecturers questions was hard; I sent messages and the replies came late.','Interaction','AB'],[0,'the first weeks were really hard','Motivation','B'],
  [1,'I could work at my own pace and rewatch the parts I did not understand.','Flexibility','AB'],[1,'I never got to know my classmates, which made me feel lonely.','Interaction','AB'],[1,'I never got to know my classmates, which made me feel lonely.','Motivation','A'],[1,'My motivation dropped over time. When nobody turned their camera on, the class became like a radio playing in the background.','Motivation','AB'],[1,'When nobody turned their camera on','Interaction','A'],[1,'I also had no quiet place to study at home.','Study environment','AB'],
  [2,'I joined on mobile data, so my allowance ran out in the middle of the month.','Internet connection','AB'],[2,'We really missed out in the practical courses; watching a simulation on screen is not the same as doing it.','Lack of practice','AB'],[2,'Some lecturers answered very quickly on the forum, which gave me confidence.','Interaction','AB'],[2,'Flexible hours let me keep my part-time job.','Flexibility','AB'],[2,'I joined on mobile data','Lack of devices','B']],
 not:'Interview on 12 October, 25 minutes. The participant is a working student.',gunluk:'Before coding we read the three transcripts twice and built the first code list together.'}};
function ornekProje(){const o=ORNEK[S.dil]||ORNEK.en;const p=bosProje();p.ad=t('sampleName');p.kodlayici=o.A;
  o.belgeler.forEach(([ad,oz,m],i)=>p.belgeler.push({id:'b'+i,ad,metin:m,ozellik:{...oz},not:i===0?o.not:''}));
  const ids={};o.kodlar.forEach(([ad,ust,tanim],i)=>{const id='k'+i;ids[ad]=id;p.kodlar.push({id,ad,renk:RENKLER[i%RENKLER.length],ust:ust?ids[ust]:null,tanim,not:''})});
  let z=1;o.kod.forEach(([d,ifade,k,kim])=>{const m=p.belgeler[d].metin,s=m.indexOf(ifade);if(s<0)return;[...kim].forEach(c=>p.bolumler.push({id:uid(),b:'b'+d,k:ids[k],s,e:s+ifade.length,kd:c==='A'?o.A:o.B,not:'',t:z++}))});
  p.gunluk.push({t:new Date().toISOString(),m:o.gunluk,oto:false,kd:o.A});return p}
async function ornekYukle(){if(P().belgeler.length&&!(await sor(t('sampleQ'),t('loadSample'))))return;once();S.P=ornekProje();S.belge=null;S.noktaBolumler=null;S.odakKod=null;S.secKod=new Set(P().kodlar.map(k=>k.id));kaydet();ciz()}

/* ====================== OLAYLAR ====================== */
const projeIndir=()=>indir(dosyaAd(P().ad)+'.kodlama.json',new Blob([JSON.stringify(P(),null,1)],{type:'application/json'}));
const ARAC={yeni:async()=>{if(await sor(t('newProjectQ'),t('newProject'),1)){once();S.P=bosProje();S.belge=null;S.secKod=new Set();S.odakKod=null;kaydet();ciz()}},
  ac:async()=>{const f=await dosyaOku('.json,application/json');if(!f)return;try{const p=JSON.parse(await f.text());if(p.tur!=='kodlama-masasi')throw 0;once();S.P=projeDuzelt(p);S.belge=null;S.noktaBolumler=null;S.odakKod=null;S.secKod=new Set(p.kodlar.map(k=>k.id));kaydet();ciz();tost(t('projectLoaded'));if(!P().kodlayici)adSor()}catch(e){tost(t('badProject'),'error')}},
  kaydet:projeIndir,ornek:ornekYukle,atif:()=>atifPencere(),qdpxVer,qdpxAl,ara:araPencere,anonim:anonimPencere,ozellik:ozellikPencere,kodlayicilar:kodlayiciPencere,ikinci:ikinciDosya,gunluk:gunlukPencere,dilSablon,dilYukle};
$$('[data-arac]').forEach(b=>b.addEventListener('click',()=>{document.activeElement&&document.activeElement.blur();ARAC[b.dataset.arac]()}));
$$('#sekmeler [data-sekme],#evBtn,.drawer-side [data-sekme]').forEach(b=>b.onclick=()=>sekmeAc(b.dataset.sekme));
$('#projeAd').onchange=e=>islem(()=>{P().ad=e.target.value.trim()||t('untitled')});
$('#kodlayiciAd').onchange=e=>{const v=e.target.value.trim();if(v)islem(()=>{P().kodlayici=v})};
$('#kodlayiciAdM').onchange=e=>{$('#kodlayiciAd').value=e.target.value;$('#kodlayiciAd').onchange({target:$('#kodlayiciAd')})};
$('#gorunur').onchange=e=>{P().gorunur=e.target.value;S.noktaBolumler=null;kaydet();ciz()};
$('#korSec').onchange=e=>islem(()=>{P().kor=e.target.checked;S.noktaBolumler=null});
const dilDegis=v=>{S.dil=v;ls.koy(KAYIT+'.dil',v);metinleriYaz();ciz()};
$('#dilSec').onchange=e=>dilDegis(e.target.value);$('#dilSecM').onchange=e=>dilDegis(e.target.value);
$('#temaSec').onchange=e=>{ls.koy(KAYIT+'.tema',e.target.checked?'masa-gece':'masa');requestAnimationFrame(()=>ciz())};
$('#geriAl').onclick=geriAl;$('#yinele').onclick=yinele;$('#yenile').onclick=()=>location.reload();
$('#genelYardim').onclick=()=>pencere(tAlt('helpTitle','genel'),`<div class="text-sm leading-relaxed ipucu-metin">${guvenliHtml(tAlt('helpBody','genel'))}</div>`);
$('#belgeEkle').onclick=belgeEkle;$('#kodEkle').onclick=()=>kodDuzenle(null);$('#kodAra').oninput=cizKodlar;
['#fAra','#fBelge','#fOzellik','#fKodlayici'].forEach(s=>$(s).addEventListener(s==='#fAra'?'input':'change',cizAlintilar));
$('#fHepsi').onclick=()=>{S.secKod=new Set(P().kodlar.map(k=>k.id));cizAlintilar()};$('#fHicbiri').onclick=()=>{S.secKod=new Set();cizAlintilar()};
$('#alintiKopya').onclick=async()=>{try{await navigator.clipboard.writeText(alintiMetin(alintilar()));tost(t('copied'))}catch(e){tost(e.message,'error')}};
$('#alintiCsv').onclick=()=>indir(dosyaAd(P().ad)+'-alintilar.csv',csv(bolumSatirlari(alintilar())));
$('#kelimeGor').onchange=$('#kelimeKapsam').onchange=()=>kelimeCiz(P().bolumler.filter(gorunurBolum));
$('#haritaIndir').onclick=()=>{const K=siraliKodlar();if(!K.length)return;const B=P().bolumler.filter(gorunurBolum);const say=K.map(k=>{const L=B.filter(x=>x.k===k.id);return {k,n:L.length}});indir(dosyaAd(P().ad)+'-kod-haritasi.svg',new Blob([haritaSvg(K,say,esGorunum(B,K),true)],{type:'image/svg+xml'}))};
['#uA','#uB','#uBirim'].forEach(s=>$(s).onchange=cizUyum);$('#uBirlestir').onclick=kodlayiciBirlestir;
$('#yontemKopya').onclick=()=>kopyala(yontemMetni().join('\n\n')+'\n\n'+ga('yontem','kaynakca')+'\n'+kaynakcaListesi().join('\n'));
$('#rWord').onclick=()=>{cizUyum();indir(dosyaAd(P().ad)+'-rapor.docx',wordRapor())};
$('#rCsv').onclick=()=>indir(dosyaAd(P().ad)+'-kodlamalar.csv',csv(bolumSatirlari([...P().bolumler].sort((a,b)=>a.b.localeCompare(b.b)||a.s-b.s))));
$('#rKitapCsv').onclick=()=>indir(dosyaAd(P().ad)+'-kod-kitabi.csv',csv([[t('colCode'),t('csvPath'),t('parent'),t('definition'),t('codeMemo'),t('colSegs'),t('colDocs')],...siraliKodlar().map(k=>{const L=P().bolumler.filter(x=>x.k===k.id);return [k.ad,kodYolu(k.id),k.ust?(kod(k.ust)||{}).ad:'',k.tanim||'',k.not||'',L.length,new Set(L.map(x=>x.b)).size]})]));

/* okuyucu: fare, dokunmatik ve klavye ile seçim */
const okE=$('#okuyucu');let isaretci=false;const okIcinde=n=>n instanceof Node&&okE.contains(n);
function secimBitti(e){setTimeout(()=>{if(kutuAcik())return;const s=secimAl();if(s){S.secim=s;kutuAc(s.rect);return}
  const sp=e&&e.target&&e.target.closest&&e.target.closest('[data-seg]');if(sp&&getSelection().isCollapsed){S.noktaBolumler=sp.dataset.seg.split(',');cizAyrinti();if(innerWidth<1280)$('#ayrinti').scrollIntoView({block:'start',behavior:'smooth'})}},0)}
okE.addEventListener('pointerdown',()=>{isaretci=true;if(kutuAcik())kutuKapat()});
addEventListener('pointerup',e=>{if(isaretci){isaretci=false;if(okIcinde(e.target)||okIcinde(getSelection().anchorNode))secimBitti(e)}});
okE.addEventListener('keyup',e=>{if(e.shiftKey)secimBitti(e)});
let secZ;document.addEventListener('selectionchange',()=>{if(S.sekme!=='kod'||isaretci)return;clearTimeout(secZ);secZ=setTimeout(()=>{if(!kutuAcik()&&okIcinde(getSelection().anchorNode))secimBitti(null)},550)});
$('#kkAra').addEventListener('input',()=>{kkSecili=0;kutuListe()});
$('#kkAra').addEventListener('keydown',e=>{const L=$$('#kkListe button');
  if(e.key==='Escape'){kutuKapat();return}
  if(!$('#kkAra').value&&/^[1-9]$/.test(e.key)){const b=L[+e.key-1];if(b&&b.dataset.uygula){e.preventDefault();uygula(b.dataset.uygula)}return}
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();kkSecili=(kkSecili+(e.key==='ArrowDown'?1:-1)+L.length)%Math.max(1,L.length);L.forEach((b,i)=>b.classList.toggle('menu-active',i===kkSecili));L[kkSecili]&&L[kkSecili].scrollIntoView({block:'nearest'})}
  if(e.key==='Enter'){e.preventDefault();const b=L[kkSecili]||L[0];const q=$('#kkAra').value.trim();if(b&&b.dataset.uygula)uygula(b.dataset.uygula);else if(q)uygula(null,q)}});
document.addEventListener('mousedown',e=>{if(kutuAcik()&&!e.target.closest('#kodKutu')&&!okIcinde(e.target))kutuKapat()});
document.addEventListener('keydown',e=>{const yaz=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);if(yaz||$('#pencere').open)return;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.shiftKey){e.preventDefault();geriAl()}
  else if((e.ctrlKey||e.metaKey)&&(e.key.toLowerCase()==='y'||(e.key.toLowerCase()==='z'&&e.shiftKey))){e.preventDefault();yinele()}});
let boyZ;addEventListener('resize',()=>{clearTimeout(boyZ);boyZ=setTimeout(()=>{if(S.sekme==='kod')cizOkuyucu()},150)});

/* ====================== BAŞLAT ====================== */
(async function(){
  try{Object.assign(DILLER,JSON.parse(ls.al(KAYIT+'.diller')||'{}'))}catch(_){}
  const d=ls.al(KAYIT+'.dil'),nl=(navigator.language||'tr').slice(0,2);S.dil=d&&DILLER[d]?d:(DILLER[nl]?nl:'en');
  const tm=ls.al(KAYIT+'.tema');if(tm==='masa-gece'||(!tm&&matchMedia('(prefers-color-scheme: dark)').matches))$('#temaSec').checked=true;
  if(window.pdfjsLib)try{pdfjsLib.GlobalWorkerOptions.workerSrc='';}catch(_){}
  await VT.ac();S.P=(await projeYukle())||bosProje();S.secKod=new Set(P().kodlar.map(k=>k.id));
  metinleriYaz();sekmeAc('giris');gecmisDugme();if(!P().kodlayici)adSor()})();
