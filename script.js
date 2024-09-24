let intro = document.querySelector(".intro");
let logo = document.querySelector(".logo");
let logoSpan = document.querySelectorAll(".logo-img");
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    logoSpan.forEach((span) => {
      setTimeout(() => {
        span.classList.add("active");
      });
    });

    setTimeout(() => {
      logoSpan.forEach((span, idx) => {
        setTimeout(() => {
          span.classList.remove("active");
          span.classList.add("fade");
        });
      });
    }, 2000);
    setTimeout(() => {
      intro.style.top = "-100vh";
    }, 2300);
  });
});
