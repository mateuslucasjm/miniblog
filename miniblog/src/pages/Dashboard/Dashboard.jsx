import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Dashboard.module.css";

import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocument";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";
import { parseTags, formatTags } from "../../utils/tags";
import Loading from "../../components/Loading/Loading";

const Dashboard = () => {
  const { user } = useAuthValue();
  const { documents: posts, loading, error } = useFetchDocuments(
    "posts",
    null,
    user?.uid,
  );
  const { updateDocument, response: updateResponse } =
    useUpdateDocument("posts");
  const { deleteDocument, response: deleteResponse } =
    useDeleteDocument("posts");

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");

  const startEdit = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setImage(post.image);
    setBody(post.body);
    setTags(formatTags(post.tagsArray));
    setFormError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormError("");
  };

  const handleUpdate = async (e, postId) => {
    e.preventDefault();
    setFormError("");

    try {
      new URL(image);
    } catch {
      setFormError("A imagem precisa ser uma URL.");
      return;
    }

    const tagsArray = parseTags(tags);

    if (!title || !image || !body || tagsArray.length === 0) {
      setFormError("Por favor, preencha todos os campos!");
      return;
    }

    const updateError = await updateDocument(postId, {
      title,
      image,
      body,
      tagsArray,
    });

    if (!updateError) {
      setEditingId(null);
    }
  };

  const handleDelete = async (postId, postTitle) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o post "${postTitle}"?`,
    );

    if (!confirmed) return;

    if (editingId === postId) {
      cancelEdit();
    }

    await deleteDocument(postId);
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <p>Gerencie, edite ou exclua os seus posts</p>
      </header>

      {loading && <Loading text="Carregando seus posts..." />}
      {error && <p className="error">{error}</p>}
      {deleteResponse.error && (
        <p className="error">{deleteResponse.error}</p>
      )}

      {!loading && posts?.length === 0 && (
        <div className={styles.empty}>
          <p>Você ainda não publicou nenhum post.</p>
          <Link to="/posts/create" className="btn">
            Criar primeiro post
          </Link>
        </div>
      )}

      <ul className={styles.posts_list}>
        {posts?.map((post) => (
          <li key={post.id} className={styles.post_item}>
            {editingId === post.id ? (
              <form
                onSubmit={(e) => handleUpdate(e, post.id)}
                className={styles.edit_form}
              >
                <h2>Editar post</h2>
                <label>
                  <span>Título:</span>
                  <input
                    type="text"
                    name="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
                <label>
                  <span>URL da imagem:</span>
                  <input
                    type="text"
                    name="image"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </label>
                <label>
                  <span>Conteúdo:</span>
                  <textarea
                    name="body"
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </label>
                <label>
                  <span>Tags:</span>
                  <input
                    type="text"
                    name="tags"
                    required
                    placeholder="Ex: react, firebase, blog"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </label>
                <div className={styles.form_actions}>
                  {!updateResponse.loading && (
                    <button type="submit" className="btn">
                      Salvar
                    </button>
                  )}
                  {updateResponse.loading && (
                    <button type="submit" className="btn" disabled>
                      Salvando...
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </button>
                </div>
                {updateResponse.error && (
                  <p className="error">{updateResponse.error}</p>
                )}
                {formError && <p className="error">{formError}</p>}
              </form>
            ) : (
              <>
                <article className={styles.post_preview}>
                  <img src={post.image} alt={post.title} />
                  <div className={styles.post_info}>
                    <h2>{post.title}</h2>
                    <p className={styles.post_body}>{post.body}</p>
                    <div className={styles.tags}>
                      {post.tagsArray?.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => startEdit(post)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deleteResponse.loading}
                  >
                    {deleteResponse.loading ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
