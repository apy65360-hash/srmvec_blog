// Centralized Event Data Store & Utility Module for SRMVEC CSE Portal

/**
 * Format YYYY-MM-DD or date strings into readable "MMM DD, YYYY"
 */
export function formatEventDate(dateStr) {
  if (!dateStr) return "Open";
  const s = String(dateStr).trim();
  const match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const yr = match[1];
    const mo = months[parseInt(match[2], 10) - 1] || "Jan";
    const day = String(parseInt(match[3], 10)).padStart(2, "0");
    return `${mo} ${day}, ${yr}`;
  }
  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  }
  return s;
}

/**
 * Validates whether an event is future/upcoming relative to today.
 */
export function isEventUpcoming(evt) {
  if (!evt) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Check registration closing date (YYYY-MM-DD or parseable)
  if (evt.regCloseDate) {
    const s = String(evt.regCloseDate).trim();
    const match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (match) {
      const regDate = new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10), 23, 59, 59);
      if (!isNaN(regDate.getTime())) {
        return regDate >= today;
      }
    }
    const parsedReg = new Date(s);
    if (!isNaN(parsedReg.getTime())) {
      parsedReg.setHours(23, 59, 59, 999);
      return parsedReg >= today;
    }
  }

  // 2. Check event date string
  if (evt.date) {
    const dateStr = String(evt.date).trim();
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      parsed.setHours(23, 59, 59, 999);
      return parsed >= today;
    }

    // Handle range/formatted date like "December 18 & 19, 2026", "January 22, 2027"
    const yearMatch = dateStr.match(/\b(20\d\d)\b/);
    if (yearMatch) {
      const yr = parseInt(yearMatch[1], 10);
      const currentYear = today.getFullYear();
      if (yr < currentYear) return false;
      if (yr > currentYear) return true;

      const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
      const lower = dateStr.toLowerCase();
      let foundMonth = -1;
      for (let m = 0; m < months.length; m++) {
        if (lower.includes(months[m]) || lower.includes(months[m].slice(0, 3))) {
          foundMonth = m;
          break;
        }
      }
      if (foundMonth !== -1) {
        const currentMonth = today.getMonth();
        if (foundMonth < currentMonth) return false;
        if (foundMonth > currentMonth) return true;

        const days = dateStr.match(/\b\d{1,2}\b/g);
        if (days) {
          const maxDay = Math.max(...days.map(d => parseInt(d, 10)).filter(n => n <= 31));
          return maxDay >= today.getDate();
        }
      }
    }
  }

  // Default to true for newly added custom/upcoming events without strict past dates
  return true;
}

const DEFAULT_EVENTS = [
  {
    id: "eve-eliteccom-26",
    numericId: 101,
    title: "ELITECCOM-2026 PROJECT EXPO — 5th National Level Symposium",
    college: "IETE Chennai Centre (Institution of Electronics & Telecommunication Engineers)",
    dept: "Recent Trends in Electrical, IT, Electronics & Communication and Computers",
    date: "December 12, 2026",
    regCloseDate: "2026-12-10",
    regCloseFormatted: "Dec 10, 2026",
    time: "9:00 AM - 5:00 PM",
    venue: "IETE Chennai Centre, Peters Road, Royapettah, Chennai - 600 086",
    fee: "₹300 / Team (IETE Members) | ₹450 / Team (Others) [Max 3 Members]",
    prizes: "Cash Awards for Winners & Internship Opportunity with Pantech Solutions",
    poster: "eventposterimg/eliteccom-2026-project-expo.jpeg",
    techEvents: ["AI, Data Science, Software & Cybersecurity", "Electronics, IoT & Embedded Systems", "Electrical Engineering, EVs & Smart Grids", "Robotics, Automation & Industry 4.0"],
    nonTechEvents: ["Open Multidisciplinary Innovation", "Biomedical & Assistive Technologies", "Smart Infrastructure & Resilience"],
    contact: "Dr. M. Arun, Dr. R. Karthikeyan | IETE Chennai Centre",
    regUrl: "https://ticketana.he5.in/e/eliteccom-2026-project-expo",
    description: "5th National Level Symposium on Recent Trends in Electrical, IT, Electronics & Communication and Computers. Project Expo open to all engineering disciplines with cash awards, jury evaluation, and corporate internship selections."
  },
  {
    id: "eve-anveshan-26",
    numericId: 102,
    title: "ANVESHAN 2K26 — 24-Hour National Level Hackathon Competition",
    college: "BGS Institute of Technology, Adichunchanagiri University",
    dept: "Department of Information Science and Engineering",
    date: "December 18 & 19, 2026",
    regCloseDate: "2026-12-15",
    regCloseFormatted: "Dec 15, 2026",
    time: "24-Hour Hackathon Competition",
    venue: "BGSIT Campus, B G Nagara, Mandya - 571448",
    fee: "Free to Register (₹2,000 only if shortlisted)",
    prizes: "₹50,000 Cash Prize Pool (1st: ₹25,000 | 2nd: ₹15,000 | 3rd: ₹10,000)",
    poster: "eventposterimg/anveshan-2k26-hackathon.jpeg",
    techEvents: ["Digital Safety & Cybersecurity", "AI & Machine Learning", "Energy, EV & Clean Technology", "Healthcare Technologies", "Open Innovation"],
    nonTechEvents: ["24-Hour Hackathon Sprint", "Mentor Pitch Session", "Live Prototype Showcase"],
    contact: "Mr. Anil Kumar K B (9740680113), Ms. Smitha K (8296460237), Treeshashree H P (6363894163)",
    regUrl: "https://instagram.com/anveshan_2026",
    description: "National Level 24-hour Hackathon competition challenging engineering minds to Think, Code, Build, and Innovate across Digital Safety, AI, Clean Tech, and Healthcare with ₹50,000 total prize pool."
  },
  {
    id: "eve-hackaithon-26",
    numericId: 103,
    title: "SRMVEC HACK-AI-THON '26 — National Generative AI Hackathon",
    college: "SRM Valliammai Engineering College",
    dept: "Department of Computer Science and Engineering",
    date: "January 08 & 09, 2027",
    regCloseDate: "2027-01-05",
    regCloseFormatted: "Jan 05, 2027",
    time: "9:00 AM - 6:00 PM",
    venue: "CSE Department Innovation Labs & Central Auditorium, SRMVEC",
    fee: "Free Entry for Shortlisted Teams",
    prizes: "₹1,00,000 Prize Pool & Cloud Credits",
    poster: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    techEvents: ["Generative AI Sprint", "Autonomous Agents Track", "Edge AI & Vision", "Zero-Knowledge Cyber Security"],
    nonTechEvents: ["Startup Pitch Battle", "Product Design Showcase"],
    contact: "cse.events@srmvalliammai.ac.in | 044-27454784",
    regUrl: "https://srmvalliammai.ac.in/events/hackaithon26",
    description: "Flagship departmental 36-hour hackathon bringing together developer teams nationwide to build transformative solutions in GenAI, Edge Vision, and Cybersecurity."
  },
  {
    id: "eve-cyberstorm-26",
    numericId: 104,
    title: "CYBERSTORM '26 — National Level Cyber Security & Ethical Hacking Fest",
    college: "SRM Valliammai Engineering College",
    dept: "Department of CSE & Center of Cyber Excellence",
    date: "January 22, 2027",
    regCloseDate: "2027-01-18",
    regCloseFormatted: "Jan 18, 2027",
    time: "9:30 AM - 4:30 PM",
    venue: "SRMVEC Campus, Kattankulathur, Chennai",
    fee: "₹150 per participant",
    prizes: "₹35,000 Cash Prizes & Bug Hunter Badges",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    techEvents: ["Capture The Flag (CTF)", "Network Defense War", "Reverse Engineering", "Malware Forensics"],
    nonTechEvents: ["Cyber Cryptogram", "Tech Debate", "Cipher Escape Room"],
    contact: "cyberstorm@srmvalliammai.ac.in | +91-98401 23456",
    regUrl: "https://srmvalliammai.ac.in/events/cyberstorm26",
    description: "Premier collegiate cybersecurity tournament featuring real-time CTF, malware analysis, forensic investigations, and network breach defense war."
  },
  {
    id: "eve-cloud-26",
    numericId: 105,
    title: "CLOUD CONVERGENCE '26 — DevOps & Cloud Architecture Summit",
    college: "SRM Valliammai Engineering College",
    dept: "Department of CSE in association with AWS & Google Cloud Clubs",
    date: "February 05, 2027",
    regCloseDate: "2027-01-30",
    regCloseFormatted: "Jan 30, 2027",
    time: "10:00 AM - 4:00 PM",
    venue: "Seminar Hall, New Building, SRMVEC",
    fee: "Free Registration",
    prizes: "Cloud Certification Vouchers & Swag Bags",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    techEvents: ["Kubernetes Cluster Sprint", "Serverless Architecture Challenge", "Infrastructure as Code Showcase"],
    nonTechEvents: ["Cloud Trivia Battle", "Architecture Design Sprint"],
    contact: "cloud.club@srmvalliammai.ac.in",
    regUrl: "https://srmvalliammai.ac.in/events/cloud2026",
    description: "Annual cloud computing and infrastructure conference featuring hands-on containerization labs, serverless architecture demos, and sponsored certification vouchers."
  }
];

const STORAGE_KEY = "srmvec_custom_events";
const OVERRIDES_KEY = "srmvec_event_overrides";
const DELETED_KEY = "srmvec_deleted_event_ids";
const SYNC_KEY = "srmvec_events_last_update";

function notifyEventsChanged(action, payload) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(SYNC_KEY, String(Date.now()));
    }
  } catch (e) {}

  if (typeof window !== "undefined") {
    // Current window
    window.dispatchEvent(new CustomEvent("srmvec:events-updated", { detail: { action, payload } }));

    // Top window if inside iframe
    try {
      if (window.top && window.top !== window) {
        window.top.dispatchEvent(new CustomEvent("srmvec:events-updated", { detail: { action, payload } }));
        window.top.postMessage({ type: "srmvec:events-updated", action, payload }, "*");
      }
    } catch (e) {}

    // Child iframes if on top page
    try {
      document.querySelectorAll("iframe").forEach(iframe => {
        try {
          iframe.contentWindow?.postMessage({ type: "srmvec:events-updated", action, payload }, "*");
          iframe.contentWindow?.dispatchEvent(new CustomEvent("srmvec:events-updated", { detail: { action, payload } }));
        } catch (e) {}
      });
    } catch (e) {}
  }
}

/** Convert a Supabase DB row (snake_case) to our camelCase event shape */
function dbRowToEvent(row) {
  return {
    id: row.id,
    numericId: row.numeric_id || Date.now(),
    title: row.title || "Untitled Event",
    college: row.college || "SRM Valliammai Engineering College",
    dept: row.dept || "Department of Computer Science & Engineering",
    date: row.date || "Upcoming",
    regCloseDate: row.reg_close_date || "2026-12-31",
    regCloseFormatted: row.reg_close_formatted || formatEventDate(row.reg_close_date),
    time: row.time || "Full Day",
    venue: row.venue || "Main Auditorium",
    fee: row.fee || "Free",
    prizes: row.prizes || "Certificates & Awards",
    poster: row.poster || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    techEvents: Array.isArray(row.tech_events) ? row.tech_events : [],
    nonTechEvents: Array.isArray(row.non_tech_events) ? row.non_tech_events : [],
    contact: row.contact || "",
    regUrl: row.reg_url || "#",
    description: row.description || "",
    createdAt: row.created_at || new Date().toISOString(),
    _fromDB: true
  };
}

/** Convert our camelCase event shape to a Supabase DB row (snake_case) */
function eventToDbRow(evt) {
  return {
    id: evt.id,
    numeric_id: evt.numericId || null,
    title: evt.title,
    college: evt.college || null,
    dept: evt.dept || null,
    date: evt.date || null,
    reg_close_date: evt.regCloseDate || null,
    reg_close_formatted: evt.regCloseFormatted || formatEventDate(evt.regCloseDate),
    time: evt.time || null,
    venue: evt.venue || null,
    fee: evt.fee || null,
    prizes: evt.prizes || null,
    poster: evt.poster || null,
    tech_events: Array.isArray(evt.techEvents) ? evt.techEvents : [],
    non_tech_events: Array.isArray(evt.nonTechEvents) ? evt.nonTechEvents : [],
    contact: evt.contact || null,
    reg_url: evt.regUrl || null,
    description: evt.description || null,
    is_deleted: false
  };
}

export const EventsStore = {
  getOverrides() {
    try {
      const stored = typeof localStorage !== "undefined" ? localStorage.getItem(OVERRIDES_KEY) : null;
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  },

  getDeletedIds() {
    try {
      const stored = typeof localStorage !== "undefined" ? localStorage.getItem(DELETED_KEY) : null;
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  getCustomEvents() {
    try {
      const stored = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Fetches custom events from Supabase and merges them into localStorage cache.
   * Call this on page load to make sure all users see admin-added events.
   * @returns {Promise<void>}
   */
  async syncFromSupabase() {
    const supabase = typeof window !== "undefined" ? window.supabase : null;
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_deleted", false)
        .order("reg_close_date", { ascending: true });

      if (error || !data) return;

      if (data.length === 0) return;

      // Build a map of default event IDs so we don't store duplicates
      const defaultIds = new Set(DEFAULT_EVENTS.map(e => String(e.id)));

      // Convert to camelCase and filter out default events (they are hardcoded)
      const dbCustomEvents = data
        .filter(row => !defaultIds.has(String(row.id)))
        .map(dbRowToEvent);

      // Merge with existing local custom events (prefer DB version)
      const localCustomEvents = this.getCustomEvents();
      const dbIds = new Set(dbCustomEvents.map(e => String(e.id)));

      // Keep local-only events (not yet synced to DB, e.g. offline draft)
      const localOnly = localCustomEvents.filter(e => !dbIds.has(String(e.id)));
      const merged = [...dbCustomEvents, ...localOnly];

      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }

      notifyEventsChanged("sync", { count: merged.length });
    } catch (err) {
      console.warn("[EventsStore] syncFromSupabase error:", err);
    }
  },

  /**
   * Retrieves events.
   * @param {Object} [options]
   * @param {boolean} [options.onlyUpcoming=false] - If true, only returns future events.
   * @param {boolean} [options.includePast=true] - If true, returns all active events with .isUpcoming tagged.
   */
  getEvents(options = {}) {
    let customEvents = this.getCustomEvents();
    const overrides = this.getOverrides();
    const deletedIds = new Set(this.getDeletedIds().map(String));

    const combined = [...DEFAULT_EVENTS, ...customEvents];
    
    // 1. Exclude deleted events and apply any overrides
    const activeEvents = combined
      .filter(evt => !deletedIds.has(String(evt.id)) && !deletedIds.has(String(evt.numericId)))
      .map(evt => {
        const ov = overrides[String(evt.id)] || overrides[String(evt.numericId)];
        const merged = ov ? { ...evt, ...ov } : { ...evt };
        merged.isUpcoming = isEventUpcoming(merged);
        if (!merged.regCloseFormatted && merged.regCloseDate) {
          merged.regCloseFormatted = formatEventDate(merged.regCloseDate);
        }
        return merged;
      });

    // 2. Filter if requested
    let resultEvents = activeEvents;
    if (options && options.onlyUpcoming) {
      resultEvents = activeEvents.filter(evt => evt.isUpcoming);
    }

    // 3. Sort: upcoming events first (earliest closing date first), then past events
    resultEvents.sort((a, b) => {
      if (a.isUpcoming !== b.isUpcoming) {
        return a.isUpcoming ? -1 : 1; // Upcoming first
      }
      const dateA = new Date(a.regCloseDate || "9999-12-31");
      const dateB = new Date(b.regCloseDate || "9999-12-31");
      return a.isUpcoming ? dateA - dateB : dateB - dateA;
    });

    return resultEvents;
  },

  /**
   * Convenience getter for sliders / countdowns that only show future events.
   */
  getUpcomingEvents() {
    const upcoming = this.getEvents({ onlyUpcoming: true });
    // If no events strictly match upcoming, fallback to all active events so slider never breaks
    return upcoming.length > 0 ? upcoming : this.getEvents();
  },

  addEvent(eventData) {
    const customEvents = this.getCustomEvents();
    const newId = "eve-custom-" + Date.now();
    
    const formattedRegClose = eventData.regCloseDate 
      ? formatEventDate(eventData.regCloseDate)
      : (eventData.regCloseFormatted || "Open");

    const newEvent = {
      id: newId,
      numericId: Date.now(),
      title: eventData.title || "Untitled Event",
      college: eventData.college || "SRM Valliammai Engineering College",
      dept: eventData.dept || "Department of Computer Science & Engineering",
      date: eventData.date || "Upcoming",
      regCloseDate: eventData.regCloseDate || "2026-12-31",
      regCloseFormatted: formattedRegClose,
      time: eventData.time || "Full Day",
      venue: eventData.venue || "Main Auditorium",
      fee: eventData.fee || "Free",
      prizes: eventData.prizes || "Certificates & Awards",
      poster: eventData.poster || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      techEvents: Array.isArray(eventData.techEvents) ? eventData.techEvents : (eventData.techEvents ? eventData.techEvents.split(",").map(s => s.trim()).filter(Boolean) : ["Paper Presentation", "Technical Quiz"]),
      nonTechEvents: Array.isArray(eventData.nonTechEvents) ? eventData.nonTechEvents : (eventData.nonTechEvents ? eventData.nonTechEvents.split(",").map(s => s.trim()).filter(Boolean) : ["Surprise Event"]),
      contact: eventData.contact || "cse.events@srmvalliammai.ac.in",
      regUrl: eventData.regUrl || "#",
      description: eventData.description || "Exciting upcoming event hosted under CSE Department.",
      createdAt: new Date().toISOString()
    };

    // 1. Save to localStorage immediately (instant UI update)
    customEvents.push(newEvent);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customEvents));
    }
    notifyEventsChanged("add", newEvent);

    // 2. Persist to Supabase in background (so all users/browsers see it)
    const supabase = typeof window !== "undefined" ? window.supabase : null;
    if (supabase) {
      supabase
        .from("events")
        .insert([eventToDbRow(newEvent)])
        .then(({ error }) => {
          if (error) {
            console.warn("[EventsStore] Supabase insert notice:", error.message);
          }
        })
        .catch(err => console.warn("[EventsStore] Supabase insert error:", err));
    }

    return newEvent;
  },

  updateEvent(id, updatedData) {
    let customEvents = this.getCustomEvents();
    const customIdx = customEvents.findIndex(e => String(e.id) === String(id) || String(e.numericId) === String(id));
    
    let formattedRegClose = updatedData.regCloseFormatted;
    if (updatedData.regCloseDate && !formattedRegClose) {
      formattedRegClose = formatEventDate(updatedData.regCloseDate);
    }

    const payload = {
      ...updatedData,
      ...(formattedRegClose ? { regCloseFormatted: formattedRegClose } : {}),
      techEvents: Array.isArray(updatedData.techEvents)
        ? updatedData.techEvents
        : (updatedData.techEvents ? updatedData.techEvents.split(",").map(s => s.trim()).filter(Boolean) : undefined),
      nonTechEvents: Array.isArray(updatedData.nonTechEvents)
        ? updatedData.nonTechEvents
        : (updatedData.nonTechEvents ? updatedData.nonTechEvents.split(",").map(s => s.trim()).filter(Boolean) : undefined),
      updatedAt: new Date().toISOString()
    };

    // Clean undefined fields
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

    let finalEvent = null;

    if (customIdx !== -1) {
      customEvents[customIdx] = { ...customEvents[customIdx], ...payload };
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customEvents));
      }
      finalEvent = customEvents[customIdx];
    } else {
      // Store in overrides for default events
      const overrides = this.getOverrides();
      overrides[String(id)] = { ...(overrides[String(id)] || {}), ...payload };
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
      }
      finalEvent = { id, ...payload };
    }

    // Persist update to Supabase in background
    const supabase = typeof window !== "undefined" ? window.supabase : null;
    if (supabase && finalEvent) {
      const dbUpdate = {
        ...(updatedData.title !== undefined ? { title: updatedData.title } : {}),
        ...(updatedData.college !== undefined ? { college: updatedData.college } : {}),
        ...(updatedData.dept !== undefined ? { dept: updatedData.dept } : {}),
        ...(updatedData.date !== undefined ? { date: updatedData.date } : {}),
        ...(updatedData.regCloseDate !== undefined ? { reg_close_date: updatedData.regCloseDate } : {}),
        ...(formattedRegClose ? { reg_close_formatted: formattedRegClose } : {}),
        ...(updatedData.time !== undefined ? { time: updatedData.time } : {}),
        ...(updatedData.venue !== undefined ? { venue: updatedData.venue } : {}),
        ...(updatedData.fee !== undefined ? { fee: updatedData.fee } : {}),
        ...(updatedData.prizes !== undefined ? { prizes: updatedData.prizes } : {}),
        ...(updatedData.poster !== undefined ? { poster: updatedData.poster } : {}),
        ...(payload.techEvents !== undefined ? { tech_events: payload.techEvents } : {}),
        ...(payload.nonTechEvents !== undefined ? { non_tech_events: payload.nonTechEvents } : {}),
        ...(updatedData.contact !== undefined ? { contact: updatedData.contact } : {}),
        ...(updatedData.regUrl !== undefined ? { reg_url: updatedData.regUrl } : {}),
        ...(updatedData.description !== undefined ? { description: updatedData.description } : {}),
        updated_at: new Date().toISOString()
      };

      supabase
        .from("events")
        .update(dbUpdate)
        .eq("id", String(id))
        .then(({ error }) => {
          if (error) console.warn("[EventsStore] Supabase update notice:", error.message);
        })
        .catch(err => console.warn("[EventsStore] Supabase update error:", err));
    }

    notifyEventsChanged("update", { id, data: finalEvent });
    return finalEvent;
  },

  deleteEvent(id) {
    let customEvents = this.getCustomEvents();
    const initialLen = customEvents.length;
    customEvents = customEvents.filter(e => String(e.id) !== String(id) && String(e.numericId) !== String(id));
    if (customEvents.length !== initialLen && typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customEvents));
    }

    // Always add to deleted list to guarantee default and custom events stay removed
    const deletedIds = this.getDeletedIds();
    if (!deletedIds.includes(String(id))) {
      deletedIds.push(String(id));
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(DELETED_KEY, JSON.stringify(deletedIds));
      }
    }

    // Clean overrides if any
    const overrides = this.getOverrides();
    if (overrides[String(id)]) {
      delete overrides[String(id)];
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
      }
    }

    // Persist deletion to Supabase in background (soft-delete via is_deleted flag)
    const supabase = typeof window !== "undefined" ? window.supabase : null;
    if (supabase) {
      supabase
        .from("events")
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq("id", String(id))
        .then(({ error }) => {
          if (error) {
            // If update failed (e.g. row not in DB — it's a default event), that's fine
            console.warn("[EventsStore] Supabase soft-delete notice:", error.message);
          }
        })
        .catch(err => console.warn("[EventsStore] Supabase delete error:", err));
    }

    notifyEventsChanged("delete", { id });
    return true;
  },

  getEventById(id) {
    const events = this.getEvents();
    let found = events.find(e => String(e.id) === String(id) || String(e.numericId) === String(id));
    if (!found) {
      const overrides = this.getOverrides();
      const raw = [...DEFAULT_EVENTS, ...this.getCustomEvents()];
      const base = raw.find(e => String(e.id) === String(id) || String(e.numericId) === String(id));
      if (base) {
        const ov = overrides[String(base.id)] || overrides[String(base.numericId)];
        found = ov ? { ...base, ...ov } : base;
      }
    }
    return found;
  }
};

if (typeof window !== "undefined") {
  window.EventsStore = EventsStore;
  window.isEventUpcoming = isEventUpcoming;
}
export { DEFAULT_EVENTS };
