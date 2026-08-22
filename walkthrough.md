# Publications & Patents Implementation Walkthrough

We have created a dedicated, animated, and fully searchable **Publications & Patents** portal page for faculties and students to publish and browse journals, research papers, and patents.

## What Was Added/Modified

### 1. New [publications-patents.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/publications-patents.html)
- A modern, high-tech dashboard showcasing research metrics (Total Submissions, Patents, Journals, Faculty Guided).
- Dynamic navigation controls allowing users to:
  - Search by title, author names, guides, or ISSN/ISBN/patent numbers.
  - Filter by type (Journals, Conference Papers, Patents, Book Chapters).
  - Filter by **Topic/Category** pills (AI & ML, Cybersecurity, Cloud & DevOps, Data Engineering, General Tech).
  - Filter by **Publish Year** pills (2026, 2025, 2024, 2023 & Before).
- Expandable publication cards featuring smooth height/opacity transitions.
- Submission form modal that validates inputs and automatically pulls the logged-in student or faculty user details.

### 2. New [publications-patents.js](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/src/scripts/publications-patents.js)
- Manages local CRUD (`PubDB`) with realistic seed data (e.g., Cardiac AI Diagnosis, Zero-Trust Patents) for instant visualization.
- Integrates with the current `Auth` helper state.
- **Guest Access Control (Requested Rule)**: 
  - **Guests (Logged-out)**: Can browse the list and see titles/authors. Clicking "🔒 Read Full Paper" expands the card to show a locked state block urging them to log in to read the abstract, DOI link, and indexing details.
  - **CSE Members (Logged-in)**: Clicking "View Details" expands the card to show the full abstract, ISSN/ISBN indices, guides, and external full-text PDF links.
- Formulates Supabase synchronization to push to/pull from a `publications` table.

### 3. Updated [index.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/index.html) & [academic-calendar.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/academic-calendar.html) & [event1.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/event1.html)
- Updated dropdown navigation items across pages.
- Replaced the "Research" column and pointed all "Publications & Patents" references to `publications-patents.html`.
- Added the Publications & Patents portal shortcut tile on the home screen page-directory grid.

### 4. Updated [supabase_schema.sql](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/supabase_schema.sql)
- Appended the database schema statement and Row-Level Security (RLS) policies for the `publications` table.

### 5. Added Add Event Buttons & Navigation to [add-event.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/add-event.html)
- **Events Board ([event1.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/event1.html))**:
  - Added a prominent **"Publish New Event"** CTA button in the hero section.
  - Added an **"+ Add Event"** button in the sticky filter & controls header bar.
- **Home Page ([index.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/index.html))**:
  - Added **"Add Event"** to the top CSE Blog navigation dropdown menu.
  - Added an **"Add New Event"** tile to the CSE Blog Pages & Portals directory grid.
  - Added an **"+ Add Event"** button above the Upcoming Events slider section.
- **Event Slider ([event-slider.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/event-slider.html))**:
  - Added an **"+ Add Event"** button in the site header that navigates directly to `add-event.html`.
- **Management & Admin Portals ([teachers-corner.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/teachers-corner.html), [admin-corner.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/admin-corner.html), [dashboard.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/dashboard.html))**:
  - Added **"Add Event"** action buttons in the portal header actions and dashboard control bars.

---

## How to Verify
1. Run the local development server: `npm run dev`.
2. Open [event1.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/event1.html) (Events Board) or [index.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/index.html) (Home Page).
3. Click any of the new **"Add Event"** / **"Publish New Event"** buttons or tiles.
4. Verify that you are directed to [add-event.html](file:///C:/Users/hemap/OneDrive/Desktop/srmvec_blog/add-event.html), where you can publish new events directly to the Events Board.
