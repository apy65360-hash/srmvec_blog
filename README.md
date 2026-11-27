# SRMVEC CSE Blog & Department Portal

An institutional web portal and blogging platform for the **Department of Computer Science & Engineering, SRM Valliammai Engineering College (SRMVEC)**. It provides role-based portals for students, faculty, and administrators to publish technical blogs, showcase student achievements, manage research publications & patents, track events, and browse academic resources.

---

## Features

- **Home Showcase (`index.html`)**: Department overview, specializations, announcements, events slider, and a 3-card **Student Achievements** showcase (automatically displaying the 3 most recently uploaded achievements).
- **Blogs Board (`blogs.html`, `blog-view.html`)**: Technical articles with admin/faculty moderation workflow (`pending` → `approved` / `rejected`).
- **Achievements Corner (`achievements.html`, `add-achievement.html`)**: Filterable and searchable achievement cards with detail modal and an admin-only publishing form.
- **Publications & Patents (`publications-patents.html`)**: Directory of journal papers, conference papers, patents, and book chapters.
- **Events & Announcements (`event1.html`, `add-event.html`, `event-slider.html`, `announcement-view.html`)**: Department event listings and announcements.
- **Academic & Lab Resources (`academic-calendar.html`, `laboratories.html`, `admissions-eligibility.html`, `contact.html`)**: Academic calendar, laboratory details, and admissions information.
- **Role-Based Portals**:
  - **Student Portal** (`student-corner.html`, `student-login.html`, `student-signup.html`, `change-password.html`)
  - **Faculty Portal** (`teachers-corner.html`, `teacher-login.html`, `teacher-signup.html`)
  - **Admin Portal** (`admin-corner.html`, `admin-login.html`, `manage-faculty.html`, `dashboard.html`)

---

## Tech Stack

- **Build Tool**: [Vite](https://vitejs.dev/) (`^8.2.0`) — multi-page HTML entry point bundling configured in `vite.config.js`
- **Frontend**: HTML5, CSS3 (`src/styles/`), Vanilla JavaScript (ES Modules in `src/scripts/`)
- **Backend & Database**: [Supabase](https://supabase.com/) (`@supabase/supabase-js` `^2.112.3`)
  - **Supabase Auth** for user authentication and session management
  - **PostgreSQL + Row Level Security (RLS)** defined in `supabase_schema.sql`
- **Icons & Typography**: Font Awesome 6 (CDN), Google Fonts (`Inter`, `Space Grotesk`)

---

## Prerequisites

- **Node.js** (v18 or higher recommended; required for Vite 8)
- **npm** (comes with Node.js)
- A **Supabase** project (URL and Anon Key)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd srmvec_blog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` in the project root and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up the Supabase Database

1. Open your **Supabase Dashboard** → **SQL Editor**.
2. Copy the contents of `supabase_schema.sql` and run it.
   - This idempotently creates the `private` schema, `profiles`, `faculty_whitelist`, `blogs`, `publications`, `achievements`, and `faculty` tables, along with RLS policies, triggers, indexes, and table-level `GRANT`s.
3. To grant admin access to a registered user, run the following in the Supabase SQL Editor:

   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'your-admin-email@example.com';
   ```

   *(Supported admin/editor roles: `'admin'`, `'faculty_admin'`, `'editor'`.)*

---

## Running the Project

### Development Server

Starts the Vite dev server with hot module replacement:

```bash
npm run dev
```

### Production Build

Builds all HTML pages and bundled assets into the `dist/` directory:

```bash
npm run build
```

### Preview Production Build

Locally serves the `dist/` production build for testing:

```bash
npm run preview
```

---

## Project Structure

```text
srmvec_blog/
├── index.html                   # Main landing page
├── achievements.html            # Achievements Corner (filterable grid & modal)
├── add-achievement.html         # Admin form to publish achievements
├── blogs.html                   # Blogs Board
├── blog-view.html               # Single blog reader view
├── publications-patents.html    # Research publications & patents directory
├── academic-calendar.html       # Department academic calendar
├── event1.html / add-event.html # Events board & creation
├── admin-corner.html            # Admin dashboard
├── admin-login.html             # Admin sign-in page
├── manage-faculty.html          # Faculty management (admin)
├── student-corner.html          # Student portal
├── teachers-corner.html         # Faculty portal
├── supabase_schema.sql          # Full PostgreSQL + RLS schema for Supabase
├── vite.config.js               # Multi-page Vite configuration
├── package.json                 # Project metadata & npm scripts
├── .env.example                 # Template for Supabase environment variables
└── src/
    ├── scripts/                 # Modular JS (auth, supabase client, achievements, blogs, etc.)
    └── styles/                  # Stylesheets (style.css, portal.css, achievements.css, etc.)
```

---

## License

Private institutional project — Department of Computer Science & Engineering, SRMVEC.
