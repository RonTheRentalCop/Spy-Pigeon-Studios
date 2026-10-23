// Works out which computer the visitor is on and shows just that download button.
// Every button stays visible if anything here fails, so nobody is left without a download.
const agree = document.getElementById("agree");
const downloads = document.getElementById("downloads");
const tickFirst = document.getElementById("tick-first");
const found = document.getElementById("found");
const switcher = document.getElementById("switch");
const intel = document.getElementById("intel");
const others = document.getElementById("others");
const buttons = [...downloads.querySelectorAll(".get")];

const MESSAGES = {
    windows: "Looks like you're on Windows. Here's Suede 1.0.2 for your PC.",
    "mac-arm": "Looks like you're on a Mac with Apple Silicon. Here's Suede 1.0.2 for it.",
    "mac-intel": "Looks like you're on an Intel Mac. Here's Suede 1.0.2 for it.",
    mobile: "Suede is for Windows and Mac computers. Open spypigeonstudios.com/get on your computer, or pick a version below.",
    other: "Suede runs on Windows and Mac. Pick the version for your computer below.",
};

function refresh() {
    downloads.setAttribute("aria-disabled", String(!agree.checked));
    buttons.forEach((link) => link.setAttribute("tabindex", agree.checked ? "0" : "-1"));
    tickFirst.hidden = agree.checked;
}

downloads.addEventListener("click", (event) => {
    if (agree.checked || !event.target.closest(".get")) return;
    event.preventDefault();
    tickFirst.classList.remove("nudge");
    void tickFirst.offsetWidth;
    tickFirst.classList.add("nudge");
    agree.focus();
});
agree.addEventListener("change", refresh);
refresh();

function graphicsChip() {
    try {
        const gl = document.createElement("canvas").getContext("webgl");
        const info = gl && gl.getExtension("WEBGL_debug_renderer_info");
        return info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    } catch {
        return "";
    }
}

async function macChip() {
    const data = navigator.userAgentData;
    if (data && data.getHighEntropyValues) {
        try {
            const { architecture } = await data.getHighEntropyValues(["architecture"]);
            if (architecture === "arm") return "mac-arm";
            if (architecture === "x86") return "mac-intel";
        } catch {
            // fall through to the graphics chip
        }
    }
    const chip = graphicsChip();
    if (/Apple M\d|Apple GPU/i.test(chip)) return "mac-arm";
    if (/Intel|AMD|Radeon|NVIDIA/i.test(chip)) return "mac-intel";
    return "mac-arm";
}

async function detect() {
    const agent = navigator.userAgent;
    const data = navigator.userAgentData;
    const platform = (data && data.platform) || navigator.platform || "";
    if ((data && data.mobile) || /Android|iPhone|iPad|iPod/i.test(agent)) return "mobile";
    if (/mac/i.test(platform) && navigator.maxTouchPoints > 1) return "mobile";
    if (/win/i.test(platform) || /Windows/i.test(agent)) return "windows";
    if (/mac/i.test(platform) || /Macintosh/i.test(agent)) return macChip();
    return "other";
}

function show(kind) {
    found.textContent = MESSAGES[kind];
    const single = kind === "windows" || kind.startsWith("mac");
    downloads.classList.toggle("single", single);
    buttons.forEach((link) => {
        const mine = link.dataset.os === kind;
        link.hidden = single && !mine;
        link.classList.toggle("mine", mine);
    });
    document.querySelectorAll(".install-help details").forEach((help) => {
        help.hidden = single && help.dataset.for !== (kind === "windows" ? "windows" : "mac");
    });
    switcher.hidden = !single;
    intel.hidden = kind !== "mac-arm";
}

intel.addEventListener("click", () => show("mac-intel"));
others.addEventListener("click", () => {
    buttons.forEach((link) => { link.hidden = false; });
    downloads.classList.remove("single");
    document.querySelectorAll(".install-help details").forEach((help) => { help.hidden = false; });
    switcher.hidden = true;
    found.textContent = "Here are all the versions of Suede 1.0.2.";
});

detect().then(show).catch(() => show("other"));
