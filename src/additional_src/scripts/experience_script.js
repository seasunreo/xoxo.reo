fetch('./data/experience_details.json')
.then(r => {
    if (!r.ok) throw new Error('Failed to fetch experience data');
    return r.json();
})
.then(experiences => {
    const list = document.getElementById('experience-list');
    if (!list) {
        console.error('experience-list element not found');
    return;
    }

    experiences.forEach((exp, i) => {
    const isLast = i === experiences.length - 1;

    const bullet = exp.completed
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" class="bi bi-circle-fill fill-[rgb(230,168,215)]" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="8"/>
            </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="7.25" fill="#2d1f29" stroke="rgb(230,168,215)" stroke-width="1.5"
                class="group-hover:fill-[rgb(230,168,215)] transition-colors duration-300"/>
            </svg>`;

    const li = document.createElement('li');
    li.className = 'relative flex items-start gap-6 pb-5';

    const bulletDiv = document.createElement('div');
    bulletDiv.className = 'relative flex-shrink-0';

    if (!isLast) {
        const lineEl = document.createElement('div');
        lineEl.style.cssText = `
        position: absolute;
        left: 5.5px;
        top: 12px;
        bottom: 0;
        width: 1px;
        background-color: rgb(230, 168, 215);
        pointer-events: none;
        `;
        li.appendChild(lineEl);
    }

    bulletDiv.innerHTML = bullet;
    li.appendChild(bulletDiv);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'flex-1';
    contentDiv.innerHTML = `
        <div class="flex justify-between items-baseline">
            <div>
                <p class="text-sm text-white font-medium">${exp.title}</p>
                <p class="mt-1 text-gray-400 text-xs font-medium">${exp.org}</p>
                <p class="mt-2 text-xs text-gray-400">${exp.period} &nbsp;·&nbsp; ${exp.duration}</p>
            </div>
            <div class="flex items-center gap-2 ml-4">
                <span class="text-xs text-gray-400 whitespace-nowrap">${exp.year_ended}</span>
                <button
                    aria-expanded="false"
                    aria-controls="panel-${i}"
                    class="text-[rgb(230,168,215)] focus:outline-none flex-shrink-0"
                    onclick="toggleExp(this, 'panel-${i}')">
                        <svg class="chevron transition-transform duration-200" width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <path d="M2 5l6 6 6-6" stroke="rgb(230,168,215)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                </button>
            </div>
        </div>

        <div id="panel-${i}" class="overflow-hidden transition-all duration-300 max-h-0 mt-2">
            <!--<p class="mt-2 text-xs text-gray-400">${exp.period} &nbsp;·&nbsp; ${exp.duration}</p>-->
            <ul class="mt-1 flex flex-col gap-1">
                ${(Array.isArray(exp.description) ? exp.description : [exp.description]).map(point => `
                    <li class="text-sm text-white leading-relaxed flex items-start gap-2 ">
                        <span style="margin-top: 10px; flex-shrink: 0; width: 4px; height: 4px; border-radius: 50%; background-color: rgb(230, 168, 215); display: inline-block;"></span>
                        <span>${point}</span>
                    </li>
                `).join('')}
            </ul>
            <!--<p class="mt-3 text-xs text-[rgb(230,168,215)]">${exp.skillsLabel}</p>
            <div class="flex flex-wrap gap-1 mt-1">
            ${exp.skills.map(s => `
                <span class="text-[10px] px-2 py-0.5 tech-stack-boxes text-white">
                ${s}
                </span>`).join('')}
            </div>-->
        </div>`;

    li.appendChild(contentDiv);
    list.appendChild(li);
    });
})
.catch(err => {
    console.error('Error loading experience data:', err);
    const list = document.getElementById('experience-list');
    if (list) {
    list.innerHTML = '<li class="text-red-500">Failed to load experience data</li>';
    }
});

function toggleExp(btn, id) {
    const panel = document.getElementById(id);
    const open = btn.getAttribute('aria-expanded') === 'true';
    panel.style.maxHeight = open ? '0' : panel.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', String(!open));
    btn.querySelector('.chevron').style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
}