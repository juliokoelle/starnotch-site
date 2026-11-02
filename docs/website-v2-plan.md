# Website v2: Plan

Stand: 2. November 2026. Nur Planung, die Live-Seite bleibt unverändert. `main` geht direkt auf starnotch.app, deshalb wird v2 auf einem eigenen Branch gebaut und auf einer separaten Preview-URL gezeigt.

**Ausgangslage.** Heute gibt es eine lange Startseite (Notch-Demo, Warteliste mit Referral, Kacheln, Feature-Liste, Install, FAQ) plus `whats-new/`, `privacy.html` und `imprint.html`. Designsprache: Nachthimmel mit Tara als hellstem Stern, dunkel mit Hell-Umschalter, Systemschrift, ein Akzent (`#4C8DFF`). Erzählt wird fast nur die Notch, vor allem für Entwickler. Tara steht am Rand, den Brain zeigt die Seite gar nicht.

**Ziel v2.** Starnotch in drei Ebenen für alle zeigen: **Notch, Tara, Brain**. Dazu eine Entwicklerseite, Vertrauensseiten, ein Integrationsverzeichnis und Docs. Foundable ist nur Maßstab für Umfang und Tiefe, nicht für Look oder Text.

---

## 1. Sitemap

| Pfad | Aufgabe der Seite |
|---|---|
| `/` | In 60 Sekunden verstehen, was Starnotch ist (Notch, Tara, Brain), das Produkt sehen und auf die Warteliste kommen. `/?ref=` muss weiter funktionieren. |
| `/notch` | Alles, was in der Notch passiert: Agenten, Kalender und Today, Now Playing, Teleprompter, All tools. |
| `/tara` | Taras Gedächtnis: was sie sich merkt, Ask Tara mit Quellen, Kontrolle (Pause, Quellen, Löschen), MCP für andere KI-Apps. |
| `/brain` | Das Dashboard: Tageszusammenfassung, Memory Map, Personen und Projekte, Integrationen, Charaktere. |
| `/developers` | Für Entwickler: Agenten, Approvals, Status-API, MCP, Open Source, Installation. |
| `/plans` | Free, Pro und Max ehrlich nebeneinander, Founding-Preis für die Warteliste. |
| `/integrations` (+ `/integrations/<slug>`) | Verzeichnis: was sich womit verbindet und welche Daten wohin fließen. |
| `/security` | Wo deine Daten liegen, als Schichtendiagramm. |
| `/security/subprocessors` | Liste aller Dienstleister, die für uns Daten verarbeiten. |
| `/ai` | KI-Offenlegung: wann KI arbeitet, mit welchem Anbieter, was gesendet wird. |
| `/legal` | Hub: Datenschutz, Impressum, Subprozessoren, Lizenzen, später AGB. |
| `/privacy`, `/imprint` | Bleiben unter diesen URLs (bestehende Links). |
| `/docs` (+ `/llms.txt`) | Hilfe und Referenz, auch maschinenlesbar. |
| `/whats-new` | Changelog, bleibt wie er ist, bekommt einen RSS-Feed. |
| `/compare/<slug>` | Später: ehrliche Vergleiche, z. B. mit anderen Notch-Apps oder Meeting-Memory-Tools. |

Navigation: Notch · Tara · Brain · Developers · Plans · Docs, dazu „Join waitlist“.

## 2. Startseite

Grundsatz: **zuerst das Produkt, dann die Bitte.** Im Hero steht kein Formular. Die Warteliste ist trotzdem überall einen Klick entfernt (Button im Hero, in der Leiste, eigener Abschnitt).

1. **Hero.** Eine Headline, die nicht nur Entwickler meint (Richtung: „Dein Mac, mit einem Gedächtnis.“ oder „Alles, was zählt, oben am Bildschirm.“). Darunter direkt die interaktive Notch-Demo, die es schon gibt („Give it a try“). Buttons: **Join the waitlist** (primär) und „Für Entwickler“. Eine Zeile: „Kostenlos, Kern Open Source, macOS 14+“. Die aktuelle Headline „Know the moment an agent needs you“ wandert auf `/developers`.
2. **Drei Ebenen in einer Zeile.** Notch, Tara, Brain, je ein Satz und ein kleines Bild, verlinkt auf die Unterseiten. Hier wird die Struktur sofort klar.
3. **Notch.** Zwei Spalten: „Für deine Agenten“ (Approvals, Fragen beantworten, Inbox) und „Für deinen Tag“ (Today mit Losgehzeit, Kalender, Now Playing, Teleprompter, All tools). Die bestehenden Kacheln werden wiederverwendet und gekürzt.
4. **Tara.** Ein Ask-Tara-Beispiel mit sichtbarer Quelle („Weekly Sync, 21. Okt“), die Gedächtnis-Schalter und die MCP-Zeile („Ihr Gedächtnis auch in Claude, ChatGPT und Cursor, nur lesend“).
5. **Brain.** Echte Screenshots vom Dashboard: Tageszusammenfassung, Memory Map, Personen und Projekte. Die gibt es heute noch nicht auf der Seite, sie werden in Phase 2 erstellt.
6. **Privatsphäre-Band.** Das Mini-Schichtendiagramm (Mac → gewählter KI-Anbieter → deine KI-Apps), verlinkt auf `/security`.
7. **Pläne-Teaser.** Drei Karten Free/Pro/Max, Link auf `/plans`.
8. **Warteliste.** Der bestehende Abschnitt mit Formular, Platz, Referral-Link und Teilen, inhaltlich unverändert.
9. **FAQ, gekürzt.** Höchstens sechs Fragen, der Rest kommt in die Docs.

## 3. Seite für Entwickler (`/developers`)

- **Hero:** „Know the moment an agent needs you.“ mit der Agenten-Demo (Approval, Frage mit Optionen, Inbox).
- **Agenten:** Claude Code, Codex, Cursor, Copilot CLI, Gemini CLI, opencode. Eine Tabelle, welcher Agent was kann (Sessions, Approvals, Fragen). Die 60-Sekunden-Regel: Ohne Antwort fragt der Agent wie gewohnt in seinem eigenen Fenster.
- **Für eigene Skripte:** Status-API (`POST 127.0.0.1/status`), MCP-Server, Loops, Character Packs. Code-Beispiele zum Kopieren, Links in die Docs.
- **GitHub:** Repo, Lizenz (Kern Apache 2.0, Tara und die Katze all rights reserved), wie man beiträgt, die letzten Commits (dieselbe GitHub-API-Abfrage wie heute).
- **Installation:** heute aus dem Quellcode bauen (bestehender Block). **Homebrew** (`brew install --cask starnotch`) erst zeigen, wenn signierte Builds und der Cask existieren. Bis dahin „bald“ ohne Befehl.
- **Roadmap für Entwickler:** Approvals am iPhone, Cloud-Sessions, SDKs für Agent-Frameworks, nur als „geplant“.

## 4. Pläne (`/plans`)

Drei Spalten, darunter eine Vergleichstabelle.

- **Free:** die ganze Mac-App, inklusive Dashboard und Tara mit 30 Tagen Gedächtnis. Kern Open Source (Apache 2.0). Ask Tara läuft mit deinem eigenen Claude- oder ChatGPT-Plan, API-Key oder Apple Intelligence.
- **Pro:** unbegrenztes Gedächtnis, Sync mit iPhone und weiteren Macs, Tara ohne eigenes KI-Abo.
- **Max:** mehr von Pro (was genau, siehe offene Fragen).

Preise stehen noch nicht fest. Bis dahin zeigt die Seite „Preis folgt, Founding-Preis für die Warteliste“ und als CTA die Warteliste. Darunter eine FAQ zu den Plänen: Was passiert nach 30 Tagen? Kann ich wechseln? Bleibt Free kostenlos?

## 5. Integrationsverzeichnis (`/integrations`)

Raster mit Filtern nach Kategorie und Plan. Jede Karte und jede Detailseite folgt demselben Schema: **was es tut · in welche Richtung die Daten fließen · was Starnotch speichert · Status (verfügbar / geplant) · Plan · Link in die Docs.**

Kategorien mit dem, was es heute gibt:
- **Coding-Agenten:** Claude Code, Codex, Cursor, GitHub Copilot CLI, Gemini CLI, opencode
- **Notizen:** Obsidian, Markdown-Ordner, Apple Notes
- **Meetings:** Jamie, Granola, Wispr Flow, Fathom, eigene Aufnahme
- **Kalender und Aufgaben:** Apple Kalender, Erinnerungen, Apple Karten (Losgehzeit)
- **Gesundheit:** Oura, WHOOP
- **Medien:** Apple Music, Spotify, Browser, LRCLIB (Lyrics)
- **KI-Anbieter für Tara:** Claude (eigener Plan oder API), ChatGPT über Codex, Apple Intelligence, einfache Regeln
- **Taras Gedächtnis in KI-Apps (MCP):** Claude Desktop, Claude Code, Cursor, ChatGPT
- **System:** Kurzbefehle, Wispr Flow (Diktat), Open-Meteo (Wetter)

Alles kommt aus einer Datei (`integrations.json`), damit Raster, Detailseiten und `/security` übereinstimmen.

## 6. Sicherheit, Subprozessoren, KI-Offenlegung

Regel: **nur Aussagen, die heute stimmen**, vor dem Launch gegen den App-Code geprüft. Was für Pro erst gebaut wird, steht als „geplant“ da, ohne Technikversprechen.

### `/security`: Schichtendiagramm

1. **Dein Mac.** Taras Gedächtnis liegt im App-Ordner auf deinem Mac. Session-Dateien der Agenten werden nur gelesen. Approvals laufen über einen lokalen Socket, den nur Prozesse deines Benutzers erreichen. Kein Konto, keine Telemetrie, kein Zugriff auf Schlüsselbund oder Cookies. Ausgeblendet beim Bildschirmteilen.
2. **Der KI-Anbieter, den du wählst.** Wenn Tara antwortet, bekommt dieser Anbieter deine Frage und die dafür nötigen Ausschnitte aus ihrem Gedächtnis. Mit Apple Intelligence oder „einfachen Regeln“ verlässt nichts den Mac.
3. **Deine KI-Apps über den lokalen MCP-Server.** Nur lesend, abgeschaltete Quellen bleiben außen vor. Was eine App nachschlägt, geht mit deinem Chat an deren Anbieter.
4. **Starnotch-Dienste.** Heute nur Website und Warteliste. Die Warteliste liegt bei Supabase in Frankfurt.

Darunter: **Wir trainieren nie mit Nutzerdaten.** Außerdem deine Kontrolle (Pause, Schalter pro Quelle, ausgeschlossene Apps, Löschen), Open Source zum Nachprüfen, saubere Deinstallation und ein Kontakt für Sicherheitsmeldungen (`security.txt`).

### `/security/subprocessors`: Tabelle

Spalten: Dienst · Zweck · Daten · Ort · seit.
- **Heute:** GitHub Pages (Hosting, USA), Umami Cloud (cookiefreie Besucherzählung), Supabase (Warteliste, Frankfurt, API-Gateway über Cloudflare), dazu der E-Mail-Versand für Double-Opt-in, sobald er feststeht.
- Nach dem Umzug kommt Cloudflare Pages als Hosting dazu und GitHub Pages fällt weg.
- **Getrennt aufgeführt**, weil keine Subprozessoren von uns: Dienste, die du selbst in der App verbindest (Anthropic, OpenAI, Apple, Meeting-Tools, LRCLIB, Open-Meteo, Apple Karten).
- Ein Änderungslog mit Datum am Ende der Seite.

### `/ai`: KI-Offenlegung

- Wo KI arbeitet: Ask Tara, Zusammenfassungen im Hintergrund, Meeting-Agent, Tageszusammenfassung im Brain.
- Welcher Anbieter: der, den du gewählt hast. Was gesendet wird: Frage plus Ausschnitte. Was nicht: alles andere.
- Wir trainieren nie mit Nutzerdaten.
- Antworten können falsch sein, deshalb zeigt Tara Quellen.
- KI entscheidet nichts allein: Approvals gibt es nur mit deinem Klick.
- Wenn Pro „Tara ohne eigenes Abo“ bringt, kommen dazu: Anbieter, Aufbewahrung, Training per Vertrag ausgeschlossen.

### `/legal`

Ein Hub mit Datenschutz, Impressum, Subprozessoren, Lizenzen (Apache 2.0 und Rechte an Tara und der Katze) und später AGB für Pro und Max.

## 7. Docs

Aufbau:
- **Start:** Installation, erster Start, Berechtigungen, Deinstallation
- **Notch:** Agenten, Approvals, Fragen, Inbox, Kalender und Today, Losgehzeit, Now Playing, Teleprompter, All tools, Tastenkürzel
- **Tara:** Gedächtnisquellen, Ask Tara, KI-Anbieter wählen, Taras Gedächtnis in anderen Apps (eine Anleitung pro Client), Privatsphäre-Einstellungen
- **Brain:** Dashboard, Tageszusammenfassung, Memory Map, Personen und Projekte, Integrationen, Charaktere
- **Entwickler:** Status-API, MCP-Referenz, Agent-Hooks, Character Packs, aus dem Quellcode bauen, Mitmachen
- **Pläne und Konto, Fehlerbehebung, FAQ**

Technik: Quellen in Markdown. Jede Seite gibt es auch als `.md` unter derselben URL. Dazu `/llms.txt` (Index) und `/llms-full.txt` (alles in einer Datei). Volltextsuche statisch mit Pagefind, ohne Server.

## 8. Hosting der Preview

| | Cloudflare Pages (Free) | Vercel Pro |
|---|---|---|
| Kosten | 0 € | ab 20 $ pro Person und Monat |
| Kommerzielle Nutzung | erlaubt | erlaubt (Hobby nicht) |
| Preview pro Branch | ja, eigene URL pro Branch | ja |
| Preview schützen | Cloudflare Access, bis 50 Nutzer kostenlos | Vercel-Login; Passwortschutz kostet extra |
| Statische Seite | passt genau | passt, Stärken bei Next.js und Server-Funktionen |

**Empfehlung: Cloudflare Pages.** Die Seite ist statisch, Cloudflare kostet nichts und erlaubt kommerzielle Nutzung. Vercel lohnt erst mit Server-Logik. Konditionen vor der Einrichtung nochmal prüfen.

**Einrichtung:** Ein Pages-Projekt mit diesem Repo verbinden. Production-Branch ist vorerst `website-v2`, nicht `main`. Dann eine Subdomain `preview.starnotch.app` (per CNAME) hinter Cloudflare Access. Über `_headers` bekommt die Preview `X-Robots-Tag: noindex`. Die Warteliste in der Preview zeigt auf eine Test-Tabelle, damit keine Testeinträge in der echten Liste landen.

**Später auf starnotch.app umstellen:**
1. Klären, wo die DNS-Zone von starnotch.app liegt. Für die Hauptdomain auf Pages muss die Zone bei Cloudflare liegen. Also alle Einträge übernehmen (auch MX für E-Mail) und die Nameserver umstellen. Vorher die TTL senken.
2. `website-v2` nach `main` mergen, im Pages-Projekt `main` als Production setzen, `starnotch.app` und `www` als Custom Domains hinzufügen.
3. Weiterleitungen in `_redirects` für alte Anker und URLs. Prüfen, dass `/?ref=` funktioniert.
4. GitHub Pages abschalten und `CNAME` entfernen.
5. Am selben Tag Datenschutzerklärung Abschnitt 2 (Hosting) und die Subprozessoren aktualisieren.
6. Rückweg, falls etwas schiefgeht: GitHub Pages wieder einschalten und DNS zurück auf GitHub.

## 9. Phasen

Aufwand: **S** bis 1 Tag, **M** 2 bis 4 Tage, **L** 1 bis 2 Wochen.

| Phase | Inhalt | Aufwand |
|---|---|---|
| 0 | Cloudflare Pages, Preview-Subdomain, Access, noindex, Test-Warteliste | S |
| 1 | Grundgerüst: statischer Generator (Vorschlag: Astro, statischer Export), gemeinsames Layout, Navigation, Footer, Tokens aus `shared/base.css`, Hell/Dunkel | M |
| 2 | Startseite neu, Screenshots vom Brain, Notch-Demo übernehmen | L |
| 3 | `/developers` und `/plans` | M |
| 4 | `/notch`, `/tara`, `/brain` | M |
| 5 | Sicherheit, Subprozessoren, KI-Offenlegung, Legal-Hub, Datenschutz-Update, Prüfung gegen den Code | M |
| 6 | Integrationsverzeichnis aus `integrations.json` | M |
| 7 | Docs, `llms.txt`, Suche | L |
| 8 | Umstellung auf starnotch.app | S |
| später | Vergleichsseiten, deutsche Version, RSS für What's new | je S |

Phase 2 bis 4 laufen parallel zu 5 und 6. Für den Launch reichen 0 bis 6 und 8, die Docs starten mit einer ersten Version.

## 10. Offene Fragen an die Gründer

1. **Positionierung:** Soll die Startseite für alle sprechen und Agenten nur als eine von mehreren Stärken zeigen? Oder bleibt die Notch für Agenten der Einstieg?
2. **Max:** Was genau ist „mehr von Pro“? Mehr KI-Nutzung, mehr Geräte, Team-Funktionen?
3. **30 Tage Free:** Wird älteres Gedächtnis gelöscht, ausgeblendet oder nur nicht mehr durchsucht? Das muss auf `/plans` und `/security` exakt stimmen.
4. **Pro-Technik:** Ist Sync Ende-zu-Ende-verschlüsselt? Welcher KI-Anbieter steckt hinter „Tara ohne eigenes Abo“, mit welcher Aufbewahrung? Das bestimmt Sicherheitsseite und Subprozessoren.
5. **Eigene Aufnahme (Reson8):** Haben wir den Vertrag mit Reson8 oder der Nutzer? Davon hängt ab, ob es ein Subprozessor ist.
6. **E-Mail-Versand** für Double-Opt-in und Launch: welcher Dienst?
7. **Homebrew und signierte Builds:** Wann? Erst dann zeigen wir einen Install-Befehl.
8. **„GitHub“ auf der Entwicklerseite:** Nur Repo und Open Source, oder ist eine GitHub-Integration (PRs, CI in der Notch) geplant?
9. **Sprache:** Erst nur Englisch, Deutsch später? Die App kann beides.
10. **Docs-Quelle:** Leben die Docs im App-Repo (näher am Code) oder in diesem Repo?
11. **DNS:** Wo liegt starnotch.app heute, und wer hat Zugriff?
12. **Vergleichsseiten:** Wollen wir Wettbewerber beim Namen nennen?
