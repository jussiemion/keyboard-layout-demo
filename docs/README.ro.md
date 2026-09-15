# Aranjament tipografic de Semyon Yushkevich

**[Deschide demo-ul](https://jussiemion.github.io/keyboard-layout-demo/)**

Încearcă simboluri tipografice, diacritice și schimbarea limbilor direct în
browser, fără instalare sau cont. Poți folosi tastatura fizică sau tastele de pe
ecran.

<div align="center" dir="ltr">

<strong>Alte limbi</strong>

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
> Aranjamentul este destinat în primul rând limbilor europene. Suportul pentru
> alte limbi, inclusiv arabă, ebraică, turcă și vietnameză, este experimental:
> caracterele și metodele de introducere pot să nu acopere toate convențiile
> lingvistice.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/demo-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="assets/demo-light.png">
  <img src="assets/demo-dark.png" alt="Aranjament tipografic de Semyon Yushkevich" width="1280">
</picture>

[Video: tema întunecată](assets/demo-dark.mp4) ·
[tema luminoasă](assets/demo-light.mp4) · MP4 · ≈ 26 s

> [!IMPORTANT]
>
> **Dezactivează dispunerea tipografică din sistem înainte de testare**: poate
> intercepta <kbd>Alt</kbd> și <kbd>Caps Lock</kbd>. Avertizarea apare numai
> după indicii clare în evenimentele de tastatură; absența ei nu dovedește că
> dispunerea este inactivă.

## Primele caractere

**Apoi** înseamnă apăsare și eliberare înainte de următoarea tastă; **+**,
menținere împreună. Pozițiile sunt US QWERTY; pe macOS <kbd>Alt</kbd> este
<kbd>Option</kbd>.

| Apasă                                                  | Rezultat |   Mod    |
| ------------------------------------------------------ | :------: | :------: |
| <kbd>Alt</kbd>, apoi <kbd>C</kbd>                      |   `©`    | **`M1`** |
| <kbd>Alt</kbd>, apoi <kbd>Alt</kbd>, apoi <kbd>C</kbd> |   `¢`    | **`M2`** |
| <kbd>Alt</kbd> + <kbd>-</kbd>                          |   `—`    | **`M0`** |
| <kbd>Alt</kbd> + <kbd>/</kbd>                          |   `…`    | **`M0`** |
| <kbd>Alt</kbd> + <kbd>,</kbd>                          |   `«`    | **`M0`** |
| <kbd>Alt</kbd> + <kbd>.</kbd>                          |   `»`    | **`M0`** |

**`S` — Switcher**: comutator de limbă (**`S0`–`S4`**). **`M` — Modifier**:
modificator al modului de tastare (**`M0`–`M2`**).

**`M0`** este scrierea obișnuită. **`M1`** și **`M2`** aleg un strat de
simboluri pentru următoarea intrare. Nu există limită de timp. <kbd>Esc</kbd>
anulează semnul în așteptare.

> [!TIP]
>
> Din meniu poți porni turul ghidat. Dacă știi deja
> [dispunerea Birman](https://ilyabirman.ru/typography-layout/), poți sări peste
> cele trei exerciții introductive. Testul final este opțional; închiderea prin
> cruce este disponibilă oricând. Butonul cu carte deschide fișa de referință.

## Diacritice

Harta română este QWERTY Programmer. După o literă eliberată, apasă și
eliberează <kbd>Shift</kbd>: `a → ă → â → a`, `i → î → i`, `s → ș → s`,
`t → ț → t`. Majusculele se păstrează; <kbd>Shift</kbd> ținut cu litera
funcționează normal. Ș și ț folosesc virgula dedesubt.

Pentru accent acut: <kbd>Alt</kbd>, <kbd>Alt</kbd>, <kbd>/</kbd>, apoi vocala.

## Limbi și setări

| Poziție  | Apasă                               | Rezultat                           |
| :------: | ----------------------------------- | ---------------------------------- |
| **`S0`** | <kbd>Caps Lock</kbd>                | Comută între două limbi principale |
| **`S1`** | <kbd>Caps Lock</kbd> + <kbd>J</kbd> | Limba atribuită 1                  |
| **`S2`** | <kbd>Caps Lock</kbd> + <kbd>K</kbd> | Limba atribuită 2                  |
| **`S3`** | <kbd>Caps Lock</kbd> + <kbd>L</kbd> | Limba atribuită 3                  |
| **`S4`** | <kbd>Caps Lock</kbd> + <kbd>;</kbd> | Limba atribuită 4                  |

Atribuie cele șase limbi în **Meniu → Setări** și **salvează**. Cele două
opțiuni **`S0`** trebuie să fie diferite; celelalte se pot repeta. Limba
**interfeței** selectează și tastatura corespunzătoare. Selectorul **deasupra
tastaturii** schimbă doar tastatura, nu limba sistemului sau textul.

Ține apăsate ambele <kbd>Ctrl</kbd> și eliberează-le pentru a activa sau
dezactiva tipografia. <kbd>Caps Lock</kbd> continuă să schimbe limbile.

<details>
<summary>Toate variantele</summary>

Interfața și documentația acoperă 14 limbi, iar tastatura oferă 24 de opțiuni.
Variantele engleze pentru Australia, Nigeria, Noua Zeelandă, Singapore, SUA și
Zimbabwe folosesc aceeași referință US QWERTY. Spaniola (Mexic), portugheza
(Brazilia, ABNT2), franceza (Canada) și germana (Elveția) au hărți distincte.
Toate opțiunile pot fi atribuite `S0`–`S4`; variantele împart interfața și
documentația limbii de bază.

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

[Documentație tehnică în engleză](national-layouts.md)

</details>

## Căutare și aspect

Lupa din antet, <kbd>Ctrl</kbd> + <kbd>F</kbd> deschid căutarea locală. Caută
după nume, caracter, cod precum `U+0024`, limbă sau țară. Sunt tolerate mici
greșeli de scriere.

- **Caută un simbol:** <kbd dir="ltr">Ctrl</kbd> + <kbd dir="ltr">F</kbd> /
  <kbd dir="ltr">Caps Lock</kbd> + <kbd dir="ltr">F</kbd>.
- **Fișă de referință:** <kbd dir="ltr">Ctrl</kbd> + <kbd dir="ltr">H</kbd> /
  <kbd dir="ltr">Caps Lock</kbd> + <kbd dir="ltr">H</kbd>.

Meniul oferă teme luminoasă și întunecată. Linux/Windows/macOS schimbă aspectul
tastaturii, nu dispunerea sistemului.

Aplicația nu salvează și nu transmite textul sau căutările. Preferințele rămân
în browser. Fonturile sunt incluse în site.

## Dezvoltare și feedback

[Trimite feedback](https://github.com/jussiemion/keyboard-layout-demo/issues)

[Documentație tehnică în engleză](development.md) ·
[GitHub](https://github.com/jussiemion/keyboard-layout-demo)

Autor: **Semyon Yushkevich (jussiemion)**. Harta simbolurilor se bazează pe
[dispunerea Ilya Birman 3.9](https://ilyabirman.ru/typography-layout/).
Contribuțiile originale ale autorului sunt sub [MIT](../LICENSE);
[materialele terților](../THIRD_PARTY_NOTICES.md) au condiții separate.
