# Kodlama Masası / Coding Desk

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24249693.svg)](https://doi.org/10.5281/zenodo.24249693)

Görüşme dökümleri, açık uçlu anket yanıtları ve belgeler için tarayıcıda çalışan, kurulumsuz, ücretsiz nitel kodlama aracı. Tek bir HTML dosyasıdır; internet bağlantısı kullanmaz, veriler bilgisayardan çıkmaz.

A free, install-free qualitative coding tool for interview transcripts, open-ended survey answers and documents. It is a single HTML file, works offline, and data never leaves your computer.

## Özellikler / Features

- Metin seçerek kodlama, alt kodlar ve temalar, sürükle bırak kod ağacı, kod tanımı ve notları
- .txt, .md, .docx ve .pdf içe aktarma; katılımcı bilgilerini Excel ya da CSV tablosundan alma
- Alıntıları koda, belgeye, katılımcı özelliğine ve kodlayıcıya göre süzme
- Kod sıklığı, kod ve belge matrisi, birlikte görünme, sözcük sıklığı, kod haritası (SVG)
- Kodlayıcılar arası uyum: Miles-Huberman, Cohen kappa, Krippendorff alfa; kör kodlama modu; ikinci kodlayıcı dosyası
- Ara ve toplu kodla, adları gizleme (anonimleştirme), geri al ve yinele, proje günlüğü (denetim izi)
- Word raporu, CSV, NVivo, MAXQDA ve ATLAS.ti ile REFI-QDA (.qdpx) alışverişi
- Türkçe ve İngilizce; topluluk yeni dil ekleyebilir (bkz. [CONTRIBUTING.md](CONTRIBUTING.md))

## Kullanım / Usage

- **Web'de aç / Open on the web:** https://behiccetin.github.io/kodlama-masasi/
- **İndir / Download:** [`kodlama-masasi.html`](https://github.com/behiccetin/kodlama-masasi/raw/main/dist/kodlama-masasi.html) dosyasını indirip çift tıklayın; internet gerekmez. / Download and double-click; no internet needed.

Web sürümü de verileri yalnızca tarayıcınızda tutar; hiçbir sunucuya gönderilmez. / The web version also keeps data in your browser only.

## Klasörler / Folders

| Klasör | İçerik |
|---|---|
| `sablon.html` | Arayüz iskeleti |
| `stil.css` | daisyUI 5 ve Tailwind 4 tema tanımları |
| `js/` | Uygulama kodu |
| `diller/` | Dil dosyaları (topluluk katkısına açık) |
| `build.py` | Hepsini tek HTML dosyasında birleştirir (`dist/` ve `index.html`) |

## Atıf / Citation

Kodlama Masası'nı kullandıysanız lütfen kaynak gösterin. Araçtaki **Atıf** düğmesi APA, ISNAD ve BibTeX biçimlerini verir; Word raporu da hazır bir yöntem paragrafı ve kaynakça içerir.

If you use Coding Desk, please cite it. The **Cite** button in the tool provides APA, ISNAD and BibTeX formats.

> Çetin, B. (2026). *Kodlama Masası* (Sürüm 2.0.1) [Bilgisayar yazılımı]. Zenodo. https://doi.org/10.5281/zenodo.24249693

- DOI, sürüm 2.0.1 / version 2.0.1: [10.5281/zenodo.24249693](https://doi.org/10.5281/zenodo.24249693)
- DOI, tüm sürümler / all versions: [10.5281/zenodo.24248756](https://doi.org/10.5281/zenodo.24248756)

## Lisans / License

MIT. Sistem mimarı ve geliştirici / System architect and developer: Öğr. Gör. Dr. Behiç ÇETİN.

PDF okuma için Mozilla pdf.js (Apache 2.0) kullanılır. / PDF reading uses Mozilla pdf.js (Apache 2.0).
