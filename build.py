#!/usr/bin/env python3
"""Kodlama Masası derleyici: sablon.html + stil.css + js/*.js + diller/*.json + pdf.js -> dist/kodlama-masasi.html"""
import json,glob,os,subprocess,sys
K=os.path.dirname(os.path.abspath(__file__))
def oku(p): return open(os.path.join(K,p),encoding='utf-8').read()
subprocess.run(['npx','@tailwindcss/cli','-i','stil.css','-o','dist/stil.css','--minify'],cwd=K,check=True,capture_output=True)
css=oku('dist/stil.css')
diller={}
for f in sorted(glob.glob(os.path.join(K,'diller','*.json'))):
    d=json.load(open(f,encoding='utf-8'))
    assert d.get('_kod') and d.get('_ad'), f
    diller[d['_kod']]=d
js='\n'.join(oku(os.path.relpath(f,K)) for f in sorted(glob.glob(os.path.join(K,'js','*.js'))))
pdf=''
if '--pdfsiz' not in sys.argv:
    b=os.path.join(K,'node_modules','pdfjs-dist','build')
    w=open(os.path.join(b,'pdf.worker.min.js'),encoding='utf-8').read().replace('</script','<\\/script')
    l=open(os.path.join(b,'pdf.min.js'),encoding='utf-8').read().replace('</script','<\\/script')
    pdf=f'<script>{w}</script>\n<script>{l}</script>'
s=oku('sablon.html')
for a in ['/*__CSS__*/','/*__DILLER__*/{}','//__JS__','<script>//__PDFJS__</script>']: assert s.count(a)==1,a
djson=json.dumps(diller,ensure_ascii=False).replace('</','<\\/')
s=s.replace('/*__CSS__*/',css).replace('/*__DILLER__*/{}',djson).replace('//__JS__',js.replace('</script','<\\/script')).replace('<script>//__PDFJS__</script>',pdf)
os.makedirs(os.path.join(K,'dist'),exist_ok=True)
open(os.path.join(K,'dist','kodlama-masasi.html'),'w',encoding='utf-8').write(s)
open(os.path.join(K,'index.html'),'w',encoding='utf-8').write(s)  # GitHub Pages
print('diller:',','.join(diller),'| boyut:',round(len(s.encode())/1024),'KB')
