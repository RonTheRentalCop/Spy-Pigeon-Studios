// Fills the setup exhibit from assets/showcase.json. Run make_showcase.py after adding photos to assets/.
const wall = document.getElementById("wall");
const empty = document.getElementById("empty");
const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewer-img");
const viewerCaption = document.getElementById("viewer-caption");
const TILTS = [-2, 1.5, -1, 2, -1.5, 1];

function credit(photo) {
    return photo.by ? `by ${photo.by}` : "";
}

function open(photo) {
    viewerImg.src = photo.file;
    viewerImg.alt = photo.alt || photo.caption || "A desktop set up with Nook";
    viewerCaption.textContent = [photo.caption, credit(photo)].filter(Boolean).join(" · ");
    viewer.showModal();
}

function pin(photo, index) {
    const card = document.createElement("button");
    card.className = "polaroid";
    card.style.setProperty("--tilt", `${TILTS[index % TILTS.length]}deg`);
    card.setAttribute("aria-label", `Open ${photo.caption || "this setup"} ${credit(photo)}`.trim());

    const tape = document.createElement("span");
    tape.className = "tape";
    const img = document.createElement("img");
    img.src = photo.file;
    img.alt = photo.alt || photo.caption || "A desktop set up with Nook";
    img.loading = "lazy";
    card.append(tape, img);

    if (photo.caption || photo.by) {
        const words = document.createElement("span");
        words.className = "words";
        if (photo.caption) {
            const caption = document.createElement("span");
            caption.className = "what";
            caption.textContent = photo.caption;
            words.append(caption);
        }
        if (photo.by) {
            const by = document.createElement("span");
            by.className = "who script";
            by.textContent = credit(photo);
            words.append(by);
        }
        card.append(words);
    }

    card.addEventListener("click", () => open(photo));
    wall.append(card);
}

fetch("assets/showcase.json", { cache: "no-cache" })
    .then((response) => (response.ok ? response.json() : { photos: [] }))
    .catch(() => ({ photos: [] }))
    .then((data) => {
        const photos = (data.photos || []).filter((photo) => photo.file);
        photos.forEach(pin);
        empty.hidden = photos.length > 0;
    });

document.getElementById("close").addEventListener("click", () => viewer.close());
viewer.addEventListener("click", (event) => {
    if (event.target === viewer) viewer.close();
});
