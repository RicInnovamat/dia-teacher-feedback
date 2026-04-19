// DIA Teacher Reflection — content for "Let's Count" session
window.SESSION = {
  teacher: "Elena Rossi",
  school: "IC Giovanni Pascoli · Milano",
  lesson: { number: 1, title: "Let's Count", grade: "Grade 2", date: "Thursday, 14 November" },

  mathGoal: "Lead the class in varied acoustic counting routines so every student can confidently count 1–100 forward and backward, including skip-counting by 2s, 5s, and 10s.",

  personalGoalOptions: [
    { id: 'wait',    label: 'Give more wait time',        description: 'Pause 3+ seconds after open questions so quieter students can join.', example: '"Take your time… look at the number line before you answer."' },
    { id: 'voices',  label: 'Invite more student voices', description: 'Lower teacher talk share; call on students who haven\'t spoken yet.',   example: '"Let\'s hear from someone we haven\'t heard from yet."' },
    { id: 'reason',  label: 'Ask reasoning questions',    description: 'Trade knowledge-check questions for "why / how / what if".',            example: '"Why does skip-counting by 2s always land on even numbers?"' },
    { id: 'revoice', label: 'Revoice student thinking',   description: "Restate a student's idea so the class can build on it.",              example: '"So Marco is saying that 25 is halfway to 50 — did I hear that right?"' },
  ],

  recording: { filename: 'lesson-lets-count-nov14.m4a', duration: '42:18', sizeMB: 38.4, quality: 'Good' },

  // Dashboard data
  dashboard: {
    // headline tied to chosen goal
    goalProgress: {
      wait:    { met: true,  metric: 'Your average wait time rose to 3.8s',   last: 'from 2.1s last session' },
      voices:  { met: true,  metric: 'You heard 14 different students',       last: 'up from 9 last session' },
      reason:  { met: false, metric: '32% of your questions were reasoning',  last: 'goal was ≥ 40%' },
      revoice: { met: true,  metric: 'You revoiced 8 student ideas',          last: 'up from 3 last session' },
    },

    // Talk distribution (teacher / student / silence)
    talk: { teacher: 48, student: 36, silence: 16 },

    // Lesson phases across 42 min
    phases: [
      { name: 'Warm-up',        start: 0,  end: 6,  kind: 'planned' },
      { name: 'Whole-class count', start: 6,  end: 14, kind: 'planned' },
      { name: 'Spontaneous: evens question', start: 14, end: 19, kind: 'spontaneous' },
      { name: 'Skip-counting by 5s', start: 19, end: 27, kind: 'planned' },
      { name: 'Skip-counting by 10s', start: 27, end: 34, kind: 'planned' },
      { name: 'Closing reflection', start: 34, end: 42, kind: 'planned' },
    ],

    // Question-type distribution
    questions: [
      { type: 'Knowledge check',  count: 23, share: 46 },
      { type: 'Reasoning',        count: 16, share: 32 },
      { type: 'Uptake',           count:  7, share: 14 },
      { type: 'Procedural',       count:  4, share:  8 },
    ],

    // Per-minute audio quality (0-100)
    qualityBands: [
      95, 96, 94, 92, 88, 80, 72, 68, 82, 90, 92, 94, 93,
      70, 58, 52, 65, 78, 88, 92,
      94, 95, 96, 94, 92, 93, 95,
      94, 92, 88, 90, 93, 95, 94,
      92, 91, 93, 94, 95, 94, 92, 90,
    ],

    // Anonymised quotes
    highlights: [
      { tag: 'A1', time: '04:12', context: 'Warm-up',
        quote: 'Teacher: "Let\'s count together up to thirty — ready?" [class joins in; ~18 voices detected]',
        note: 'Strong whole-class engagement at the start. 18 distinct voices in the first 5 minutes.' },
      { tag: 'A2', time: '14:38', context: 'Spontaneous moment',
        quote: 'Sofia: "Teacher, why are all the two-numbers always even?" Teacher: "Good observation, Sofia! Let\'s keep going."',
        note: 'A rich student-initiated question that opened a reasoning moment. The conversation moved on before the whole class could engage.' },
      { tag: 'A3', time: '27:02', context: 'Skip-counting by 10s',
        quote: 'Teacher: "So Marco is saying that if we skip by 10, we always land on a zero — is that always true? Talk to your partner."',
        note: 'Excellent revoicing and invitation to peer discussion — this is exactly the pattern you set as your goal.' },
    ],

    growth: [
      { title: 'Hold the spontaneous moments longer',
        body: 'When Sofia asked about even numbers (14:38), the class briefly went quiet — a real opening for deeper reasoning. Giving 5–10s of wait time there could have drawn in more voices.' },
      { title: 'Balance question types',
        body: 'Knowledge-check questions (46%) still dominated. Try swapping 2–3 of them for "Why do you think…" next session — you\'re already good at revoicing, so this pairs well.' },
    ],
  },

  // Key insights deep-dive
  insights: {
    tru: [
      { dim: 'The Mathematics',          status: 'strong',   summary: 'The lesson stayed anchored on counting fluency across 1–100, with coherent progression from counting by 1s → 5s → 10s.' },
      { dim: 'Cognitive Demand',         status: 'mixed',    summary: 'Most tasks were procedural. One spontaneous moment (Sofia\'s even-numbers question) briefly lifted the demand.' },
      { dim: 'Equitable Access',         status: 'growth',   summary: '14 students spoke, but 6 students dominated 52% of turns. Quiet students weren\'t explicitly invited in.' },
      { dim: 'Agency, Identity, Authority', status: 'strong', summary: 'You revoiced 8 student ideas by name. This pattern is the strongest in the session and directly builds student identity as mathematicians.' },
      { dim: 'Formative Assessment',     status: 'strong',   summary: 'You checked understanding after each new skip-count pattern with a quick class chorus and a partner-turn.' },
    ],

    moments: [
      { time: '04:12', kind: 'strength',  title: 'Confident warm-up',
        body: 'The whole-class count to 30 landed 18 distinct voices in under 5 minutes — a strong opening that primed the rest of the lesson.' },
      { time: '14:38', kind: 'opportunity', title: 'Missed reasoning moment',
        body: 'Sofia asked a real mathematical question: why two-numbers are always even. The discussion moved on within 40 seconds. Slowing down here is one of the highest-leverage moves you could make.' },
      { time: '27:02', kind: 'strength',   title: 'Revoicing + partner talk',
        body: 'You revoiced Marco\'s observation and invited partner discussion — a textbook move that raised agency and access simultaneously.' },
    ],

    resources: [
      { kind: 'Teacher guide', title: 'Extending wait time effectively',    detail: '5-min read · TRU dimension: Equitable Access' },
      { kind: 'Capsule',       title: 'Following spontaneous questions',    detail: '7-min video · From the Innovamat methodology library' },
      { kind: 'Activity',      title: 'Even & odd pattern exploration',     detail: 'Grade 2 · 25 min · Pairs with today\'s "Let\'s Count"' },
    ],
  },

  // Previous sessions for history dropdown
  history: [
    { num: 1, title: "Let's Count",           date: 'Nov 14', current: true },
    { num: 2, title: "Let's Add I",           date: 'Nov 07' },
    { num: 3, title: "Let's Add II",          date: 'Oct 31' },
    { num: 4, title: "Let's Count in groups", date: 'Oct 24' },
  ],
};
