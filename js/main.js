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
    var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var siteHeader = document.getElementById("site-header");
    var keepTimer;

    var keepFieldVisible = function () {
      var field = document.activeElement;
      if (!field || !form.contains(field)) return;
      if (field.tagName !== "TEXTAREA" && !(field.tagName === "INPUT" && field.type !== "radio")) return;
      var row = field.closest(".form-row") || field;
      var vv = window.visualViewport;
      var viewTop = vv ? vv.offsetTop : 0;
      var viewHeight = vv ? vv.height : window.innerHeight;
      var topLimit = viewTop + (siteHeader ? siteHeader.offsetHeight : 0) + 16;
      var bottomLimit = viewTop + viewHeight - 16;
      var rect = row.getBoundingClientRect();
      if (rect.top < topLimit || rect.bottom > bottomLimit) {
        window.scrollBy({ top: rect.top - topLimit, behavior: "instant" });
      }
    };

    var scheduleKeepVisible = function (delay) {
      clearTimeout(keepTimer);
      keepTimer = setTimeout(keepFieldVisible, delay);
    };

    form.addEventListener("focusin", function () {
      scheduleKeepVisible(350);
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", function () {
        scheduleKeepVisible(100);
      });
    }

    var showStep = function (index, focusField) {
      steps.forEach(function (step, i) {
        step.hidden = i !== index;
      });
      backBtn.hidden = index === 0;
      var isLast = index === steps.length - 1;
      nextBtn.hidden = isLast;
      submitBtn.hidden = !isLast;
      progressBar.style.transform = "translateX(" + (((index + 1) / steps.length) * 100 - 100) + "%)";
      stepLabel.textContent = "Steg " + (index + 1) + " av " + steps.length;
      var firstField = steps[index].querySelector("input, textarea");
      if (firstField && canHover && focusField !== false) firstField.focus({ preventScroll: true });
    };

    var stepIsValid = function (index, report) {
      var step = steps[index];
      var planInputs = step.querySelectorAll('input[name="Plan"]');
      if (planInputs.length) {
        var planError = step.querySelector(".plan-error");
        var checked = step.querySelector('input[name="Plan"]:checked');
        if (planError && report) planError.hidden = !!checked;
        return !!checked;
      }
      var fields = step.querySelectorAll("input, textarea");
      for (var i = 0; i < fields.length; i++) {
        if (!fields[i].checkValidity()) {
          if (report) fields[i].reportValidity();
          return false;
        }
      }
      return true;
    };

    if (steps.length) {
      showStep(currentStep, false);

      nextBtn.addEventListener("click", function () {
        if (!stepIsValid(currentStep, true)) return;
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

      for (var i = 0; i < steps.length; i++) {
        if (!stepIsValid(i, false)) {
          currentStep = i;
          showStep(i);
          stepIsValid(i, true);
          return;
        }
      }

      var formNav = document.querySelector(".form-nav");
      var formError = document.getElementById("formError");
      var formSuccess = document.getElementById("formSuccess");
      var formProgress = document.querySelector(".form-progress");

      formError.hidden = true;
      submitBtn.disabled = true;
      var originalText = submitBtn.textContent;
      submitBtn.textContent = "Sender...";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Innsending feilet");
          var chosen = form.querySelector('input[name="Plan"]:checked');
          var planCard = chosen && chosen.closest(".plan-card");
          if (planCard) {
            document.getElementById("successPlan").textContent =
              planCard.querySelector(".plan-card-name").textContent + ", " +
              planCard.querySelector(".plan-card-price").textContent;
          }
          steps.forEach(function (step) { step.hidden = true; });
          formProgress.hidden = true;
          stepLabel.hidden = true;
          formNav.hidden = true;
          formSuccess.hidden = false;
        })
        .catch(function () {
          formError.hidden = false;
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });

    document.querySelectorAll("[data-plan]").forEach(function (planBtn) {
      planBtn.addEventListener("click", function () {
        var plan = planBtn.getAttribute("data-plan");
        var radio = form.querySelector('input[name="Plan"][value="' + plan + '"]');
        if (radio) radio.checked = true;
        currentStep = 0;
        showStep(currentStep);
      });
    });
  }

  var header = document.getElementById("site-header");
  if (header && "IntersectionObserver" in window) {
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:5px;pointer-events:none";
    document.body.insertBefore(sentinel, document.body.firstChild);
    new IntersectionObserver(function (entries) {
      header.style.boxShadow = entries[0].isIntersecting ? "none" : "0 4px 16px rgba(17,24,45,0.08)";
    }).observe(sentinel);
  }
})();
