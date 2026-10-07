// Visitor stats with Umami (umami.is): no cookies and no personal data, so no cookie banner is needed.
// Umami records page views, visit length, where people came from, and their browser, device and country.
// This file adds the clicks: every link and button is counted by its label, so new ones are tracked
// automatically. Paste your Umami website ID below to switch it on.
const UMAMI_WEBSITE_ID = "e22a72e8-22e8-4afb-9dd1-8de38bf2b350";
const LIVE_SITE = "spypigeonstudios.com";

if (UMAMI_WEBSITE_ID && location.hostname.replace(/^www\./, "") === LIVE_SITE) {
    const tag = document.createElement("script");
    tag.defer = true;
    tag.src = "https://cloud.umami.is/script.js";
    tag.dataset.websiteId = UMAMI_WEBSITE_ID;
    tag.dataset.domains = `${LIVE_SITE},www.${LIVE_SITE}`;
    tag.dataset.doNotTrack = "true"; // respect browsers that ask not to be tracked
    document.head.append(tag);
}

function track(name, data) {
    if (window.umami) window.umami.track(name.slice(0, 50), data);
}

function labelOf(element) {
    const text = element.getAttribute("aria-label") || element.textContent || element.getAttribute("href") || "";
    return text.replace(/\s+/g, " ").trim();
}

// Every link and button click, named by what it says, e.g. "Click: Join our Discord"
document.addEventListener("click", (event) => {
    const target = event.target.closest("a, button");
    if (!target || target.matches("summary")) return;
    const section = target.closest("section, header, footer, main, dialog");
    track(`Click: ${labelOf(target)}`, {
        page: location.pathname,
        area: section ? section.id || section.classList[0] || section.tagName.toLowerCase() : "page",
        to: target.getAttribute("href") || "",
    });
});

// Which questions people open
document.querySelectorAll("details").forEach((item) => {
    item.addEventListener("toggle", () => {
        if (item.open) track(`Question: ${labelOf(item.querySelector("summary"))}`, { page: location.pathname });
    });
});

// How far down each page people get
const reached = new Set();
window.addEventListener("scroll", () => {
    const seen = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    for (const mark of [25, 50, 75, 100]) {
        if (seen * 100 >= mark - 2 && !reached.has(mark)) {
            reached.add(mark);
            track(`Scrolled ${mark}%`, { page: location.pathname });
        }
    }
}, { passive: true });
