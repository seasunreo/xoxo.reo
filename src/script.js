document.getElementById("year").textContent = new Date().getFullYear();

let projects = [];

fetch('./data/project_details.json')
  .then(res => res.json())
  .then(data => {
    projects = data;
  })
  .catch(err => console.error(err));

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".project-boxes");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  openModal(id);
});

function openModal(id) {
  const dialog = document.getElementById("dialog");
  const panel = document.getElementById("modal-panel");

  const project = projects.find(p => p.id === id);
  if (!project || !dialog) return;

  document.getElementById("dialog-title").innerText = project.title;
  document.getElementById("dialog-desc").innerText = project.description;

  if (panel) {
    panel.style.backgroundImage = `url('${project.image}')`;
  }

    const githubBtn = document.getElementById("github-btn");
  if (githubBtn) {
    githubBtn.href = project.github;
  }


  dialog.showModal();
}

function closeModal() {
  document.getElementById("dialog")?.close();
}

fetch("./data/techstack_details.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("tech-stacks");

    data.stacks.forEach(section => {
      const div = document.createElement("div");

      div.innerHTML = `
        <h3 class="text-sm font-semibold mb-2 text-white">
          ${section.category}
        </h3>

        <div class="flex flex-wrap gap-2">
          ${section.items
            .map(
              tech => `
                <span class="inline-flex px-3 py-1 text-xs font-medium div-text shadow-[0_1px_1px_rgba(0,0,0,0.03)] tech-stack-boxes">
                  ${tech}
                </span>
              `
            )
            .join("")}
        </div>
      `;

      container.appendChild(div);
    });
  });