"use strict";

const players = Array.from(document.querySelectorAll(".video-player"));

function restorePlayer(player) {
  const frame = player.querySelector("iframe");
  if (frame) frame.remove();
  player.querySelector("img").hidden = false;
  player.querySelector("[data-play]").hidden = false;
  player.classList.remove("is-playing");
}

players.forEach((player) => {
  player.querySelector("[data-play]").addEventListener("click", () => {
    // Switching demonstrations stops the previous Drive player.
    players.forEach(restorePlayer);

    const id = player.dataset.driveId;
    if (!/^[A-Za-z0-9_-]+$/.test(id)) return;

    const frame = document.createElement("iframe");
    frame.src = `https://drive.google.com/file/d/${id}/preview`;
    frame.title = player.dataset.videoTitle;
    frame.allow = "autoplay; fullscreen";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "no-referrer";

    player.querySelector("img").hidden = true;
    player.querySelector("[data-play]").hidden = true;
    player.classList.add("is-playing");
    player.appendChild(frame);
    frame.focus();
  });
});
