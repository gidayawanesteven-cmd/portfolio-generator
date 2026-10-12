const id = getParam("id");
const previewKey = getParam("template");
const renderers = {
  simple: renderSimple,
  modern: renderModern,
  creative: renderCreative,
};

function showError(text) {
  $("portfolio").innerHTML =
    `<div class="container"><div class="msg">${esc(text)}</div>
     <a class="btn btn-primary" href="manage.html">Go to Manage Portfolios</a></div>`;
}

async function init() {
  if (!id) return showError("No portfolio selected.");
  try {
    const p = await getPortfolio(id);
    const isPreview = !!renderers[previewKey];
    const key = isPreview
      ? previewKey
      : renderers[p.template]
        ? p.template
        : "simple";

    $("portfolio").innerHTML = renderers[key](p);
    document.title = p.full_name + " - Portfolio";
    $("toolbar").hidden = false;
    $("modeBadge").textContent = (isPreview ? "Preview: " : "Template: ") + key;

    if (isPreview) {
      $("actions").innerHTML = `
        <a class="btn btn-ghost btn-sm" href="templates.html?id=${esc(id)}">&larr; Back</a>
        <button id="useBtn" class="btn btn-primary btn-sm">Use this template</button>`;
      $("useBtn").onclick = async () => {
        $("useBtn").disabled = true;
        try {
          await updatePortfolio(id, { template: key });
          location.href = `view.html?id=${id}`;
        } catch (e) {
          alert("Could not save: " + e.message);
          $("useBtn").disabled = false;
        }
      };
    } else {
      $("actions").innerHTML = `
        <a class="btn btn-ghost btn-sm" href="form.html?id=${esc(id)}">Edit info</a>
        <a class="btn btn-ghost btn-sm" href="templates.html?id=${esc(id)}">Change template</a>
        <a class="btn btn-ghost btn-sm" href="manage.html">Manage</a>
        <button id="copyBtn" class="btn btn-primary btn-sm">Copy share link</button>`;
      $("copyBtn").onclick = async () => {
        const u = new URL(location.href);
        u.searchParams.delete("template");
        try {
          await navigator.clipboard.writeText(u.href);
          $("copyBtn").textContent = "Copied!";
        } catch {
          prompt("Copy this link:", u.href);
        }
      };
    }
  } catch (e) {
    showError("Could not load portfolio: " + e.message);
  }
}
init();
