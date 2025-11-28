import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaClock, FaUser, FaTag } from 'react-icons/fa';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!blog) {
    return <div style={styles.error}>Blog not found</div>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <FaArrowLeft /> Back
      </button>

      <article style={styles.article}>
        <img src={blog.imageUrl} alt={blog.title} style={styles.image} />
        
        <div style={styles.content}>
          <h1 style={styles.title}>{blog.title}</h1>
          
          <div style={styles.meta}>
            <span style={styles.metaItem}>
              <FaUser /> {blog.author.username}
            </span>
            <span style={styles.metaItem}>
              <FaClock /> {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {blog.tags && blog.tags.length > 0 && (
              <span style={styles.metaItem}>
                <FaTag /> {blog.tags.join(', ')}
              </span>
            )}
          </div>

          <div style={styles.body}>
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} style={styles.paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.5rem',
    color: 'white',
  },
  error: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.5rem',
    color: 'white',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  article: {
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
  },
  content: {
    padding: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    color: '#333',
    lineHeight: '1.3',
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid #f0f0f0',
    color: '#999',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  body: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#444',
  },
  paragraph: {
    marginBottom: '1.5rem',
  },
};

export default BlogDetail;