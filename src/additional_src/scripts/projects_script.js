fetch('../data/project_details.json')
.then(r => {
    if (!r.ok) throw new Error('Failed to fetch project data');
    return r.json();
})
.then(data => {

    const container = document.getElementById('projects-container');

    if (!container) {
        console.error('projects-container element not found');
        return;
    }

    const projects = data.projects;

    projects.forEach((project, i) => {

        const a = document.createElement('a');
        a.href = project.link;
        a.target = "_blank";
        a.setAttribute('data-year', project.year);

        a.className = `
            flex flex-col gap-4 rounded-lg p-4
            fade-up tech-stack-boxes transition-all duration-200
            hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]
            hover:border-pink-300 cursor-pointer
        `;

        const techStackHTML = project.tech.map(tech => `
            <span class="inline-flex px-3 py-1 text-xs font-medium div-text
                shadow-[0_1px_1px_rgba(0,0,0,0.03)] tech-stack-boxes">
                ${tech}
            </span>
        `).join('');

        a.innerHTML = `
            <div class="flex items-start p-2 gap-4 h-full">
                <i class="${project.icon} mt-1" style="color: ${project.color};"></i>
                <div class="flex flex-col flex-1 w-full text-left">
                    <span class="text-base text-white font-bold div-title">${project.title}</span>
                    <p class="text-sm text-white text-justify mt-2">
                        ${project.description}
                    </p>
                    <div class="mt-4">
                        <h3 class="text-sm font-semibold mb-2 div-title">Tech Stack</h3>
                        <div class="flex flex-wrap gap-2">
                            ${techStackHTML}
                        </div>
                    </div>
                </div>
                <span class="text-xs text-gray-400 whitespace-nowrap mt-1">
                    ${project.year}
                </span>
            </div>
        `;

        container.appendChild(a);

    });

})
.catch(err => {
    console.error('Error loading project data:', err);

    const container = document.getElementById('projects-container');
    if (container) {
        container.innerHTML = `
            <p class="text-red-500 text-sm">
                Failed to load project data
            </p>
        `;
    }
});