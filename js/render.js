const arr = (v) => (Array.isArray(v) ? v : []);

const initials = (n = "") =>
  n
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

const linkUrl = (u = "") => {
  u = u.trim();
  if (!u) return "#";
  return /^(https?:\/\/|mailto:)/i.test(u) ? u : "https://" + u;
};

const photo = (p) =>
  p.profile_picture_url
    ? `<img class="avatar" src="${esc(p.profile_picture_url)}" alt="${esc(p.full_name)}">`
    : `<div class="avatar ph">${esc(initials(p.full_name))}</div>`;

const contactBits = (p) =>
  [
    p.email ? `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>` : "",
    p.phone ? `<span>${esc(p.phone)}</span>` : "",
    p.address ? `<span>${esc(p.address)}</span>` : "",
  ].filter(Boolean);

const linkBits = (p) =>
  arr(p.social_links)
    .filter((l) => l.url)
    .map(
      (l) =>
        `<a href="${esc(linkUrl(l.url))}" target="_blank" rel="noopener">${esc(l.label || l.url)}</a>`,
    );

const projLink = (pr) =>
  pr.link
    ? ` <a class="plink" href="${esc(linkUrl(pr.link))}" target="_blank" rel="noopener">View &rarr;</a>`
    : "";

/* ---------- TEMPLATE 1: SIMPLE ---------- */
function renderSimple(p) {
  const sec = (t, h) => (h ? `<section><h2>${t}</h2>${h}</section>` : "");
  const edu = arr(p.education)
    .map(
      (e) =>
        `<div class="item"><strong>${esc(e.degree)}</strong><div>${esc(e.school)}${e.year ? " · " + esc(e.year) : ""}</div></div>`,
    )
    .join("");
  const exp = arr(p.experience)
    .map(
      (x) =>
        `<div class="item"><strong>${esc(x.role)}</strong> — ${esc(x.company)}<div class="muted">${esc(x.period)}</div><p class="pre">${esc(x.description)}</p></div>`,
    )
    .join("");
  const proj = arr(p.projects)
    .map(
      (pr) =>
        `<div class="item"><strong>${esc(pr.title)}</strong>${projLink(pr)}<p class="pre">${esc(pr.description)}</p></div>`,
    )
    .join("");
  const skills = arr(p.skills).length
    ? `<p>${arr(p.skills)
        .map((s) => esc(s))
        .join(" · ")}</p>`
    : "";

  return `<div class="t-simple"><div class="page">
    <header>${photo(p)}<h1>${esc(p.full_name)}</h1>
      <p>${contactBits(p).join(" · ")}</p><p>${linkBits(p).join(" · ")}</p></header>
    ${sec("About Me", p.about ? `<p class="pre">${esc(p.about)}</p>` : "")}
    ${sec("Education", edu)}${sec("Skills", skills)}${sec("Projects", proj)}${sec("Work Experience", exp)}
  </div></div>`;
}

/* ---------- TEMPLATE 2: MODERN ---------- */
function renderModern(p) {
  const panel = (t, h) =>
    h ? `<section class="panel"><h2>${t}</h2>${h}</section>` : "";
  const chips = [...contactBits(p), ...linkBits(p)].join("");
  const edu = arr(p.education)
    .map(
      (e) =>
        `<div class="mini"><strong>${esc(e.degree)}</strong><div>${esc(e.school)}</div><div class="muted">${esc(e.year)}</div></div>`,
    )
    .join("");
  const proj = arr(p.projects)
    .map(
      (pr) =>
        `<div class="mini"><strong>${esc(pr.title)}</strong><p class="pre">${esc(pr.description)}</p>${projLink(pr)}</div>`,
    )
    .join("");
  const exp = arr(p.experience)
    .map(
      (x) =>
        `<div class="mini"><strong>${esc(x.role)}</strong><div>${esc(x.company)}</div><div class="muted">${esc(x.period)}</div><p class="pre">${esc(x.description)}</p></div>`,
    )
    .join("");
  const skills = arr(p.skills)
    .map((s) => `<span class="tag">${esc(s)}</span>`)
    .join("");

  return `<div class="t-modern">
    <header class="hero">${photo(p)}<h1>${esc(p.full_name)}</h1><div class="chips">${chips}</div></header>
    <div class="wrap">
      ${panel("About Me", p.about ? `<p class="pre">${esc(p.about)}</p>` : "")}
      ${panel("Skills", skills)}
      ${panel("Projects", proj ? `<div class="cards">${proj}</div>` : "")}
      ${panel("Work Experience", exp ? `<div class="cards">${exp}</div>` : "")}
      ${panel("Education", edu ? `<div class="cards">${edu}</div>` : "")}
    </div></div>`;
}

/* ---------- TEMPLATE 3: CREATIVE ---------- */
function renderCreative(p) {
  let n = 0;
  const block = (t, h) =>
    h ? `<div class="block"><h2><span>0${++n}</span>${t}</h2>${h}</div>` : "";
  const note = (h) => `<div class="note">${h}</div>`;
  const proj = arr(p.projects)
    .map((pr) =>
      note(
        `<strong>${esc(pr.title)}</strong>${projLink(pr)}<p class="pre">${esc(pr.description)}</p>`,
      ),
    )
    .join("");
  const exp = arr(p.experience)
    .map((x) =>
      note(
        `<strong>${esc(x.role)}</strong> @ ${esc(x.company)}<div class="muted">${esc(x.period)}</div><p class="pre">${esc(x.description)}</p>`,
      ),
    )
    .join("");
  const edu = arr(p.education)
    .map((e) =>
      note(
        `<strong>${esc(e.degree)}</strong><div>${esc(e.school)} ${e.year ? "· " + esc(e.year) : ""}</div>`,
      ),
    )
    .join("");
  const skills = arr(p.skills)
    .map((s) => `<span class="pill">${esc(s)}</span>`)
    .join("");

  return `<div class="t-creative">
    <aside>${photo(p)}
      <h3>Contact</h3>${contactBits(p)
        .map((c) => `<div class="line">${c}</div>`)
        .join("")}
      ${
        linkBits(p).length
          ? `<h3>Find me</h3>${linkBits(p)
              .map((c) => `<div class="line">${c}</div>`)
              .join("")}`
          : ""
      }
      ${skills ? `<h3>Skills</h3>${skills}` : ""}
    </aside>
    <main>
      <div class="hi">Hello, I'm</div><h1>${esc(p.full_name)}</h1>
      ${p.about ? `<p class="pre lead">${esc(p.about)}</p>` : ""}
      ${block("Projects", proj)}${block("Experience", exp)}${block("Education", edu)}
    </main></div>`;
}
