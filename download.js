// The download buttons only work once the Beta Licence box is ticked, and the button for the
// visitor's own computer is highlighted.
const agree = document.getElementById("agree");
const downloads = document.getElementById("downloads");
const tickFirst = document.getElementById("tick-first");

function refresh() {
    downloads.setAttribute("aria-disabled", String(!agree.checked));
    downloads.querySelectorAll(".get").forEach((link) => link.setAttribute("tabindex", agree.checked ? "0" : "-1"));
    tickFirst.hidden = agree.checked;
}

downloads.addEventListener("click", (event) => {
    if (agree.checked || !event.target.closest(".get")) return;
    event.preventDefault();
    tickFirst.classList.remove("nudge");
    void tickFirst.offsetWidth; // restart the little shake
    tickFirst.classList.add("nudge");
    agree.focus();
});
agree.addEventListener("change", refresh);
refresh();

// Point people at the right file for their computer
const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent;
const mine = /win/i.test(platform) ? "windows" : /mac/i.test(platform) ? "mac-arm" : "";
if (mine) {
    const link = downloads.querySelector(`[data-os="${mine}"]`);
    link.classList.add("mine");
    downloads.prepend(link);
}
