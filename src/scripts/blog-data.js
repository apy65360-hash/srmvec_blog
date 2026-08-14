/* ===================================================
   BLOG DATA STORE — blog-data.js
   Shared localStorage CRUD for all portal pages
   =================================================== */

const BlogDB = (() => {

  const STORAGE_KEY = 'srmvec_blogs';
  const USER_KEY    = 'srmvec_current_user';

  // ── Sample seed data so carousel is populated immediately ──
  const SEED_BLOGS = [
    {
      id: 'blog_seed_1',
      title: 'Getting Started with Machine Learning in Python',
      category: 'AI & ML',
      content: 'Machine learning has transformed how we build intelligent systems. In this article, we explore the fundamentals of supervised learning, from linear regression to neural networks, using Python and scikit-learn. Whether you are a beginner or looking to solidify your foundations, this guide walks you through each concept with hands-on examples and real datasets. We cover data preprocessing, model training, evaluation metrics, and deployment best practices.',
      tags: ['Python', 'ML', 'scikit-learn', 'AI'],
      author: 'Dr. Priya Ramesh',
      authorId: 'teacher_seed_1',
      role: 'teacher',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      views: 312
    },
    {
      id: 'blog_seed_2',
      title: 'Zero-Trust Security Architecture: A Practical Guide',
      category: 'Cybersecurity',
      content: 'Zero-trust is no longer a buzzword — it is an essential security model for modern enterprises. This article breaks down the core principles: verify explicitly, use least privilege access, and assume breach. We walk through implementing zero-trust in a cloud-native environment using identity providers, micro-segmentation, and continuous monitoring. Case studies from real-world deployments are included.',
      tags: ['Security', 'Zero-Trust', 'Cloud', 'IAM'],
      author: 'Prof. Karthik Subramanian',
      authorId: 'teacher_seed_2',
      role: 'teacher',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      views: 487
    },
    {
      id: 'blog_seed_3',
      title: 'My Experience Building a Full-Stack App with React & Node.js',
      category: 'Web Development',
      content: 'As a third-year CSE student, I recently built my first complete full-stack application for our college symposium. I used React for the frontend and Node.js with Express on the backend, connected to a MongoDB database. This post documents the challenges I faced — CORS errors, JWT auth bugs, and deployment woes — and how I overcame each one. A great learning experience for anyone starting out!',
      tags: ['React', 'Node.js', 'MongoDB', 'Student Project'],
      author: 'Arun Krishnamurthy',
      authorId: 'student_seed_1',
      role: 'student',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      views: 198
    },
    {
      id: 'blog_seed_4',
      title: 'Kubernetes for Beginners: Deploying Your First Pod',
      category: 'Cloud & DevOps',
      content: 'Container orchestration with Kubernetes can feel overwhelming at first. This beginner-friendly guide strips away the complexity and walks you through deploying your very first containerized application on a local Kubernetes cluster using Minikube. We cover Pods, Deployments, Services, and ConfigMaps — all explained with clear YAML examples and CLI commands you can run right away.',
      tags: ['Kubernetes', 'Docker', 'DevOps', 'Cloud'],
      author: 'Dr. Meena Sundarajan',
      authorId: 'teacher_seed_3',
      role: 'teacher',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      views: 534
    },
    {
      id: 'blog_seed_5',
      title: 'How I Cleared My First Competitive Coding Round',
      category: 'Student Life',
      content: 'Competitive programming was something I always feared. But after months of consistent practice on LeetCode and Codeforces, I cracked my first campus placement coding round. In this post, I share my study plan, the topics that matter most (arrays, trees, DP, graphs), and the mental strategies that kept me going when problems felt impossible. Consistency over brilliance — that is the mantra.',
      tags: ['Competitive Coding', 'Placement', 'LeetCode', 'Student'],
      author: 'Swetha Raghavan',
      authorId: 'student_seed_2',
      role: 'student',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      views: 621
    }
  ];

  // ── Initialize storage with seed data if empty ──
  function init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BLOGS));
    }
  }

  // ── BLOG CRUD ──
  function getBlogs() {
    init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function saveBlogs(blogs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  }

  function getBlogById(id) {
    return getBlogs().find(b => b.id === id) || null;
  }

  function createBlog({ title, category, content, tags, author, authorId, role }) {
    const blogs = getBlogs();
    const newBlog = {
      id: 'blog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      title: title.trim(),
      category: category.trim(),
      content: content.trim(),
      tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean),
      author,
      authorId,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0
    };
    blogs.unshift(newBlog); // newest first
    saveBlogs(blogs);
    return newBlog;
  }

  function updateBlog(id, updates) {
    const blogs = getBlogs();
    const idx = blogs.findIndex(b => b.id === id);
    if (idx === -1) return null;
    blogs[idx] = {
      ...blogs[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveBlogs(blogs);
    return blogs[idx];
  }

  function deleteBlog(id) {
    const blogs = getBlogs();
    const filtered = blogs.filter(b => b.id !== id);
    if (filtered.length === blogs.length) return false;
    saveBlogs(filtered);
    return true;
  }

  function incrementViews(id) {
    const blogs = getBlogs();
    const idx = blogs.findIndex(b => b.id === id);
    if (idx !== -1) {
      blogs[idx].views = (blogs[idx].views || 0) + 1;
      saveBlogs(blogs);
    }
  }

  // ── Top blogs for carousel (max 5, sorted by newest) ──
  function getTopBlogs(max = 5) {
    const blogs = getBlogs();
    return [...blogs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, max);
  }

  // ── USER SESSION ──
  function getCurrentUser() {
    try {
      return JSON.parse(sessionStorage.getItem(USER_KEY)) || null;
    } catch { return null; }
  }

  function setCurrentUser(user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function logout() {
    sessionStorage.removeItem(USER_KEY);
    // The portal pages (auth.js) mirror the session under their own key.
    sessionStorage.removeItem('srmvec_portal_session');
  }

  // ── Credential check (demo only; in production use a real backend) ──
  // Teacher and student accounts come from users.js: sign in with NAME + ID NUMBER.
  const ADMIN_ACCOUNT = { username: 'admin', password: 'Admin@2026', role: 'admin', displayName: 'Administrator' };

  function authenticate(username, password, expectedRole) {
    if (expectedRole === 'admin') {
      return username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password ? ADMIN_ACCOUNT : null;
    }
    const directory = window.PortalUsers;
    if (!directory) return null;
    const user = directory.match(username, password, expectedRole);
    if (!user) return null;
    return {
      userId: user.userId,
      id: user.id,
      username: user.name,
      displayName: user.name,
      name: user.name,
      role: user.role,
      email: user.email || ''
    };
  }

  // ── Helpers ──
  function formatDate(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function truncate(str, maxLen = 130) {
    if (!str) return '';
    return str.length > maxLen ? str.slice(0, maxLen).trim() + '…' : str;
  }

  // Public API
  return {
    init,
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    incrementViews,
    getTopBlogs,
    getCurrentUser,
    setCurrentUser,
    logout,
    authenticate,
    formatDate,
    truncate
  };
})();

window.BlogDB = BlogDB;
