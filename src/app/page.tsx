import PageHeader from "@/components/navigation/PageHeader";
import ResearchNavigation from "@/components/navigation/ResearchNavigation";
import { getPostsMetadata } from "@/utils/mdProcessor";
import styles from "./page.module.css";

export default function Home() {
  const posts = getPostsMetadata();

  return (
    <div className={styles.home}>
      <PageHeader />

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <main className={styles.mainContent}>
            <article className={styles.article}>
              {/* Introdução */}
              <section className={styles.abstract}>
                <h2 className={styles.sectionTitle}>
                  Introdução – I.A. na ação contra queimadas
                </h2>
                <p className={styles.abstractText}>
                  Notícias sobre queimadas e incêndios florestais têm ocupado os
                  veículos de comunicação brasileiros com frequência alarmante.
                  De ocorrências localizadas até catástrofes de grande
                  magnitude, os eventos vêm comprometendo porções significativas
                  da Amazônia e ameaçando elementos fundamentais da
                  biodiversidade.
                </p>
                <p className={styles.abstractText}>
                  Embora faça parte da rotina noticiosa, não se trata de mero
                  acaso. Estudos e reportagens destacam que o crescimento dos
                  incêndios de origem criminosa na região amazônica impacta
                  tanto o equilíbrio climático quanto indicadores de saúde
                  pública. Esse cenário revela a combinação de fatores humanos e
                  climáticos que intensificam a gravidade dos incêndios.
                </p>
              </section>

              {/* Impactos na Saúde Pública */}
              <section className={styles.methodology}>
                <h2 className={styles.sectionTitle}>
                  Impactos das queimadas na saúde pública
                </h2>
                <p className={styles.contentText}>
                  Os efeitos na saúde são alarmantes, sobretudo em populações
                  vulneráveis. Pesquisas demonstram que, durante secas severas
                  na Amazônia, hospitalizações por doenças respiratórias em
                  crianças menores de cinco anos aumentaram entre 1,2% e 267%. O
                  fator determinante é o material particulado oriundo das
                  queimadas, que penetra profundamente nos pulmões e causa
                  sérios danos.
                </p>
                <ul className={styles.methodList}>
                  <li>
                    Material particulado inalado atinge até 400 mg/m³ em eventos
                    severos
                  </li>
                  <li>
                    Danos respiratórios graves em crianças e populações
                    vulneráveis
                  </li>
                  <li>
                    Evidências científicas reforçam urgência de medidas
                    preventivas
                  </li>
                </ul>
              </section>

              {/* Tendências Crescentes */}
              <section className={styles.contributions}>
                <h2 className={styles.sectionTitle}>
                  Tendências crescentes dos focos de incêndio
                </h2>
                <p className={styles.contentText}>
                  Dados do INPE revelam uma tendência preocupante no aumento dos
                  focos de incêndio nas últimas décadas. Entre 2000 e 2007,
                  repetiu-se um padrão de alta, e desde 2024 o número voltou a
                  crescer. Estudos também mostram que no Cerrado maranhense mais
                  de 77% das queimadas se concentram entre agosto e outubro.
                </p>
                <div className={styles.contributionsList}>
                  <div className={styles.contribution}>
                    <h3 className={styles.contributionTitle}>Casos críticos</h3>
                    <p className={styles.contributionText}>
                      Incêndios na Estação Ecológica do Taim devastaram mais de
                      40% da unidade em anos de seca extrema.
                    </p>
                  </div>
                  <div className={styles.contribution}>
                    <h3 className={styles.contributionTitle}>
                      Distribuição temporal
                    </h3>
                    <p className={styles.contributionText}>
                      77,23% dos focos de incêndio no Cerrado concentram-se em
                      apenas três meses.
                    </p>
                  </div>
                </div>
              </section>

              {/* Condições Climáticas */}
              <section className={styles.methodology}>
                <h2 className={styles.sectionTitle}>
                  Condições climáticas propícias
                </h2>
                <p className={styles.contentText}>
                  Limiares climáticos como baixa precipitação, umidade relativa
                  abaixo de 70% e temperaturas acima de 34°C aumentam
                  drasticamente a probabilidade de ignição. Com as mudanças
                  climáticas, tais condições tornam-se mais frequentes,
                  intensificando ignições naturais e a propagação de incêndios
                  antropogênicos.
                </p>
                <ul className={styles.methodList}>
                  <li>Precipitação mensal inferior a 100 mm</li>
                  <li>Menos de 5 dias consecutivos de chuva</li>
                  <li>Umidade relativa &lt; 70%</li>
                  <li>Temperaturas &gt; 34°C</li>
                </ul>
              </section>

              {/* Inserção Tecnológica */}
              <section className={styles.contributions}>
                <h2 className={styles.sectionTitle}>
                  A inserção do contexto tecnológico
                </h2>
                <p className={styles.contentText}>
                  Diante do agravamento dos riscos, torna-se essencial adotar
                  soluções tecnológicas inovadoras. Surge assim o projeto{" "}
                  <b>I.G.N.I.S.</b>, que propõe a implementação de um sistema
                  baseado em visão computacional e inteligência artificial para
                  detecção precoce de focos.
                </p>
                <div className={styles.contributionsList}>
                  <div className={styles.contribution}>
                    <h3 className={styles.contributionTitle}>
                      Prova de conceito
                    </h3>
                    <p className={styles.contributionText}>
                      Integração de modelos de IA com sistemas embarcados para
                      operação em cenários reais.
                    </p>
                  </div>
                  <div className={styles.contribution}>
                    <h3 className={styles.contributionTitle}>
                      Detecção precoce
                    </h3>
                    <p className={styles.contributionText}>
                      Sistema projetado para identificar incêndios ainda nos
                      estágios iniciais.
                    </p>
                  </div>
                </div>
              </section>

              {/* Justificativa */}
              <section className={styles.methodology}>
                <h2 className={styles.sectionTitle}>
                  Justificativa: falhas nos métodos atuais
                </h2>
                <p className={styles.contentText}>
                  Métodos convencionais como torres de vigilância e satélites
                  apresentam baixa precisão e atrasos na identificação. Casos
                  como o da ESEC Taim revelam discrepâncias de milhares de
                  hectares entre a área noticiada e a área efetivamente
                  queimada.
                </p>
                <ul className={styles.methodList}>
                  <li>Detecção tardia aumenta custos e complexidade</li>
                  <li>Monitoramento por satélite falha com nuvens</li>
                  <li>Torres de observação dependem de ação humana</li>
                </ul>
              </section>

              {/* Sentido Prático */}
              <section className={styles.contributions}>
                <h2 className={styles.sectionTitle}>
                  Por que a I.G.N.I.S. faz sentido prático?
                </h2>
                <p className={styles.contentText}>
                  Diferente de soluções puramente teóricas, a I.G.N.I.S. foi
                  desenhada para lidar com limitações de infraestrutura e
                  condições ambientais adversas. O uso de sistemas embarcados
                  permite operação autônoma e contínua.
                </p>
                <div className={styles.contributionsList}>
                  <div className={styles.contribution}>
                    <h3 className={styles.contributionTitle}>
                      Proteção socioambiental
                    </h3>
                    <p className={styles.contributionText}>
                      Comunidades, agricultores e povos tradicionais são
                      beneficiados pela detecção precoce.
                    </p>
                  </div>
                  <div className={styles.contribution}>
                    <h3 className={styles.contributionTitle}>ODS da ONU</h3>
                    <p className={styles.contributionText}>
                      Alinhamento direto com os objetivos de saúde, clima e vida
                      terrestre.
                    </p>
                  </div>
                </div>
              </section>
            </article>
          </main>

          {/* Navegação lateral */}
          <ResearchNavigation posts={posts} />
        </div>
      </div>
    </div>
  );
}
