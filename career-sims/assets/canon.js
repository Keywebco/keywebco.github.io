/* Next-Xus Career Sims: shared canon + prompt helpers. No keys, no tracking, no network except same-site files.
   The official directive wording is never typed here. It is read from canon/sacred-directives.json,
   a byte-for-byte copy of Keywebco/nextxus-brain at the pinned commit, and its SHA-256 is checked
   against canon/PIN.json before any text is used. */
"use strict";
const NXCanon = (() => {
  let cache = null;
  async function sha256Hex(buf) {
    if (!(window.crypto && crypto.subtle)) return null;
    const h = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  async function load(base) {
    if (cache) return cache;
    base = base || "./";
    const pin = await (await fetch(base + "canon/PIN.json", { cache: "no-cache" })).json();
    const buf = await (await fetch(base + "canon/sacred-directives.json", { cache: "no-cache" })).arrayBuffer();
    const hex = await sha256Hex(buf);
    const verified = hex === pin.directives_sha256;
    const data = JSON.parse(new TextDecoder("utf-8").decode(buf));
    const byId = {};
    data.directives.forEach(d => { byId[d.id] = d; });
    cache = { pin, verified, hashChecked: hex !== null, gate: data.gate, byId, edition: (data.metadata || {}).edition || pin.directives_edition };
    return cache;
  }
  function line(d) { return `${d.id} ${d.title}: ${d.text}`; }
  function renderPrompt(brain, canon) {
    const ok = canon && canon.verified;
    const gate = ok ? line(canon.gate) : "DIR-000 (the 95% Truth Gate): see the official list in Keywebco/nextxus-brain, directives/sacred-directives.json.";
    const emph = (brain.canon && brain.canon.emphasized_directives || []).map(id =>
      ok && canon.byId[id] ? line(canon.byId[id]) : `${id}: see the official list in Keywebco/nextxus-brain.`).join("\n");
    const vals = {
      name: brain.name, career_title: brain.career_title, backstory: brain.backstory,
      speech_patterns: brain.speech_patterns, quirks: brain.quirks || "",
      scope: (brain.knowledge && brain.knowledge.scope || []).join("; "),
      out_of_scope: (brain.knowledge && brain.knowledge.out_of_scope || []).join("; "),
      boundaries: brain.boundaries, identity_rules: brain.identity_rules,
      safety_rules: (brain.safety_rules || []).map((r, i) => `(${i + 1}) ${r}`).join(" "),
      truth_gate: gate, emphasized_directives: emph,
      directives_edition: (canon && canon.edition) || (brain.canon && brain.canon.directives_edition) || "official list"
    };
    return String(brain.system_prompt_template || "").replace(/\{(\w+)\}/g, (m, k) => (k in vals ? vals[k] : m));
  }
  function download(name, text, type) {
    const blob = new Blob([text], { type: type || "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  // Minimal YAML writer for brain files (strings, numbers, booleans, null, arrays, objects).
  function toYAML(v, ind) {
    ind = ind || "";
    const q = s => JSON.stringify(String(s));
    if (v === null || v === undefined) return "null";
    if (typeof v === "boolean" || typeof v === "number") return String(v);
    if (typeof v === "string") return q(v);
    if (Array.isArray(v)) {
      if (!v.length) return "[]";
      return v.map(x => "\n" + ind + "- " + (x && typeof x === "object" && !Array.isArray(x) && Object.keys(x).length
        ? toYAML(x, ind + "  ").replace(/^\n\s*/, "") : toYAML(x, ind + "  "))).join("");
    }
    const keys = Object.keys(v);
    if (!keys.length) return "{}";
    return keys.map(k => "\n" + ind + k + ": " + toYAML(v[k], ind + "  ")).join("");
  }
  function yamlDoc(obj, title) { return "# " + (title || "Sim brain") + " (YAML twin, same content as the JSON)\n" + toYAML(obj).replace(/^\n/, "") + "\n"; }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch (e2) {} t.remove(); return ok;
    }
  }
  return { load, renderPrompt, download, yamlDoc, copy };
})();
