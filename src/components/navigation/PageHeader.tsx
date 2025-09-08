import Link from "next/link";
import Ignis from "../svg/Ignis";
import styles from "./pageHeader.module.css";

interface PageHeaderProps {
  className?: string;
}

export default function PageHeader({ className = "" }: PageHeaderProps) {
  return (
    <header className={`${styles.pageHeader} ${className}`}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <Link
              href="/"
              className={styles.logoLink}
              aria-label="Ir para a página inicial"
            >
              <Ignis />
            </Link>
          </div>
          <div className={styles.titleContainer}>
            <h1 className={styles.mainTitle}>
              <Link href="/" className={styles.titleLink}>
                I.G.N.I.S.
              </Link>
            </h1>
            <p className={styles.mainSubtitle}>
              Inteligência para Gerenciamento e Neutralização de Incêndios
              Sistematizada
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
