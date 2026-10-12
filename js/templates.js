const id = getParam("id");

const TEMPLATES = [
  {
    key: "simple",
    name: "Simple",
    desc: "Clean and professional single-column layout.",
  },
  {
    key: "modern",
    name: "Modern",
    desc: "Cards, sections, and a bold gradient header.",
  },
  {
    key: "creative",
    name: "Creative",
    desc: "Colorful sidebar with an asymmetric layout.",
  },
];

function showMsg(text) {
  $("msg").textContent = text;
  $("msg").hidden = false;
}

async function init() {
  if (!id) return showMsg("No portfolio selected. Please create one first.");

  let current = "simple";
  try {
    const p = await getPortfolio(id);
    current = p.template || "simple";
  } catch (e) {
    return showMsg("Could not load portfolio: " + e.message);
  }

  $("tplGrid").innerHTML = TEMPLATES.map(
    (t) => `
    <div class="tpl-card ${t.key === current ? "selected" : ""}">
      <div class="thumb ${t.key}"></div>
      <div class="body">
        <h3>${t.name} ${t.key === current ? '<span class="badge">Current</span>' : ""}</h3>
        <p class="muted">${t.desc}</p>
        <div class="actions">
          <a class="btn btn-ghost btn-sm" href="view.html?id=${esc(id)}&template=${t.key}">Preview</a>
          <button class="btn btn-primary btn-sm" data-key="${t.key}">Select &amp; Generate</button>
        </div>
      </div>
    </div>`,
  ).join("");

  document.querySelectorAll("[data-key]").forEach((b) => {
    b.onclick = async () => {
      b.disabled = true;
      b.textContent = "Saving...";
      try {
        await updatePortfolio(id, { template: b.dataset.key });
        location.href = `view.html?id=${id}`;
      } catch (e) {
        showMsg("Could not save template: " + e.message);
        b.disabled = false;
        b.textContent = "Select & Generate";
      }
    };
  });
}
init();
