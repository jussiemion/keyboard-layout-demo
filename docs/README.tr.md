# Semyon Yushkevich tarafından geliştirilen tipografik klavye düzeni

**[Demoyu açın](https://jussiemion.github.io/keyboard-layout-demo/)**

Tipografik simgeleri, aksanları ve dil geçişlerini tarayıcıda deneyin. Kurulum
veya hesap gerekmez. Fiziksel klavyeyi ve ekran tuşlarını kullanabilirsiniz.

<div align="center" dir="ltr">

<strong>Diğer diller</strong>

<a href="../README.md"><span dir="auto">English</span></a> ·
<a href="README.ru.md"><span dir="auto">Русский</span></a> ·
<a href="README.pl.md"><span dir="auto">Polski</span></a> ·
<a href="README.pt.md"><span dir="auto">Português</span></a> ·
<a href="README.es.md"><span dir="auto">Español</span></a> ·
<a href="README.de.md"><span dir="auto">Deutsch</span></a> ·
<a href="README.fr.md"><span dir="auto">Français</span></a> ·
<a href="README.it.md"><span dir="auto">Italiano</span></a> ·
<a href="README.nl.md"><span dir="auto">Nederlands</span></a> ·
<a href="README.ro.md"><span dir="auto">Română</span></a> ·
<a href="README.ar.md"><span dir="auto">العربية</span></a> ·
<a href="README.he.md"><span dir="auto">עברית</span></a> ·
<a href="README.tr.md"><span dir="auto">Türkçe</span></a> ·
<a href="README.vi.md"><span dir="auto">Tiếng Việt</span></a>

</div>

> [!NOTE]
>
> Düzen öncelikle Avrupa dillerine yöneliktir. Arapça, İbranice, Türkçe ve
> Vietnamca dahil diğer dillerin desteği deneyseldir: karakter kapsamı ve giriş
> yöntemleri tüm dil kurallarını karşılamayabilir.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/demo-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="assets/demo-light.png">
  <img src="assets/demo-dark.png" alt="Semyon Yushkevich tarafından geliştirilen tipografik klavye düzeni" width="1280">
</picture>

[Video: koyu tema](assets/demo-dark.mp4) · [açık tema](assets/demo-light.mp4) ·
MP4 · ≈ 26 s

> [!IMPORTANT]
>
> **Demoyu kullanmadan önce işletim sistemindeki tipografik düzeni kapatın.**
> <kbd>Alt</kbd> veya <kbd>Caps Lock</kbd> tarayıcıya ulaşmadan yakalanabilir.
> Uyarı yalnız belirgin olaylardan sonra çıkar; uyarının yokluğu düzenin kapalı
> olduğunu kanıtlamaz.

## İlk simgeler

Sıralı girişte <kbd>Alt</kbd> tuşunu sonraki tuştan önce bırakın. `+` birlikte
basılan tuşları gösterir. macOS'ta <kbd>Alt</kbd> yerine <kbd>Option</kbd>
kullanılır. Harf adları, seçili dildeki etiketten bağımsız fiziksel QWERTY
konumlarıdır.

| Basın                                                          | Sonuç |   Mod    |
| -------------------------------------------------------------- | :---: | :------: |
| <kbd>Alt</kbd>, ardından <kbd>C</kbd>                          |  `©`  | **`M1`** |
| <kbd>Alt</kbd>, ardından <kbd>Alt</kbd>, ardından <kbd>C</kbd> |  `¢`  | **`M2`** |
| <kbd>Alt</kbd> + <kbd>-</kbd>                                  |  `—`  | **`M0`** |
| <kbd>Alt</kbd> + <kbd>/</kbd>                                  |  `…`  | **`M0`** |
| <kbd>Alt</kbd> + <kbd>,</kbd>                                  |  `«`  | **`M0`** |
| <kbd>Alt</kbd> + <kbd>.</kbd>                                  |  `»`  | **`M0`** |

**`M0`** normal yazımdır; **`M1`** ve **`M2`** sonraki giriş için simge
katmanını seçer. Basışlar arasında süre sınırı yoktur. <kbd>Esc</kbd> bekleyen
simgeyi veya aksanı iptal eder. Klavyenin üstündeki `M0`/`M1`/`M2` düğmeleri de
mod seçer.

> [!TIP]
>
> Basışlar arasında süre sınırı yoktur. <kbd>Esc</kbd> bekleyen simgeyi veya
> aksanı iptal eder. Klavyenin üstündeki `M0`/`M1`/`M2` düğmeleri de mod seçer.
> Kitap düğmesi kısa başvuruyu açar.

## Aksanlar

Türkçe harita **Türkçe Q**, XKB `tr(basic)` referansıdır; Türkçe F değildir.
`i/İ` ve `ı/I` doğru büyük/küçük harf çiftleridir.

Harfi yazıp bıraktıktan sonra <kbd>Shift</kbd> tuşuna basıp bırakarak
varyantları dolaşın: `c → ç → c`, `g → ğ → g`, `i → ı → i`, `o → ö → o`,
`s → ş → s`, `u → ü → u`. Büyük harfler korunur.

<kbd>Alt</kbd>, <kbd>Alt</kbd>, fiziksel <kbd>/</kbd> konumu sonraki ünlü için
vurgu hazırlar.

## Diller ve ayarlar

|   Yuva   | Basın                               | Sonuç                      |
| :------: | ----------------------------------- | -------------------------- |
| **`S0`** | <kbd>Caps Lock</kbd>                | İki ana dil arasında geçiş |
| **`S1`** | <kbd>Caps Lock</kbd> + <kbd>J</kbd> | Atanan dil 1               |
| **`S2`** | <kbd>Caps Lock</kbd> + <kbd>K</kbd> | Atanan dil 2               |
| **`S3`** | <kbd>Caps Lock</kbd> + <kbd>L</kbd> | Atanan dil 3               |
| **`S4`** | <kbd>Caps Lock</kbd> + <kbd>;</kbd> | Atanan dil 4               |

**Menü → Ayarlar** içinde altı dili atayın ve **kaydedin**. İki **`S0`**
seçeneği farklı olmalıdır; diğerleri tekrarlanabilir. **Arayüz dilini** seçmek
klavyeyi de o dile geçirir. **Klavye üzerindeki seçici** yalnız klavyeyi
değiştirir; sistem dili ve mevcut metin değişmez.

İki <kbd>Ctrl</kbd> tuşunu birlikte tutup bırakmak tipografiyi açar veya
kapatır. <kbd>Caps Lock</kbd> dil değiştirmeyi sürdürür.

<details>
<summary>Tüm seçenekler</summary>

Arayüz ve kullanıcı belgeleri **14 dilde**, klavye **24 seçenekte** sunulur.
Diller: İngilizce, Rusça, Lehçe, Fransızca, Almanca, İspanyolca, Portekizce,
İtalyanca, Rumence, İbranice, Arapça, Türkçe, Vietnamca ve Felemenkçe.

İngilizcenin Avustralya, Nijerya, Yeni Zelanda, Singapur, ABD ve Zimbabve
seçenekleri aynı US QWERTY haritasını kullanır. Meksika İspanyolcası Latin
Amerika, Brezilya Portekizcesi ABNT2, Kanada Fransızcası Kanada Fransızca ve
İsviçre Almancası İsviçre QWERTZ haritalarını kullanır. Bunlar klavye
seçenekleridir; ayrı arayüz çevirileri değildir.

<div dir="ltr" align="left">

- `en`
- `ru`
- `pl`
- `pt`
- `es`
- `de`
- `de-CH`
- `en-AU`
- `en-NG`
- `en-NZ`
- `en-SG`
- `en-US`
- `en-ZW`
- `es-MX`
- `fr`
- `fr-CA`
- `it`
- `nl`
- `pt-BR`
- `ro`
- `ar`
- `he`
- `tr`
- `vi`

</div>

[İngilizce teknik belgeler](national-layouts.md)

</details>

## Arama ve görünüm

Büyüteç, <kbd>Ctrl</kbd> + <kbd>F</kbd> simge aramasını açar. Ad, simge,
`U+0024` gibi Unicode kodu, dil veya ülke arayın. Arama 14 dilde çalışır ve
küçük yazım hatalarını tolere eder.

Menüden açık veya koyu tema seçilir. Linux/Windows/macOS klavyenin görünümünü
değiştirir; sistem düzenini değiştirmez.

Metin ve aramalar kaydedilmez veya gönderilmez. Tercihler tarayıcıda, yazı
tipleri sitenin içinde tutulur.

## Geliştirme ve geri bildirim

[Hata veya öneri bildirin](https://github.com/jussiemion/keyboard-layout-demo/issues):
sistem, tarayıcı, seçilen harita, sistem düzeninin durumu ve tam tuş sırası
yardımcı olur.

[İngilizce teknik belgeler](development.md) ·
[GitHub](https://github.com/jussiemion/keyboard-layout-demo)

Yazar: **Semyon Yushkevich (jussiemion)**. Simge haritası
[Ilya Birman 3.9](https://ilyabirman.ru/typography-layout/) düzenine dayanır.
Yazarın özgün katkıları [MIT](../LICENSE) lisanslıdır;
[üçüncü taraf malzemeler](../THIRD_PARTY_NOTICES.md) kendi koşullarını korur.
