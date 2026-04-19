# DIA Pipeline — Specifica operativa

> Pipeline di analisi del discorso didattico (Discursive Implementation Assessment).
> Progetto: Dottorato industriale Innovamat × UniPg — Pre-pilota (Fase 1)

---

## 1. Visione d'insieme

La pipeline prende in input file JSON di trascrizioni ASR e una guida docente Innovamat in PDF, e produce un memo di analisi dell'implementazione in formato `.md` e `.html`.

```
INPUT                                    OUTPUT
─────                                    ──────
N file JSON (trascrizioni ASR)    →      memo_sessione.md
1 file PDF (guida docente)        →      memo_sessione.html
1 file YAML (config indicatori)          feedback_docente.md

                    │
                    ▼

          ┌─────────────────┐
          │    Modulo 1      │  Script Python (deterministico)
          │  Ingest, Merge   │
          │  Clean, Pseudon. │
          └────────┬────────┘
                   │  transcript_clean.json + ingest_log.json
                   ▼
          ┌─────────────────┐
          │    Modulo 2      │  Script Python (deterministico)
          │  Quality Gate    │
          └────────┬────────┘
                   │  transcript_annotated.json + quality_report.md
                   ▼
          ┌─────────────────┐
          │    Modulo 3      │  Script Python + chiamata LLM
          │  Lesson Plan     │◄── guida docente (PDF)
          │  Alignment       │
          └────────┬────────┘
                   │  transcript_phased.json + alignment_report.md
                   ▼
          ┌─────────────────┐
          │    Modulo 4      │  Script Python (deterministico)
          │  Low-Inference   │◄── dia_indicators.yaml
          │  Indicators      │
          └────────┬────────┘
                   │  indicators_low.json
                   ▼
          ┌─────────────────┐
          │    Modulo 5      │  Script Python + chiamata LLM
          │  Medium-Inference│◄── dia_indicators.yaml + codebook
          │  Indicators      │
          └────────┬────────┘
                   │  question_labels.json
                   ▼
          ┌─────────────────┐
          │    Modulo 6      │  Script Python (deterministico)
          │  Synthesis &     │◄── tutti gli output precedenti
          │  Report          │
          └────────┬────────┘
                   │
                   ▼
          memo_sessione.md + memo_sessione.html + feedback_docente.md
```

### Tipi di componente

| Tipo | Moduli | Riproducibilità |
|------|--------|-----------------|
| **Script Python deterministico** | 1, 2, 4, 6 | Totale: stesso input → stesso output |
| **Script Python + LLM** | 3, 5 | Alta: prompt versionato, output in formato fisso |

---

## 2. Struttura del repository

```
dia-pipeline/
├── README.md
├── CLAUDE.md                    ← istruzioni persistenti per Claude Code
├── run_pipeline.py              ← orchestratore: esegue M1→M6 in sequenza
├── configs/
│   ├── dia_indicators.yaml      ← definizione indicatori (versionata)
│   ├── speaker_mapping.yaml     ← regole normalizzazione speaker
│   ├── cleaning_rules.yaml      ← regole pulizia testo
│   └── thresholds.yaml          ← soglie confidence, durata min turno, etc.
├── src/
│   ├── m1_ingest_merge_clean.py
│   ├── m2_quality_gate.py
│   ├── m3_lesson_alignment.py
│   ├── m4_low_inference.py
│   ├── m5_medium_inference.py
│   ├── m6_synthesis.py
│   └── utils/
│       ├── io_helpers.py        ← lettura JSON, scrittura output, logging
│       ├── text_cleaning.py     ← funzioni pulizia testo
│       ├── pseudonymization.py  ← sostituzione nomi propri
│       └── timestamp_utils.py   ← calcolo timestamp assoluti, formattazione
├── prompts/
│   ├── dia_codebook_v01.md      ← codebook indicatori (versionato)
│   ├── m3_alignment_prompt.md   ← prompt per allineamento LLM (Modulo 3)
│   └── m5_question_classification_prompt.md  ← prompt per classificazione domande (Modulo 5)
├── data/
│   ├── raw/                     ← file JSON grezzi (per sessione)
│   ├── guides/                  ← guide docente PDF
│   └── output/                  ← output per sessione (sottocartelle)
├── docs/
│   ├── CHANGELOG.md             ← storico modifiche per versione
│   ├── coding_pack_v0.2/        ← pacchetto codifica umana (protocolli, gold examples, CSV)
│   └── releases/                ← manifest e hash di ciascuna release freeze
├── .claude/
│   ├── settings.json            ← hook protezione dati sensibili
│   └── skills/
│       └── parse-guide/         ← skill per parsing guida docente → lesson_plan_parsed.json
├── requirements.txt             ← dipendenze Python
└── logs/
    └── run_manifest_YYYYMMDD_HHMMSS.json
```

---

## 3. Uso

### Pipeline completa

```bash
cd dia-pipeline

# Con LLM (richiede ANTHROPIC_API_KEY per M3 e M5)
python3 run_pipeline.py <session_id> "<path/to/guida.pdf>"

# Senza LLM (fallback deterministici per M3 e M5)
python3 run_pipeline.py <session_id> "<path/to/guida.pdf>" --skip-llm
```

### Moduli singoli

Ogni modulo può essere eseguito indipendentemente (richiede che i moduli precedenti abbiano già prodotto il loro output):

```bash
# Modulo 1: Ingest, Merge, Clean
python3 -m src.m1_ingest_merge_clean <session_id>

# Modulo 2: Quality Gate
python3 -m src.m2_quality_gate <session_id>

# Modulo 3: Lesson Plan Alignment
python3 -m src.m3_lesson_alignment <session_id>           # con LLM
python3 -m src.m3_lesson_alignment <session_id> --skip-llm  # senza LLM

# Modulo 4: Low-Inference Indicators
python3 -m src.m4_low_inference <session_id>

# Modulo 5: Medium-Inference Indicators
python3 -m src.m5_medium_inference <session_id>           # con LLM
python3 -m src.m5_medium_inference <session_id> --skip-llm  # senza LLM

# Modulo 6: Synthesis & Report
python3 -m src.m6_synthesis <session_id>
```

### Variabile d'ambiente

```bash
export ANTHROPIC_API_KEY="sk-..."  # necessaria per M3 e M5 senza --skip-llm
```

---

## 4. Specifiche per modulo

### Modulo 1 — Ingest, Merge, Clean, Pseudonymize

**File**: `src/m1_ingest_merge_clean.py`
**Config**: `speaker_mapping.yaml`, `cleaning_rules.yaml`
**Input**: N file JSON in `data/raw/{session_id}/` (pattern `*_NNN.json`)
**Output**: `transcript_clean.json`, `ingest_log.json`, `pseudonym_map.json`

Operazioni:
1. Discovery e validazione file JSON (suffissi consecutivi, formato valido)
2. Concatenazione con timestamp assoluti (offset calcolato dal file precedente)
3. Normalizzazione speaker (ruoli: INS, INS2, STU, OVL, UNK)
4. Assegnazione `global_id` sequenziale
5. Pulizia testo ASR (ripetizioni, punteggiatura, artefatti)
6. Pseudonimizzazione (nomi propri → A1, A2, ...)
7. Filtraggio artefatti di diarizzazione (segmenti troppo brevi o vuoti)

### Modulo 2 — Quality Gate

**File**: `src/m2_quality_gate.py`
**Config**: `thresholds.yaml`
**Input**: `transcript_clean.json`
**Output**: `transcript_annotated.json`, `quality_report.md`

Operazioni:
1. Classificazione quality tier (HIGH / MED / LOW) per segmento
2. Rilevamento anomalie (overlap, low confidence, long segment, short gap)
3. Calcolo statistiche di qualità e copertura diarizzazione
4. Verdetto di analizzabilità per indicatori low e medium-inference

### Modulo 3 — Lesson Plan Alignment

**File**: `src/m3_lesson_alignment.py`
**Prompt**: `prompts/m3_alignment_prompt.md`
**Input**: `transcript_annotated.json`, `lesson_plan_parsed.json`
**Output**: `transcript_phased.json`, `lesson_plan_normalized.json`, `alignment_report.md`

Catena di fallback per l'allineamento:
1. `manual_boundaries` nel lesson plan → usa quelli (confini definiti a mano)
2. LLM API disponibile e `--skip-llm` non attivo → allineamento LLM-based
3. Nessuno dei precedenti → euristica keyword-based

L'allineamento LLM invia un digest compatto della trascrizione (~1 riga per segmento, ~25K char) + la struttura delle fasi della guida in una singola chiamata API. L'LLM restituisce i confini delle fasi in formato JSON, che vengono validati (phase_id, segment range, contiguità) e iniettati come `manual_boundaries` nel codice esistente.

Le fasi spontanee (non previste dalla guida) sono definite manualmente nel `lesson_plan_parsed.json` — l'LLM non le genera.

### Modulo 4 — Low-Inference Indicators

**File**: `src/m4_low_inference.py`
**Config**: `dia_indicators.yaml`
**Input**: `transcript_phased.json`
**Output**: `indicators_low.json`

Indicatori calcolati (definiti in `dia_indicators.yaml`):
- `talk_distribution` — distribuzione parole/durata per ruolo (INS, STU, UNK)
- `question_density` — % turni INS interrogativi
- `direct_density` — % turni INS direttivi (imperativi, deontici)
- `repair_burden` — frequenza turni INS di riparazione
- `wait_time` — pause > soglia dopo domande INS (v0.1.3: disambiguazione con filtro boundary/continuation/range, config in `thresholds.yaml`)

Tutti calcolati per fase e per sessione. Le regex sono nel YAML, non nel codice.

### Modulo 5 — Medium-Inference Indicators

**File**: `src/m5_medium_inference.py`
**Prompt**: `prompts/m5_question_classification_prompt.md`
**Input**: `transcript_phased.json`, `indicators_low.json`
**Output**: `question_labels.json` (con fallback `question_labels_manual.json`)

Operazioni:
1. Estrazione triadi INS → STU → INS
2. Per ogni triade, classificazione LLM o manuale (`classifications_manual.json`) di:
   - **Uptake** (UP_0, UP_1, UP_2, UP_3, UP_X)
   - **Focusing/Funneling** (FF_F, FF_N, FF_A, FF_X)
   - **Revoicing** (RV_0, RV_1, RV_X)
3. Aggregazione per fase e per sessione

### Modulo 6 — Synthesis & Report

**File**: `src/m6_synthesis.py`
**Input**: tutti gli output precedenti (transcript, indicators, lesson plan)
**Output**: `memo_sessione.md`, `memo_sessione.html`, `feedback_docente.md`

- `memo_sessione.md` — report strutturato: sintesi sessione, aderenza strutturale, profilo discorsivo per fase, profilo complessivo, limitazioni, appendice tecnica
- `memo_sessione.html` — dashboard interattiva con Chart.js (timeline, grafici indicatori, tabella riassuntiva)
- `feedback_docente.md` — feedback formativo positivo e basato su evidenze per il docente

---

## 5. File di output per sessione

Dopo un run completo, `data/output/{session_id}/` contiene:

| File | Modulo | Descrizione |
|------|--------|-------------|
| `transcript_clean.json` | M1 | Trascrizione pulita con speaker normalizzati |
| `ingest_log.json` | M1 | Log di tutte le decisioni di merge/clean |
| `pseudonym_map.json` | M1 | Mappa nomi reali → pseudonimi (sensibile) |
| `transcript_annotated.json` | M2 | Trascrizione con quality tier e flag |
| `quality_report.md` | M2 | Report qualità con statistiche |
| `transcript_phased.json` | M3 | Trascrizione con fasi assegnate (include campi phase_chunk: `phase_parent`, `phase_chunk`, `phase_chunk_label`, `phase_chunk_index`, `phase_chunk_total`, `phase_chunk_start_abs`, `phase_chunk_end_abs`) |
| `lesson_plan_parsed.json` | Esterno | Struttura guida in JSON — generato esternamente alla pipeline (Claude Code) a partire dal PDF della guida docente |
| `lesson_plan_normalized.json` | M3 | Guida filtrata (solo fasi didattiche) |
| `alignment_report.md` | M3 | Report aderenza strutturale |
| `indicators_low.json` | M4 | Indicatori low-inference per segmento/fase/sessione |
| `question_labels.json` | M5 | Classificazione domande focusing/funneling (output LLM) |
| `question_labels_manual.json` | M5 | Classificazione domande (fallback se API non disponibile) |
| `classifications_manual.json` | — | *Artefatto archiviato*: codifica manuale triadi (solo ic_volpiano, non usato dalla pipeline) |
| `memo_sessione.md` | M6 | Report strutturato di analisi |
| `memo_sessione.html` | M6 | Dashboard interattiva |
| `feedback_docente.md` | M6 | Feedback formativo per il docente |

---

## 6. Configurazione indicatori — `dia_indicators.yaml`

Ogni indicatore è definito in questo file. I Moduli 4 e 5 leggono il file e calcolano solo ciò che trovano. Aggiungere, rimuovere o modificare un indicatore = modificare solo questo file.

Struttura:
```yaml
indicators:
  question_density:
    level: low          # low | medium
    module: 4           # 4 | 5
    type: rate           # continuous | rate | event | categorical | boolean
    unit: phase+session  # per fase e/o sessione
    description: "..."
    regex: "\\?"         # per indicatori basati su regex
    applies_to: [INS]    # ruoli a cui si applica
    tru_dimensions: [D4, D5]  # dimensioni TRU collegate
```

---

## 7. Prerequisiti

- Python 3.10+
- Dipendenze: `pip install -r requirements.txt`
- `ANTHROPIC_API_KEY` nel environment (per M3 e M5 senza `--skip-llm`)

---

## 8. Note

- `pseudonym_map.json` e `data/raw/` contengono dati sensibili — non committare
- Ogni run produce un `logs/run_manifest_*.json` con timestamp, hash input, stato moduli
- Il `--skip-llm` flag disabilita le chiamate LLM in M3 (allineamento) e M5 (classificazione), usando i rispettivi fallback deterministici
