# I.G.N.I.S. — Aplicação web de monitoramento

> **See the fire before it spreads...**
> Este repositório é o frontend de monitoramento do **IGNIS** — um sistema de detecção de incêndio com IA que encaminha resultados de inferência de um microcontrolador Pico (Raspberry Pico W / Pico 2W) para um pequeno servidor JSON. A aplicação de monitoramento fornece um painel compacto em tempo real, visão de histórico e componentes que você pode incorporar ao seu próprio site Next.js para observar detecções e receber alertas.

---

## 🌍 Suporte Multilíngue

Esta aplicação suporta **Português Brasileiro** e **Inglês** com detecção automática de idioma e salvamento de preferências do usuário.

### Funcionalidades de Idioma:
- **Detecção automática**: Detecção do idioma do navegador com armazenamento de preferência por cookies
- **Seletor de Idioma**: Alternância fácil entre Português e Inglês
- **Separação de Conteúdo**: Posts organizados em diretórios específicos por idioma (`posts-ptBR/` e `posts-en/`)
- **Internacionalização Completa**: Todos os elementos de UI, navegação e páginas de erro são traduzidos

---

## O que este repositório contém

- Uma UI Next.js + React + TypeScript que consome o servidor JSON de borda do IGNIS
- Componentes reutilizáveis (`PicoViewer` e subsequentes) que:
  - buscam e expõem os dados mais recentes / histórico do Pico,
  - reproduzem um som de alerta quando novas detecções chegam,
  - exibem a classe da detecção, confiança e pontuações
- Sistema de posts baseado em MDX com conteúdo específico por idioma
- Design responsivo com experiência consistente entre idiomas

---

## Início rápido (local)

> Você pode usar **bun**, **npm** ou **yarn** dependendo do seu ambiente.

1. Instale as dependências

```bash
bun install
# ou
npm install
# ou
yarn
```

2. Rode o servidor de desenvolvimento

```bash
bun run dev
# ou
npm run dev
# ou
yarn dev
```

3. Abra `http://localhost:3001` (ou a porta configurada no seu app Next).

---

## Publicações / documentação em MDX

Este projeto inclui um sistema de posts MDX com suporte multilíngue completo:

- **Posts em Português**: /posts-ptBR/ - Todo o conteúdo em Português Brasileiro

- **Posts em Inglês**: /posts-en/ - Todo o conteúdo em Inglês

Coloque seus arquivos `.md` ou `.mdx` no diretório de idioma apropriado.

**O frontmatter atualmente suporta**:
	- `topic` (string) <-
  - `title` (string) <-

Os arquivos são compilados via `next-mdx-remote/rsc` e renderizados com componentes MDX personalizados.

Exemplo de frontmatter:

```md
---
topic: "pesquisa"
title: "IGNIS: notas de avaliação"
---

Conteúdo escrito...
```

---

## Uso — Componentes & API

O principal bloco de construção da UI é o componente `PicoViewer` (`src/components/pico/PicoViewer.tsx`) que fornece um contexto React e vários componentes de apresentação de dados.

**Exemplo de uso (dashboard simples):**

```tsx
import PicoViewer, {
	Header,
	ViewerDashboard,
	DetectionResult,
	DetectionConfidence,
	DetectionTimestamp,
	HistoryTable,
} from "@/components/pico/PicoViewer";

export default function DashboardPage() {
	return (
		<PicoViewer baseUrl={process.env.NEXT_PUBLIC_IGNIS_BASE_URL}>
			<Header>IGNIS — Detecção em tempo real</Header>

			<ViewerDashboard>
				<div>
					<h3>
						Classificação: <DetectionResult ifFire="🔥 FIRE" ifNoFire="— no fire" />
					</h3>
					<p>
						Confiança: <DetectionConfidence />
					</p>
					<p>
						Momento da detecção: <DetectionTimestamp />
					</p>
				</div>

				{/* histórico opcional */}
				<HistoryTable />
			</ViewerDashboard>
		</PicoViewer>
	);
}
```

### Componentes exportados pelo `PicoViewer.tsx`

- `PicoViewer` — provedor de contexto e responsável por buscar dados.
- `usePico()` — hook que expõe `{ latest, history, loading, error, refreshMs, showHistory, refetch }`.
- `Header` — wrapper para títulos pequenos.
- `ViewerDashboard` — UI de fallback enquanto os dados carregam ou em caso de erro; exibe o conteúdo filho quando disponível.
- `DashboardHeader` — wrapper para títulos pequenos (para o dashboard).
- `DetectionResult` — mostra `"Fire"` / `"Nofire"` / desconhecido.
- `DetectionConfidence` — mostra a confiança da inferência.
- `DetectionFireScore`, `DetectionNoFireScore` — mostram as pontuações do modelo como floats.
- `DetectionTimestamp` — renderiza o timestamp de acordo com o local.
- `HistoryTable` — tabela simples com leituras recentes.

Todos os componentes são intencionalmente pequenos e compostáveis para que você possa inseri-los facilmente no seu próprio layout.

---

## Exemplo de post interativo (em `/posts`)

Este repositório inclui um post MDX de exemplo que demonstra como usar `PicoViewer` diretamente dentro de uma página de post. Você pode encontrá-lo na pasta `posts`.

```md
---
topic: "Teste do Sevidor"
title: "Resultados da Comunicação"
---

<PicoViewer showHistory={true} baseUrl="http://localhost:3000" refreshMs={12000}>
  <Header>Pico 2W — Painel</Header>

  <ViewerDashboard>
    <DashboardHeader>Última Detecção</DashboardHeader>

    <strong>Classe Detectada: </strong> <DetectionResult ifFire="FOGO!!!" ifNoFire="Sem fogo" />
    <br></br>
    <strong>Confiança: </strong> <DetectionConfidence />
    <br></br>
    <strong>Pontuação Fogo: </strong> <DetectionFireScore />
    <br></br>
    <strong>Pontuação Sem Fogo: </strong> <DetectionNoFireScore />
    <br></br>
    <strong>Marcação: </strong> <DetectionTimestamp />

  </ViewerDashboard>

  <HistoryTable />
</PicoViewer>
```

---

## Formato dos dados

Cada leitura que o frontend espera tem esta estrutura:

```json
{
	"timestamp": 1690000000000, // Date.now em ms
	"class": "Fire", // "Fire", "Nofire" (case-sensitive)
	"confidence": 0.92, // 0 ... 1
	"fire_score": 0.95, // pontuação dada pelo modelo
	"nofire_score": 0.05 // pontuação dada pelo modelo
}
```

`timestamp` é obrigatório, outros campos podem estar ausentes.

---

### Exemplo: testes locais com o servidor

Se você executar o seguinte comando com o servidor JSON da IGNIS rodando localmente (porta padrão `3000`):

```bash
curl "http://localhost:3000/pico_data?class=Fire&confidence=0.87&fire_score=0.90&nofire_score=0.10"
```

O frontend (apontando para `http://localhost:3000`) irá capturar os dados enviados na próxima atualização.

---

## Limitações conhecidas

- Autoplay de áudio depende das políticas do navegador.
- O buscador do `PicoViewer` é simples (polling). Para muitos clientes ou maior frequência de envios, use SSE/WebSocket.
- Não há autenticação embutida para conectar ao servidor JSON — adicione middleware se necessário.

---

## Solução de problemas

- **Nenhuma detecção aparecendo**: verifique `NEXT_PUBLIC_IGNIS_BASE_URL` / `baseUrl` e confira as requisições de rede no console do navegador para `/pico_data/latest`.
- **Áudio não tocando**: verifique se `public/alert.wav` existe (se não existir, precisará adicionar um) e se o usuário interagiu com a página (navegadores frequentemente exigem interação para permitir reprodução).
- **Erros de CORS**: se o servidor JSON estiver rodando em remoto, habilite CORS lá ou hospede o frontend e o servidor na mesma origem.

---

## Contribuindo

Contribuições são bem-vindas! Fluxo típico:

1. Faça um fork do repositório
2. Crie um branch de feature
3. Abra um PR com uma descrição e testes (quando aplicáveis)

Por favor, mantenha a compatibilidade da API em mente ao alterar o comportamento público do `PicoViewer`.

---

## Note e adote

Esta plataforma faz parte do **I.G.N.I.S.** (Inteligência para Gerenciamento e Neutralização de Incêndios Sistematizada): um projeto que usa IA para detectar incêndios em estágio inicial usando visão computacional em dispositivos portáteis (ESP32 / câmeras ópticas), permitindo que as autoridades respondam mais rápido. A plataforma foi projetada para ser de fácil uso, apoiando esse objetivo.
