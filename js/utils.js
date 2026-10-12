const $ = (id) => document.getElementById(id);

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const getParam = (name) => new URLSearchParams(location.search).get(name);
