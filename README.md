
> Diese Seite bei [https://calliope-net.github.io/mkc-63/](https://calliope-net.github.io/mkc-63/) öffnen

## Als Erweiterung verwenden

Dieses Repository kann als **Erweiterung** in MakeCode hinzugefügt werden.

* öffne [https://makecode.calliope.cc/](https://makecode.calliope.cc/)
* klicke auf **Neues Projekt**
* klicke auf **Erweiterungen** unter dem Zahnrad-Menü
* nach **https://github.com/calliope-net/mkc-63** suchen und importieren

### Calliope v3 PINs

Steckverbinder|Bezeichnung v3|Blöcke v3|digital|analog out|analog in
---|---|---|---|---|---
1|VCC|3.3V
2|GND|GND
3|PAD1|P1|v3 v1|v3 v1|v3 v1
4|PAD0|P0|v3 v1|v3|v3
5|PAD3|P3|v3 v1|v3|-
6|PAD2|P2|v3 v1|v3 v1|v3 v1
7|BTN_A|C5|v3 v1|v3 v1|v1
13|BTN_B|C11|v3 v1|v3|-
8|COLR1|C4|v3 v1|v3 v1|v3 v1
9|COLR2|C7|v3 v1|v3|-
10|COLR4|C6|v3 v1|v3 v1|v1
14|COLR5|C10|v3 v1|v3|v3
22|COLR3|C18|v3 v1|v3|v3
11|GPIO2|C9 frei|v3 v1|v3|-
12|GPIO1|C8 frei|v3 v1|v3|-
16|GPIO4|C12 Jacdac|v3 v1|v3|-
19|GPIO3|**C17** TX|v3 v1|v3 v1|v1
20|GROVE_Analogin|**C16** RX|v3 v1|v3 v1|v3 v1
15|SPI_EXT_SCK|C13|v3|v3|-
17|SPI_EXTMOSI|C15|v3|v3|-
18|SPI_EXT_MISO|C14|v3|v3|-
21|I2C_EXT_SCL|**C19**
24|I2C_EXT_SDA|**C20**
23|GND|
_|RGB|
_|MIC|||v1|v1
25|MOTOR_B+|M1
26|MOTOR_A+|M0
27|MOTOR_B-|M1
28|MOTOR_A-|M0
29|GND|
30|VM_IN (+9V)


#### Metadaten (verwendet für Suche, Rendering)

* for PXT/calliopemini
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
