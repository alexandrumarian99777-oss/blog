import { Link } from 'react-router-dom';
import { FaClock, FaTag } from 'react-icons/fa';

const BlogCard = ({ blog }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div style={styles.card}>
      <img src={blog.imageUrl} alt={blog.title} style={styles.image} />
      <div style={styles.content}>
        <h3 style={styles.title}>{blog.title}</h3>
        <p style={styles.excerpt}>{blog.excerpt || blog.content.substring(0, 150)}...</p>
        
        <div style={styles.meta}>
          <span style={styles.metaItem}>
            <FaClock /> {formatDate(blog.createdAt)}
          </span>
          {blog.tags && blog.tags.length > 0 && (
            <span style={styles.metaItem}>
              <FaTag /> {blog.tags[0]}
            </span>
          )}
        </div>
        
        <Link to={`/blog/${blog._id}`} style={styles.readMore}>
          Read More →
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '1.5rem',
  },
  title: {
    fontSize: '1.4rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  excerpt: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    color: '#999',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  readMore: {
    color: '#667eea',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
  },
};

export default BlogCard;