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

  // ── BLOG CRUD (Synchronous with Local Cache & Supabase Sync) ──
  function getBlogs() {
    init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function saveBlogs(blogs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  }

  // Async Supabase sync
  async function fetchBlogsAsync() {
    if (window.supabase) {
      try {
        const { data, error } = await window.supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(b => ({
            id: b.id,
            title: b.title,
            category: b.category,
            content: b.content,
            tags: b.tags || [],
            author: b.author_name,
            authorId: b.author_id,
            role: b.author_role,
            createdAt: b.created_at,
            updatedAt: b.updated_at,
            views: b.views || 0
          }));
          saveBlogs(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using local cache:', err);
      }
    }
    return getBlogs();
  }

  function getBlogById(id) {
    return getBlogs().find(b => b.id === id) || null;
  }

  async function createBlog({ title, category, content, tags, author, authorId, role }) {
    const parsedTags = Array.isArray(tags) ? tags : String(tags || '').split(',').map(t => t.trim()).filter(Boolean);
    const currentUser = getCurrentUser();
    const effectiveAuthorId = authorId || currentUser?.id || currentUser?.userId;

    const newBlog = {
      id: 'blog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      title: title.trim(),
      category: category.trim(),
      content: content.trim(),
      tags: parsedTags,
      author: author || currentUser?.displayName || currentUser?.name || 'Anonymous',
      authorId: effectiveAuthorId,
      role: role || currentUser?.role || 'student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0
    };

    // Save locally first for instant UI response
    const blogs = getBlogs();
    blogs.unshift(newBlog);
    saveBlogs(blogs);

    // Sync to Supabase if available
    if (window.supabase && currentUser) {
      try {
        const { data, error } = await window.supabase
          .from('blogs')
          .insert([{
            title: newBlog.title,
            category: newBlog.category,
            content: newBlog.content,
            tags: newBlog.tags,
            author_name: newBlog.author,
            author_id: currentUser.id || currentUser.userId,
            author_role: newBlog.role,
            is_published: true
          }])
          .select()
          .single();

        if (!error && data) {
          newBlog.id = data.id;
          blogs[0].id = data.id;
          saveBlogs(blogs);
        }
      } catch (e) {
        console.warn('Supabase insert skipped or failed:', e);
      }
    }

    return newBlog;
  }

  async function updateBlog(id, updates) {
    const blogs = getBlogs();
    const idx = blogs.findIndex(b => b.id === id);
    if (idx === -1) return null;

    blogs[idx] = {
      ...blogs[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveBlogs(blogs);

    if (window.supabase) {
      try {
        await window.supabase
          .from('blogs')
          .update({
            title: updates.title || blogs[idx].title,
            category: updates.category || blogs[idx].category,
            content: updates.content || blogs[idx].content,
            tags: updates.tags || blogs[idx].tags,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase update failed:', e);
      }
    }

    return blogs[idx];
  }

  async function deleteBlog(id) {
    const blogs = getBlogs();
    const filtered = blogs.filter(b => b.id !== id);
    if (filtered.length === blogs.length) return false;
    saveBlogs(filtered);

    if (window.supabase) {
      try {
        await window.supabase
          .from('blogs')
          .delete()
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase delete failed:', e);
      }
    }

    return true;
  }

  function incrementViews(id) {
    const blogs = getBlogs();
    const idx = blogs.findIndex(b => b.id === id);
    if (idx !== -1) {
      blogs[idx].views = (blogs[idx].views || 0) + 1;
      saveBlogs(blogs);

      if (window.supabase) {
        window.supabase
          .from('blogs')
          .update({ views: blogs[idx].views })
          .eq('id', id)
          .then();
      }
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
    sessionStorage.removeItem('srmvec_portal_session');
  }

  // ── Authentication Directory Check ──
  function authenticate(username, password, expectedRole) {
    if (expectedRole === 'admin' || expectedRole === 'faculty_admin' || expectedRole === 'editor') {
      // Admin authentication must be handled via Supabase Auth (Auth.login)
      return null;
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

  // Auto fetch from Supabase on load
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      fetchBlogsAsync();
    }, 300);
  }

  // Public API
  return {
    init,
    getBlogs,
    fetchBlogsAsync,
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

