// Cursor
const cursor=document.getElementById('cursor'),dot=document.getElementById('cursorDot');
let mx=0,my=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
document.addEventListener('click',()=>{cursor.classList.add('clicked');setTimeout(()=>cursor.classList.remove('clicked'),300);});
(function animateCursor(){cx+=(mx-cx)*0.12;cy+=(my-cy)*0.12;cursor.style.left=cx+'px';cursor.style.top=cy+'px';dot.style.left=mx+'px';dot.style.top=my+'px';requestAnimationFrame(animateCursor);})();

// Particles
const pc=document.getElementById('particles');
const cols=['#D4AA7D','#C9A07A','#F8F0FF','#ffffff'];
for(let i=0;i<25;i++){
  const p=document.createElement('div');p.className='particle';
  const s=Math.random()*3.5+1;
  p.style.cssText=`width:${s}px;height:${s}px;background:${cols[Math.floor(Math.random()*cols.length)]};left:${Math.random()*100}%;bottom:-10px;animation-duration:${Math.random()*14+9}s;animation-delay:${Math.random()*10}s;`;
  pc.appendChild(p);
}

// Types Strip
const skills=['HTML','CSS','JavaScript','PHP','C#','MySQL','Bootstrap','Tailwind','jQuery','SQL','XAMPP','Git','GitHub','GitLab','Full-Stack','Frontend','Backend','Database'];
const track=document.getElementById('typesTrack');
[...skills,...skills].forEach(s=>{const b=document.createElement('span');b.className='skill-badge';b.textContent=s;track.appendChild(b);});

// Pokeball click
document.getElementById('pokeball').addEventListener('click',()=>{
  const pb=document.getElementById('pokeball');
  pb.style.animation='none';pb.style.transform='scale(1.25)';
  setTimeout(()=>{pb.style.transform='scale(1) rotate(360deg)';pb.style.transition='transform 0.6s ease';},100);
  setTimeout(()=>{pb.style.animation='heroFloat 3s ease-in-out infinite';pb.style.transition='';pb.style.transform='';},700);
});

// Dynamic section rendering from JSON
async function loadSiteData() {
  try {
    const skillsRes = await fetch("developer's_data/techstack_details.json");
    const projectsRes = await fetch("developer's_data/project_details.json");
    const experienceRes = await fetch("developer's_data/experience_details.json");

    const skills = await skillsRes.json();
    const projects = await projectsRes.json();
    const experience = await experienceRes.json();

    renderSkillCarousel(skills);
    renderProjectCarousel(projects);
    renderExperience(experience);
  } catch (error) {
    console.error('Unable to load site data:', error);
  }
}

function renderSkillCarousel(slides) {
  const tabsWrap = document.getElementById('skillTabs');
  const dotsWrap = document.getElementById('skillDots');
  const track = document.getElementById('skillTrack');
  const dropdown = document.getElementById('skillDropdown');

  tabsWrap.innerHTML = '';
  dotsWrap.innerHTML = '';
  track.innerHTML = '';
  if (dropdown) dropdown.innerHTML = '';

  const ITEMS_PER_PAGE = 12;
  let current = 0;
  const labelEl = document.getElementById('skillLabel');

  // Build all slides with pagination
  slides.forEach((slide, idx) => {
    // Chunk items into pages of 12
    const chunks = [];
    for (let i = 0; i < slide.items.length; i += ITEMS_PER_PAGE) {
      chunks.push(slide.items.slice(i, i + ITEMS_PER_PAGE));
    }

    // Wrap all pages for this category
    const categoryWrap = document.createElement('div');
    categoryWrap.className = `skill-category${idx === 0 ? ' active' : ''}`;
    categoryWrap.dataset.category = idx;

    chunks.forEach((chunk, pageIdx) => {
      const pageEl = document.createElement('div');
      pageEl.className = `carousel-slide${pageIdx === 0 ? ' active' : ''}`;
      pageEl.innerHTML = chunk.map(item => `
        <div class="skill-item tech-card">
          <div class="skill-item-icon"><i class="${item.icon}"></i></div>
          <div class="skill-item-name">${item.name}</div>
          <div class="skill-item-level">${item.level}</div>
        </div>
      `).join('');
      categoryWrap.appendChild(pageEl);
    });

    track.appendChild(categoryWrap);

    // Tab button
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `carousel-tab div-title${idx === 0 ? ' active' : ''}`;
    button.dataset.slide = idx;
    button.innerHTML = `<i class="${slide.icon}"></i> ${slide.label}`;
    tabsWrap.appendChild(button);

    // Dropdown option
    if (dropdown) {
      const option = document.createElement('option');
      option.value = idx;
      option.textContent = slide.label;
      if (idx === 0) option.selected = true;
      dropdown.appendChild(option);
    }
  });

  const tabs = tabsWrap.querySelectorAll('.carousel-tab');

  // Build dots for a given category's pages
  function buildDots(categoryIdx) {
    dotsWrap.innerHTML = '';
    const categoryWrap = track.querySelector(`.skill-category[data-category="${categoryIdx}"]`);
    const pages = categoryWrap.querySelectorAll('.carousel-slide');

    if (pages.length <= 1) return; // no dots needed for single page

    pages.forEach((_, pageIdx) => {
      const dot = document.createElement('div');
      dot.className = `carousel-dot${pageIdx === 0 ? ' active' : ''}`;
      dot.dataset.page = pageIdx;
      dot.addEventListener('click', () => goToPage(categoryIdx, pageIdx));
      dotsWrap.appendChild(dot);
    });
  }

  // Go to a specific page within a category
  function goToPage(categoryIdx, pageIdx) {
    const categoryWrap = track.querySelector(`.skill-category[data-category="${categoryIdx}"]`);
    const pages = categoryWrap.querySelectorAll('.carousel-slide');

    pages.forEach((p, i) => p.classList.toggle('active', i === pageIdx));

    // Update dots
    const dots = dotsWrap.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === pageIdx));
  }

  // Switch category
  function goTo(idx) {
    current = idx;

    // Show/hide categories
    track.querySelectorAll('.skill-category').forEach((c, i) => {
      c.classList.toggle('active', i === idx);
      // Reset to first page when switching category
      c.querySelectorAll('.carousel-slide').forEach((p, pi) => {
        p.classList.toggle('active', pi === 0);
      });
    });

    // Update tabs and dropdown
    tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
    if (dropdown) dropdown.value = idx;
    labelEl.textContent = slides[idx].label;

    // Rebuild dots for this category
    buildDots(idx);
  }

  // Events
  tabs.forEach(tab => tab.addEventListener('click', () => goTo(+tab.dataset.slide)));
  if (dropdown) dropdown.addEventListener('change', () => goTo(+dropdown.value));

  // Swipe to change page within category
  let touchStartX = 0;
  const wrap = document.querySelector('.carousel-track-wrap');
  wrap.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, {passive:true});
  wrap.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      const categoryWrap = track.querySelector(`.skill-category[data-category="${current}"]`);
      const pages = categoryWrap.querySelectorAll('.carousel-slide');
      const activePage = [...pages].findIndex(p => p.classList.contains('active'));
      const nextPage = dx < 0
        ? Math.min(activePage + 1, pages.length - 1)
        : Math.max(activePage - 1, 0);
      goToPage(current, nextPage);
    }
  }, {passive:true});

  // Initialize
  labelEl.textContent = slides[0].label;
  buildDots(0);
}

function renderProjectCarousel(projects) {
  const track = document.getElementById('projTrack');
  const prevBtn = document.getElementById('projPrev');
  const nextBtn = document.getElementById('projNext');
  const counter = document.getElementById('projCurrent');
  const totalEl = document.getElementById('projTotal');
  const dotsWrap = document.getElementById('projDots');

  track.innerHTML = projects.map((project, idx) => `
    <div class="proj-slide">
      <div class="project-card">
        <div class="project-num">${String(idx + 1).padStart(2, '0')}</div>
        <div class="project-icon"><i class="${project.icon}"></i></div>
        <div class="project-title">${project.title}</div>
        <div class="project-detail-org">${project.creation}</div>
        <p class="project-desc">${project.description}</p>
        <div class="project-tech" style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;">
          ${project.tech.map(tech => `<span class="tech-pill">${tech}</span>`).join('')}
        </div>
        <a href="${project.github}" target="_blank" class="project-link"><i class="fab fa-github"></i> View on GitHub</a>
      </div>
    </div>
  `).join('');

  let slides = track.querySelectorAll('.proj-slide');
  let perView = window.innerWidth <= 700 ? 1 : 2;
  let current = 0;

  function updateSlideSizes() {
    slides = track.querySelectorAll('.proj-slide');
    slides.forEach(s => s.style.minWidth = `${100 / perView}%`);
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const count = Math.ceil(slides.length / perView);
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = `proj-dot${i === 0 ? ' active' : ''}`;
      dot.dataset.pair = i;
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateCounter() {
    const from = current * perView + 1;
    const to = Math.min(from + perView - 1, slides.length);
    counter.textContent = perView === 1 ? from : `${from}–${to}`;
  }

  function goTo(idx) {
    current = idx;
    track.style.transform = `translateX(-${current * 100}%)`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= Math.ceil(slides.length / perView) - 1;
    dotsWrap.querySelectorAll('.proj-dot').forEach((dot, i) => dot.classList.toggle('active', i === current));
    updateCounter();
  }

  function refresh() {
    perView = window.innerWidth <= 700 ? 1 : 2;
    updateSlideSizes();
    buildDots();
    goTo(0);
  }

  prevBtn.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
  nextBtn.addEventListener('click', () => { if (current < Math.ceil(slides.length / perView) - 1) goTo(current + 1); });
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    const maxPair = Math.ceil(slides.length / perView) - 1;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? Math.min(current + 1, maxPair) : Math.max(current - 1, 0));
  }, {passive:true});

  let touchX = 0;
  totalEl.textContent = slides.length;
  refresh();
  window.addEventListener('resize', refresh);
}

function renderExperience(experience) {
  const timeline = document.getElementById('expTimeline');
  const detailContainer = document.getElementById('expDetail');
  const emptyState = document.getElementById('expEmpty');

  timeline.innerHTML = '';
  detailContainer.querySelectorAll('.exp-detail-content').forEach(node => node.remove());

  experience.forEach(exp => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    timelineItem.dataset.exp = exp.id;
    timelineItem.innerHTML = `
      <div class="timeline-dot ${exp.completed ? 'dot-filled' : 'dot-empty'}"></div>
      <div class="timeline-body">
        <div class="timeline-role">
          <span class="timeline-role-text">${exp.title}</span>
          <i class="fas fa-chevron-right timeline-chevron"></i>
        </div>
        <div class="timeline-org">${exp.org}</div>
        <div class="timeline-year">${exp.year_ended}</div>
      </div>
    `;
    timeline.appendChild(timelineItem);

    const detail = document.createElement('div');
    detail.className = 'exp-detail-content';
    detail.id = `exp-${exp.id}`;
    detail.innerHTML = `
      <div class="exp-detail-tag">${exp.tag}</div>
      <div class="exp-detail-title">${exp.title}</div>
      <div class="exp-detail-org"><i class="${exp.icon}"></i> ${exp.org} &nbsp;·&nbsp; ${exp.period} &nbsp;·&nbsp; ${exp.duration}</div>
      <p class="exp-detail-desc">${exp.description}</p>
      <div class="exp-detail-section-label">${exp.skillsLabel}</div>
      <div class="exp-skills-wrap">
        ${exp.skills.map(skill => `<span class="tech-pill">${skill}</span>`).join('')}
      </div>
    `;
    detailContainer.appendChild(detail);
  });

  function showExperience(id) {
    document.querySelectorAll('.timeline-item').forEach(item => item.classList.toggle('active', item.dataset.exp === id));
    document.querySelectorAll('.exp-detail-content').forEach(content => content.classList.toggle('active', content.id === `exp-${id}`));
    emptyState.style.display = 'none';
  }

  timeline.addEventListener('click', event => {
    const item = event.target.closest('.timeline-item');
    if (!item) return;
    showExperience(item.dataset.exp);
  });
}

loadSiteData();

// Scroll reveal
const reveals=document.querySelectorAll('.reveal');
const obs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*70);obs.unobserve(e.target);}});
},{threshold:0.08});
reveals.forEach(el=>obs.observe(el));


