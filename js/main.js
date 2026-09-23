(function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("name").value.trim();
      var business = document.getElementById("business").value.trim();
      var email = document.getElementById("email").value.trim();
      var phone = document.getElementById("phone").value.trim();
      var message = document.getElementById("message").value.trim();

      var subject = "Ny henvendelse fra " + (business || name);
      var body = [
        "Navn: " + name,
        "Bedrift: " + business,
        "E-post: " + email,
        "Telefon: " + phone,
        "",
        "Melding:",
        message
      ].join("\n");

      var address = form.getAttribute("data-mailto");
      window.location.href =
        "mailto:" + address +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }

  var header = document.getElementById("site-header");
  var onScroll = function () {
    if (window.scrollY > 4) {
      header.style.boxShadow = "0 4px 16px rgba(17,24,45,0.08)";
    } else {
      header.style.boxShadow = "none";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
