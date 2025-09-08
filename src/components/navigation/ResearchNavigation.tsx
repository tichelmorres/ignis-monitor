import { PostMetadata } from "@/types/post";
import Link from "next/link";
import styles from "./researchNavigation.module.css";

interface ResearchNavigationProps {
  posts: PostMetadata[];
  currentSlug?: string;
  className?: string;
}

export default function ResearchNavigation({
  posts,
  currentSlug,
  className = "",
}: ResearchNavigationProps) {
  return (
    <aside className={`${styles.sidebar} ${className}`}>
      <nav
        className={styles.navigation}
        role="navigation"
        aria-label="Research Documentation"
      >
        <h2 className={styles.navTitle}>Documentação da Pesquisa</h2>

        {posts.length > 0 && (
          <ul className={styles.navList}>
            {posts.map((post, index) => {
              const isCurrentPage = currentSlug === post.slug;

              return (
                <li key={post.slug} className={styles.navItem}>
                  {isCurrentPage ? (
                    <div
                      className={`${styles.navLink} ${styles.navLinkCurrent}`}
                      aria-current="page"
                    >
                      <div className={styles.navMeta}>
                        <span className={styles.navNumber}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {post.topic && (
                          <span className={styles.navtopic}>{post.topic}</span>
                        )}
                      </div>
                      <h3 className={styles.navPostTitle}>{post.title}</h3>
                    </div>
                  ) : (
                    <Link href={`/${post.slug}`} className={styles.navLink}>
                      <div className={styles.navMeta}>
                        <span className={styles.navNumber}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {post.topic && (
                          <span className={styles.navtopic}>{post.topic}</span>
                        )}
                      </div>
                      <h3 className={styles.navPostTitle}>{post.title}</h3>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </aside>
  );
}
