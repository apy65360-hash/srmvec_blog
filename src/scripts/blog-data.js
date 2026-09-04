/* ===================================================
   BLOG DATA STORE — blog-data.js
   Shared localStorage & Supabase Sync CRUD
   Enforces Student Article Approval & Admin-Only Edits/Deletions
   =================================================== */

const BlogDB = (() => {

  const STORAGE_KEY = 'srmvec_blogs';
  const USER_KEY    = 'srmvec_current_user';

  // ── Sample seed data initialized as approved so public visitors see demo content ──
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
      status: 'approved',
      is_published: true,
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
      status: 'approved',
      is_published: true,
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
      status: 'approved',
      is_published: true,
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
      status: 'approved',
      is_published: true,
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
      status: 'approved',
      is_published: true,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      views: 621
    }
  ];

  // ── Helper: Admin role check ──
  function checkIsAdmin() {
    const user = getCurrentUser();
    if (!user) return false;
    return user.role === 'admin' || user.role === 'faculty_admin' || user.role === 'editor';
  }

  // ── Initialize storage ──
  function init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BLOGS));
    }
  }

  // ── Get all raw blogs ──
  function getAllRawBlogs() {
    init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function saveBlogs(blogs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  }

  // ── Get ONLY approved & published blogs (for public boards & general users) ──
  function getBlogs() {
    const blogs = getAllRawBlogs();
    return blogs.filter(b => b.status === 'approved' || b.is_published === true || !b.status);
  }

  // ── Get pending blogs waiting for admin approval ──
  function getPendingBlogs() {
    const blogs = getAllRawBlogs();
    return blogs.filter(b => b.status === 'pending');
  }

  // ── Get author's own blogs (regardless of approval status, so author can track submission status) ──
  function getAuthorBlogs(authorId) {
    const blogs = getAllRawBlogs();
    return blogs.filter(b => b.authorId === authorId);
  }

  // ── Async Supabase sync ──
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
            status: b.status || (b.is_published ? 'approved' : 'pending'),
            is_published: b.is_published,
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
    return getAllRawBlogs();
  }

  function getBlogById(id) {
    return getAllRawBlogs().find(b => b.id === id) || null;
  }

  // ── CREATE ARTICLE / BLOG POST ──
  // Students create articles with status 'pending' (requires admin approval)
  // Admins create articles with status 'approved' directly
  async function createBlog({ title, category, content, tags, author, authorId, role }) {
    const parsedTags = Array.isArray(tags) ? tags : String(tags || '').split(',').map(t => t.trim()).filter(Boolean);
    const currentUser = getCurrentUser();
    const effectiveAuthorId = authorId || currentUser?.id || currentUser?.userId;
    const authorRole = role || currentUser?.role || 'student';
    const isAdminUser = checkIsAdmin();

    // Student articles MUST be approved by admin before publishing
    const status = isAdminUser ? 'approved' : 'pending';
    const isPublished = isAdminUser ? true : false;

    const newBlog = {
      id: 'blog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      title: title.trim(),
      category: category.trim(),
      content: content.trim(),
      tags: parsedTags,
      author: author || currentUser?.displayName || currentUser?.name || 'Anonymous',
      authorId: effectiveAuthorId,
      role: authorRole,
      status: status,
      is_published: isPublished,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0
    };

    const blogs = getAllRawBlogs();
    blogs.unshift(newBlog);
    saveBlogs(blogs);

    // Sync to Supabase if connected
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
            status: status,
            is_published: isPublished
          }])
          .select()
          .single();

        if (!error && data) {
          newBlog.id = data.id;
          blogs[0].id = data.id;
          saveBlogs(blogs);
        }
      } catch (e) {
        console.warn('Supabase insert failed:', e);
      }
    }

    return newBlog;
  }

  // ── ADMIN APPROVE ARTICLE ──
  async function approveBlog(id) {
    if (!checkIsAdmin()) {
      return { error: 'Permission denied: Only administrators can approve articles.' };
    }

    const blogs = getAllRawBlogs();
    const idx = blogs.findIndex(b => b.id === id);
    if (idx === -1) return null;

    blogs[idx].status = 'approved';
    blogs[idx].is_published = true;
    blogs[idx].updatedAt = new Date().toISOString();
    saveBlogs(blogs);

    if (window.supabase) {
      try {
        await window.supabase
          .from('blogs')
          .update({
            status: 'approved',
            is_published: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase approve error:', e);
      }
    }

    return blogs[idx];
  }

  // ── ADMIN REJECT ARTICLE ──
  async function rejectBlog(id) {
    if (!checkIsAdmin()) {
      return { error: 'Permission denied: Only administrators can reject articles.' };
    }

    const blogs = getAllRawBlogs();
    const idx = blogs.findIndex(b => b.id === id);
    if (idx === -1) return null;

    blogs[idx].status = 'rejected';
    blogs[idx].is_published = false;
    blogs[idx].updatedAt = new Date().toISOString();
    saveBlogs(blogs);

    if (window.supabase) {
      try {
        await window.supabase
          .from('blogs')
          .update({
            status: 'rejected',
            is_published: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase reject error:', e);
      }
    }

    return blogs[idx];
  }

  // ── UPDATE BLOG (STRICT ADMIN ONLY) ──
  async function updateBlog(id, updates) {
    if (!checkIsAdmin()) {
      alert('Security Alert: Only administrators are authorized to edit data.');
      return { error: 'Permission denied: Only administrators can edit data.' };
    }

    const blogs = getAllRawBlogs();
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

  // ── DELETE BLOG (STRICT ADMIN ONLY) ──
  async function deleteBlog(id) {
    if (!checkIsAdmin()) {
      alert('Security Alert: Only administrators are authorized to delete data.');
      return false;
    }

    const blogs = getAllRawBlogs();
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
    const blogs = getAllRawBlogs();
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

  // ── Top blogs for carousel (max 5 approved/published blogs) ──
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

  // ── Authentication Check ──
  function authenticate(username, password, expectedRole) {
    if (expectedRole === 'admin' || expectedRole === 'faculty_admin' || expectedRole === 'editor') {
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

  function formatDate(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function truncate(str, maxLen = 130) {
    if (!str) return '';
    return str.length > maxLen ? str.slice(0, maxLen).trim() + '…' : str;
  }

  if (typeof window !== 'undefined') {
    setTimeout(() => {
      fetchBlogsAsync();
    }, 300);
  }

  return {
    init,
    getBlogs,
    getPendingBlogs,
    getAuthorBlogs,
    getAllRawBlogs,
    fetchBlogsAsync,
    getBlogById,
    createBlog,
    approveBlog,
    rejectBlog,
    updateBlog,
    deleteBlog,
    incrementViews,
    getTopBlogs,
    getCurrentUser,
    setCurrentUser,
    logout,
    authenticate,
    formatDate,
    truncate,
    checkIsAdmin
  };
})();

window.BlogDB = BlogDB;
