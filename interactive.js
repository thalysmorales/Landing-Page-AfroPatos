/*Enter avança para o próximo campo*/

document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" || e.isComposing) return;

    const atual = e.target;
    const form = atual.closest("#formAgendamento");
    if (!form) return;
    if (atual.tagName === "TEXTAREA" || atual.tagName === "BUTTON") return;

    e.preventDefault();

    const campos = [...form.querySelectorAll("input, select, textarea")]
        .filter(c => !c.disabled && !c.closest("[hidden]"));

    const proximo = campos[campos.indexOf(atual) + 1];
    if (proximo) proximo.focus();
});


/*Menu mobile*/

const menuBtn   = document.getElementById("menuBtn");
const menuLista = document.getElementById("menuLista");

function fecharMenu() {
    menuLista.classList.remove("aberto");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menu");
}

menuBtn.addEventListener("click", function () {
    const abrir = !menuLista.classList.contains("aberto");
    menuLista.classList.toggle("aberto", abrir);
    menuBtn.setAttribute("aria-expanded", abrir);
    menuBtn.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
});

// fecha ao escolher um link, ao tocar fora, com Esc ou ao voltar para a tela grande
menuLista.addEventListener("click", e => { if (e.target.closest("a")) fecharMenu(); });
document.addEventListener("click", e => { if (!e.target.closest(".navegador")) fecharMenu(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") fecharMenu(); });
window.addEventListener("resize", () => { if (window.innerWidth > 768) fecharMenu(); });
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
const cardsModelo = document.querySelectorAll(".CardmodeloTranca");
const avisoVazio = document.getElementById("semModelos");

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
        "Chanel": ["Fina", "Média", "Grossa"],
        "Médio": ["Fina", "Média", "Grossa"],
        "Cintura": ["Média", "Grossa"]
    },
    "Goddess Braids": {
        "Chanel": ["Fina", "Média"],
        "Médio": ["Fina", "Média"],
        "Cintura": ["Média"]
    }
  
};

const selServico = document.getElementById("servico");
const selTamanho = document.getElementById("tamanho");
const selEspessura = document.getElementById("espessura");
const boxTamanho = document.getElementById("campoTamanho");
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


/*Mensagem para o WhatsApp + validação*/


const NUMERO = "5534991508682"; // 55 + DDD + número, só dígitos

const formulario = document.getElementById("formAgendamento");
const campoNome  = document.getElementById("nome");
const campoData  = document.getElementById("data");
const campoHora  = document.getElementById("horario");
const modalEnvio = document.getElementById("modalEnvio");

// data mínima = hoje, no horário local
const hoje = new Date();
campoData.min = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

function abrirConfirmacao(dados, url) {
    const resumo = document.getElementById("envioResumo");
    resumo.innerHTML = "";

    [["Nome", dados.nome], ["Serviço", dados.servico], ["Data", dados.data], ["Horário", dados.horario]]
        .forEach(([rotulo, valor]) => {
            const li = document.createElement("li");
            const negrito = document.createElement("strong");
            negrito.textContent = rotulo + ": ";
            li.append(negrito, valor);
            resumo.append(li);
        });

    document.getElementById("envioLink").href = url;
    modalEnvio.showModal();
}

document.getElementById("envioFechar").addEventListener("click", () => modalEnvio.close());
modalEnvio.addEventListener("click", e => { if (e.target === modalEnvio) modalEnvio.close(); });

function enviarSolicitacao() {
    const nome    = campoNome.value.trim();
    const data    = campoData.value;
    const horario = campoHora.value;

    // campos obrigatórios que estão vazios
    const faltando = [];
    if (!nome)    faltando.push({ rotulo: "Nome completo", el: campoNome });
    if (!data)    faltando.push({ rotulo: "Data", el: campoData });
    if (!horario) faltando.push({ rotulo: "Horário", el: campoHora });

    if (faltando.length) {
        alert("Preencha os campos obrigatórios:\n\n• " + faltando.map(f => f.rotulo).join("\n• "));
        faltando[0].el.focus();
        return;
    }

    if (data < campoData.min) {
        alert("Escolha uma data a partir de hoje.");
        campoData.focus();
        return;
    }

    const whatsapp   = document.getElementById("whatsapp").value.trim() || "não informado";
    const observacao = document.getElementById("observacao").value.trim();

    const partes  = [selServico.value, selTamanho.value, selEspessura.value].filter(Boolean);
    const servico = partes.length
        ? partes[0] + (partes.length > 1 ? " (" + partes.slice(1).join(", ") + ")" : "")
        : "não informado";

    const dataBR = data.split("-").reverse().join("/");

    const mensagem =
        "Olá! Gostaria de solicitar um agendamento.\n\n" +
        "Nome: " + nome + "\n" +
        "WhatsApp: " + whatsapp + "\n" +
        "Serviço: " + servico + "\n" +
        "Data: " + dataBR + "\n" +
        "Horário: " + horario + "\n" +
        "Observações: " + (observacao || "nenhuma");

    const url = "https://wa.me/" + NUMERO + "?text=" + encodeURIComponent(mensagem);
    abrirConfirmacao({ nome, servico, data: dataBR, horario }, url);
}

// a verificação só acontece no clique do botão
document.getElementById("btnEnviar").addEventListener("click", enviarSolicitacao);

// garantia: o Enter nunca envia o formulário
formulario.addEventListener("submit", e => e.preventDefault());

/*Saiba Mais*/

const MODELOS = {
    "boxeadora": {
        servico: "Boxeadora",
        titulo: "Boxeadora",
        fotos: [{ src: "img/Boxeadora.jpeg", legenda: "Boxeadora" }],
    },
    "boxTamChanel": {
        servico: "Box Braids", tamanho: "Chanel",
        titulo: "Box Braids · Tamanho Chanel",
        descricao: "",
        fotos: [
            { src: "img/BoxEspP.jpeg", legenda: "P - R$400,00" },
            { src: "img/BoxEspM.jpeg", legenda: "M - R$380,00" },
            { src: "img/BoxEspG.jpeg", legenda: "G - R$360,00" }
        ],
        detalhes: [""]
    },
    "boxTamMedio": {
        servico: "Box Braids", tamanho: "Médio",
        titulo: "Box Braids · Tamanho Médio",
        fotos: [
            { src: "img/BoxEspP.jpeg", legenda: "P - R$430,00" },
            { src: "img/BoxEspM.jpeg", legenda: "M - R$380,00" },
            { src: "img/BoxEspG.jpeg", legenda: "G - R$360,00" }
        ],
    },
    "boxTamCintura": {
        servico: "Box Braids", tamanho: "Cintura",
        titulo: "Box Braids · Tamanho Cintura",
        fotos: [
            { src: "img/BoxEspP.jpeg", legenda: "P - R$500,00" },
            { src: "img/BoxEspM.jpeg", legenda: "M - R$450,00" },
            { src: "img/BoxEspG.jpeg", legenda: "G - R$400,00" }
        ],
    },
    "GhanaBraids": {
        servico: "Ghana Braids",
        titulo: "Ghana Braids",
        fotos: [
            { src: "img/GhanaBraids.jpeg", legenda: "Fina" }
        ],
    },
    "GhanaBraidsCcachos": {
        servico: "Ghana Braids",
        titulo: "Ghana Braids com Cachos",
        fotos: [{ src: "img/GhanaBraidsCcachos.jpeg", legenda: "Com cachos" }],
    },
    "GoddessTamChanel": {
        servico: "Goddess Braids", tamanho: "Chanel",
        titulo: "Goddess Braids · Tamanho Chanel",
        fotos: [
            { src: "img/GoddesEspP.jpeg", legenda: "P - R$460,00" },
            { src: "img/GoddesEspM.jpeg", legenda: "M - R$440,00" },
            { src: "img/GoddesEspG.jpeg", legenda: "G - R$400,00" }
        ],
    },
    "GoddessTamMedia": {
        servico: "Goddess Braids", tamanho: "Médio",
        titulo: "Goddess Braids · Tamanho Médio",
        descricao: "",
        fotos: [
            { src: "img/GoddesEspP.jpeg", legenda: "P - R$480,00" },
            { src: "img/GoddesEspM.jpeg", legenda: "M - R$450,00" },
            { src: "img/GoddesEspG.jpeg", legenda: "G - R$400,00" }
        ],
        detalhes: [""]
    },
    "GoddessTamCintura": {
        servico: "Goddess Braids", tamanho: "Cintura",
        titulo: "Goddess Braids · Tamanho Cintura",
        descricao: "",
        fotos: [
            { src: "img/GoddesEspP.jpeg", legenda: "P - R$550,00" },
            { src: "img/GoddesEspM.jpeg", legenda: "M - R$500,00" },
            { src: "img/GoddesEspG.jpeg", legenda: "G - R$450,00" }
        ],
        detalhes: [""]
    },
    "GypsyEspessuraP": {
        servico: "Gypsy Braids", tamanho: "Cintura",
        titulo: "Gypsy Braids · Tamanho Cintura",
        fotos: [
            { src: "img/GypsyEspP.jpeg", legenda: "P - R$560,00" },
        ],
    },
    "GypsyEspessuraM": {
        servico: "Gypsy Braids", tamanho: "Cintura",
        titulo: "Gypsy Braids · Tamanho Cintura",
        fotos: [
            { src: "img/GypsyEspM.jpeg", legenda: "M - R$500,00" },
        ],
    },
    "GypsyEspessuraG": {
        servico: "Gypsy Braids", tamanho: "Cintura",
        titulo: "Gypsy Braids · Tamanho Cintura",
        fotos: [
            { src: "img/GypsyEspG.jpeg", legenda: "G - R$460,00"}
        ]
    },
    "NagoMasculina": {
        servico: "Nagô",
        titulo: "Nagô Masculina",
        fotos: [{ src: "img/NagoMasculina.jpeg", legenda: "Nagô Masculina" }],
    },
    "NagoTira": {   // chave igual ao seu HTML (data-modelo="NagoTira")
        servico: "Nagô",
        titulo: "Nagô Tiara",
        fotos: [{ src: "img/NagoTiara.jpeg", legenda: "Nagô Tiara" }],
    },
    "NagoTopo": {
        servico: "Nagô",
        titulo: "Nagô Topo",
        fotos: [
            { src: "img/NagoTopo1.jpeg", legenda: "Nagô Topo Tipo 1" },
            { src: "img/NagoTopo2.jpeg", legenda: "Nagô Topo Tipo 2" },
        ],
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
    selServico.dispatchEvent(new Event("change"));

    if (this.dataset.tamanho) {
        selTamanho.value = this.dataset.tamanho;
        selTamanho.dispatchEvent(new Event("change"));
    }
    modal.close();
});
