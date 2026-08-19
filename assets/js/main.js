(function () {
  var year = document.querySelector("[data-current-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  var menu = document.getElementById("menu-mobile");
  if (menu && window.bootstrap) {
    var offcanvas = window.bootstrap.Offcanvas.getOrCreateInstance(menu);
    menu.querySelectorAll("a[href]").forEach(function (link) {
      link.addEventListener("click", function () {
        offcanvas.hide();
      });
    });
  }

  var filters = document.querySelector("[data-realisation-filters]");
  if (filters) {
    var cards = Array.from(document.querySelectorAll("[data-project-card]"));
    var summary = document.querySelector("[data-filter-summary]");
    var emptyState = document.querySelector("[data-filter-empty]");
    var filterButtons = Array.from(filters.querySelectorAll("[data-filter]"));
    var knownFilters = filterButtons.map(function (button) {
      return button.dataset.filter;
    });

    function applyFilter(filter, updateUrl) {
      var activeFilter = knownFilters.indexOf(filter) === -1 ? "tous" : filter;
      var visibleCount = 0;

      cards.forEach(function (card) {
        var visible = activeFilter === "tous" || card.dataset.domaine === activeFilter;
        card.hidden = !visible;
        if (visible) {
          visibleCount += 1;
        }
      });

      filterButtons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.dataset.filter === activeFilter));
      });

      if (summary) {
        summary.textContent = visibleCount + (visibleCount > 1 ? " réalisations affichées" : " réalisation affichée");
      }
      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }

      if (updateUrl && window.history && window.history.replaceState) {
        var url = new URL(window.location.href);
        if (activeFilter === "tous") {
          url.searchParams.delete("domaine");
        } else {
          url.searchParams.set("domaine", activeFilter);
        }
        window.history.replaceState({}, "", url.pathname + url.search + url.hash);
      }
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        applyFilter(button.dataset.filter, true);
      });
    });

    applyFilter(new URLSearchParams(window.location.search).get("domaine") || "tous", false);
  }

  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    var items = Array.from(gallery.querySelectorAll("[data-gallery-item]"));
    var modalElement = gallery.querySelector("[data-gallery-modal]");
    if (!items.length || !modalElement || !window.bootstrap) {
      return;
    }

    var modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
    var modalImage = modalElement.querySelector("[data-gallery-image]");
    var modalCaption = modalElement.querySelector("[data-gallery-caption]");
    var modalPosition = modalElement.querySelector("[data-gallery-position]");
    var previousButton = modalElement.querySelector("[data-gallery-prev]");
    var nextButton = modalElement.querySelector("[data-gallery-next]");
    var currentIndex = 0;
    var lastTrigger = null;

    function showItem(index) {
      currentIndex = (index + items.length) % items.length;
      var item = items[currentIndex];
      modalImage.src = item.dataset.gallerySrc;
      modalImage.alt = item.dataset.galleryAlt;
      modalCaption.textContent = item.dataset.galleryCaption;
      modalPosition.textContent = currentIndex + 1 + " / " + items.length;
    }

    items.forEach(function (item, index) {
      item.addEventListener("click", function () {
        lastTrigger = item;
        showItem(index);
        modal.show();
      });
    });

    previousButton.addEventListener("click", function () {
      showItem(currentIndex - 1);
    });
    nextButton.addEventListener("click", function () {
      showItem(currentIndex + 1);
    });
    document.addEventListener("keydown", function (event) {
      if (!modalElement.classList.contains("show")) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showItem(currentIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showItem(currentIndex + 1);
      }
    });
    modalElement.addEventListener("hidden.bs.modal", function () {
      if (lastTrigger) {
        lastTrigger.focus();
      }
    });
  });

  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    var formStatus = contactForm.querySelector("[data-form-status]");
    var whatsappFallback = contactForm.querySelector("[data-whatsapp-fallback]");

    contactForm.addEventListener("invalid", function () {
      contactForm.classList.add("was-validated");
      formStatus.textContent = "Vérifiez les champs signalés avant l'envoi.";
    }, true);

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      contactForm.classList.add("was-validated");

      if (!contactForm.checkValidity()) {
        var invalidField = contactForm.querySelector(":invalid");
        if (invalidField) {
          invalidField.focus();
        }
        formStatus.textContent = "Vérifiez les champs signalés avant l'envoi.";
        return;
      }

      var data = new FormData(contactForm);
      var subject = "Demande depuis le site ECCOTA-EPF — " + data.get("sujet");
      var body = [
        "Nom : " + data.get("nom"),
        "E-mail : " + data.get("email"),
        "Téléphone : " + (data.get("telephone") || "Non renseigné"),
        "",
        String(data.get("message"))
      ].join("\n");
      var whatsappMessage = "Bonjour ECCOTA-EPF, je suis " + data.get("nom") + ". Objet : " + data.get("sujet") + ". " + data.get("message");

      whatsappFallback.href = "https://wa.me/224000000000?text=" + encodeURIComponent(whatsappMessage);
      formStatus.textContent = "Votre application de messagerie va s'ouvrir. WhatsApp reste disponible en cas de besoin.";
      window.location.href = "mailto:contact@eccota-epf.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
})();
