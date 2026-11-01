# AfroPatos | Landing Page

Landing page comercial desenvolvida para a **AfroPatos**, studio de tranças afro da trancista **Yasmin Ákila**, em Patos de Minas (MG).

🔗 **Site no ar:** [afropatos-yasminakila.pages.dev](https://afropatos-yasminakila.pages.dev/)

[Prévia do site em dispositivos desktop](img/desktop.png)
[Prévia do site em dispositivos celulares móveis](img/mobile.jpeg)


---

## Sobre o projeto

Projeto desenvolvido sob demanda, com **objetivo comercial**: a venda de uma landing page para um negócio local de beleza.

A cliente precisava de um único lugar para apresentar o trabalho, mostrar os modelos de tranças com valores e **receber pedidos de agendamento direto no WhatsApp**, sem depender de conversas soltas pelo Instagram.

O trabalho cobriu o design da interface (Figma), o desenvolvimento front-end, a otimização para buscadores e a publicação.

## Funcionalidades

- **Navegação:** menu com destaque da seção que está sendo lida, rolagem suave entre as seções e versão hambúrguer no celular.
- **Catálogo de modelos:** 15 modelos de tranças com foto e valor, organizados por categoria (Boxeadora, Box Braids, Ghana Braids, Goddess Braids, Gypsy Braids e Nagô), com filtro.
- **"Saiba Mais":** janela com as fotos de cada espessura, os valores por tamanho e o botão "Agendar este modelo", que já preenche o formulário.
- **Agendamento pelo WhatsApp:**
  - escolha em etapas: serviço, tamanho e espessura;
  - validação dos campos obrigatórios (nome, data e horário) e bloqueio de datas passadas;
  - a tecla Enter passa para o próximo campo;
  - tela de confirmação com o resumo do pedido;
  - abertura do WhatsApp com a mensagem já escrita.
- **Dúvidas frequentes:** orientações antes, durante e depois do procedimento, sinal, remarcações e atrasos.
- **Localização:** foto do studio, mapa e link para o Google Maps.
- **Sobre mim:** apresentação da trancista, valores do trabalho e números.
- **Responsivo:** layout adaptado para computador e celular (ponto de quebra em 768px).

## Tecnologias

| Uso | Tecnologia |
|---|---|
| Estrutura | HTML5 semântico (inclui o elemento `<dialog>`) |
| Estilo | CSS3 com Flexbox, Grid, variáveis CSS e media queries |
| Interatividade | JavaScript (ES6+), sem frameworks |
| Animação de rolagem | [GSAP](https://gsap.com/) 3.12.5 + ScrollToPlugin |
| Ícones | [Bootstrap Icons](https://icons.getbootstrap.com/) 1.11.3 |
| Design | Figma |
| Hospedagem | Cloudflare Pages |

## SEO e segurança

- Título e descrição otimizados para busca local ("trancista em Patos de Minas").
- Tags Open Graph e Twitter Card, com imagem de prévia (logotipo), para o link compartilhado em redes sociais aparecer com foto.
- Dados estruturados (JSON-LD, tipo `HairSalon`) e URL canônica.
- `robots.txt` e `sitemap.xml`.
- Cabeçalhos de segurança no arquivo `_headers`: `X-Content-Type-Options: nosniff` e `Referrer-Policy: strict-origin-when-cross-origin`.

## Estrutura do projeto

```
Landing-Page-AfroPatos/
├── index.html        # estrutura e conteúdo da página
├── style.css         # estilos (desktop e celular)
├── interactive.js    # menu, filtro, "Saiba Mais" e formulário
├── robots.txt
├── sitemap.xml
├── _headers
└── img/              # logotipo e fotos
```

## Como rodar localmente

Não há dependências nem etapa de build.

```bash
git clone https://github.com/thalysmorales/Landing-Page-AfroPatos.git
cd Landing-Page-AfroPatos
```

Abra o `index.html` no navegador. Se preferir um servidor local, use a extensão **Live Server** do VS Code.

## Como personalizar

Tudo que muda com frequência fica no `interactive.js`:

| O que alterar | Onde |
|---|---|
| Número que recebe os pedidos de agendamento | constante `NUMERO` (código do país + DDD + número, só dígitos) |
| Links de WhatsApp da página (Sobre Mim e rodapé) | atributos `href` com `wa.me/...` no `index.html`, sempre com o mesmo número da constante `NUMERO` |
| Imagem de prévia nas redes sociais | tag `og:image` no `<head>` do `index.html` (o ideal é uma imagem de 1200 × 630 px) |
| Valores, fotos e textos do "Saiba Mais" | objeto `MODELOS` |
| Tamanhos e espessuras do formulário | objeto `CATALOGO` |

Para incluir um modelo novo: crie o card em `index.html` com um `data-modelo` único e cadastre a mesma chave no `MODELOS`.

## Paleta de cores

| Cor | Código | Uso |
|---|---|---|
| Bege | `#E9DFD3` / `#F6F1EA` | fundos |
| Rosado | `#D6B8A7` | menu e rodapé |
| Marrom | `#8C5A37` | botões e destaques |
| Vinho | `#6D2E46` | bordas e filtros |
| Verde-oliva | `#7D8F69` | botões secundários |
| Azul-petróleo | `#1E4D59` | detalhes |

## Autor

Desenvolvido por **Thalys Morales**.

- Portfólio: [moralesthalys-portfolio.netlify.app](https://moralesthalys-portfolio.netlify.app/)
- GitHub: [@thalysmorales](https://github.com/thalysmorales)

## Direitos de uso

Projeto comercial desenvolvido para a AfroPatos. A marca, o logotipo, as fotos e os textos pertencem à AfroPatos / Yasmin Ákila e não devem ser reutilizados sem autorização.
