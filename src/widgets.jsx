/* global React */
const { useMemo } = React;

// ───── Donut: talk distribution ─────
function Donut({ data, size = 170, stroke = 28 }){
  const total = data.reduce((a, b) => a + b.value, 0);
  const r = (size - stroke) / 2;
  const cx = size / 2, cy = size / 2;
  const C = 2 * Math.PI * r;
  let offset = 0;
  const segments = data.map((d) => {
    const frac = d.value / total;
    const len = C * frac;
    const seg = {
      ...d,
      dash: `${len} ${C - len}`,
      offset: C * 0.25 - offset,
    };
    offset += len;
    return seg;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--sunk)" strokeWidth={stroke}/>
      {segments.map((s, i) => (
        <circle key={i}
          cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth={stroke}
          strokeDasharray={s.dash}
          strokeDashoffset={s.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(.2,.8,.2,1)' }}
        />
      ))}
      <text x={cx} y={cy + size * 0.05} textAnchor="middle" fontSize={size * 0.2} fontWeight="500" fill="var(--ink-900)" fontFamily="JetBrains Mono, monospace">
        {data[0].value}%
      </text>
    </svg>
  );
}

// ───── Timeline ─────
function Timeline({ phases, total = 42 }){
  return (
    <div className="timeline-wrap">
      <div className="timeline-track">
        {phases.map((p, i) => {
          const left = (p.start / total) * 100;
          const width = ((p.end - p.start) / total) * 100;
          return (
            <div key={i}
              className={`timeline-phase ${p.kind}`}
              style={{ left: `${left}%`, width: `${width}%` }}
              title={`${p.name} · ${p.start}–${p.end} min`}
            >
              {width > 8 ? p.name : ''}
            </div>
          );
        })}
      </div>
      <div className="timeline-axis">
        <span>0:00</span>
        <span>10:00</span>
        <span>20:00</span>
        <span>30:00</span>
        <span>40:00</span>
      </div>
      <div className="timeline-legend">
        <span><span className="ldot planned"/>Planned phase</span>
        <span><span className="ldot spontaneous"/>Spontaneous detour</span>
      </div>
    </div>
  );
}

// ───── Question-type bars ─────
function QuestionBars({ questions }){
  const max = Math.max(...questions.map(q => q.share));
  const classFor = (t) => t.startsWith('Reason') ? 'reason'
                        : t.startsWith('Upt') ? 'uptake'
                        : t.startsWith('Proc') ? 'proc' : '';
  return (
    <div className="bars">
      {questions.map((q, i) => (
        <div key={i} className="bar-row">
          <div className="bar-label">{q.type}</div>
          <div className="bar-track">
            <div className={`bar-fill ${classFor(q.type)}`}
              style={{ width: `${(q.share / max) * 100}%` }}/>
          </div>
          <div className="bar-val">{q.share}%</div>
        </div>
      ))}
    </div>
  );
}

// ───── Quality heatmap ─────
function QualityHeatmap({ values }){
  const colorFor = (v) => {
    if (v >= 90) return 'var(--accent)';
    if (v >= 80) return 'var(--accent-lite)';
    if (v >= 70) return 'var(--accent-soft)';
    if (v >= 60) return 'var(--sand)';
    return 'var(--rose-soft)';
  };
  return (
    <div>
      <div className="heatmap">
        {values.map((v, i) => (
          <div key={i} className="cell"
            style={{ background: colorFor(v) }}
            title={`Minute ${i+1}: ${v}% confidence`}
          />
        ))}
      </div>
      <div className="heatmap-scale">
        <span>Low confidence</span>
        <div className="scale-bar"/>
        <span>High confidence</span>
      </div>
    </div>
  );
}

// ───── Quote list ─────
function QuoteList({ quotes }){
  return (
    <div className="quote-list">
      {quotes.map((q, i) => (
        <div key={i} className={`quote-card ${q.context === 'Spontaneous moment' ? 'opportunity' : ''}`}>
          <div className="q-tag">
            <span className="t-id">{q.tag}</span>
            <span className="t-time">{q.time}</span>
          </div>
          <div className="q-body">
            <div className="q-context">{q.context}</div>
            <div className="q-text">{q.quote}</div>
            <div className="q-note">{q.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Donut, Timeline, QuestionBars, QualityHeatmap, QuoteList });
