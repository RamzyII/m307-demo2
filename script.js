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

document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Verhindert das automatische Abschicken des Formulars

    // Eingabefelder sammeln
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm").value.trim();

    // Überprüfung, ob alle Felder ausgefüllt sind
    if (!name || !email || !password || !confirm) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }

    // Überprüfung, ob die Passwörter übereinstimmen
    if (password !== confirm) {
      alert("Die Passwörter stimmen nicht überein.");
      return;
    }

    // Wenn alle Felder ausgefüllt sind und die Passwörter übereinstimmen, Formular absenden
    alert("Registrierung erfolgreich!");
    this.submit(); // Formular wird hier nur abgesendet, wenn alle Bedingungen erfüllt sind
  });
