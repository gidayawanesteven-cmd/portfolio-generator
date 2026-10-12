const editId = getParam("id");
let photoUrl = "";

const groups = {
  education: [
    ["school", "School"],
    ["degree", "Degree / Course"],
    ["year", "Year"],
  ],
  projects: [
    ["title", "Project title"],
    ["description", "Description", "textarea"],
    ["link", "Link (optional)"],
  ],
  experience: [
    ["company", "Company"],
    ["role", "Role"],
    ["period", "Period"],
    ["description", "Description", "textarea"],
  ],
  links: [
    ["label", "Label (e.g. GitHub)"],
    ["url", "URL"],
  ],
};

function addEntry(group, values = {}) {
  const box = document.createElement("div");
  box.className = "entry";
  box.innerHTML =
    groups[group]
      .map(([key, label, tag]) => {
        const val = esc(values[key] || "");
        return (
          `<label>${label}</label>` +
          (tag === "textarea"
            ? `<textarea data-key="${key}" rows="3">${val}</textarea>`
            : `<input data-key="${key}" value="${val}">`)
        );
      })
      .join("") +
    `<button type="button" class="btn btn-danger btn-sm remove">Remove</button>`;
  box.querySelector(".remove").onclick = () => box.remove();
  $(group).appendChild(box);
}

function readGroup(group) {
  return [...$(group).querySelectorAll(".entry")]
    .map((box) => {
      const obj = {};
      box
        .querySelectorAll("[data-key]")
        .forEach((el) => (obj[el.dataset.key] = el.value.trim()));
      return obj;
    })
    .filter((o) => Object.values(o).some((v) => v));
}

function showMsg(text) {
  $("msg").textContent = text;
  $("msg").hidden = false;
}

document.querySelectorAll("[data-add]").forEach((b) => {
  b.onclick = () => addEntry(b.dataset.add);
});

$("photo").onchange = (e) => {
  const file = e.target.files[0];
  if (file) {
    $("photoPreview").src = URL.createObjectURL(file);
    $("photoPreview").hidden = false;
  }
};

$("portfolioForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("saveBtn");
  btn.disabled = true;
  btn.textContent = "Saving...";
  $("msg").hidden = true;
  try {
    const file = $("photo").files[0];
    if (file) photoUrl = await uploadPhoto(file);

    const data = {
      full_name: $("full_name").value.trim(),
      email: $("email").value.trim(),
      phone: $("phone").value.trim(),
      address: $("address").value.trim(),
      about: $("about").value.trim(),
      profile_picture_url: photoUrl,
      education: readGroup("education"),
      skills: $("skills")
        .value.split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      projects: readGroup("projects"),
      experience: readGroup("experience"),
      social_links: readGroup("links"),
    };

    const row = editId
      ? await updatePortfolio(editId, data)
      : await savePortfolio(data);
    location.href = `templates.html?id=${row.id}`;
  } catch (err) {
    showMsg("Could not save: " + err.message);
    btn.disabled = false;
    btn.textContent = "Save and Choose Template";
  }
});

async function init() {
  if (!editId) {
    ["education", "projects", "experience", "links"].forEach((g) =>
      addEntry(g),
    );
    return;
  }
  $("pageTitle").textContent = "Edit Portfolio";
  try {
    const p = await getPortfolio(editId);
    $("full_name").value = p.full_name || "";
    $("email").value = p.email || "";
    $("phone").value = p.phone || "";
    $("address").value = p.address || "";
    $("about").value = p.about || "";
    $("skills").value = (p.skills || []).join(", ");
    photoUrl = p.profile_picture_url || "";
    if (photoUrl) {
      $("photoPreview").src = photoUrl;
      $("photoPreview").hidden = false;
    }
    [
      ["education", p.education],
      ["projects", p.projects],
      ["experience", p.experience],
      ["links", p.social_links],
    ].forEach(([g, list]) => {
      (list && list.length ? list : [{}]).forEach((v) => addEntry(g, v));
    });
  } catch (err) {
    showMsg("Could not load portfolio: " + err.message);
  }
}
init();
