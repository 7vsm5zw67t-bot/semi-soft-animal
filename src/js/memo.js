// Voice memo players: one small play button and progress line per photo.
const fmt = (s) => {
  if (!isFinite(s)) return "";
  const m = Math.floor(s / 60);
  return m + ":" + String(Math.floor(s % 60)).padStart(2, "0");
};
document.querySelectorAll(".memo").forEach((memo) => {
  const audio = memo.querySelector("audio");
  const button = memo.querySelector("button");
  const bar = memo.querySelector(".track i");
  const track = memo.querySelector(".track");
  const time = memo.querySelector(".time");
  const showLength = () => { if (isFinite(audio.duration)) time.textContent = "Listen · " + fmt(audio.duration); };
  audio.addEventListener("loadedmetadata", showLength);
  if (audio.readyState >= 1) showLength();
  button.addEventListener("click", () => {
    if (audio.paused) {
      document.querySelectorAll(".memo audio").forEach((a) => { if (a !== audio) a.pause(); });
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });
  audio.addEventListener("play", () => { memo.classList.add("playing"); button.setAttribute("aria-label", "Pause voice memo"); });
  audio.addEventListener("pause", () => { memo.classList.remove("playing"); button.setAttribute("aria-label", "Play voice memo"); });
  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    bar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
    time.textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration);
  });
  audio.addEventListener("ended", () => { bar.style.width = "0"; showLength(); });
  track.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const r = track.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });
});
