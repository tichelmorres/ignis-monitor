"use client";

import { ArrowLeftIcon } from "@/components/svg/ArrowLeftIcon";
import { HomeIcon } from "@/components/svg/HomeIcon";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function PostNotFound() {
  return (
    <div className={styles.post}>
      <div className={styles.postContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>404: Post não encontrado</h1>
          <p className={styles.subtitle}>
            Desculpe, o post que você está procurando não existe ou foi
            removido.
          </p>
        </header>

        <main className={styles.content}>
          <h2>O que você pode fazer:</h2>
          <ul>
            <li>Verificar se a URL está correta</li>
            <li>Voltar à página inicial ou anterior</li>
            <li>Explorar outros posts</li>
          </ul>
        </main>

        <footer className={styles.actions}>
          <Link href="/" className={styles.actionLink}>
            <HomeIcon className={styles.icon} />
            <span>Página inicial</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className={styles.actionButton}
          >
            <ArrowLeftIcon className={styles.icon} />
            <span>Voltar</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
