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