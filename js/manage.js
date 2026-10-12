function showMsg(text) {
  $("msg").textContent = text;
  $("msg").hidden = false;
}

function cardHtml(p) {
  const avatar = p.profile_picture_url
    ? `<img class="thumb-avatar" src="${esc(p.profile_picture_url)}" alt="">`
    : `<div class="thumb-avatar ph">${esc(initials(p.full_name))}</div>`;
  const date = new Date(p.created_at).toLocaleDateString();
  return `
    <div class="p-card">
      ${avatar}
      <div class="info">
        <strong>${esc(p.full_name)}</strong>
        <div class="muted">${esc(p.email)}</div>
        <div class="muted">Template: ${esc(p.template || "simple")} · Created ${esc(date)}</div>
      </div>
      <div class="p-actions">
        <a class="btn btn-ghost btn-sm" href="view.html?id=${esc(p.id)}">View</a>
        <a class="btn btn-ghost btn-sm" href="form.html?id=${esc(p.id)}">Edit</a>
        <button class="btn btn-danger btn-sm" data-del="${esc(p.id)}" data-name="${esc(p.full_name)}">Delete</button>
      </div>
    </div>`;
}

async function load() {
  $("msg").hidden = true;
  try {
    const rows = await listPortfolios();
    if (!rows.length) {
      $("list").innerHTML = `
        <div class="card empty">
          <h3>No portfolios yet</h3>
          <p class="muted">Create your first one to get started.</p><br>
          <a class="btn btn-primary" href="form.html">Create Portfolio</a>
        </div>`;
      return;
    }
    $("list").innerHTML = rows.map(cardHtml).join("");
    document.querySelectorAll("[data-del]").forEach((b) => {
      b.onclick = async () => {
        if (
          !confirm(
            `Delete ${b.dataset.name}'s portfolio? This cannot be undone.`,
          )
        )
          return;
        b.disabled = true;
        try {
          await deletePortfolio(b.dataset.del);
          load();
        } catch (e) {
          showMsg("Could not delete: " + e.message);
          b.disabled = false;
        }
      };
    });
  } catch (e) {
    $("list").innerHTML = "";
    showMsg("Could not load portfolios: " + e.message);
  }
}
load();
