// Centralized Event Data Store & Utility Module for SRMVEC CSE Portal

const DEFAULT_EVENTS = [
  {
    id: "eve-3",
    numericId: 3,
    title: "CSEISMIC 2020 — Inter-Collegiate Technical Symposium",
    college: "KCG College of Technology",
    dept: "Department of Computer Science and Engineering",
    date: "January 10, 2020",
    regCloseDate: "2020-01-05",
    regCloseFormatted: "Jan 05, 2020",
    time: "9:00 AM - 4:30 PM",
    venue: "KCG College Campus, Karapakkam, Chennai",
    fee: "Free Online Registration (No On-spot Registrations)",
    prizes: "Certificates & Trophy Awards",
    poster: "eventposterimg/eve3.webp",
    techEvents: ["Technostorm (Paper Presentation)", "Inquizative (Tech Quiz)", "Humblebrag (Web Designing)", "Project Explorer (Project Display)", "Programmer Unknown Coding Ground"],
    nonTechEvents: ["Technoconnect (Connections)", "Tech Click (Photography)", "Wonder Query (Fandom Quiz)", "Meme Coders (Technical Memes)", "KCG Explorer (Treasure Hunt)"],
    contact: "+91-77086 06689, +91-90432 33406 | csesymposium@kcgcollege.com",
    regUrl: "http://www.kcgcsesymposium.com",
    description: "National level inter-collegiate technical symposium organized by Department of CSE in association with ISTE Students Chapter. Offers paper presentation, web design, coding, photography, and gaming contests."
  },
  {
    id: "eve-5",
    numericId: 5,
    title: "PHANTAZO '22 — National Level Technical Symposium",
    college: "J.J. College of Engineering and Technology",
    dept: "Department of Information Technology & Computer Science",
    date: "November 05, 2022",
    regCloseDate: "2022-10-27",
    regCloseFormatted: "Oct 27, 2022",
    time: "9:30 AM - 4:00 PM",
    venue: "J.J. College Campus, Ammapettai, Tiruchirappalli",
    fee: "Offline: ₹200 / head | Online: ₹150 / head",
    prizes: "Cash Prizes for Winners",
    poster: "eventposterimg/eve5.webp",
    techEvents: ["Paper Bestowal (AR/VR, 3D Biometrics, 5G, Robotics, Space Propulsion)", "Code Debugging", "Technical Word-Hunt"],
    nonTechEvents: ["Marketing", "Connections", "Surprise Events", "Online Animation & Logo Design"],
    contact: "956696362, 9443211700, 9940251111 | phantazo2022@gmail.com",
    regUrl: "https://jjcet.ac.in/event/national-level-technical-symposium-22/",
    description: "National Level Technical Symposium showcasing research paper presentations across AR/VR, 5G, Space Propulsion, along with coding debugging and creative design tracks."
  },
  {
    id: "eve-4",
    numericId: 4,
    title: "CYNOSURE '23 — National Level Technical Symposium",
    college: "Sri Ramakrishna Institute of Technology",
    dept: "Department of Computer Science and Engineering (CTEK ACE)",
    date: "February 09, 2023",
    regCloseDate: "2023-02-04",
    regCloseFormatted: "Feb 04, 2023",
    time: "9:00 AM - 5:00 PM",
    venue: "Perur Chettipalayam, Pachapalayam, Coimbatore",
    fee: "₹200 per head",
    prizes: "Exciting Cash Prizes for Winners",
    poster: "eventposterimg/eve4.webp",
    techEvents: ["Code Development", "Code Debugging", "Interview Skills", "Paper Presentation", "Poster & Project Presentation", "Tech Talk"],
    nonTechEvents: ["Hunt and Seek", "Short Film", "Debate", "Tech Quiz"],
    contact: "S. Sudeeson (9943442244), S. Thamaraiselvan (9360488660) | cynosure.srit.org",
    regUrl: "https://cynosure.srit.org",
    description: "National Level Technical Symposium hosted by Association of CSE (CTEK ACE), featuring code development, mock interviews, tech talks, debates, and short film screenings."
  },
  {
    id: "eve-7",
    numericId: 7,
    title: "CanFig — Hands-on Workshop on Figma and Canva",
    college: "Sri Sai Ram Engineering College",
    dept: "Department of CSE (IEEE Information Theory & CSI Chapter)",
    date: "May 23 & 24, 2023",
    regCloseDate: "2023-05-20",
    regCloseFormatted: "May 20, 2023",
    time: "10:00 AM - 4:00 PM",
    venue: "Beta Hall, Sri Sai Ram Engineering College, Chennai",
    fee: "Free Entry (Includes Certificate & Contest)",
    prizes: "Design Contest Awards & Swag",
    poster: "eventposterimg/eve7.webp",
    techEvents: ["Figma UI/UX Prototyping Workshop", "Canva Graphic Design", "Interactive Web Layout Creation"],
    nonTechEvents: ["Live UI Design Challenge", "Poster Design Contest"],
    contact: "Student Trainers: Anitha G K, Nithya R, Divya P | www.sairam.edu.in",
    regUrl: "https://sairam.edu.in/canfig2023",
    description: "Hands-on double-day design workshop teaching students how to harness Figma and Canva for UI design, poster layouts, and social assets, ending in a competitive live design challenge."
  },
  {
    id: "eve-1",
    numericId: 1,
    title: "AUGUSTA '24 — National Level Technical Symposium",
    college: "AAA College of Engineering & Technology",
    dept: "Department of Computer Science & Engineering",
    date: "April 03, 2024",
    regCloseDate: "2024-03-30",
    regCloseFormatted: "Mar 30, 2024",
    time: "9:30 AM - 4:30 PM",
    venue: "AAA College Campus, Amathur, Sivakasi",
    fee: "₹250/- only (Includes Participation Certificate, Lunch & Refreshments)",
    prizes: "Exciting Cash Prizes & Trophies",
    poster: "eventposterimg/eve1.webp",
    techEvents: ["Bug for Bugs", "UI/UX Architect", "Wisdom Wiz", "Presentino", "The Mystery Maze"],
    nonTechEvents: ["Kalakalappu Cafe", "Talentia", "Calm Wave", "Prop Hunt", "Rhythm Blast"],
    contact: "Mr. M. Dev Ananth (+91-73959 55578), Ms. A. Shren Miresan, Mr. R. Golyaram | augusta2k24@aaacet.ac.in",
    regUrl: "https://www.augusta24.in",
    description: "Get ready to be Augustified! Flagship national level symposium featuring high-octane technical challenges, UI/UX designing, maze hunts, and cultural competitions."
  },
  {
    id: "eve-6",
    numericId: 6,
    title: "DRESTEIN '24 — Technical & Management Fest",
    college: "Saveetha Engineering College",
    dept: "Department of CSE & Interdisciplinary Engineering",
    date: "November 04 - 09, 2024",
    regCloseDate: "2024-10-28",
    regCloseFormatted: "Oct 28, 2024",
    time: "9:00 AM - 5:00 PM",
    venue: "Saveetha Engineering College, Thandalam, Chennai",
    fee: "Varies by Track / Pass",
    prizes: "Attractive Prizes Worth ₹10 Lakhs",
    poster: "eventposterimg/eve6.webp",
    techEvents: ["24-Hour AI Hackathon", "Hands-on Tech Workshops", "Paper Presentation", "Poster Presentation", "Project Display"],
    nonTechEvents: ["Technical & Management Fest Competitions", "Gaming Tournaments"],
    contact: "drestein@saveetha.ac.in | www.saveetha.ac.in",
    regUrl: "https://drestein.saveetha.ac.in",
    description: "15th National Level Inter Collegiate Technical and Management Fest themed 'DReam dESign compeTE wIN' offering massive prize pools worth ₹10 Lakhs."
  },
  {
    id: "eve-2",
    numericId: 2,
    title: "KREATIV '26 — TECH BETA: Business x Coding",
    college: "Kamaraj College of Engineering & Technology",
    dept: "Department of Computer Science & Engineering",
    date: "February 13, 2026",
    regCloseDate: "2026-02-10",
    regCloseFormatted: "Feb 10, 2026",
    time: "9:00 AM - 4:30 PM",
    venue: "Kamaraj College Campus, Virudhunagar",
    fee: "₹100 per head (Team of 1 to 3 members)",
    prizes: "₹25,000 Prize Pool",
    poster: "eventposterimg/eve2.webp",
    techEvents: ["Project Sprint (Technical Coding & Systems Building)"],
    nonTechEvents: ["Market-O-Mania (Business Strategy & Pitching)"],
    contact: "Cloud Nexus & Cyberite Student Chapters | Kamaraj College CSE",
    regUrl: "https://kamarajengg.edu.in/kreativ26",
    description: "National Level Technical Symposium uniting software engineering and business strategy with a ₹25k prize pool."
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
    
    // Sort chronologically by registration closing date (regCloseDate) ASCENDING (earliest closing date first)
    allEvents.sort((a, b) => {
      const dateA = new Date(a.regCloseDate || "9999-12-31");
      const dateB = new Date(b.regCloseDate || "9999-12-31");
      return dateA - dateB;
    });

    return allEvents;
  },

  addEvent(eventData) {
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
}
