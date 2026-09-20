/* ============================================================
   include.js
   Loads the shared navbar.html and footer.html into every page
   and fires an "includesLoaded" event when done so main.js can
   run navbar/footer-dependent code (active link, mobile menu...).

   NOTE: Because this uses fetch() to read local .html files, most
   browsers require the site to be served over http:// rather than
   opened directly as a file:// path. Easiest options:
     - VS Code "Live Server" extension, or
     - Run `python3 -m http.server` in this folder, then visit
       http://localhost:8000
   ============================================================ */

(function () {
  async function injectInclude(placeholderId, url) {
    const target = document.getElementById(placeholderId);
    if (!target) return;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      target.innerHTML = await response.text();
    } catch (error) {
      console.error(error);
      target.innerHTML =
        '<p style="text-align:center;padding:1rem;color:#94a3b8;">' +
        "Couldn't load " + url + ". If you opened this file directly, " +
        "please view the site through a local server instead." +
        "</p>";
    }
  }

  async function loadIncludes() {
    await Promise.all([
      injectInclude("navbar-placeholder", "includes/navbar.html"),
      injectInclude("footer-placeholder", "includes/footer.html"),
    ]);
    document.dispatchEvent(new Event("includesLoaded"));
  }

  document.addEventListener("DOMContentLoaded", loadIncludes);
})();
