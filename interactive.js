/*Rolagem suave + link ativo no menu*/

const navegador = document.querySelector(".navegador");

// rolagem suave até a seção, descontando a altura do menu fixo
if (window.gsap && window.ScrollToPlugin) {
    gsap.registerPlugin(ScrollToPlugin);

    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
        link.addEventListener("click", e => {
            const alvo = document.querySelector(link.getAttribute("href"));
            if (!alvo) return;                    // ID não existe: deixa o navegador agir

            e.preventDefault();
            gsap.to(window, {
                duration: 0.8,
                scrollTo: { y: alvo, offsetY: navegador.offsetHeight },
                ease: "power2.inOut"
            });
        });
    });
}

// destaca no menu a seção que está sendo lida
const linksMenu = document.querySelectorAll(".itensNav a");
const secoesComId = document.querySelectorAll("section[id]");

const observador = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            linksMenu.forEach(link => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entrada.target.id}`);
            });
        }
    });
}, { rootMargin: "-40% 0px -60% 0px" });

secoesComId.forEach(secao => observador.observe(secao));

/*Filtro de modelos*/

const botoesFiltro = document.querySelectorAll(".botaoseletor button");
const cardsModelo  = document.querySelectorAll(".CardmodeloTranca");
const avisoVazio   = document.getElementById("semModelos");

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", function () {
        const filtro = botao.dataset.filtro;

        // marca o botão selecionado
        botoesFiltro.forEach(b => {
            b.classList.toggle("ativo", b === botao);
            b.setAttribute("aria-pressed", b === botao);
        });

        // mostra ou esconde cada card
        let visiveis = 0;
        cardsModelo.forEach(card => {
            const mostrar = filtro === "todas" || card.dataset.categoria === filtro;
            card.hidden = !mostrar;
            if (mostrar) visiveis++;
        });

        avisoVazio.hidden = visiveis > 0;
    });
});

/*Quero Agendar*/

// Edite aqui: estilo -> tamanho -> espessuras
const CATALOGO = {
    "Box Braids": {
        "Chanel":  ["Fina", "Média", "Grossa"],
        "Médio":   ["Fina", "Média", "Grossa"],
        "Cintura": ["Média", "Grossa"]
    },
    "Goddess Braids": {
        "Chanel":  ["Fina", "Média"],
        "Médio":   ["Fina", "Média"],
        "Cintura": ["Média"]
    }
    // estilos fora da lista não mostram tamanho nem espessura
};

const selServico   = document.getElementById("servico");
const selTamanho   = document.getElementById("tamanho");
const selEspessura = document.getElementById("espessura");
const boxTamanho   = document.getElementById("campoTamanho");
const boxEspessura = document.getElementById("campoEspessura");

// preenche um select com opções, ou esconde o campo se não houver
function preencher(select, caixa, opcoes, rotulo) {
    if (!opcoes || opcoes.length === 0) {
        caixa.hidden = true;
        select.required = false;
        select.innerHTML = "";
        return;
    }
    select.innerHTML =
        `<option value="">Selecione ${rotulo}</option>` +
        opcoes.map(o => `<option>${o}</option>`).join("");
    select.required = true;
    caixa.hidden = false;
}

selServico.addEventListener("change", function () {
    const tamanhos = CATALOGO[selServico.value];
    preencher(selTamanho, boxTamanho, tamanhos && Object.keys(tamanhos), "o tamanho");
    preencher(selEspessura, boxEspessura, null);   // limpa o nível abaixo
});

selTamanho.addEventListener("change", function () {
    const espessuras = CATALOGO[selServico.value]?.[selTamanho.value];
    preencher(selEspessura, boxEspessura, espessuras, "a espessura");
});

/*Mensagem para o WhatsApp */

const NUMERO = "5534991508682"; // 55 + DDD + número, só dígitos

const campoData = document.getElementById("data");
campoData.min = new Date().toISOString().split("T")[0];   // bloqueia datas passadas

document.getElementById("formAgendamento").addEventListener("submit", function (e) {
    e.preventDefault();

    const nome       = document.getElementById("nome").value.trim();
    const whatsapp   = document.getElementById("whatsapp").value.trim();
    const data       = campoData.value.split("-").reverse().join("/");
    const horario    = document.getElementById("horario").value;
    const observacao = document.getElementById("observacao").value.trim();

    const partes = [selServico.value, selTamanho.value, selEspessura.value].filter(Boolean);
    const servico = partes[0] + (partes.length > 1 ? " (" + partes.slice(1).join(", ") + ")" : "");

    const mensagem =
        "Olá! Gostaria de solicitar um agendamento.\n\n" +
        "Nome: " + nome + "\n" +
        "WhatsApp: " + whatsapp + "\n" +
        "Serviço: " + servico + "\n" +
        "Data: " + data + "\n" +
        "Horário: " + horario + "\n" +
        "Observações: " + (observacao || "nenhuma");

    window.location.href = "https://wa.me/" + NUMERO + "?text=" + encodeURIComponent(mensagem);
});

/*Saiba Mais*/

// Atalho para modelos com 3 espessuras: monta os 3 caminhos a partir de um nome-base.
// Ex.: espessuras("box-chanel") -> img/espessuras/box-chanel-fina.jpeg, -media.jpeg, -grossa.jpeg
function espessuras(base) {
    return [
        { src: `img/espessuras/${base}-fina.jpeg`,   legenda: "Fina" },
        { src: `img/espessuras/${base}-media.jpeg`,  legenda: "Média" },
        { src: `img/espessuras/${base}-grossa.jpeg`, legenda: "Grossa" }
    ];
}

// A chave de cada modelo é igual ao data-modelo do botão no HTML.
// servico  = texto exato da opção do select "Serviço desejado"
// tamanho  = (opcional) texto exato da opção do select "Tamanho"
const MODELOS = {
    "boxeadora": {
        servico: "Boxeadora",
        titulo: "Boxeadora",
        descricao: "[Descreva o modelo]",
        fotos: [{ src: "img/Boxeadora.jpeg", legenda: "Boxeadora" }],
        detalhes: ["[Duração]", "[Manutenção]"]
    },
    "boxTamChanel": {
        servico: "Box Braids", tamanho: "Chanel",
        titulo: "Box Braids · Tamanho Chanel",
        descricao: "[Descreva o modelo]",
        fotos: espessuras("box-chanel"),
        detalhes: ["[Duração]", "[Manutenção]"]
    },
    "boxTamMedio": {
        servico: "Box Braids", tamanho: "Médio",
        titulo: "Box Braids · Tamanho Médio",
        descricao: "[Descreva o modelo]",
        fotos: espessuras("box-medio"),
        detalhes: ["[Duração]", "[Manutenção]"]
    },
    "boxTamCintura": {
        servico: "Box Braids", tamanho: "Cintura",
        titulo: "Box Braids · Tamanho Cintura",
        descricao: "[Descreva o modelo]",
        fotos: espessuras("box-cintura"),
        detalhes: ["[Duração]", "[Manutenção]"]
    },
    "GhanaBraids": {
        servico: "Ghana Braids",
        titulo: "Ghana Braids",
        descricao: "[Descreva o modelo]",
        fotos: [{ src: "img/GhanaBraids.jpeg", legenda: "Ghana Braids" }],
        detalhes: ["[Duração]", "[Manutenção]"]
    },
    "GhanaBraidsCcachos": {
        servico: "Ghana Braids",
        titulo: "Ghana Braids com Cachos",
        descricao: "[Descreva o modelo]",
        fotos: [{ src: "img/GhanaBraidsCcachos.jpeg", legenda: "Com cachos" }],
        detalhes: ["[Duração]", "[Manutenção]"]
    },
    "GoddessTamChanel": {
        servico: "Goddess Braids", tamanho: "Chanel",
        titulo: "Goddess Braids · Tamanho Chanel",
        descricao: "[Descreva o modelo]",
        fotos: espessuras("goddess-chanel"),
        detalhes: ["[Duração]", "[Manutenção]"]
    },
    "GoddessTamMedia": {
        servico: "Goddess Braids", tamanho: "Médio",
        titulo: "Goddess Braids · Tamanho Médio",
        descricao: "[Descreva o modelo]",
        fotos: espessuras("goddess-medio"),
        detalhes: ["[Duração]", "[Manutenção]"]
    },
    "GoddessTamCintura": {
        servico: "Goddess Braids", tamanho: "Cintura",
        titulo: "Goddess Braids · Tamanho Cintura",
        descricao: "[Descreva o modelo]",
        fotos: espessuras("goddess-cintura"),
        detalhes: ["[Duração]", "[Manutenção]"]
    },
    "NagoMasculina": {
        servico: "Nagô",
        titulo: "Nagô Masculina",
        descricao: "[Descreva o modelo]",
        fotos: [{ src: "img/NagoMasculina.jpeg", legenda: "Nagô Masculina" }],
        detalhes: ["[Duração]", "[Manutenção]"]
    },
    "NagoTira": {   // chave igual ao seu HTML (data-modelo="NagoTira")
        servico: "Nagô",
        titulo: "Nagô Tiara",
        descricao: "[Descreva o modelo]",
        fotos: [{ src: "img/NagoTiara.jpeg", legenda: "Nagô Tiara" }],
        detalhes: ["[Duração]", "[Manutenção]"]
    },
    "NagoTopo": {
        servico: "Nagô",
        titulo: "Nagô Topo",
        descricao: "[Descreva o modelo]",
        fotos: [{ src: "img/NagoTopo1.jpeg", legenda: "Nagô Topo" }],
        detalhes: ["[Duração]", "[Manutenção]"]
    }
};

const modal = document.getElementById("modalModelo");

// abrir: qualquer botão com data-modelo
document.addEventListener("click", function (e) {
    const botao = e.target.closest("[data-modelo]");
    if (!botao) return;

    const m = MODELOS[botao.dataset.modelo];
    if (!m) {
        console.warn("Modelo sem cadastro em MODELOS:", botao.dataset.modelo);
        return;
    }

    document.getElementById("modalTitulo").textContent = m.titulo;
    document.getElementById("modalDescricao").textContent = m.descricao;

    document.getElementById("modalFotos").innerHTML = m.fotos.map(f =>
        `<figure>
            <img src="${f.src}" alt="${m.titulo} - ${f.legenda}">
            <figcaption>${f.legenda}</figcaption>
        </figure>`
    ).join("");

    const lista = document.getElementById("modalDetalhes");
    lista.innerHTML = (m.detalhes || []).map(d => `<li>${d}</li>`).join("");
    lista.hidden = !(m.detalhes && m.detalhes.length);

    const agendar = document.getElementById("modalAgendar");
    agendar.dataset.servico = m.servico;
    agendar.dataset.tamanho = m.tamanho || "";

    modal.showModal();
    modal.scrollTop = 0;
});

// fechar: botão X, clique fora do quadro ou tecla Esc (nativa)
modal.querySelector(".modalFechar").addEventListener("click", () => modal.close());
modal.addEventListener("click", function (e) {
    if (e.target === modal) modal.close();
});

// "Agendar este modelo": já preenche o formulário
document.getElementById("modalAgendar").addEventListener("click", function () {
    selServico.value = this.dataset.servico;
    selServico.dispatchEvent(new Event("change"));       // cria as opções de tamanho

    if (this.dataset.tamanho) {
        selTamanho.value = this.dataset.tamanho;
        selTamanho.dispatchEvent(new Event("change"));   // cria as opções de espessura
    }
    modal.close();
});