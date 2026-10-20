// Centralized Event Data Store & Utility Module for SRMVEC CSE Portal

/**
 * Strict Rule: Filter and validate that an event is future/upcoming.
 * Events that have already finished in the past are excluded.
 */
export function isEventUpcoming(evt) {
  if (!evt) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. If registration closing date is provided (YYYY-MM-DD), check it
  if (evt.regCloseDate) {
    const regDate = new Date(evt.regCloseDate + "T23:59:59");
    if (!isNaN(regDate.getTime())) {
      if (regDate >= today) return true;
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

    // Handle range/formatted date like "October 17, 2026", "October 15 & 16, 2026", "November 06 & 07, 2026"
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

  // 3. If regCloseDate exists and is strictly before today, it's past
  if (evt.regCloseDate) {
    const regDate = new Date(evt.regCloseDate + "T23:59:59");
    if (!isNaN(regDate.getTime())) {
      return regDate >= today;
    }
  }

  return false;
}

const DEFAULT_EVENTS = [
  {
    id: "eve-eliteccom-26",
    numericId: 101,
    title: "ELITECCOM-2026 PROJECT EXPO — 5th National Level Symposium",
    college: "IETE Chennai Centre (Institution of Electronics & Telecommunication Engineers)",
    dept: "Recent Trends in Electrical, IT, Electronics & Communication and Computers",
    date: "October 17, 2026",
    regCloseDate: "2026-10-16",
    regCloseFormatted: "Oct 16, 2026",
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
    date: "October 15 & 16, 2026",
    regCloseDate: "2026-10-16",
    regCloseFormatted: "Oct 16, 2026",
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
    date: "November 06 & 07, 2026",
    regCloseDate: "2026-11-01",
    regCloseFormatted: "Nov 01, 2026",
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
    date: "November 20, 2026",
    regCloseDate: "2026-11-15",
    regCloseFormatted: "Nov 15, 2026",
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
    date: "December 04, 2026",
    regCloseDate: "2026-11-28",
    regCloseFormatted: "Nov 28, 2026",
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

export const EventsStore = {
  getEvents() {
    let customEvents = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        customEvents = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to parse custom events from localStorage:", e);
    }

    const allEvents = [...DEFAULT_EVENTS, ...customEvents];
    
    // STRICT RULE: Only return future and upcoming events. Past events are removed.
    const upcomingEvents = allEvents.filter(evt => isEventUpcoming(evt));

    // Sort chronologically by registration closing date (regCloseDate) ASCENDING (earliest closing date first)
    upcomingEvents.sort((a, b) => {
      const dateA = new Date(a.regCloseDate || "9999-12-31");
      const dateB = new Date(b.regCloseDate || "9999-12-31");
      return dateA - dateB;
    });

    return upcomingEvents;
  },

  addEvent(eventData) {
    // STRICT RULE: We can ONLY add future and upcoming events!
    if (!isEventUpcoming(eventData)) {
      throw new Error("Validation Error: Only future and upcoming events can be added. Events that have already finished in the past are not allowed.");
    }

    const customEvents = this.getCustomEvents();
    const newId = "eve-custom-" + Date.now();
    
    const formattedRegClose = eventData.regCloseDate 
      ? new Date(eventData.regCloseDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
      : "Open";

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
      techEvents: Array.isArray(eventData.techEvents) ? eventData.techEvents : (eventData.techEvents ? eventData.techEvents.split(",").map(s => s.trim()) : ["Paper Presentation", "Technical Quiz"]),
      nonTechEvents: Array.isArray(eventData.nonTechEvents) ? eventData.nonTechEvents : (eventData.nonTechEvents ? eventData.nonTechEvents.split(",").map(s => s.trim()) : ["Surprise Event"]),
      contact: eventData.contact || "cse.events@srmvalliammai.ac.in",
      regUrl: eventData.regUrl || "#",
      description: eventData.description || "Exciting upcoming event hosted under CSE Department."
    };

    customEvents.push(newEvent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customEvents));
    return newEvent;
  },

  getCustomEvents() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  getEventById(id) {
    const events = this.getEvents();
    return events.find(e => String(e.id) === String(id) || String(e.numericId) === String(id));
  }
};

if (typeof window !== "undefined") {
  window.EventsStore = EventsStore;
  window.isEventUpcoming = isEventUpcoming;
}
export { DEFAULT_EVENTS };
