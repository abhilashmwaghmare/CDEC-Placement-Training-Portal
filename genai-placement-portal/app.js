(() => {
  const D = window.GENAI_DATA;
  const app = document.getElementById('app');
  const esc = s => String(s ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const bullets = s => String(s || '').split('\n').filter(Boolean).map(x => `<li>${esc(x.replace(/^•\s*/,''))}</li>`).join('');
  let view = 'dashboard';
  let selectedDay = 0;
  let projectPhase = 'all';
  let query = '';

  const completed = () => JSON.parse(localStorage.getItem('genai-complete') || '{}');
  const toggleDone = i => { const x = completed(); x[i] = !x[i]; localStorage.setItem('genai-complete', JSON.stringify(x)); render(); };

  function shell(content) {
    app.innerHTML = `<div class="portal"><aside class="sidebar"><div class="brand"><span class="logo">CB</span><div><b>CloudBlitz</b><small>GenAI Placement Portal</small></div></div><nav>
      <button class="nav ${view==='dashboard'?'active':''}" data-view="dashboard">⌂ <span>Dashboard</span></button>
      <button class="nav ${view==='training'?'active':''}" data-view="training">▦ <span>15-Day Training</span></button>
      <button class="nav ${view==='trainer'?'active':''}" data-view="trainer">▶ <span>Trainer Mode</span></button>
      <button class="nav ${view==='project'?'active':''}" data-view="project">◈ <span>Project SOP</span></button>
      <button class="nav ${view==='resources'?'active':''}" data-view="resources">✦ <span>Placement Resources</span></button>
    </nav><div class="side-note"><b>Source-first portal</b><p>Content is based on the uploaded GenAI placement and project SOP workbook.</p></div></aside><main class="main"><header class="top"><div><span class="eyebrow">CLOUDBLITZ · GENAI 2026</span><h1>${D.title}</h1></div><div class="top-actions"><button class="outline" data-view="training">Training Roadmap</button><button class="primary" data-view="trainer">Start Trainer Mode</button></div></header><div class="content">${content}</div><footer>CloudBlitz · GenAI Placement Readiness · Source: ${esc(D.source)}</footer></main></div>`;
    app.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => { view=b.dataset.view; render(); }));
  }

  function dashboard() {
    const done = completed();
    const count = Object.values(done).filter(Boolean).length;
    return `<section class="hero"><div><span class="tag">PLACEMENT READINESS · GENAI</span><h2>From GenAI skills to interview-ready execution.</h2><p>${esc(D.subtitle)}.</p><div class="actions"><button class="primary" data-view="trainer">Start Training →</button><button class="outline" data-view="project">Explore Project SOP</button></div></div><div class="hero-art"><div class="orb">AI</div><div class="float f1">LLM</div><div class="float f2">RAG</div><div class="float f3">Agents</div><div class="float f4">MCP</div></div></section>
    <div class="stats"><div><b>15</b><span>Placement Days</span></div><div><b>4</b><span>Project Phases</span></div><div><b>LLM</b><span>RAG · Agents · MCP</span></div><div><b>${count}</b><span>Topics Completed</span></div></div>
    <section class="section"><div class="section-head"><div><span class="eyebrow">TRAINING JOURNEY</span><h3>Placement Readiness Roadmap</h3></div><button class="text-btn" data-view="training">View all →</button></div><div class="roadmap">${D.days.slice(0,5).map((d,i)=>`<button class="road" data-day="${i}"><span>${i+1}</span><div><b>${esc(d[1])}</b><small>${esc(d[3])}</small></div></button>`).join('')}</div></section>
    <section class="quick"><div class="quick-card orange"><span>01</span><h3>Interview Readiness</h3><p>LLM, RAG, Agents, FastAPI, system design and scenario-based preparation.</p><button data-view="training">Open training →</button></div><div class="quick-card dark"><span>02</span><h3>Real GenAI Project</h3><p>Kickoff → Build → Validate → Deploy & Handover using the source SOP.</p><button data-view="project">Open project SOP →</button></div><div class="quick-card light"><span>03</span><h3>Career Positioning</h3><p>Resume, LinkedIn, Naukri, networking and job-search readiness.</p><button data-view="resources">Placement resources →</button></div></section>`;
  }

  function training() {
    const q = query.toLowerCase();
    const list = D.days.map((d,i)=>({d,i})).filter(({d}) => !q || d.join(' ').toLowerCase().includes(q));
    return `<section class="page-head"><span class="tag">CLASSROOM</span><h2>15-Day GenAI Placement Roadmap</h2><p>Each day contains the exact topic heading, source subtopics and expected outcome from the workbook.</p><div class="search"><span>⌕</span><input id="search" placeholder="Search training topics..." value="${esc(query)}"></div></section><div class="day-grid">${list.map(({d,i})=>`<article class="day-card ${i===selectedDay?'selected':''}" data-day="${i}"><div class="day-no">${String(i+1).padStart(2,'0')}</div><div class="day-copy"><span class="eyebrow">${esc(d[0])}</span><h3>${esc(d[1])}</h3><ul>${bullets(d[2])}</ul><div class="outcome"><b>Outcome</b><span>${esc(d[3])}</span></div></div><div class="day-actions"><button class="primary" data-trainer="${i}">Teach this day →</button><button class="check" data-complete="${i}">${completed()[i]?'✓ Completed':'Mark complete'}</button></div></article>`).join('')}</div>`;
  }

  function trainer() {
    const d = D.days[selectedDay] || D.days[0];
    const idx = selectedDay;
    return `<section class="trainer-page"><div class="trainer-top"><div><span class="tag">TRAINER MODE</span><span class="eyebrow">${esc(d[0])} · ${idx+1} / ${D.days.length}</span><h2>${esc(d[1])}</h2><p>${esc(d[3])}</p></div><div class="trainer-progress"><b>${Math.round(((idx+1)/D.days.length)*100)}%</b><span>roadmap</span><div><i style="width:${((idx+1)/D.days.length)*100}%"></i></div></div></div><div class="trainer-grid"><section class="lesson"><h3>Teaching checklist</h3><div class="lesson-list">${d[2].split('\n').map((x,i)=>`<div class="lesson-row"><span>${String(i+1).padStart(2,'0')}</span><p>${esc(x.replace(/^•\s*/,''))}</p></div>`).join('')}</div><div class="teaching-flow"><span>Explain</span><i>→</i><span>Demonstrate</span><i>→</i><span>Student Activity</span><i>→</i><span>Review</span><i>→</i><span>Next</span></div></section><aside class="trainer-side"><h3>Day navigation</h3><div class="mini-days">${D.days.map((x,i)=>`<button class="${i===idx?'active':''}" data-day="${i}">${i+1}<small>${esc(x[1].split(' ').slice(0,3).join(' '))}</small></button>`).join('')}</div><div class="trainer-nav"><button class="outline" data-prev>← Previous</button><button class="primary" data-next>${idx===D.days.length-1?'Finish':'Next Day →'}</button></div></aside></div></section>`;
  }

  function project() {
    const groups = [...new Set(D.project.map(x=>x[0]))];
    const filtered = projectPhase==='all' ? D.project : D.project.filter(x=>x[0]===projectPhase);
    return `<section class="page-head"><span class="tag">PROJECT SOP</span><h2>Generic GenAI Project SOP</h2><p>4-day standard industry flow: kickoff, build, validate, deploy & handover.</p><div class="phase-tabs"><button class="${projectPhase==='all'?'active':''}" data-phase="all">All phases</button>${groups.map(g=>`<button class="${projectPhase===g?'active':''}" data-phase="${esc(g)}">${esc(g)}</button>`).join('')}</div></section><div class="project-timeline">${filtered.map((x,i)=>`<article><div class="phase">${esc(x[0])}</div><div class="project-dot"></div><div class="project-card"><span>${String(i+1).padStart(2,'0')}</span><h3>${esc(x[1])}</h3><ul>${bullets(x[2])}</ul></div></article>`).join('')}</div>`;
  }

  function resources() {
    return `<section class="page-head"><span class="tag">PLACEMENT RESOURCES</span><h2>Career Readiness Toolkit</h2><p>The workbook's placement journey is designed around profile readiness, communication, interviews, networking and project storytelling.</p></section><div class="resource-grid"><div><b>Resume</b><h3>ATS-ready GenAI positioning</h3><p>Day 2 focuses on GenAI resume structure, keywords, project links and quantified impact.</p></div><div><b>LinkedIn</b><h3>Professional profile optimization</h3><p>Headline, About, Experience, Featured Projects and skills endorsement strategy.</p></div><div><b>Naukri</b><h3>Visibility & keyword optimization</h3><p>Profile setup and GenAI keyword optimization for search visibility.</p></div><div><b>Interview</b><h3>Scenario-based preparation</h3><p>LLMs, RAG, Agents, system design, Python and FastAPI interview patterns.</p></div><div><b>Networking</b><h3>Consistent outreach</h3><p>LinkedIn search, direct hiring-manager outreach, alumni and AI communities.</p></div><div><b>Project Storytelling</b><h3>Show the work clearly</h3><p>Use the real project flow, architecture, design decisions, quality checks and demo preparation.</p></div></div>`;
  }

  function bind() {
    app.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',e=>{selectedDay=Number(e.currentTarget.dataset.day); if(view==='trainer') render(); else {view='trainer';render();}}));
    app.querySelectorAll('[data-trainer]').forEach(b=>b.addEventListener('click',e=>{selectedDay=Number(e.currentTarget.dataset.trainer);view='trainer';render();}));
    app.querySelectorAll('[data-complete]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();toggleDone(Number(e.currentTarget.dataset.complete));}));
    const s=app.querySelector('#search'); if(s) s.addEventListener('input',e=>{query=e.target.value; render(); const el=document.getElementById('search'); if(el){el.focus();el.setSelectionRange(query.length,query.length);}});
    app.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>{if(selectedDay<D.days.length-1){selectedDay++;render();}}));
    app.querySelectorAll('[data-prev]').forEach(b=>b.addEventListener('click',()=>{if(selectedDay>0){selectedDay--;render();}}));
    app.querySelectorAll('[data-phase]').forEach(b=>b.addEventListener('click',()=>{projectPhase=b.dataset.phase;render();}));
  }
  function render(){ shell(view==='dashboard'?dashboard():view==='training'?training():view==='trainer'?trainer():view==='project'?project():resources()); bind(); }
  render();
})();