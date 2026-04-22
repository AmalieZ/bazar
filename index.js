const form = document.getElementById("adForm");
const adsDiv = document.getElementById("ads");

// XSS ochrana
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[m]);
}

// validace
function validate(data) {
    if (data.title.length < 3) {
        alert("Název musí mít alespoň 3 znaky");
        return false;
    }

    if (data.price < 0) {
        alert("Cena nemůže být záporná");
        return false;
    }

    return true;
}

// render
function renderAd(ad) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
    <h3>${escapeHTML(ad.title)}</h3>
    <p>${escapeHTML(ad.category)}</p>
    <p>${escapeHTML(ad.condition)}</p>
    <p class="price">${ad.price} Kč</p>
    <p>${escapeHTML(ad.description)}</p>
    <p>${escapeHTML(ad.email)}</p>
    ${ad.image ? `<img src="${escapeHTML(ad.image)}" width="100%">` : ""}
  `;

    adsDiv.appendChild(card);
}

// submit
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    if (!validate(data)) return;

    // beckend napojení
    try {
        await fetch("/api/ads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    } catch (err) {
        console.log("Backend zatím neběží");
    }

    renderAd(data);
    form.reset();
});
