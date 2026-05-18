import styles from "./Home.module.css";

import { Link } from "react-router-dom";
import { useState } from "react";
import { useFetchDocuments } from "../../hooks/useFetchDocument";

import PostDetails from "../../components/PostDetails";
import Loading from "../../components/Loading/Loading";

const Home = () => {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(null);

  const { documents: posts, loading, error } = useFetchDocuments(
    "posts",
    search,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = query.trim().toLowerCase();
    setSearch(term || null);
  };

  const handleClear = () => {
    setQuery("");
    setSearch(null);
  };

  return (
    <div className={styles.home}>
      <h1>Veja os nossos posts mais recentes</h1>
      <form onSubmit={handleSubmit} className={styles.search_form}>
        <input
          type="text"
          placeholder="Busque por tag (ex: react)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-dark">
          Pesquisar
        </button>
        {search && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleClear}
          >
            Limpar
          </button>
        )}
      </form>

      {search && (
        <p className={styles.search_info}>
          Resultados para a tag: <strong>#{search}</strong>
        </p>
      )}

      {error && <p className="error">{error}</p>}

      <section className={styles.posts_section}>
        {loading && <Loading text="Carregando posts..." />}
        {!loading && posts && posts.length > 0 && (
          <ul className={styles.posts_grid}>
            {posts.map((post) => (
              <li key={post.id}>
                <PostDetails post={post} />
              </li>
            ))}
          </ul>
        )}
        {!loading && posts && posts.length === 0 && (
          <div className={styles.noposts}>
            <p>
              {search
                ? `Nenhum post encontrado com a tag "${search}"`
                : "Não foram encontrados posts"}
            </p>
            {!search && (
              <Link to="/posts/create" className="btn">
                Criar primeiro post
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
