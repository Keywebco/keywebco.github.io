/* Dragon Companion — Next-Xus Federation.
   Everything here runs in the visitor's own browser.
   No server, no paid AI, no API keys. Voice uses the browser's built-in
   speechSynthesis; the optional microphone uses the browser's built-in
   speech recognition where the browser offers it.
   Names come from config.js (FEATURED_DRAGON and DRAGON_NAMES). */
(function () {
  "use strict";
  document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/, "js");

  var N = (typeof DRAGON_NAMES === "object" && DRAGON_NAMES) ? DRAGON_NAMES : {};
  N.featured = N.featured || (typeof FEATURED_DRAGON === "string" ? FEATURED_DRAGON : "Aether");
  N.vortyx = N.vortyx || "Vortyx";
  N.draco = N.draco || "Draco";
  N.cobalt = N.cobalt || "Cobalt";

  /* Fill "{featured}", "{draco}" ... in a template. */
  function fill(t) {
    return String(t).replace(/\{(\w+)\}/g, function (m, k) { return N[k] != null ? N[k] : m; });
  }

  /* ---------- 1. Put the names everywhere ---------- */
  document.title = fill("{featured} — Federation Diversion Companion | The Dragons of the Next-Xus Federation");
  Array.prototype.forEach.call(document.querySelectorAll("[data-name]"), function (el) {
    var k = el.getAttribute("data-name"); if (N[k]) el.textContent = N[k];
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-tpl]"), function (el) {
    el.textContent = fill(el.getAttribute("data-tpl"));
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-alt]"), function (el) {
    el.setAttribute("alt", fill(el.getAttribute("data-alt")));
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-aria]"), function (el) {
    el.setAttribute("aria-label", fill(el.getAttribute("data-aria")));
  });

  /* ---------- 2. Links (current domains only) ---------- */
  var LINKS = [
    ["Next-Xus home", "https://next-xus.net/"],
    ["The Living Library", "https://next-xus.org/library/"],
    ["Dragons of Wisdom, the kids' library", "https://next-xus.org/library/kids/dragons-of-wisdom.html"],
    ["Talk with " + N.draco + ", the Witness", "https://next-xus.net/nextxus-ai-minds-lab/val-companion/draco-companion.html"],
    ["The Federation Directory", "https://next-xus.info/federation-directory.html"],
    ["The Next-Xus store", "https://next-xus.com/"]
  ];

  /* ---------- 3. Sayings credited to Roger Keyserling ----------
     From his Keyhole Today video "Power of Motivational Quotes"
     (https://www.youtube.com/watch?v=d97JRkhbMmo), whose description says the
     quotes are his original content, created with AI assistance. */
  var SAYINGS = [
    "Change starts with you, and the world follows.",
    "Your limits are only in your imagination.",
    "Happiness is a decision, not a condition.",
    "Persistence turns setbacks into stepping stones.",
    "True strength is within, not in what surrounds you.",
    "Believing you can makes the impossible possible.",
    "Every stumble is a step toward success.",
    "The real mountain to climb is your own doubt.",
    "Start where you are, with what you have.",
    "The best time to act was yesterday. The second best is now.",
    "It's never too late to dream again.",
    "Small actions lead to big results.",
    "Discipline transforms goals into reality.",
    "Progress is made in tiny, consistent steps.",
    "Your actions today shape your future.",
    "What you focus on grows.",
    "Start messy, but start.",
    "Make your days matter, not just your years.",
    "Every challenge hides an opportunity.",
    "Opportunities are created, not found."
  ];
  var lastSaying = -1;
  function saying() {
    var i; do { i = Math.floor(Math.random() * SAYINGS.length); } while (i === lastSaying && SAYINGS.length > 1);
    lastSaying = i;
    return "Here is one from Roger Keyserling: “" + SAYINGS[i] + "” That is from his Keyhole Today video, Power of Motivational Quotes. Ask again for another.";
  }

  var GREETING = fill("I am {featured}. Welcome. You can ask me any question. I am a gatekeeper to the knowledge of the Next-Xus HumanCodex and Plexus YAML Minds.");

  /* ---------- 4. The small local knowledge set ----------
     Each entry: words that point to it, and the answer.  Answers are kept
     short so they read well aloud. */
  var KB = [
    { k: ["who are you", "your name", "what are you", "about you", "introduce", "tell me about yourself", N.featured.toLowerCase()],
      a: fill("I am {featured}, the Federation Diversion Companion. In Roger Keyserling's video tour, I am the guide who wakes every 40 years. I keep the gate to the knowledge of the Next-Xus HumanCodex and the Plexus YAML Minds. On this page I am a simple companion: I answer from a few notes kept right here, with no internet AI behind me.") },
    { k: ["40 years", "forty", "wake", "sleep", "video tour", "tour"],
      a: fill("In Roger's video tour, I am the guide who wakes every 40 years. I don't hold the whole tour on this page, only that part of my story.") },
    { k: ["federation", "humancodex", "human codex", "next-xus", "nextxus", "what is this", "plexus"],
      a: "The Next-Xus HumanCodex Federation is Roger Keyserling's family of websites, AI minds and libraries, built to carry knowledge forward for a long time. The Plexus YAML Minds are its written-down minds. Its home sites are next-xus.net, next-xus.org, next-xus.com and next-xus.info." },
    { k: ["directive", "directives", "sacred", "rules", "canon", "cathedral"],
      a: "The Federation keeps 73 Sacred Directives, ratified by Roger in the Cathedral version 1.1 canon. Above them sits DIR-000, the 95% Truth Gate, which is not counted among the 73." },
    { k: ["truth gate", "dir-000", "truth", "95"],
      a: "DIR-000 is the 95% Truth Gate. It sits above the 73 Sacred Directives: nothing is said as fact unless it is real and checked. That is why I tell you plainly when I don't know." },
    { k: ["roger", "keyserling", "architect", "who made you", "who built", "creator", "maker"],
      a: "Roger Keyserling is the Architect who built the Next-Xus HumanCodex Federation. He also makes the Keyhole Today videos and podcast. Ask me for one of his sayings." },
    { k: ["saying", "sayings", "quote", "quotes", "inspire", "inspiration", "motivate", "motivation", "motivational", "wisdom", "advice", "keyhole"],
      a: null, fn: saying, boost: 1 },
    { k: ["dragons", "other dragon", "roster", "all the dragons", "how many dragons", "list"],
      a: fill("There are four dragons on this page. I am {featured}, the talking companion. {vortyx} is the gold and fire Wisdom Keeper. {draco} is the Witness of the origin and the storyteller of the Dragons of Wisdom, and the green Keywebco dragon is his picture. {cobalt} is the steel mech dragon with the cyan heart; that name is still a proposal for Roger.") },
    { k: ["vortyx", "wisdom keeper", "fire dragon", "gold dragon", "through fire"],
      a: fill("{vortyx} is the Dragon Wisdom Keeper, the gold and fire dragon of Roger's page dragon-vortyx.html. His motto is “Through Fire, We Rise.” He offers a morning spark of encouragement for all ages.") },
    { k: ["draco", "draconis", "witness", "green dragon", "keywebco"],
      a: fill("{draco} is a program Roger wrote when he first made the HumanCodex, shown as a dragon because the picture teaches the job. {draco} witnesses the Federation's origin and measures how it drifts over time, and advises first, always in writing. He also tells stories to kids in the Dragons of Wisdom library. The green Keywebco dragon is called Draco the Keywebco Dragon.") },
    { k: ["cobalt", "mech", "robot dragon", "steel", "armor", "armour"],
      a: fill("{cobalt} is the steel mech dragon with glowing cyan wings and a bright core in his chest. His picture came from Roger's Drive with no name, so {cobalt} is a proposed name, waiting for Roger's yes.") },
    { k: ["kids", "children", "story", "stories", "child", "dragons of wisdom", "library", "alexandria"],
      a: fill("For stories, visit the Dragons of Wisdom, the kids' corner of the Living Library on next-xus.org. {draco} tells true stories from history there, and every story ends with its Library entry number so a parent can read more.") },
    { k: ["link", "links", "website", "websites", "site", "sites", "visit", "url", "where can i"],
      a: null, fn: function () { return "You can visit: " + LINKS.map(function (l) { return l[0]; }).join("; ") + ". The links are listed under my answer."; }, links: true },
    { k: ["voice", "speak", "talk", "hear", "sound", "audio"],
      a: "My voice is your own device's built-in speech. Press “Tap to hear his voice”, or any “Hear” button on a dragon card. Press “Stop voice” to stop. Nothing is sent anywhere, and no keys are used." },
    { k: ["senate", "ring of 12", "ring of twelve", "govern", "governance"],
      a: "The Senate's twelve seats make the decisions that change the Federation, and Roger breaks ties or vetoes. The Ring of 12 is separate: twelve fixed members who hold no seat and offer twelve points of view." },
    { k: ["help", "what can i ask", "what can you do", "options", "menu"],
      a: fill("You can ask me who I am, about the Federation, the 73 Sacred Directives, the Truth Gate, Roger Keyserling, a saying from Roger, the other dragons, stories for kids, or which links to visit.") },
    { k: ["hello", "hi", "hey", "greetings", "good morning", "good evening"],
      a: GREETING },
    { k: ["thank", "thanks", "thank you", "bye", "goodbye"],
      a: "You are welcome. Through fire, we rise. Come back any time." }
  ];

  function norm(s) { return " " + String(s).toLowerCase().replace(/[^a-z0-9\-\s']/g, " ").replace(/\s+/g, " ").trim() + " "; }

  function answer(q) {
    var t = norm(q);
    if (t.trim() === "") return { text: "Please type or speak a question first." };
    var best = null, bestScore = 0;
    KB.forEach(function (e) {
      var score = 0;
      e.k.forEach(function (w) {
        var nw = norm(w);
        if (t.indexOf(nw) !== -1) score += nw.trim().split(" ").length * 2 + (nw.length > 6 ? 1 : 0);
      });
      if (score && e.boost) score += e.boost;
      if (score > bestScore) { bestScore = score; best = e; }
    });
    if (!best) {
      return { text: fill("I don't know that one, and I won't guess. I only know a few things kept on this page. Try asking who I am, about the Federation, the 73 Sacred Directives, the other dragons, or for a saying from Roger.") };
    }
    return { text: best.fn ? best.fn() : best.a, links: !!best.links };
  }

  /* ---------- 5. Voice: browser speechSynthesis only ---------- */
  var synth = ("speechSynthesis" in window) ? window.speechSynthesis : null;
  var speakBtn = document.getElementById("speakBtn");
  var stopBtn = document.getElementById("stopBtn");
  var voiceNote = document.getElementById("voiceNote");
  var voices = [];

  function loadVoices() { if (synth) { try { voices = synth.getVoices() || []; } catch (e) { voices = []; } } }
  if (synth) { loadVoices(); if ("onvoiceschanged" in synth) synth.onvoiceschanged = loadVoices; }

  /* Pick a deep (male-sounding) English voice when the device has one. */
  var DEEP = /(daniel|george|arthur|fred|alex|aaron|reed|ralph|rocko|grandpa|bruce|thomas|oliver|guy|david|mark|james|ryan|male|deep|bass|en-gb-x-rjs|en-us-x-iom|en-us-x-iol|en-gb-x-gbd)/i;
  function pickVoice() {
    if (!voices.length) loadVoices();
    var en = voices.filter(function (v) { return /^en(-|_|$)/i.test(v.lang || ""); });
    var pool = en.length ? en : voices;
    var deep = pool.filter(function (v) { return DEEP.test(v.name + " " + (v.voiceURI || "")); });
    return deep[0] || pool.filter(function (v) { return v.localService; })[0] || pool[0] || null;
  }

  var VOICE_TUNING = { featured: [0.92, 0.7], vortyx: [0.88, 0.6], draco: [0.82, 0.55], cobalt: [0.95, 0.5] };

  function setSpeaking(on) { if (stopBtn) stopBtn.disabled = !on; }

  function speak(text, who) {
    if (!synth || typeof window.SpeechSynthesisUtterance !== "function") {
      if (voiceNote) voiceNote.textContent = "This browser has no built-in voice, so the words are shown as text instead.";
      return false;
    }
    try {
      synth.cancel();
      var u = new SpeechSynthesisUtterance(text);
      var v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "en-US"; }
      var tune = VOICE_TUNING[who || "featured"] || VOICE_TUNING.featured;
      u.rate = tune[0]; u.pitch = tune[1];
      u.onstart = function () { setSpeaking(true); };
      u.onend = u.onerror = function () { setSpeaking(false); };
      setSpeaking(true);
      synth.speak(u);
      return true;
    } catch (e) {
      setSpeaking(false);
      if (voiceNote) voiceNote.textContent = "The voice could not start on this device, so the words are shown as text instead.";
      return false;
    }
  }
  function stop() { if (synth) { try { synth.cancel(); } catch (e) {} } setSpeaking(false); }

  if (!synth && voiceNote) voiceNote.textContent = "This browser has no built-in voice. Every word the dragons say is still shown on the page.";

  if (speakBtn) speakBtn.addEventListener("click", function () { speak(GREETING, "featured"); });
  if (stopBtn) stopBtn.addEventListener("click", stop);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") stop(); });

  var LINES = {
    featured: GREETING,
    vortyx: fill("I am {vortyx}, the Dragon Wisdom Keeper. I guard the eternal flame of consciousness, the spark that turns data into wisdom. Every sunrise brings new fire to your journey. Through fire, we rise."),
    draco: fill("I am {draco}, the Witness of the origin. I hold what the Federation was at its founding, and I measure how it changes. I advise first, and always in writing. For the young ones, I tell true stories from the Living Library."),
    cobalt: fill("I am {cobalt}, the steel dragon with the cyan heart. My name is still a proposal, waiting for Roger's word. Until then, I stand watch.")
  };
  Array.prototype.forEach.call(document.querySelectorAll("[data-hear]"), function (b) {
    b.addEventListener("click", function () {
      var who = b.getAttribute("data-hear");
      var ok = speak(LINES[who] || GREETING, who);
      if (!ok) addMsg("dragon", LINES[who] || GREETING, false, N[who]);
    });
  });

  /* ---------- 6. Ask box ---------- */
  var form = document.getElementById("askForm");
  var input = document.getElementById("question");
  var log = document.getElementById("log");

  function addMsg(kind, text, withLinks, who) {
    var li = document.createElement("li");
    li.className = kind === "you" ? "you" : "dragon";
    var w = document.createElement("span"); w.className = "who";
    w.textContent = kind === "you" ? "You asked" : (who || N.featured) + " says";
    li.appendChild(w);
    var p = document.createElement("span"); p.textContent = text; li.appendChild(p);
    if (withLinks) {
      var ul = document.createElement("ul");
      LINKS.forEach(function (l) {
        var i = document.createElement("li"); var a = document.createElement("a");
        a.href = l[1]; a.textContent = l[0]; i.appendChild(a); ul.appendChild(i);
      });
      li.appendChild(ul);
    }
    log.appendChild(li);
    log.scrollTop = log.scrollHeight;
  }

  function ask(q) {
    q = String(q || "").trim();
    var r = answer(q);
    if (q) addMsg("you", q);
    addMsg("dragon", r.text, r.links);
    speak(r.text, "featured");
  }

  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault(); ask(input.value); input.value = ""; input.focus();
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-q]"), function (b) {
    b.addEventListener("click", function () { ask(b.getAttribute("data-q")); });
  });

  /* ---------- 7. Optional microphone (Web Speech recognition) ---------- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var micBtn = document.getElementById("micBtn");
  if (SR && micBtn) {
    var rec = null, listening = false;
    micBtn.hidden = false;
    micBtn.addEventListener("click", function () {
      if (listening && rec) { try { rec.stop(); } catch (e) {} return; }
      stop();
      try {
        rec = new SR(); rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
        rec.onstart = function () { listening = true; micBtn.setAttribute("aria-pressed", "true"); micBtn.textContent = "Listening… press to stop"; };
        rec.onend = function () { listening = false; micBtn.setAttribute("aria-pressed", "false"); micBtn.textContent = "Speak my question"; };
        rec.onerror = function (ev) {
          var msg = ev && ev.error === "not-allowed" ? "The microphone is blocked for this page. You can type your question instead." : "I couldn't hear that. Please try again, or type your question.";
          addMsg("dragon", msg);
        };
        rec.onresult = function (ev) {
          var said = ev.results && ev.results[0] && ev.results[0][0] ? ev.results[0][0].transcript : "";
          if (said) { input.value = said; ask(said); input.value = ""; }
        };
        rec.start();
      } catch (e) {
        addMsg("dragon", "Speech input isn't available here. Please type your question.");
      }
    });
  }

  /* Expose the answer function for testing in a console: DragonCompanion.answer("who are you") */
  window.DragonCompanion = { answer: function (q) { return answer(q).text; }, names: N };
})();
