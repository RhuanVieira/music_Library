const state = {
    usuarios: [],
    musicas: []
};

const $ = (selector) => document.querySelector(selector);

const toast = $("#toast");
const usuarioForm = $("#usuarioForm");
const musicaForm = $("#musicaForm");
const hasGsap = typeof gsap !== "undefined";

if (!hasGsap && $("#pageLoader")) {
    $("#pageLoader").style.display = "none";
}

function animateIntro() {
    if (!hasGsap) return;

    const loader = $("#pageLoader");
    const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

    timeline
        .set("body", { overflow: "hidden" })
        .from(".loader-mark", {
            scaleX: 0,
            duration: 0.9,
            ease: "expo.inOut",
            transformOrigin: "left center"
        })
        .to(loader, {
            yPercent: -100,
            duration: 0.9,
            ease: "expo.inOut"
        })
        .set("body", { overflow: "" })
        .set(loader, { display: "none" })
        .from(".topbar", {
            y: 56,
            opacity: 0,
            filter: "blur(14px)",
            duration: 0.9,
            clearProps: "filter"
        }, "-=0.35")
        .from(".topbar h1", {
            y: 44,
            opacity: 0,
            scale: 0.96,
            duration: 0.85
        }, "-=0.65")
        .from(".tabs", {
            y: 26,
            opacity: 0,
            duration: 0.7
        }, "-=0.48")
        .from(".panel.active .list-head", {
            y: 24,
            opacity: 0,
            duration: 0.55
        }, "-=0.35");
}

function animatePanel(panel) {
    if (!hasGsap) return;

    gsap.fromTo(panel, {
        opacity: 0,
        y: 18
    }, {
        opacity: 1,
        y: 0,
        duration: 0.42,
        ease: "power2.out"
    });

    gsap.from(panel.querySelectorAll(".form, .list-head, .item, .music-card"), {
        y: 36,
        rotateX: 8,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.7,
        stagger: 0.055,
        ease: "expo.out",
        clearProps: "filter"
    });

    setupMusicInteractions();
}

function switchPanel(tabName) {
    const tab = document.querySelector(`[data-tab="${tabName}"]`);
    const panel = $(`#${tabName}Panel`);

    if (!tab || !panel) return;

    document.querySelectorAll(".tab").forEach((button) => button.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((item) => item.classList.remove("active"));

    tab.classList.add("active");
    panel.classList.add("active");
    animatePanel(panel);
}

function animateCards(selector) {
    if (!hasGsap) return;

    gsap.from(selector, {
        y: 54,
        scale: 0.9,
        rotateX: 14,
        opacity: 0,
        filter: "blur(12px)",
        duration: 0.85,
        stagger: {
            each: 0.055,
            from: "start"
        },
        ease: "expo.out",
        clearProps: "filter"
    });

    setupMusicInteractions();
}

function pulseElement(element) {
    if (!hasGsap || !element) return;

    gsap.timeline()
        .to(element, {
            scale: 0.985,
            duration: 0.12,
            ease: "power2.out"
        })
        .to(element, {
            scale: 1,
            duration: 0.55,
            ease: "elastic.out(1, 0.45)"
        });
}

function animateRemove(element, animation) {
    if (!hasGsap || !element) return Promise.resolve();

    return new Promise((resolve) => {
        gsap.to(element, {
            ...animation,
            onComplete: resolve
        });
    });
}

function setupAmbientMotion() {
    if (!hasGsap) return;

    const light = $("#ambientLight");
    const moveX = gsap.quickTo(light, "--x", { duration: 0.7, ease: "power3.out" });
    const moveY = gsap.quickTo(light, "--y", { duration: 0.7, ease: "power3.out" });

    window.addEventListener("pointermove", (event) => {
        moveX(`${Math.round((event.clientX / window.innerWidth) * 100)}%`);
        moveY(`${Math.round((event.clientY / window.innerHeight) * 100)}%`);
    });
}

function setupMagneticButtons() {
    if (!hasGsap) return;

    document.addEventListener("pointermove", (event) => {
        const button = event.target.closest(".primary-button, .ghost-button, .tab");
        if (!button) return;

        const box = button.getBoundingClientRect();
        const x = (event.clientX - box.left - box.width / 2) * 0.18;
        const y = (event.clientY - box.top - box.height / 2) * 0.28;

        gsap.to(button, {
            x,
            y,
            duration: 0.35,
            ease: "power3.out"
        });
    });

    document.addEventListener("pointerout", (event) => {
        const button = event.target.closest?.(".primary-button, .ghost-button, .tab");
        if (!button) return;

        gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.45,
            ease: "elastic.out(1, 0.45)"
        });
    });
}

function setupMusicInteractions() {
    if (!hasGsap) return;

    document.querySelectorAll(".music-card").forEach((card) => {
        if (card.dataset.enhanced === "true") return;

        card.dataset.enhanced = "true";
        const cover = card.querySelector(".cover");
        const play = card.querySelector(".play-button");
        const title = card.querySelector(".music-title");

        card.addEventListener("pointermove", (event) => {
            const box = card.getBoundingClientRect();
            const px = (event.clientX - box.left) / box.width - 0.5;
            const py = (event.clientY - box.top) / box.height - 0.5;

            gsap.to(card, {
                rotateY: px * 8,
                rotateX: py * -8,
                y: -8,
                duration: 0.35,
                ease: "power3.out"
            });

            gsap.to(cover, {
                x: px * 10,
                y: py * 10,
                scale: 1.045,
                duration: 0.35,
                ease: "power3.out"
            });

            gsap.to(play, {
                x: px * 8,
                y: py * 8,
                scale: 1.08,
                duration: 0.35,
                ease: "power3.out"
            });
        });

        card.addEventListener("pointerenter", () => {
            gsap.timeline()
                .to(play, {
                    opacity: 1,
                    y: 0,
                    rotate: 360,
                    duration: 0.55,
                    ease: "back.out(1.9)"
                }, 0)
                .fromTo(title, {
                    y: 8
                }, {
                    y: 0,
                    duration: 0.35,
                    ease: "power3.out"
                }, 0);
        });

        card.addEventListener("pointerleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                y: 0,
                duration: 0.75,
                ease: "elastic.out(1, 0.55)"
            });

            gsap.to(cover, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "power3.out"
            });

            gsap.to(play, {
                x: 0,
                y: 8,
                scale: 1,
                rotate: 0,
                opacity: 0,
                duration: 0.35,
                ease: "power2.out"
            });
        });
    });
}

function setupFormAnimations() {
    if (!hasGsap) return;

    document.addEventListener("focusin", (event) => {
        if (!event.target.matches("input")) return;

        const form = event.target.closest(".form");
        const label = event.target.closest("label");

        gsap.to(form, {
            y: -3,
            boxShadow: "0 24px 64px rgba(44, 57, 36, 0.16)",
            duration: 0.35,
            ease: "power3.out"
        });

        gsap.fromTo(label, { x: -2 }, {
            x: 0,
            duration: 0.55,
            ease: "elastic.out(1, 0.45)"
        });
    });

    document.addEventListener("focusout", (event) => {
        if (!event.target.matches("input")) return;

        gsap.to(event.target.closest(".form"), {
            y: 0,
            boxShadow: "0 18px 48px rgba(44, 57, 36, 0.11)",
            duration: 0.35,
            ease: "power3.out"
        });
    });
}

function showToast(message, type = "success") {
    toast.textContent = message;
    toast.className = `toast show ${type === "error" ? "error" : ""}`;

    if (hasGsap) {
        gsap.fromTo(toast, {
            y: 24,
            opacity: 0,
            scale: 0.96
        }, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.32,
            ease: "back.out(1.8)"
        });
    }

    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => {
        if (hasGsap) {
            gsap.to(toast, {
                y: 16,
                opacity: 0,
                duration: 0.22,
                ease: "power2.in",
                onComplete: () => {
                    toast.className = "toast";
                    gsap.set(toast, { clearProps: "all" });
                }
            });
            return;
        }

        toast.className = "toast";
    }, 3000);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function api(path, options = {}) {
    const response = await fetch(path, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new Error(data?.erro || data?.msg || "Erro na requisicao");
    }

    return data;
}

function requiredSenha() {
    const editing = Boolean($("#usuarioId").value);
    $("#usuarioSenha").required = !editing;
    $("#usuarioSenha").placeholder = editing ? "Deixe em branco para manter" : "Senha";
}

function resetUsuarioForm() {
    usuarioForm.reset();
    $("#usuarioId").value = "";
    $("#usuarioFormTitle").textContent = "Novo usuario";
    $("#cancelUsuarioEdit").classList.add("hidden");
    requiredSenha();
}

function resetMusicaForm() {
    musicaForm.reset();
    $("#musicaId").value = "";
    $("#musicaFormTitle").textContent = "Nova musica";
    $("#cancelMusicaEdit").classList.add("hidden");
}

function renderUsuarios() {
    const list = $("#usuariosList");
    $("#usuariosCount").textContent = `${state.usuarios.length} itens`;

    if (!state.usuarios.length) {
        list.innerHTML = '<div class="empty">Nenhum usuario cadastrado.</div>';
        return;
    }

    list.innerHTML = state.usuarios.map((usuario) => `
        <article class="item">
            <div>
                <div class="item-title">${escapeHtml(usuario.nome)}</div>
                <div class="item-meta">
                    <span>ID ${usuario.id}</span>
                    <span>${escapeHtml(usuario.email)}</span>
                </div>
            </div>
            <div class="actions">
                <button class="small-button" type="button" data-edit-user="${usuario.id}">Editar</button>
                <button class="small-button danger" type="button" data-delete-user="${usuario.id}">Deletar</button>
            </div>
        </article>
    `).join("");

    animateCards("#usuariosList .item");
}

function renderMusicas() {
    const list = $("#musicasList");
    $("#musicasCount").textContent = `${state.musicas.length} itens`;

    if (!state.musicas.length) {
        list.innerHTML = '<div class="empty">Nenhuma musica cadastrada.</div>';
        return;
    }

    list.innerHTML = state.musicas.map((musica) => `
        <article class="music-card">
            <a class="cover-link" href="${escapeHtml(musica.link_musica)}" target="_blank" rel="noreferrer">
                <img class="cover" src="${escapeHtml(musica.link_imagem)}" alt="Capa de ${escapeHtml(musica.titulo)}">
                <span class="play-button" aria-hidden="true"></span>
            </a>
            <div class="music-info">
                <div class="music-title">${escapeHtml(musica.titulo)}</div>
                <div class="music-subtitle">${escapeHtml(musica.album)} &bull; ${escapeHtml(musica.ano_lancamento)}</div>
            </div>
            <div class="music-actions">
                <button class="small-button" type="button" data-edit-music="${musica.id}">Editar</button>
                <button class="small-button danger" type="button" data-delete-music="${musica.id}">Deletar</button>
            </div>
        </article>
    `).join("");

    animateCards("#musicasList .music-card");
}

async function loadUsuarios() {
    state.usuarios = await api("/users");
    renderUsuarios();
}

async function loadMusicas() {
    state.musicas = await api("/musica");
    renderMusicas();
}

async function loadAll() {
    try {
        await Promise.all([loadUsuarios(), loadMusicas()]);
    } catch (error) {
        showToast(error.message, "error");
    }
}

usuarioForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = $("#usuarioId").value;
    const body = {
        nome: $("#usuarioNome").value.trim(),
        email: $("#usuarioEmail").value.trim()
    };

    const senha = $("#usuarioSenha").value.trim();
    if (senha) body.senha = senha;

    try {
        await api(id ? `/users/${id}` : "/users", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(body)
        });
        showToast(id ? "Usuario atualizado." : "Usuario criado.");
        pulseElement(usuarioForm);
        resetUsuarioForm();
        await loadUsuarios();
    } catch (error) {
        showToast(error.message, "error");
    }
});

musicaForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = $("#musicaId").value;
    const body = {
        titulo: $("#musicaTitulo").value.trim(),
        album: $("#musicaAlbum").value.trim(),
        ano_lancamento: $("#musicaAno").value.trim(),
        link_musica: $("#musicaLink").value.trim(),
        link_imagem: $("#musicaImagem").value.trim()
    };

    try {
        await api(id ? `/musica/${id}` : "/musica", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(body)
        });
        showToast(id ? "Musica atualizada." : "Musica criada.");
        pulseElement(musicaForm);
        resetMusicaForm();
        await loadMusicas();
    } catch (error) {
        showToast(error.message, "error");
    }
});

document.addEventListener("click", async (event) => {
    const tab = event.target.closest("[data-tab]");
    const editUser = event.target.closest("[data-edit-user]");
    const deleteUser = event.target.closest("[data-delete-user]");
    const editMusic = event.target.closest("[data-edit-music]");
    const deleteMusic = event.target.closest("[data-delete-music]");

    if (tab) {
        switchPanel(tab.dataset.tab);
    }

    if (editUser) {
        const usuario = state.usuarios.find((item) => item.id === Number(editUser.dataset.editUser));
        if (!usuario) return;

        $("#usuarioId").value = usuario.id;
        $("#usuarioNome").value = usuario.nome;
        $("#usuarioEmail").value = usuario.email;
        $("#usuarioSenha").value = "";
        $("#usuarioFormTitle").textContent = "Editar usuario";
        $("#cancelUsuarioEdit").classList.remove("hidden");
        requiredSenha();
        switchPanel("cadastro");
        pulseElement(usuarioForm);
        usuarioForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (deleteUser) {
        const id = deleteUser.dataset.deleteUser;
        if (!confirm("Deletar este usuario?")) return;

        try {
            await api(`/users/${id}`, { method: "DELETE" });
            showToast("Usuario deletado.");
            await animateRemove(deleteUser.closest(".item"), {
                x: 26,
                opacity: 0,
                duration: 0.22,
                ease: "power2.in"
            });
            await loadUsuarios();
        } catch (error) {
            showToast(error.message, "error");
        }
    }

    if (editMusic) {
        const musica = state.musicas.find((item) => item.id === Number(editMusic.dataset.editMusic));
        if (!musica) return;

        $("#musicaId").value = musica.id;
        $("#musicaTitulo").value = musica.titulo;
        $("#musicaAlbum").value = musica.album;
        $("#musicaAno").value = musica.ano_lancamento;
        $("#musicaLink").value = musica.link_musica;
        $("#musicaImagem").value = musica.link_imagem;
        $("#musicaFormTitle").textContent = "Editar musica";
        $("#cancelMusicaEdit").classList.remove("hidden");
        switchPanel("cadastro");
        pulseElement(musicaForm);
        musicaForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (deleteMusic) {
        const id = deleteMusic.dataset.deleteMusic;
        if (!confirm("Deletar esta musica?")) return;

        try {
            await api(`/musica/${id}`, { method: "DELETE" });
            showToast("Musica deletada.");
            await animateRemove(deleteMusic.closest(".music-card"), {
                y: 18,
                scale: 0.92,
                opacity: 0,
                duration: 0.24,
                ease: "power2.in"
            });
            await loadMusicas();
        } catch (error) {
            showToast(error.message, "error");
        }
    }
});

$("#refreshButton").addEventListener("click", loadAll);
$("#cancelUsuarioEdit").addEventListener("click", resetUsuarioForm);
$("#cancelMusicaEdit").addEventListener("click", resetMusicaForm);

requiredSenha();
animateIntro();
setupAmbientMotion();
setupMagneticButtons();
setupFormAnimations();
loadAll();
