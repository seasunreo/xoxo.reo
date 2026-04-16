let projects = [];

// LOAD JSON
fetch('projects-data/project_details.json')
  .then(res => res.json())
  .then(data => {
    projects = data;
  })
  .catch(err => console.error(err));


// CLICK HANDLER (FIXED)
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".project-boxes");
  if (!btn) return;

  const id = Number(btn.dataset.id); // ✅ FIX HERE
  openModal(id);
});


// OPEN MODAL
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


// CLOSE MODAL
function closeModal() {
  document.getElementById("dialog")?.close();
}