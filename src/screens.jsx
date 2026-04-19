/* global React, SESSION */
const { useState, useEffect } = React;

// Icons
const I = {
  check: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrow: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  back: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  upload: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0-12l-4 4m4-4l4 4M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  audio: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  target: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>,
  clock: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  voices: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="9" r="3" stroke="currentColor" strokeWidth="1.8"/><circle cx="16" cy="9" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M3 19c.5-3 2.5-5 5-5s4.5 2 5 5M13 19c.5-3 2.5-5 5-5s4.5 2 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  think: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3a6 6 0 00-4 10.5V17h8v-3.5A6 6 0 0012 3zM10 21h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  quote: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 17l-2 4V7a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
};

function iconFor(goalId){
  if (goalId==='wait') return I.clock();
  if (goalId==='voices') return I.voices();
  if (goalId==='reason') return I.think();
  return I.quote();
}

// ═══ Screen 1: Goal picker ═══
function GoalScreen({ chosen, setChosen, next }){
  return (
    <>
      <div className="page-head">
        <div className="hl">
          <div className="chip">Step 1 · Set your focus</div>
          <h1>What would you like the Coach to <em>pay close attention to</em> today?</h1>
          <p className="lede">Pick one focus area for this lesson. The feedback you get afterwards will be anchored to your choice — so the Coach becomes a partner in something <em>you</em> chose to work on, not a generic evaluator.</p>
        </div>
      </div>

      <div className="goals-grid">
        {SESSION.personalGoalOptions.map(g => (
          <div key={g.id}
            className={`goal-card ${chosen===g.id?'selected':''}`}
            onClick={() => setChosen(g.id)}
          >
            <div className="radio-dot"/>
            <div className="goal-icon">{iconFor(g.id)}</div>
            <h3 className="goal-title">{g.label}</h3>
            <p className="goal-desc">{g.description}</p>
            <div className="goal-example">{g.example}</div>
          </div>
        ))}
      </div>

      <div className="page-nav">
        <div/>
        <button className="btn primary lg" disabled={!chosen} onClick={next}>
          Continue <span className="arrow">→</span>
        </button>
      </div>
    </>
  );
}

// ═══ Screen 2: Lesson ═══
function LessonScreen({ chosen, next, back }){
  const S = SESSION;
  const g = S.personalGoalOptions.find(x => x.id === chosen);
  return (
    <>
      <div className="page-head">
        <div className="hl">
          <div className="chip">Step 2 · Today's lesson</div>
          <h1>{S.lesson.title}</h1>
          <p className="lede">Review the plan for today, then head over to record or upload the audio.</p>
        </div>
      </div>

      <div className="lesson-layout">
        <div className="lesson-hero">
          <div className="row">
            <div className="label">Session</div>
            <div className="val big">Session {S.lesson.number} · {S.lesson.title}</div>
          </div>
          <div className="row">
            <div className="label">When</div>
            <div className="val">{S.lesson.date} · {S.lesson.grade}</div>
          </div>
          <div className="row">
            <div className="label">Math key goal</div>
            <div className="val">{S.mathGoal}</div>
          </div>
          <div className="row">
            <div className="label">Your focus</div>
            <div className="val">
              <span className="goal-pill">{iconFor(chosen)} {g.label}</span>
            </div>
          </div>
        </div>

        <aside className="focus-aside">
          <div className="aside-label">Your focus today</div>
          <h3 className="aside-title">{g.label}</h3>
          <p className="aside-desc">{g.description}</p>
          <div className="aside-example">{g.example}</div>
        </aside>
      </div>

      <div className="page-nav">
        <button className="btn secondary" onClick={back}><span className="arrow">←</span> Change focus</button>
        <button className="btn primary lg" onClick={next}>Upload recording <span className="arrow">→</span></button>
      </div>
    </>
  );
}

// ═══ Screen 3: Upload ═══
function UploadScreen({ next, back, file, setFile }){
  const onPick = () => setFile(SESSION.recording);
  return (
    <>
      <div className="page-head">
        <div className="hl">
          <div className="chip">Step 3 · Upload recording</div>
          <h1>Upload today's lesson audio</h1>
          <p className="lede">We accept .m4a, .mp3 or .wav up to 2 hours. Everything is processed privately and anonymised — student names never leave the Coach.</p>
        </div>
      </div>

      <div className="upload-grid">
        {!file ? (
          <div className="dropzone" onClick={onPick}>
            <div className="up-icon">{I.upload(32)}</div>
            <div className="up-title">Drop your audio here</div>
            <div className="up-sub">or click to browse — .m4a, .mp3, .wav up to 2 hours</div>
          </div>
        ) : (
          <div className="dropzone has-file">
            <div className="file-row">
              <div className="file-icon">{I.audio(26)}</div>
              <div className="file-meta">
                <div className="fname">{file.filename}</div>
                <div className="fdetails">
                  <span>{I.clock()} {file.duration}</span>
                  <span>{file.sizeMB} MB</span>
                  <span style={{color:'var(--accent-hover)'}}>{I.check(14)} Quality: {file.quality}</span>
                </div>
              </div>
              <button className="remove-btn" onClick={() => setFile(null)}>Remove</button>
            </div>
          </div>
        )}

        <aside className="upload-tips">
          <h4>For best results</h4>
          <ul>
            <li>Place the recorder near the centre of the class, not on your desk.</li>
            <li>Quiet corridors and moving furniture are fine — we filter them.</li>
            <li>Let students know you're recording. Names are automatically anonymised.</li>
          </ul>
        </aside>
      </div>

      <div className="page-nav">
        <button className="btn secondary" onClick={back}><span className="arrow">←</span> Back</button>
        <button className="btn primary lg" onClick={next} disabled={!file}>
          Start analysis <span className="arrow">→</span>
        </button>
      </div>
    </>
  );
}

// ═══ Screen 4: Analysis ═══
function AnalysisScreen({ next, chosen }){
  const g = SESSION.personalGoalOptions.find(x => x.id === chosen);
  const steps = [
    { id:'M1', label:'Cleaning the transcript',         detail:'Normalising speakers, pseudonymising student names', time:'~20s' },
    { id:'M2', label:'Checking audio quality',          detail:'Flagging overlaps and low-confidence segments',       time:'~15s' },
    { id:'M3', label:'Aligning with your lesson plan',  detail:'Matching discussion to planned phases',                time:'~30s' },
    { id:'M4', label:'Measuring talk patterns',         detail:`Wait time, turn distribution, talk share — anchored to "${g.label.toLowerCase()}"`, time:'~45s' },
    { id:'M5', label:'Reading the kind of questions asked', detail:'Uptake, focusing, revoicing, reasoning demand', time:'~30s' },
    { id:'M6', label:'Writing your feedback',           detail:'Evidence-grounded notes, with anonymised quotes',     time:'~20s' },
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= steps.length){
      const t = setTimeout(next, 800); return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(s => s + 1), step === 0 ? 600 : 900);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div className="analysis-wrap">
      <div className="page-head" style={{marginBottom:0, textAlign:'center', display:'block'}}>
        <div className="chip" style={{textAlign:'center'}}>Step 4 · Analysing</div>
        <h1 style={{textAlign:'center'}}>{step >= steps.length ? "All done." : "We're listening closely…"}</h1>
        <p className="lede" style={{textAlign:'center', margin:'14px auto 0'}}>
          {step >= steps.length ? 'Opening your feedback…' : 'This usually takes 2–3 minutes. You can leave this tab open or come back later.'}
        </p>
      </div>

      <div className="proc-steps">
        {steps.map((s, i) => {
          const state = i < step ? 'done' : i === step ? 'current' : 'pending';
          return (
            <div key={s.id} className={`proc-step ${state}`}>
              <div className="dot">{state==='done' ? '✓' : ''}</div>
              <div className="text">
                <div className="plabel">{s.label}</div>
                <div className="pdetail">{s.detail}</div>
              </div>
              <div className="ptime">{s.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══ Screen 5: Dashboard ═══
function DashboardScreen({ chosen, next, back }){
  const S = SESSION;
  const d = S.dashboard;
  const g = S.personalGoalOptions.find(x => x.id === chosen);
  const progress = d.goalProgress[chosen];

  const talkData = [
    { label:'Teacher talk',   value: d.talk.teacher, color:'var(--accent-hover)' },
    { label:'Student talk',   value: d.talk.student, color:'var(--accent-lite)' },
    { label:'Silence / transitions', value: d.talk.silence, color:'var(--sunk-deep)' },
  ];

  return (
    <>
      <div className="page-head">
        <div className="hl">
          <div className="chip">Step 5 · Your lesson feedback</div>
          <h1>{S.lesson.title} · <em>what happened today</em></h1>
          <p className="lede">Everything below is anchored to the focus you chose: <b>{g.label.toLowerCase()}</b>. Metrics are for reflection, not evaluation — hover any widget to see the evidence behind it.</p>
        </div>
      </div>

      <div className={`goal-banner ${progress.met ? '' : 'missed'}`}>
        <div className="banner-icon">{progress.met ? I.check(26) : I.target(26)}</div>
        <div className="banner-text">
          <div className="banner-eyebrow">{progress.met ? 'Goal met' : 'Partial progress'}</div>
          <div className="banner-title">{progress.metric}</div>
          <div className="banner-sub">{progress.last}</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card span-4">
          <div className="card-head">
            <div>
              <h3 className="card-title">Talk distribution</h3>
              <div className="card-sub">Of your 42:18 lesson</div>
            </div>
          </div>
          <div className="donut-wrap">
            <Donut data={talkData}/>
            <div className="donut-legend">
              {talkData.map((t, i) => (
                <div key={i} className="leg-row">
                  <span className="leg-dot" style={{background: t.color}}/>
                  <span className="leg-label">{t.label}</span>
                  <span className="leg-val">{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card span-8">
          <div className="card-head">
            <div>
              <h3 className="card-title">Lesson timeline</h3>
              <div className="card-sub">Planned phases vs spontaneous detours</div>
            </div>
          </div>
          <Timeline phases={d.phases}/>
        </div>

        <div className="card span-6">
          <div className="card-head">
            <div>
              <h3 className="card-title">Question types</h3>
              <div className="card-sub">50 questions detected across the lesson</div>
            </div>
          </div>
          <QuestionBars questions={d.questions}/>
        </div>

        <div className="card span-6">
          <div className="card-head">
            <div>
              <h3 className="card-title">Audio quality by minute</h3>
              <div className="card-sub">Higher = higher transcription confidence</div>
            </div>
          </div>
          <QualityHeatmap values={d.qualityBands}/>
          <div className="card-foot-note">Dip around minute 14–17 — overlapping voices during Sofia's question. The transcript is still usable but worth listening to the original audio for this moment.</div>
        </div>

        <div className="card span-12">
          <div className="card-head">
            <div>
              <h3 className="card-title-lg card-title">Three moments worth remembering</h3>
              <div className="card-sub">Anonymised quotes, drawn from the transcript</div>
            </div>
          </div>
          <QuoteList quotes={d.highlights}/>
        </div>

        <div className="card span-12">
          <div className="card-head">
            <div>
              <h3 className="card-title">Growth areas to try next time</h3>
              <div className="card-sub">Gentle suggestions, not a to-do list</div>
            </div>
          </div>
          <div className="growth-list">
            {d.growth.map((g, i) => (
              <div key={i} className="growth-item">
                <h4 className="g-title">{g.title}</h4>
                <p className="g-body">{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-nav">
        <button className="btn secondary" onClick={back}><span className="arrow">←</span> Back</button>
        <button className="btn primary lg" onClick={next}>See key insights <span className="arrow">→</span></button>
      </div>
    </>
  );
}

// ═══ Screen 6: Key Insights ═══
function InsightsScreen({ back, restart }){
  const S = SESSION;
  const k = S.insights;
  return (
    <>
      <div className="page-head">
        <div className="hl">
          <div className="chip">Step 6 · Key insights</div>
          <h1>Your session through a <em>TRU lens</em></h1>
          <p className="lede">A deeper read of the five Teaching for Robust Understanding dimensions, the moments that mattered most, and resources picked for what we heard today.</p>
        </div>
      </div>

      <div className="insights-layout">
        <div>
          <section id="tru" className="card" style={{marginBottom:24}}>
            <div className="card-head">
              <div>
                <h3 className="card-title-lg card-title">TRU snapshot · five dimensions</h3>
                <div className="card-sub">Based on the Schoenfeld framework for powerful classrooms</div>
              </div>
            </div>
            {k.tru.map((t, i) => (
              <div key={i} className="tru-row">
                <div className="tru-dim">{t.dim}</div>
                <div className="tru-summary">{t.summary}</div>
                <span className={`status-pill ${t.status}`}>
                  {t.status==='strong' ? 'Strength' : t.status==='mixed' ? 'Mixed' : 'Growth area'}
                </span>
              </div>
            ))}
          </section>

          <section id="moments" style={{marginBottom:24}}>
            <h3 className="card-title-lg card-title" style={{marginBottom:14, paddingLeft:4}}>Moments that mattered</h3>
            {k.moments.map((m, i) => (
              <div key={i} className={`moment-card ${m.kind}`}>
                <div className="m-time">{m.time}</div>
                <div className="m-body">
                  <div className="m-kind">{m.kind === 'strength' ? 'Strength' : 'Opportunity'}</div>
                  <h4 className="m-title">{m.title}</h4>
                  <p className="m-text">{m.body}</p>
                </div>
              </div>
            ))}
          </section>

          <section id="resources" className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title-lg card-title">Resources picked for this session</h3>
                <div className="card-sub">Chosen to match what we heard today</div>
              </div>
            </div>
            {k.resources.map((r, i) => (
              <div key={i} className="resource-row">
                <span className={`r-kind ${r.kind === 'Teacher guide' ? 'guide' : r.kind === 'Capsule' ? 'capsule' : 'activity'}`}>
                  {r.kind}
                </span>
                <div className="r-body">
                  <div className="r-title">{r.title}</div>
                  <div className="r-detail">{r.detail}</div>
                </div>
                <div className="r-arrow">{I.arrow()}</div>
              </div>
            ))}
          </section>
        </div>

        <aside className="insights-toc">
          <h4>On this page</h4>
          <a href="#tru"><span className="toc-dot"/>TRU snapshot</a>
          <a href="#moments"><span className="toc-dot"/>Moments that mattered</a>
          <a href="#resources"><span className="toc-dot"/>Resources</a>
        </aside>
      </div>

      <div className="page-nav">
        <button className="btn secondary" onClick={back}><span className="arrow">←</span> Back to dashboard</button>
        <button className="btn tertiary" onClick={restart}>Start new session</button>
      </div>
    </>
  );
}

Object.assign(window, { GoalScreen, LessonScreen, UploadScreen, AnalysisScreen, DashboardScreen, InsightsScreen });
