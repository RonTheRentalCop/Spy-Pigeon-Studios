// Works out which computer the visitor is on and starts that download straight away.
// Every button stays visible if anything here fails, so nobody is left without a download.
const downloads = document.getElementById("downloads");
const found = document.getElementById("found");
const switcher = document.getElementById("switch");
const intel = document.getElementById("intel");
const others = document.getElementById("others");
const buttons = [...downloads.querySelectorAll(".get")];

const NAMES = { windows: "Windows", "mac-arm": "your Mac with Apple Silicon", "mac-intel": "your Intel Mac" };
const MESSAGES = {
    mobile: "Suede is for Windows and Mac computers. Open spypigeonstudios.com/get on your computer, or pick a version below.",
    other: "Suede runs on Windows and Mac. Pick the version for your computer below.",
};

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

function showHelp(kind) {
    document.querySelectorAll(".install-help details").forEach((help) => {
        help.hidden = Boolean(kind) && help.dataset.for !== (kind === "windows" ? "windows" : "mac");
        help.open = !help.hidden && Boolean(kind);
    });
}

function start(kind) {
    const link = buttons.find((button) => button.dataset.os === kind);
    found.textContent = `Your download of Suede 1.0.2 for ${NAMES[kind]} is starting. Check your Downloads folder.`;
    downloads.classList.add("single");
    buttons.forEach((button) => {
        button.hidden = button !== link;
        button.classList.toggle("mine", button === link);
    });
    link.querySelector(".get-name").textContent = "Download again";
    showHelp(kind);
    switcher.hidden = false;
    intel.hidden = kind !== "mac-arm";
    setTimeout(() => { window.location.href = link.href; }, 700);
}

function showAll(message) {
    found.textContent = message;
    downloads.classList.remove("single");
    buttons.forEach((button) => {
        button.hidden = false;
        button.classList.remove("mine");
    });
    showHelp(null);
    switcher.hidden = true;
}

intel.addEventListener("click", () => start("mac-intel"));
others.addEventListener("click", () => showAll("Here are all the versions of Suede 1.0.2."));

detect()
    .then((kind) => (NAMES[kind] ? start(kind) : showAll(MESSAGES[kind])))
    .catch(() => showAll(MESSAGES.other));
