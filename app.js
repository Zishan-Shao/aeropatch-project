"use strict";

const demos = {
  main: {
    id: "141-BHLHDrvMQKxPheblWc5odwJA2KXNz",
    poster: "assets/desktop-demo.jpg",
    alt: "AeroPatch desktop with an interactive image canvas, object selections, and an agent conversation",
    title: "From a conversation to a visual operation.",
    description: "The agent works with the canvas, calls editing tools, and returns results you can inspect and refine.",
    label: "English · 1:28",
    name: "AeroPatch desktop agent demonstration",
  },
  image: {
    id: "1UpFiPM-1mmmjUo2nDyHInA8MW1fe06cS",
    poster: "assets/image-workflow.jpg",
    alt: "An aerial image of a dense forest canopy introducing individual-object discovery",
    title: "Find the individual in all this detail.",
    description: "Discover objects, generate instance masks, and inspect the candidates in the image workflow.",
    label: "Image workflow demonstration",
    name: "AeroPatch image workflow demonstration",
  },
  video: {
    id: "1lzaeUMJtiQKYdeawwIJ8739OYiFgN5tP",
    poster: "assets/video-workflow.jpg",
    alt: "AeroPatch ARCH video workflow introducing a target-tracking example with similar-looking animals",
    title: "Follow the target. Inspect the uncertain spans.",
    description: "See temporal tracking, identity checks, and review in the ARCH video workflow.",
    label: "ARCH video demonstration",
    name: "AeroPatch video workflow demonstration",
  },
};

const tabs = Array.from(document.querySelectorAll("[data-demo]"));
const player = document.getElementById("demo-player");
const panel = document.getElementById("demo-panel");
const poster = document.getElementById("demo-poster");
const playButton = document.getElementById("play-demo");
let selectedDemo = "main";

function selectDemo(key) {
  const demo = demos[key];
  if (!demo) return;
  selectedDemo = key;
  // Removing the iframe stops playback when moving to another demonstration.
  const frame = player.querySelector("iframe");
  if (frame) frame.remove();
  player.classList.remove("is-playing");
  poster.hidden = false;
  playButton.hidden = false;
  poster.src = demo.poster;
  poster.alt = demo.alt;
  document.getElementById("demo-title").textContent = demo.title;
  document.getElementById("demo-description").textContent = demo.description;
  document.getElementById("demo-duration").textContent = demo.label;
  document.getElementById("demo-direct").href = `https://drive.google.com/file/d/${demo.id}/view`;
  playButton.setAttribute("aria-label", `Play the ${demo.name}`);
  panel.setAttribute("aria-labelledby", `tab-${key}`);
  tabs.forEach((tab) => {
    const active = tab.dataset.demo === key;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectDemo(tab.dataset.demo));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectDemo(tabs[next].dataset.demo);
    tabs[next].focus();
  });
});

playButton.addEventListener("click", () => {
  const demo = demos[selectedDemo];
  const frame = document.createElement("iframe");
  frame.src = `https://drive.google.com/file/d/${demo.id}/preview`;
  frame.title = demo.name;
  frame.allow = "autoplay; fullscreen";
  frame.allowFullscreen = true;
  frame.referrerPolicy = "no-referrer";
  poster.hidden = true;
  playButton.hidden = true;
  player.classList.add("is-playing");
  player.appendChild(frame);
  frame.focus();
});

document.querySelectorAll("[data-select-demo]").forEach((link) => {
  link.addEventListener("click", () => {
    selectDemo(link.dataset.selectDemo);
    tabs.find((tab) => tab.dataset.demo === selectedDemo).focus({ preventScroll: true });
  });
});
