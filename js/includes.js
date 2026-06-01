/* ==========================================================================
   Shared chrome injector — header, footer, floating buttons, emergency strip.
   Pages set <body data-page="..." data-prefix="..."> ; data-prefix is "" for
   root pages and "../" for pages inside /services/.
   ========================================================================== */
(function () {
  const body = document.body;
  const page = body.getAttribute("data-page") || "";
  const p = body.getAttribute("data-prefix") || "";

  /* Favicon (injected so every page gets it without editing each <head>) */
  if (!document.querySelector('link[rel="icon"]')) {
    const fav = document.createElement("link");
    fav.rel = "icon";
    fav.type = "image/svg+xml";
    fav.href = p + "assets/favicon.svg";
    document.head.appendChild(fav);
  }

  const navItems = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "about.html", label: "About Doctor", key: "about" },
    { href: "services.html", label: "Services", key: "services" },
    { href: "gallery.html", label: "Gallery", key: "gallery" },
    { href: "contact.html", label: "Contact", key: "contact" },
  ];

  const services = [
    ["services/high-risk-pregnancy.html", "High-Risk Pregnancy"],
    ["services/normal-delivery.html", "Painless Normal Delivery"],
    ["services/cesarean.html", "Cesarean (C-Section)"],
    ["services/laparoscopic-surgery.html", "Laparoscopic Surgery"],
    ["services/infertility-ivf.html", "Infertility / IVF"],
    ["services/pcos-irregular-periods.html", "PCOS & Irregular Periods"],
    ["services/ovarian-cyst.html", "Ovarian Cyst Treatment"],
    ["services/menopausal-health.html", "Menopausal Health"],
    ["services/adolescent-health.html", "Adolescent Health"],
  ];

  const navLinks = navItems
    .map((it) => {
      const active = it.key === page ? " active" : "";
      if (it.key === "services") {
        const dd = services
          .map((s) => `<li><a href="${p}${s[0]}">${s[1]}</a></li>`)
          .join("");
        return `<li class="has-dropdown"><a href="${p}services.html" class="${active}">Services</a><ul class="dropdown">${dd}</ul></li>`;
      }
      return `<li><a href="${p}${it.href}" class="${active}">${it.label}</a></li>`;
    })
    .join("");

  const header = `
  <div class="emergency-strip">
    <i class="fa-solid fa-truck-medical"></i> 24/7 Emergency &amp; Maternity Care &mdash;
    <a href="tel:+918429021972">Call +91 84290 21972</a>
  </div>
  <header class="site-header">
    <div class="container">
      <a class="logo" href="${p}index.html" aria-label="Dr. Asna Zehra Naqvi home">
        <img src="${p}assets/logo.png?v=2" alt="Dr. Asna Zehra Naqvi — Obstetrics &amp; Gynaecology" class="site-logo"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
        <span class="logo-text" style="display:none;">
          <span class="logo-name">Dr. Asna Zehra Naqvi</span>
          <span class="logo-tag">Senior Consultant, Obstetrics &amp; Gynaecology</span>
        </span>
      </a>
      <nav class="main-nav" aria-label="Primary"><ul>${navLinks}</ul></nav>
      <div class="header-cta">
        <a href="https://www.apollo247.com/doctors/dr-asna-zehra-naqvi-5a77eea8-2715-47b3-a2c4-f0ff93fd33ca" target="_blank" rel="noopener" class="btn btn--primary">Book Appointment</a>
        <button class="hamburger" aria-label="Open menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
      </div>
    </div>
  </header>`;

  const footer = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>Dr. Asna Zehra Naqvi</h4>
          <p style="color:#b8a9b3;">Senior Consultant, Obstetrics &amp; Gynaecology. Compassionate, internationally trained women's health care in Lucknow.</p>
          <div class="socials">
            <a href="https://www.apollo247.com/doctors/dr-asna-zehra-naqvi-5a77eea8-2715-47b3-a2c4-f0ff93fd33ca" target="_blank" rel="noopener" aria-label="Apollo profile"><i class="fa-solid fa-user-doctor"></i></a>
            <a href="https://www.instagram.com/dr.asna_z_naqvi/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://wa.me/918429021972" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
            <a href="tel:+918429021972" aria-label="Call"><i class="fa-solid fa-phone"></i></a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="${p}index.html">Home</a></li>
            <li><a href="${p}about.html">About Doctor</a></li>
            <li><a href="${p}services.html">Services</a></li>
            <li><a href="${p}gallery.html">Gallery</a></li>
            <li><a href="${p}contact.html">Contact</a></li>
            <li><a href="https://www.apollo247.com/doctors/dr-asna-zehra-naqvi-5a77eea8-2715-47b3-a2c4-f0ff93fd33ca" target="_blank" rel="noopener">Book Appointment</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul class="foot-contact">
            <li><i class="fa-solid fa-location-dot"></i> Apollo Medics Hospitals, Sector B, LDA Colony, Kanpur&nbsp;&ndash;&nbsp;Lucknow Road, Lucknow, Uttar Pradesh 226012</li>
            <li><i class="fa-solid fa-phone"></i> <a href="tel:+918429021972">+91 84290 21972</a></li>
            <li><i class="fa-brands fa-instagram"></i> <a href="https://www.instagram.com/dr.asna_z_naqvi/" target="_blank" rel="noopener">@dr.asna_z_naqvi</a></li>
            <li><i class="fa-solid fa-globe"></i> <a href="https://www.apollohospitals.com" target="_blank" rel="noopener">apollohospitals.com</a></li>
          </ul>
          <div class="foot-map">
            <iframe
              title="Dr. Asna Zehra Naqvi location map"
              src="https://www.google.com/maps?q=26.797939,80.9015426&z=16&output=embed"
              width="100%" height="170" style="border:0;display:block;border-radius:12px;" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
      <div class="footer-bottom">&copy; <span id="year">2026</span> Dr. Asna Zehra Naqvi. All rights reserved.</div>
    </div>
  </footer>`;

  const floating = `
  <div class="floating">
    <a class="call" href="tel:+918429021972" aria-label="Call now"><i class="fa-solid fa-phone"></i></a>
    <a class="whatsapp" href="https://wa.me/918429021972" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
  </div>`;

  const headerMount = document.getElementById("site-header-mount");
  const footerMount = document.getElementById("site-footer-mount");
  if (headerMount) headerMount.innerHTML = header;
  if (footerMount) footerMount.innerHTML = footer + floating;
})();
