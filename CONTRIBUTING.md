# Katkı rehberi / Contributing guide

## Türkçe

### Yeni bir dil eklemek

Kodlama Masası'nın bütün metinleri `diller/` klasöründeki JSON dosyalarındadır. Yeni bir dil eklemek için programlama bilmeniz gerekmez.

1. `diller/en.json` dosyasını kopyalayın ve dilinizin kısa koduyla adlandırın, örneğin `diller/de.json` (Almanca) ya da `diller/az.json` (Azerbaycan Türkçesi).
2. Dosyanın başındaki üç alanı doldurun:
   - `"_kod"`: dil kodu, dosya adıyla aynı (`"de"`).
   - `"_ad"`: dilin kendi dilindeki adı (`"Deutsch"`).
   - `"_cevirmen"`: adınız.
3. Yalnızca **değerleri** çevirin; anahtarlara (iki nokta üst üsteden önceki kısım) dokunmayın.
4. `{0}`, `{1}` gibi yer tutucuları çeviride aynen koruyun; sırası değişebilir.
5. `helpBody` ve `ipucu` içindeki metinlerde yalnızca şu biçim etiketleri kullanılabilir: `<p>`, `<b>`, `<strong>`, `<i>`, `<em>`, `<ol>`, `<ul>`, `<li>`, `<br>`, `<code>`, `<kbd>`. Diğer etiketler güvenlik nedeniyle düz metne çevrilir.
6. `stop` alanına dilinizin bağlaç, edat gibi anlamsız sözcüklerini boşlukla ayırarak yazın. Sözcük sıklığı bunları saymaz.
7. Çevirmediğiniz anahtarlar İngilizce görünür; bu yüzden çeviriyi parça parça da gönderebilirsiniz.

### Göndermek

- GitHub kullanıyorsanız dosyayı `diller/` klasörüne ekleyip bir *pull request* açın.
- GitHub kullanmıyorsanız dosyayı geliştiriciye e-postayla gönderin.

Onaylanan diller bir sonraki sürümde araca gömülür. Gömülene kadar herkes aracın **Proje > Dil dosyası yükle** menüsüyle dosyayı kendisi ekleyebilir.

### Denemek

Dosyanızı göndermeden önce aracı açın, **Proje > Dil dosyası yükle** ile seçin ve sekmeleri gezin. Taşan ya da yanlış duran metinleri düzeltin.

### Aracı derlemek

```
npm install
python3 build.py          # dist/kodlama-masasi.html
python3 build.py --pdfsiz # PDF desteği olmadan, daha küçük dosya
```

## English

### Adding a new language

All texts of Coding Desk live in the JSON files in the `diller/` folder. You do not need to know programming.

1. Copy `diller/en.json` and name it with your language code, for example `diller/de.json`.
2. Fill in the three fields at the top: `"_kod"` (language code, same as the file name), `"_ad"` (the language name in that language) and `"_cevirmen"` (your name).
3. Translate the **values** only; do not change the keys.
4. Keep placeholders such as `{0}` and `{1}`; their order may change.
5. In `helpBody` and `ipucu`, only these tags are allowed: `<p>`, `<b>`, `<strong>`, `<i>`, `<em>`, `<ol>`, `<ul>`, `<li>`, `<br>`, `<code>`, `<kbd>`. Other tags are turned into plain text for security.
6. Put the function words of your language in `stop`, separated by spaces, so word frequency ignores them.
7. Missing keys fall back to English, so partial translations are welcome.

Open a pull request adding your file to `diller/`, or e-mail it to the developer. Accepted languages are bundled in the next release. Until then anyone can add the file through **Project > Load language file**.
