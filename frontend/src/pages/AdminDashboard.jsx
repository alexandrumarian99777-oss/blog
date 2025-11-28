import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchBlogs();
    fetchUsers();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()),
      };

      if (editMode) {
        await axios.put(`http://localhost:5000/api/blogs/${currentBlog._id}`, blogData);
      } else {
        await axios.post('http://localhost:5000/api/blogs', blogData);
      }

      fetchBlogs();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (blog) => {
    setEditMode(true);
    setCurrentBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      tags: blog.tags.join(', '),
      imageUrl: blog.imageUrl,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`);
        fetchBlogs();
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  // ✅ DELETE USER FUNCTION
  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers(); // refresh list
      } catch (error) {
        alert(error.response?.data?.message || "User delete failed");
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', excerpt: '', tags: '', imageUrl: '' });
    setShowForm(false);
    setEditMode(false);
    setCurrentBlog(null);
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Admin Dashboard</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> New Blog</>}
        </button>
      </div>

      {/* BLOG FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3 style={styles.formTitle}>{editMode ? '✏️ Edit Blog' : '➕ Create New Blog'}</h3>

          <input
            type="text"
            placeholder="Blog Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={styles.input}
            required
          />

          <textarea
            placeholder="Blog Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            style={{ ...styles.input, minHeight: '200px' }}
            required
          />

          <input
            type="text"
            placeholder="Excerpt (optional)"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            style={styles.input}
          />

          <input
            type="url"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            style={styles.input}
          />

          <div style={styles.formButtons}>
            <button type="submit" style={styles.submitButton}>
              <FaSave /> {editMode ? 'Update Blog' : 'Create Blog'}
            </button>
            <button type="button" onClick={resetForm} style={styles.cancelButton}>
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      )}

      {/* BLOG LIST */}
      <div style={styles.blogList}>
        <h3 style={styles.listTitle}>📚 Your Blogs ({blogs.length})</h3>
        {blogs.length === 0 ? (
          <p style={styles.emptyText}>No blogs yet. Create your first blog!</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} style={styles.blogItem}>
              <img src={blog.imageUrl} alt={blog.title} style={styles.blogImage} />

              <div style={styles.blogContent}>
                <h4 style={styles.blogTitle}>{blog.title}</h4>
                <p style={styles.blogExcerpt}>
                  {blog.excerpt || blog.content.substring(0, 100)}...
                </p>
                <div style={styles.blogMeta}>
                  <span>🏷️ {blog.tags.join(', ')}</span>
                  <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={styles.blogActions}>
                <button onClick={() => handleEdit(blog)} style={styles.editButton}>
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(blog._id)} style={styles.deleteButton}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* USERS LIST */}
      <div style={styles.blogList}>
        <h3 style={styles.listTitle}>👤 Users ({users.length})</h3>

        {users.length === 0 ? (
          <p style={styles.emptyText}>No users found.</p>
        ) : (
          users.map((user) => (
            <div key={user._id} style={styles.blogItem}>
              <div style={styles.blogContent}>
                <h4 style={styles.blogTitle}>{user.username}</h4>
                <p style={styles.blogExcerpt}>{user.email}</p>
              </div>

              <div style={styles.blogActions}>
                <button
                  onClick={() => navigate(`/admin/edit-user/${user._id}`)}
                  style={styles.editButton}
                >
                  <FaEdit /> Edit User
                </button>

                {/* ✅ REAL DELETE USER BUTTON */}
                <button
                  onClick={() => deleteUser(user._id)}
                  style={styles.deleteButton}
                >
                  <FaTrash /> Delete User
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    background: 'white',
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
  },
  form: {
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    marginBottom: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  formTitle: {
    marginBottom: '1.5rem',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '1rem',
    marginBottom: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '1rem',
    outline: 'none',
  },
  formButtons: {
    display: 'flex',
    gap: '1rem',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '1rem 1.5rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#9e9e9e',
    color: 'white',
    border: 'none',
    padding: '1rem 1.5rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
  },
  blogList: {
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginTop: '2rem',
  },
  listTitle: {
    marginBottom: '1.5rem',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: '2rem',
  },
  blogItem: {
    display: 'flex',
    gap: '1.5rem',
    padding: '1.5rem',
    marginBottom: '1rem',
    border: '2px solid #f0f0f0',
    borderRadius: '12px',
    transition: 'all 0.3s',
  },
  blogImage: {
    width: '150px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  blogContent: {
    flex: 1,
  },
  blogTitle: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  blogExcerpt: {
    color: '#666',
    marginBottom: '0.5rem',
  },
  blogMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.9rem',
    color: '#999',
  },
  blogActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#2196f3',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#f44336',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default AdminDashboard;
