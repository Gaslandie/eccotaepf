(function () {
  var year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();

  var reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion) {
    let lastY = scrollY, tick;
    addEventListener("scroll", () => {
      if (tick) return;
      tick = requestAnimationFrame(() => {
        let y = scrollY;
        document.body.classList.toggle("header-compact", y > 40);
        document.body.classList.toggle("header-hidden", y > 400 && y > lastY);
        lastY = y;
        tick = null;
      });
    }, { passive: true });

    const heading = document.querySelector("[data-hero-rotator]");
    if (heading) {
      const rotator = heading.querySelector("[data-hero-words]");
      const word = rotator.querySelector("[data-hero-word]");
      const words = rotator.dataset.heroWords.split("|");
      let index = 0, timer;
      const rotate = () => {
        if (heading.matches(":hover,:focus-within")) return;
        rotator.classList.add("is-leaving");
        setTimeout(() => {
          word.textContent = words[++index % words.length];
          rotator.className = "hero-rotator is-entering";
          requestAnimationFrame(() => requestAnimationFrame(() => rotator.classList.remove("is-entering")));
        }, 180);
      };
      const start = () => {
        clearInterval(timer);
        if (!heading.matches(":hover,:focus-within")) timer = setInterval(rotate, 2800);
      };
      ["mouseenter", "focusin"].forEach(event => heading.addEventListener(event, () => clearInterval(timer)));
      ["mouseleave", "focusout"].forEach(event => heading.addEventListener(event, start));
      start();
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting && entry.boundingClientRect.top >= 0) return;
        const element = entry.target;
        if (element.classList.contains("stat-value")) {
          const finalValue = Number(element.textContent), start = performance.now();
          const count = now => {
            const progress = Math.min((now - start) / 1200, 1);
            element.textContent = Math.round(finalValue * (1 - Math.pow(1 - progress, 3)));
            if (progress < 1) requestAnimationFrame(count);
          };
          requestAnimationFrame(count);
        } else element.classList.add("is-visible");
        observer.unobserve(element);
      }), { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
      const selector = ".section .row > [class*='col-']:not([data-project-card]),.stats-grid>*,.value-grid>*,.engagement-grid>*,.partner-groups>*,.region-list>*,.compliance-grid>*,.gallery-grid>*";
      const groups = new Map();
      document.querySelectorAll(selector).forEach(element => {
        if (element.getBoundingClientRect().top < innerHeight) return;
        const group = element.parentElement;
        const index = groups.get(group) || 0;
        groups.set(group, index + 1);
        element.style.setProperty("--reveal-delay", Math.min(index, 5) * 60 + "ms");
        element.setAttribute("data-reveal", "");
        observer.observe(element);
      });
      document.querySelectorAll(".stat-value").forEach(element => observer.observe(element));
    }
  }

  var menu = document.getElementById("menu-mobile");
  if (menu && window.bootstrap) {
    var offcanvas = window.bootstrap.Offcanvas.getOrCreateInstance(menu);
    menu.querySelectorAll("a[href]").forEach(link => link.addEventListener("click", () => offcanvas.hide()));
  }

  var filters = document.querySelector("[data-realisation-filters]");
  if (filters) {
    const cards = [...document.querySelectorAll("[data-project-card]")];
    const summary = document.querySelector("[data-filter-summary]");
    const emptyState = document.querySelector("[data-filter-empty]");
    const buttons = [...filters.querySelectorAll("[data-filter]")];
    const known = buttons.map(button => button.dataset.filter);
    let busy = false;

    const applyFilter = (filter, updateUrl, animate) => {
      if (busy) return;
      const active = known.includes(filter) ? filter : "tous";
      const visible = cards.filter(card => active === "tous" || (card.dataset.domaine || "").split(/\s+/).includes(active));
      buttons.forEach(button => button.setAttribute("aria-pressed", button.dataset.filter === active));
      if (updateUrl && history.replaceState) {
        const url = new URL(location.href);
        if (active === "tous") url.searchParams.delete("domaine");
        else url.searchParams.set("domaine", active);
        history.replaceState({}, "", url.pathname + url.search + url.hash);
      }
      const updateResult = () => {
        if (summary) summary.textContent = visible.length + (visible.length > 1 ? " réalisations affichées" : " réalisation affichée");
        if (emptyState) emptyState.hidden = visible.length !== 0;
      };
      if (!animate || reducedMotion) {
        cards.forEach(card => card.hidden = !visible.includes(card));
        updateResult();
        return;
      }
      const leaving = cards.filter(card => !card.hidden && !visible.includes(card));
      const entering = visible.filter(card => card.hidden);
      if (!leaving.length && !entering.length) {
        updateResult();
        return;
      }
      busy = true;
      filters.setAttribute("aria-busy", "true");
      leaving.forEach(card => card.classList.add("is-filter-exiting"));
      setTimeout(() => {
        leaving.forEach(card => {
          card.hidden = true;
          card.classList.remove("is-filter-exiting");
        });
        entering.forEach((card, index) => {
          card.style.setProperty("--filter-delay", Math.min(index, 5) * 40 + "ms");
          card.classList.add("is-filter-entering");
          card.hidden = false;
        });
        updateResult();
        requestAnimationFrame(() => requestAnimationFrame(() => entering.forEach(card => card.classList.remove("is-filter-entering"))));
        setTimeout(() => {
          entering.forEach(card => card.style.removeProperty("--filter-delay"));
          filters.removeAttribute("aria-busy");
          busy = false;
        }, 660);
      }, 180);
    };
    buttons.forEach(button => button.addEventListener("click", () => applyFilter(button.dataset.filter, true, true)));
    applyFilter(new URLSearchParams(window.location.search).get("domaine") || "tous", false, false);
  }

  document.querySelectorAll("[data-gallery]").forEach(gallery => {
    var items = Array.from(gallery.querySelectorAll("[data-gallery-item]"));
    var modalElement = gallery.querySelector("[data-gallery-modal]");
    if (!items.length || !modalElement || !window.bootstrap) return;

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

    items.forEach((item, index) => {
      item.addEventListener("click", () => {
        lastTrigger = item;
        showItem(index);
        modal.show();
      });
    });

    previousButton.addEventListener("click", () => showItem(currentIndex - 1));
    nextButton.addEventListener("click", () => showItem(currentIndex + 1));
    document.addEventListener("keydown", event => {
      if (!modalElement.classList.contains("show")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showItem(currentIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showItem(currentIndex + 1);
      }
    });
    modalElement.addEventListener("hidden.bs.modal", () => { if (lastTrigger) lastTrigger.focus(); });
  });

  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    var formStatus = contactForm.querySelector("[data-form-status]");
    var whatsappFallback = contactForm.querySelector("[data-whatsapp-fallback]");

    contactForm.addEventListener("invalid", () => {
      contactForm.classList.add("was-validated");
      formStatus.textContent = "Vérifiez les champs signalés avant l'envoi.";
    }, true);

    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      contactForm.classList.add("was-validated");

      if (!contactForm.checkValidity()) {
        var invalidField = contactForm.querySelector(":invalid");
        if (invalidField) invalidField.focus();
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

      whatsappFallback.href = "https://wa.me/224627958193?text=" + encodeURIComponent(whatsappMessage);
      formStatus.textContent = "Votre application de messagerie va s'ouvrir. WhatsApp reste disponible en cas de besoin.";
      window.location.href = "mailto:eccota-epf@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
})();
