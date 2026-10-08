const offer = document.getElementById("offer");

if (offer) {
    const [year, month, day] = offer.dataset.until.split("-").map(Number);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const left = Math.round((new Date(year, month - 1, day) - today) / 86400000);
    if (left < 0) {
        offer.remove();
    } else {
        offer.querySelector("[data-left]").textContent = left === 0 ? "Last day!" : left === 1 ? "1 day left" : `${left} days left`;
    }
}
