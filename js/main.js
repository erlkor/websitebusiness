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
    var steps = Array.prototype.slice.call(form.querySelectorAll(".form-step"));
    var progressBar = document.getElementById("formProgressBar");
    var stepLabel = document.getElementById("formStepLabel");
    var backBtn = document.getElementById("formBack");
    var nextBtn = document.getElementById("formNext");
    var submitBtn = document.getElementById("formSubmit");
    var currentStep = 0;

    var showStep = function (index) {
      steps.forEach(function (step, i) {
        step.hidden = i !== index;
      });
      backBtn.hidden = index === 0;
      var isLast = index === steps.length - 1;
      nextBtn.hidden = isLast;
      submitBtn.hidden = !isLast;
      progressBar.style.width = ((index + 1) / steps.length) * 100 + "%";
      stepLabel.textContent = "Steg " + (index + 1) + " av " + steps.length;
      var firstField = steps[index].querySelector("input, textarea");
      if (firstField) firstField.focus({ preventScroll: true });
    };

    var stepIsValid = function (index) {
      var fields = steps[index].querySelectorAll("input, textarea");
      for (var i = 0; i < fields.length; i++) {
        if (!fields[i].checkValidity()) {
          fields[i].reportValidity();
          return false;
        }
      }
      return true;
    };

    if (steps.length) {
      showStep(currentStep);

      nextBtn.addEventListener("click", function () {
        if (!stepIsValid(currentStep)) return;
        if (currentStep < steps.length - 1) {
          currentStep++;
          showStep(currentStep);
        }
      });

      backBtn.addEventListener("click", function () {
        if (currentStep > 0) {
          currentStep--;
          showStep(currentStep);
        }
      });

      form.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && e.target.tagName === "INPUT" && currentStep < steps.length - 1) {
          e.preventDefault();
          nextBtn.click();
        }
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
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
