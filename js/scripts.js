const videos = [...Array(6)].map((_, i) => document.getElementById(`video${i}`));
const audio = document.getElementById("audio");
const fallback = document.getElementById("start-fallback");
const unsupported = document.getElementById("unsupported-browser");
const continueButtons = [document.getElementById("continue1"), document.getElementById("continue2"), document.getElementById("continue3")];
const continueImages = [document.getElementById("img1"), document.getElementById("img2"), document.getElementById("img3")];
const buttonsContainer = document.getElementById("buttons-container");
const allLinks = document.querySelectorAll(".buttons-container a");
const repeatButton = document.getElementById("repeat-button");
const footer = document.getElementById("main-footer");
const footerLink = footer.querySelector("a");

const isXiaomi = /miuibrowser|miui|miwebview/.test(navigator.userAgent.toLowerCase());
if (isXiaomi) {
  unsupported.style.display = "flex";
  videos.forEach(v => v.style.display = "none");
  audio.remove();
  buttonsContainer.style.display = "none";
} else {
  videos.forEach(v => v.load());

  window.addEventListener("load", () => {
    videos[0].play().catch(() => fallback.style.display = "flex");
  });

  fallback.addEventListener("click", () => {
    videos[0].play().then(() => fallback.style.display = "none");
  });

  videos[0].addEventListener("ended", () => {
    videos[0].style.display = "none";
    videos[1].style.display = "block";
  });

  function handleVideo1Click() {
    videos[1].muted = false;
    videos[1].play();
    audio.play();
    videos[1].removeEventListener("click", handleVideo1Click);
  }

  videos[1].addEventListener("click", handleVideo1Click);

  videos[1].addEventListener("ended", () => {
    continueButtons[0].style.display = "block";
    continueImages[0].style.opacity = 1;
  });

  continueButtons[0].addEventListener("click", () => {
    showVideo(2, 0);
  });

  videos[2].addEventListener("ended", () => {
    continueButtons[1].style.display = "block";
    continueImages[1].style.opacity = 1;
  });

  continueButtons[1].addEventListener("click", () => {
    showVideo(3, 1);
  });

  videos[3].addEventListener("ended", () => {
    continueButtons[2].style.display = "block";
    continueImages[2].style.opacity = 1;
  });

  continueButtons[2].addEventListener("click", () => {
    showVideo(4, 2);
  });

  videos[4].addEventListener("ended", () => {
    videos.slice(0, 5).forEach(v => v.style.display = "none");
    videos[5].style.display = "block";
    videos[5].style.opacity = 1;
    videos[5].play().catch(err => console.error("Error al reproducir video5:", err));
    buttonsContainer.classList.add("enabled");
    allLinks.forEach(link => {
      link.classList.remove("inactive-link");
      link.removeAttribute("tabindex");
      link.style.pointerEvents = "auto";
    });
    footer.style.opacity = 1;
    footer.style.pointerEvents = "auto";
    footerLink.classList.remove("inactive-link");
    footerLink.removeAttribute("tabindex");
    footerLink.style.pointerEvents = "auto";
  });

  repeatButton.addEventListener("click", () => {
    videos.slice(1, 5).forEach(v => {
      v.pause();
      v.currentTime = 0;
      v.style.display = "none";
    });
    videos[5].pause();
    videos[5].currentTime = 0;
    videos[5].style.opacity = 0;
    videos[5].style.display = "none";
    videos[1].style.display = "block";
    videos[1].style.pointerEvents = "auto";
    videos[1].addEventListener("click", handleVideo1Click);
    audio.pause();
    audio.currentTime = 0;
    buttonsContainer.classList.remove("enabled");
    allLinks.forEach(link => {
      link.classList.add("inactive-link");
      link.setAttribute("tabindex", "-1");
      link.style.pointerEvents = "none";
    });
    continueButtons.forEach(btn => btn.style.display = "none");
    continueImages.forEach(img => img.style.opacity = 0);
    footer.style.opacity = 0;
    footer.style.pointerEvents = "none";
    footerLink.classList.add("inactive-link");
    footerLink.setAttribute("tabindex", "-1");
    footerLink.style.pointerEvents = "none";
  });

  function showVideo(next, idx) {
    videos[next - 1].style.display = "none";
    continueButtons[idx].style.display = "none";
    continueImages[idx].style.opacity = 0;
    videos[next].style.display = "block";
    videos[next].play();
  }

  document.addEventListener('contextmenu', e => e.preventDefault());
}
