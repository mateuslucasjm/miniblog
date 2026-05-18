import { Link, useParams } from "react-router-dom";

import styles from "./Post.module.css";

import { useFetchDocumentById } from "../../hooks/useFetchDocumentById";
import Loading from "../../components/Loading/Loading";

const Post = () => {
  const { id } = useParams();
  const { document: post, loading, error } = useFetchDocumentById("posts", id);

  if (loading) {
    return <Loading text="Carregando post..." />;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!post) {
    return (
      <div className={styles.not_found}>
        <p>Post não encontrado.</p>
        <Link to="/" className="btn">
          Voltar para a home
        </Link>
      </div>
    );
  }

  return (
    <article className={styles.post}>
      <Link to="/" className={styles.back}>
        ← Voltar
      </Link>

      <img src={post.image} alt={post.title} />

      <header className={styles.header}>
        <h1>{post.title}</h1>
        <p className={styles.createdby}>Por {post.createdBy}</p>
        <div className={styles.tags}>
          {post.tagsArray?.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </header>

      <div className={styles.body}>
        <p>{post.body}</p>
      </div>
    </article>
  );
};

export default Post;
