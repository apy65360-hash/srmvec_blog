/**
 * PUBLICATIONS & PATENTS PORTAL SCRIPT — publications-patents.js
 * Manages research papers, journals, book chapters, and patents.
 * Leverages localStorage with Supabase database synchronization.
 */

const PubDB = (() => {
  const STORAGE_KEY = 'srmvec_publications';

  // Realistic seed data
  const SEED_PUBLICATIONS = [
  {
    "id": "pub_imported_1",
    "title": "Optimizing Blood Cell Segmentation in Hematological Analysis Using Advanced Image Processing",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Science and Research Technology",
    "issn": "Volume 11 Issue 10 , ISSN: 2349-6002, March 2025",
    "year": 2025,
    "contributors": "Dr.B.Vanathi, UG Students(8th Sem):, 1.Ifthikaar Ahmed 2.A.Haari 3.Vignesh T, 4.Akshaya E",
    "mentors": "Dr.B.Vanathi",
    "abstract": "This research publication titled \"Optimizing Blood Cell Segmentation in Hematological Analysis Using Advanced Image Processing\" was authored by Dr.B.Vanathi, UG Students(8th Sem):, 1.Ifthikaar Ahmed 2.A.Haari 3.Vignesh T, 4.Akshaya E and published in \"International Journal of Innovative Science and Research Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.601Z"
  },
  {
    "id": "pub_imported_2",
    "title": "Parking Pixels: Pythons Vision for Urban Space Optimization",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of New Innovations in Engineering and Technology",
    "issn": "Volume.24, Issue.4,, pp:21-29",
    "year": 2024,
    "contributors": "Dr. V. Dhanakoti, , UG Students(8th Sem):, Sakthivel S, , Vedavarshini. K, Sundaresan. C",
    "mentors": "Dr. V. Dhanakoti",
    "abstract": "This research publication titled \"Parking Pixels: Pythons Vision for Urban Space Optimization\" was authored by Dr. V. Dhanakoti, , UG Students(8th Sem):, Sakthivel S, , Vedavarshini. K, Sundaresan. C and published in \"International Journal of New Innovations in Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.608Z"
  },
  {
    "id": "pub_imported_3",
    "title": "Enhanced Sentiment Analysis Of App Reviews Using Naïve Bayes And Ensemble Learning",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal of Innovative Science and Research Technology",
    "issn": "Volume 11, Issue.10, March 2025",
    "year": 2025,
    "contributors": "V. Dhanakoti, , UG Students(8th Sem):, Anitha Varshini. A, Athmanathan K, , Balineni Akhila",
    "mentors": null,
    "abstract": "This research publication titled \"Enhanced Sentiment Analysis Of App Reviews Using Naïve Bayes And Ensemble Learning\" was authored by V. Dhanakoti, , UG Students(8th Sem):, Anitha Varshini. A, Athmanathan K, , Balineni Akhila and published in \"International Journal of Innovative Science and Research Technology\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.608Z"
  },
  {
    "id": "pub_imported_4",
    "title": "Blockchain-Powered Logistics: Securing and Optimizing IoT-Based Distribution and Storage Networks",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Science and Research Technology",
    "issn": "Volume 11 Issue 10 , ISSN: 2349-6002, March 2025",
    "year": 2025,
    "contributors": "C.Pabitha, , UG Students(8th Sem):, Sivarama Krishnan K, Steve Samuel A, Sylesh Gowtham S",
    "mentors": null,
    "abstract": "This research publication titled \"Blockchain-Powered Logistics: Securing and Optimizing IoT-Based Distribution and Storage Networks\" was authored by C.Pabitha, , UG Students(8th Sem):, Sivarama Krishnan K, Steve Samuel A, Sylesh Gowtham S and published in \"International Journal of Innovative Science and Research Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.608Z"
  },
  {
    "id": "pub_imported_5",
    "title": "Safe Tracker - Combines Road Safety and Tracking Capabilities using Computer Vision",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal of Innovative Science and Research Technology",
    "issn": "Volume 11 Issue 10 | ISSN: 2349-6002, March 2025",
    "year": 2025,
    "contributors": "C.Pabitha, , UG Students(8th Sem):, A. Prathija, V. Shamritha,, R. Vignesh",
    "mentors": null,
    "abstract": "This research publication titled \"Safe Tracker - Combines Road Safety and Tracking Capabilities using Computer Vision\" was authored by C.Pabitha, , UG Students(8th Sem):, A. Prathija, V. Shamritha,, R. Vignesh and published in \"International Journal of Innovative Science and Research Technology\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.608Z"
  },
  {
    "id": "pub_imported_6",
    "title": "Otogalucosense: AI-Powered system for glaucoma and otitis media detection.",
    "type": "journal",
    "category": "AI & ML",
    "journal": "World Journal of Advanced Engineering Technology and Sciences (WJAETS)",
    "issn": "CrosRef DOI:10.30574/wjaets.2025.14.3.0101, Volume 14, Issue 3, March 2025",
    "year": 2025,
    "contributors": "Pabitha C ,, UG Students(8th Sem): , Sanjay H, , Vigneshwar S , Vishwa M",
    "mentors": null,
    "abstract": "This research publication titled \"Otogalucosense: AI-Powered system for glaucoma and otitis media detection.\" was authored by Pabitha C ,, UG Students(8th Sem): , Sanjay H, , Vigneshwar S , Vishwa M and published in \"World Journal of Advanced Engineering Technology and Sciences (WJAETS)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.30574/wjaets.2025.14.3.0101,",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.608Z"
  },
  {
    "id": "pub_imported_7",
    "title": "Enhancing Customer Retention : A Voting Classifier Apporach",
    "type": "journal",
    "category": "General Tech",
    "journal": "Journal Of Electronics Information Technology Science And Management",
    "issn": "Volume 14, Issue 3, March 2025",
    "year": 2025,
    "contributors": "M. Mayuranathan, , UG Students(8th Sem):, Vignesh D,, Thirupathi M,, Shiva Shankar M",
    "mentors": null,
    "abstract": "This research publication titled \"Enhancing Customer Retention : A Voting Classifier Apporach\" was authored by M. Mayuranathan, , UG Students(8th Sem):, Vignesh D,, Thirupathi M,, Shiva Shankar M and published in \"Journal Of Electronics Information Technology Science And Management\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.608Z"
  },
  {
    "id": "pub_imported_8",
    "title": "AI-Enhanced Lung Size Matching and Eligibility System",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Science and Research Technology",
    "issn": "Volume 10, Issue 3, March 2025",
    "year": 2025,
    "contributors": "Dr. G. Sangeetha, UG Students(8th Sem):, Vasan K J, Subash M, Venu Krishnan S",
    "mentors": "Dr. G. Sangeetha",
    "abstract": "This research publication titled \"AI-Enhanced Lung Size Matching and Eligibility System\" was authored by Dr. G. Sangeetha, UG Students(8th Sem):, Vasan K J, Subash M, Venu Krishnan S and published in \"International Journal of Innovative Science and Research Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.608Z"
  },
  {
    "id": "pub_imported_9",
    "title": "Blockchain-Enabled Solutions to Identify Users behind Drug Trafficking on Encrypted Platforms",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Science and Research Technology",
    "issn": "Volume 10 Issue 3 , ISSN No:-2456-2165 page no:3295 -3297, March 2025",
    "year": 2025,
    "contributors": "S. Shanthi, UG Students(8th Sem):, Kishore Kumar M; Moulia Vasan G; Naveen Kumar P;",
    "mentors": null,
    "abstract": "This research publication titled \"Blockchain-Enabled Solutions to Identify Users behind Drug Trafficking on Encrypted Platforms\" was authored by S. Shanthi, UG Students(8th Sem):, Kishore Kumar M; Moulia Vasan G; Naveen Kumar P; and published in \"International Journal of Innovative Science and Research Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.608Z"
  },
  {
    "id": "pub_imported_10",
    "title": "AI based OCR system for Digitizing Handwritten Historical Documents in Regional Languages",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Research in Technology",
    "issn": "Volume 11., Issue 10,, ISSN 2349-6002,, page No:3435-3441, March 2025",
    "year": 2025,
    "contributors": "Ms.Shanthi S, UG Students(8th Sem):, Kavishri B, Mahalakshmi R, Nivedhitha.S",
    "mentors": null,
    "abstract": "This research publication titled \"AI based OCR system for Digitizing Handwritten Historical Documents in Regional Languages\" was authored by Ms.Shanthi S, UG Students(8th Sem):, Kavishri B, Mahalakshmi R, Nivedhitha.S and published in \"International Journal of Innovative Research in Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.608Z"
  },
  {
    "id": "pub_imported_11",
    "title": "Improving Breast Cancer Detection with Random Forest Algorithm and the Breakhis Dataset",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Research in Technology",
    "issn": "Volume:11, ,Issue:10,, Pg No:3145 -3150,, IJIRT 174206, March 2025",
    "year": 2025,
    "contributors": "A.Vidhya, UG Students(8th Sem):, Dharshana R S, , Dinesh R,, Dinesh S",
    "mentors": null,
    "abstract": "This research publication titled \"Improving Breast Cancer Detection with Random Forest Algorithm and the Breakhis Dataset\" was authored by A.Vidhya, UG Students(8th Sem):, Dharshana R S, , Dinesh R,, Dinesh S and published in \"International Journal of Innovative Research in Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.608Z"
  },
  {
    "id": "pub_imported_12",
    "title": "Machine Learning Classification for Identification of Heart Disease in E-Healthcare",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Research in Technology",
    "issn": "Volume 11 Issue 10 , ISSN: 2349-6002, March 2025",
    "year": 2025,
    "contributors": "Prema. V, UG Students(8th Sem):, Swathi.S, , Subhiksha G R S, , Vimal Kishore.M",
    "mentors": null,
    "abstract": "This research publication titled \"Machine Learning Classification for Identification of Heart Disease in E-Healthcare\" was authored by Prema. V, UG Students(8th Sem):, Swathi.S, , Subhiksha G R S, , Vimal Kishore.M and published in \"International Journal of Innovative Research in Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.608Z"
  },
  {
    "id": "pub_imported_13",
    "title": "Automated OCR-Based PAN Card Text Extraction System",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal of Innovative Research in Technology",
    "issn": "Volume 10, , Issue 3 , ISSN: , 2456-3315, March 2025",
    "year": 2025,
    "contributors": "Mrs. V. Prema , UG Students(8th Sem):, Narendranaath S R Muralidharan S Krishna Sai Ram R",
    "mentors": null,
    "abstract": "This research publication titled \"Automated OCR-Based PAN Card Text Extraction System\" was authored by Mrs. V. Prema , UG Students(8th Sem):, Narendranaath S R Muralidharan S Krishna Sai Ram R and published in \"International Journal of Innovative Research in Technology\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.608Z"
  },
  {
    "id": "pub_imported_14",
    "title": "Secure Blockchain-Based File Sharing",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Research in Technology",
    "issn": "Volume 11, Issue 10, , Page No. 4487-4491, , ISSN: 2349-6002, March 2025",
    "year": 2025,
    "contributors": "Rajasekaran T, UG Students(8th Sem):, Ajaykumar M , Arjun , Harish Kumar S T",
    "mentors": null,
    "abstract": "This research publication titled \"Secure Blockchain-Based File Sharing\" was authored by Rajasekaran T, UG Students(8th Sem):, Ajaykumar M , Arjun , Harish Kumar S T and published in \"International Journal of Innovative Research in Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_15",
    "title": "Digital Money Transaction using, Blockchain in Python",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Science and Research Technology",
    "issn": "Volume 10,, Issue 3, , ISSN No:2456-2165, March 2025",
    "year": 2025,
    "contributors": "Mrs. M. Mohanapriya, UG Students(8th Sem):, Eswarapasadh S, Dinu Karthik P, Franklin Jack R",
    "mentors": null,
    "abstract": "This research publication titled \"Digital Money Transaction using, Blockchain in Python\" was authored by Mrs. M. Mohanapriya, UG Students(8th Sem):, Eswarapasadh S, Dinu Karthik P, Franklin Jack R and published in \"International Journal of Innovative Science and Research Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_16",
    "title": "The Future of Iv Therapy: Smart Saline Bottle Using Iot Solutions",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "International Journal of Innovative Science and Research Technology",
    "issn": "Volume 10,, Issue 3, , ISSN No:-2456-2165, March 2025",
    "year": 2025,
    "contributors": "Mrs. M. Mohanapriya, UG Students(8th Sem):, Abilash K, Harish N, Dhushiv S",
    "mentors": null,
    "abstract": "This research publication titled \"The Future of Iv Therapy: Smart Saline Bottle Using Iot Solutions\" was authored by Mrs. M. Mohanapriya, UG Students(8th Sem):, Abilash K, Harish N, Dhushiv S and published in \"International Journal of Innovative Science and Research Technology\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_17",
    "title": "Enhancing palm leaves Manuscript Recognition using capsule networks(Capsnet)in Deep Learning Approaches",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Research Journal on Advanced Engineering Hub (IRJAEH)",
    "issn": "Vol. 03, Issue: 04, April 2025",
    "year": 2025,
    "contributors": "Ms.S.Balaswathy, Ms.R.Gayathri, UG Students(8th Sem):, Sivasamy K, Sudha dharan S, Vibhu N",
    "mentors": null,
    "abstract": "This research publication titled \"Enhancing palm leaves Manuscript Recognition using capsule networks(Capsnet)in Deep Learning Approaches\" was authored by Ms.S.Balaswathy, Ms.R.Gayathri, UG Students(8th Sem):, Sivasamy K, Sudha dharan S, Vibhu N and published in \"International Research Journal on Advanced Engineering Hub (IRJAEH)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_18",
    "title": "Integrated Road safetysystem for real-time water logging detectionand trafficmanagement using Google maps API",
    "type": "journal",
    "category": "AI & ML",
    "journal": "IEEE Xplore: 27 February 2025 (SCOPUS INDEXED)",
    "issn": "pp. 1165-1170, doi: 10.1109/ICMSCI62561.2025",
    "year": 2025,
    "contributors": "Pabitha C, UG Student:, Vignesh R, Shamritha V, Prathija A",
    "mentors": null,
    "abstract": "This research publication titled \"Integrated Road safetysystem for real-time water logging detectionand trafficmanagement using Google maps API\" was authored by Pabitha C, UG Student:, Vignesh R, Shamritha V, Prathija A and published in \"IEEE Xplore: 27 February 2025 (SCOPUS INDEXED)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1109/ICMSCI62561.2025",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_19",
    "title": "Prediction of stock market using technical trading Indicator",
    "type": "journal",
    "category": "AI & ML",
    "journal": "VDI-Z Integrierte Produktion",
    "issn": "Vol.11, Issue.7, pp.70-83",
    "year": 2024,
    "contributors": "V.Dhanakoti, /Prof, UG Student:, Uttam M",
    "mentors": "/Prof",
    "abstract": "This research publication titled \"Prediction of stock market using technical trading Indicator\" was authored by V.Dhanakoti, /Prof, UG Student:, Uttam M and published in \"VDI-Z Integrierte Produktion\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_20",
    "title": "Gesture based Writing using computer vision",
    "type": "conference",
    "category": "General Tech",
    "journal": "Proceeding of National Conference on Recent Trends in Computational Intelligence",
    "issn": "ISBN :978-81-953396-5-5, April 2024",
    "year": 2024,
    "contributors": "Dr.Mayuranathan, Mr.R.Sudharsan, Mr.V.Vikram",
    "mentors": "Dr.Mayuranathan",
    "abstract": "This research publication titled \"Gesture based Writing using computer vision\" was authored by Dr.Mayuranathan, Mr.R.Sudharsan, Mr.V.Vikram and published in \"Proceeding of National Conference on Recent Trends in Computational Intelligence\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_21",
    "title": "Smart OCT Analysis: Predictive Diagonostics and automated Clinical Reporting-",
    "type": "conference",
    "category": "AI & ML",
    "journal": "Proceeding of 13th International Conference on Contemporary Engineering and Technology",
    "issn": "ISBN :978-81-985365-9-4",
    "year": 2024,
    "contributors": "A.Samydurai, UG Students(7th Sem):, Kaveeya D, Joshua Samuel E, Kanaga Sundari",
    "mentors": null,
    "abstract": "This research publication titled \"Smart OCT Analysis: Predictive Diagonostics and automated Clinical Reporting-\" was authored by A.Samydurai, UG Students(7th Sem):, Kaveeya D, Joshua Samuel E, Kanaga Sundari and published in \"Proceeding of 13th International Conference on Contemporary Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_22",
    "title": "Development of Markerless Augmented Reality Bowling Game Using/ Vuforia and Unity engine-Organization of Science and Innovation Engineering & Technology",
    "type": "conference",
    "category": "General Tech",
    "journal": "Proceedings of 13th International Conference on Contemporary Engineering & Technology 2025",
    "issn": "ISBN :978-81-985365-9-4",
    "year": 2024,
    "contributors": "Dr.G.Kumaresan, UG Students(7th Sem):, Rupesh T, Jayannd Kishore A B, Logeshwaren A",
    "mentors": "Dr.G.Kumaresan",
    "abstract": "This research publication titled \"Development of Markerless Augmented Reality Bowling Game Using/ Vuforia and Unity engine-Organization of Science and Innovation Engineering & Technology\" was authored by Dr.G.Kumaresan, UG Students(7th Sem):, Rupesh T, Jayannd Kishore A B, Logeshwaren A and published in \"Proceedings of 13th International Conference on Contemporary Engineering & Technology 2025\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_23",
    "title": "Soil Nutrient Analysis And Recommendations Using Machine Learning Technique",
    "type": "conference",
    "category": "AI & ML",
    "journal": "Proceeding of 13th International Conference on Contemporary Engineering and Technology",
    "issn": "ISBN 978-81-985365-9-4",
    "year": 2024,
    "contributors": "Dr.G.Sangeetha , UG Students(7th Sem):, Kanishka. M.D, Kavya Shree.V.S Nithya Sree.B",
    "mentors": "Dr.G.Sangeetha",
    "abstract": "This research publication titled \"Soil Nutrient Analysis And Recommendations Using Machine Learning Technique\" was authored by Dr.G.Sangeetha , UG Students(7th Sem):, Kanishka. M.D, Kavya Shree.V.S Nithya Sree.B and published in \"Proceeding of 13th International Conference on Contemporary Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_24",
    "title": "AI-Driven Lung Transplant Compatibility And Eligibility Criteria Analysis",
    "type": "conference",
    "category": "AI & ML",
    "journal": "Proceeding of 13th International Conference on Contemporary Engineering and Technology",
    "issn": "ISBN :978-81-985365-9-4",
    "year": 2024,
    "contributors": "Dr. G. Sangeetha, UG Students(7th Sem):, Vasan K J, Subash M, Venu Krishnan S",
    "mentors": "Dr. G. Sangeetha",
    "abstract": "This research publication titled \"AI-Driven Lung Transplant Compatibility And Eligibility Criteria Analysis\" was authored by Dr. G. Sangeetha, UG Students(7th Sem):, Vasan K J, Subash M, Venu Krishnan S and published in \"Proceeding of 13th International Conference on Contemporary Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_25",
    "title": "Smart Meeting platform With Real Time Emotion Analysis Using AI",
    "type": "conference",
    "category": "AI & ML",
    "journal": "Proceeding of 13th International Conference on Contemporary Engineering and Technology",
    "issn": "ISBN :978-81-985365-9-4",
    "year": 2024,
    "contributors": "Mrs .A.Lalitha, , Dr. Samydurai. , UG Students(7th Sem):, Kiranraj. A3, Manivannan. M4, Pranavh Balaji",
    "mentors": "Dr. Samydurai.",
    "abstract": "This research publication titled \"Smart Meeting platform With Real Time Emotion Analysis Using AI\" was authored by Mrs .A.Lalitha, , Dr. Samydurai. , UG Students(7th Sem):, Kiranraj. A3, Manivannan. M4, Pranavh Balaji and published in \"Proceeding of 13th International Conference on Contemporary Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_26",
    "title": "Real-time Image Based Facial Emotion Detection Using Deep Learning",
    "type": "conference",
    "category": "AI & ML",
    "journal": "5th International Conference On Recent Trends in Engineering Technology",
    "issn": "N/A",
    "year": 2024,
    "contributors": "Mrs .A.Lalitha, UG Students(8th Sem):, A.Abinayan, A.Arokiya Avinash, S.Dhanraj",
    "mentors": null,
    "abstract": "This research publication titled \"Real-time Image Based Facial Emotion Detection Using Deep Learning\" was authored by Mrs .A.Lalitha, UG Students(8th Sem):, A.Abinayan, A.Arokiya Avinash, S.Dhanraj and published in \"5th International Conference On Recent Trends in Engineering Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_27",
    "title": "NovaCrypt: A Secure and adaptive file encryption algorithm with dynamic key scheduling",
    "type": "conference",
    "category": "AI & ML",
    "journal": "Proceedings of 13th International Conference on Contemporary Engineering & Technology 2025",
    "issn": "ISBN :978-81-985365-9-4",
    "year": 2024,
    "contributors": "Dr.G.Kumaresan, UG Students(7th Sem):, Kanishkar Mathi, John Tenis Johnson, Richardson Dennis",
    "mentors": "Dr.G.Kumaresan",
    "abstract": "This research publication titled \"NovaCrypt: A Secure and adaptive file encryption algorithm with dynamic key scheduling\" was authored by Dr.G.Kumaresan, UG Students(7th Sem):, Kanishkar Mathi, John Tenis Johnson, Richardson Dennis and published in \"Proceedings of 13th International Conference on Contemporary Engineering & Technology 2025\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_28",
    "title": "IOT  Integrated Deep Learning Approach for Food Freshness Monitoring",
    "type": "conference",
    "category": "AI & ML",
    "journal": "3rd International Conference on Robotics, Automation, and Intelligent Computing",
    "issn": "indexed in , Robotics, Automation and Intelligent Computing - Cambridge Scholars Publishing",
    "year": 2024,
    "contributors": "Dr. C. Pabitha, , UG Students(8th Sem):, Santhiya G, Sharulatha R and Shobika B.S",
    "mentors": "Dr. C. Pabitha",
    "abstract": "This research publication titled \"IOT  Integrated Deep Learning Approach for Food Freshness Monitoring\" was authored by Dr. C. Pabitha, , UG Students(8th Sem):, Santhiya G, Sharulatha R and Shobika B.S and published in \"3rd International Conference on Robotics, Automation, and Intelligent Computing\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_29",
    "title": "Fashion Fusion AR: Where Tech Meets Trend",
    "type": "conference",
    "category": "General Tech",
    "journal": "7th International Conference On Engineering And Advancement in Technology 2025, Organization Of Science And Innovative Engineering & technology",
    "issn": "Volume 1 ISBN: 978-81-983500-6-0",
    "year": 2024,
    "contributors": "Mrs.S.Suma, , UG Students(7th Sem):, Suvathi P,, Tamizh Selvan Yuvanjali S",
    "mentors": null,
    "abstract": "This research publication titled \"Fashion Fusion AR: Where Tech Meets Trend\" was authored by Mrs.S.Suma, , UG Students(7th Sem):, Suvathi P,, Tamizh Selvan Yuvanjali S and published in \"7th International Conference On Engineering And Advancement in Technology 2025, Organization Of Science And Innovative Engineering & technology\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_30",
    "title": "Deep Learning Model For MonkeyPox Prediction using VGG16",
    "type": "conference",
    "category": "AI & ML",
    "journal": "13th International Conference on Contemporary Engineering and Technology",
    "issn": "ISBN :978-81-985365-9-4",
    "year": 2024,
    "contributors": "Shanthi S,, UG Students(7th Sem):, Deepakraj G,Arul Antrony Rajan , S,Arshad.S",
    "mentors": null,
    "abstract": "This research publication titled \"Deep Learning Model For MonkeyPox Prediction using VGG16\" was authored by Shanthi S,, UG Students(7th Sem):, Deepakraj G,Arul Antrony Rajan , S,Arshad.S and published in \"13th International Conference on Contemporary Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_31",
    "title": "Ai-powered automated filtering of inappropriate comments using deep learning-",
    "type": "conference",
    "category": "AI & ML",
    "journal": "International Conference on Contemporary Engineering and Technology",
    "issn": "ISBN :978-81-985365-9-4",
    "year": 2024,
    "contributors": "N. Leo Bright Tennisson, UG Students(7th Sem):, Prabhakaran S R, Sadhiq Ali S, Mohan S",
    "mentors": null,
    "abstract": "This research publication titled \"Ai-powered automated filtering of inappropriate comments using deep learning-\" was authored by N. Leo Bright Tennisson, UG Students(7th Sem):, Prabhakaran S R, Sadhiq Ali S, Mohan S and published in \"International Conference on Contemporary Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_32",
    "title": "Novel AI Based Ensemble Technique for efficient Training of deep neural network on Brain Tumor Detection",
    "type": "conference",
    "category": "AI & ML",
    "journal": "National Conference on researches in Science and Technology (1/03/2025).",
    "issn": "N/A",
    "year": 2024,
    "contributors": "Dr S.Venkatesh(2nd Author),, UG Students(8th Sem):, R.Sudharshan, M.Sharanaragalingam, M.Vaishnav",
    "mentors": null,
    "abstract": "This research publication titled \"Novel AI Based Ensemble Technique for efficient Training of deep neural network on Brain Tumor Detection\" was authored by Dr S.Venkatesh(2nd Author),, UG Students(8th Sem):, R.Sudharshan, M.Sharanaragalingam, M.Vaishnav and published in \"National Conference on researches in Science and Technology (1/03/2025).\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_33",
    "title": "Optimized Breast Cancer Image Classification Using CNN-",
    "type": "conference",
    "category": "AI & ML",
    "journal": "Proceeding of 13th International Conference on Contemporary Engineering and Technology",
    "issn": "ISBN 978-81-985365-9-4",
    "year": 2024,
    "contributors": "Ms.A.Vidhya,, UG Students(7th Sem):, Dharshana R S,, Dinesh R, Dinesh S",
    "mentors": null,
    "abstract": "This research publication titled \"Optimized Breast Cancer Image Classification Using CNN-\" was authored by Ms.A.Vidhya,, UG Students(7th Sem):, Dharshana R S,, Dinesh R, Dinesh S and published in \"Proceeding of 13th International Conference on Contemporary Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_34",
    "title": "Lung Cancer Classification (NSCLC) Using Explainable AI Techniques",
    "type": "conference",
    "category": "AI & ML",
    "journal": "Proceeding of 13th International Conference on Contemporary Engineering and Technology",
    "issn": "ISBN 978-81-985365-9-4",
    "year": 2024,
    "contributors": "Ms.A.Vidhya, UG Students(7th Sem):, Harshvardhan, Harish",
    "mentors": null,
    "abstract": "This research publication titled \"Lung Cancer Classification (NSCLC) Using Explainable AI Techniques\" was authored by Ms.A.Vidhya, UG Students(7th Sem):, Harshvardhan, Harish and published in \"Proceeding of 13th International Conference on Contemporary Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_35",
    "title": "Intelligent Video Surveillance System using Deep Learning",
    "type": "conference",
    "category": "AI & ML",
    "journal": "International Conference on Contemporary Engineering and Technology 2025",
    "issn": "ISBN 978-81-985365-9-4",
    "year": 2024,
    "contributors": "Rajasekaran T, UG Students(7th Sem):, Elango V, , Gokul P, , Gowtham S",
    "mentors": null,
    "abstract": "This research publication titled \"Intelligent Video Surveillance System using Deep Learning\" was authored by Rajasekaran T, UG Students(7th Sem):, Elango V, , Gokul P, , Gowtham S and published in \"International Conference on Contemporary Engineering and Technology 2025\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_36",
    "title": "Authentech: GAN Powered Evidence Authentication",
    "type": "conference",
    "category": "Cybersecurity",
    "journal": "13th International Conference On Contemporary Engineering And Technology",
    "issn": "ISBN 978-81-985365-9-4, 22 & 23 March 2025",
    "year": 2025,
    "contributors": "Anslam Sibi S , UG Students(7th Sem):, S.Jayamathi, D.Karthikeyan, V.Lakshmipriya, P.Mahindhan",
    "mentors": null,
    "abstract": "This research publication titled \"Authentech: GAN Powered Evidence Authentication\" was authored by Anslam Sibi S , UG Students(7th Sem):, S.Jayamathi, D.Karthikeyan, V.Lakshmipriya, P.Mahindhan and published in \"13th International Conference On Contemporary Engineering And Technology\". It contributes to the field of Cybersecurity by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_37",
    "title": "Fetal Heart Disease Detection using Machine Learning-",
    "type": "conference",
    "category": "AI & ML",
    "journal": "13th International Conference On Contemporary Engineering And Technology- ICCET 2025",
    "issn": "ISBN 978-81-985-365-9-4",
    "year": 2024,
    "contributors": "Ms.Anitha R, , UG Students(7th Sem):, M.Dineshkumar, D.Ajith, A.Apsal Khan",
    "mentors": null,
    "abstract": "This research publication titled \"Fetal Heart Disease Detection using Machine Learning-\" was authored by Ms.Anitha R, , UG Students(7th Sem):, M.Dineshkumar, D.Ajith, A.Apsal Khan and published in \"13th International Conference On Contemporary Engineering And Technology- ICCET 2025\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_38",
    "title": "Multimodal Interaction System: Cursor Controlling Using, Hand Gestures-",
    "type": "conference",
    "category": "General Tech",
    "journal": "13th International Conference On Contemporary Engineering And Technology- ICCET 2025",
    "issn": "ISBN 978-81-985-365-9-4",
    "year": 2024,
    "contributors": "Ms.Anitha R, , UG Students(7th Sem):, Mr. Dineshkumar N, Mr. Jaidev Melvine R J, Mr. Hruthik P",
    "mentors": null,
    "abstract": "This research publication titled \"Multimodal Interaction System: Cursor Controlling Using, Hand Gestures-\" was authored by Ms.Anitha R, , UG Students(7th Sem):, Mr. Dineshkumar N, Mr. Jaidev Melvine R J, Mr. Hruthik P and published in \"13th International Conference On Contemporary Engineering And Technology- ICCET 2025\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_39",
    "title": "Artificial Intelligence Based Real Time Smart Phishing Detection And Defence System-",
    "type": "conference",
    "category": "AI & ML",
    "journal": "13th International Conference On Contemporary Engineering And Technology 2025",
    "issn": "978-81-985365-9-4",
    "year": 2024,
    "contributors": "V.Vijaypriya, UG Students(7th Sem):, Sanjay,, Saravanan M, Sharath Surya N",
    "mentors": null,
    "abstract": "This research publication titled \"Artificial Intelligence Based Real Time Smart Phishing Detection And Defence System-\" was authored by V.Vijaypriya, UG Students(7th Sem):, Sanjay,, Saravanan M, Sharath Surya N and published in \"13th International Conference On Contemporary Engineering And Technology 2025\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_40",
    "title": "Automated Sewer Defect Detection and size Estimation using YOLOv8 and MiDaS",
    "type": "conference",
    "category": "AI & ML",
    "journal": "13th International Conference On Contemporary Engineering And Technology 2025",
    "issn": "ISBN:978-81-985365-9-4",
    "year": 2024,
    "contributors": "Sathya G, UG Students(7th Sem):, K.Surendhar, K Vijiyasimman, J.Vijaikrishna",
    "mentors": null,
    "abstract": "This research publication titled \"Automated Sewer Defect Detection and size Estimation using YOLOv8 and MiDaS\" was authored by Sathya G, UG Students(7th Sem):, K.Surendhar, K Vijiyasimman, J.Vijaikrishna and published in \"13th International Conference On Contemporary Engineering And Technology 2025\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_41",
    "title": "Security in cloud computing using triple-des algorithm in blockchain",
    "type": "conference",
    "category": "AI & ML",
    "journal": "13th International Conference On Contemporary Engineering And Technology 2025",
    "issn": "ISBN:978-81-985365-9-4",
    "year": 2024,
    "contributors": "Sathya G, UG Students(7th Sem):, Jefferson Agnew.A, S.Roopesh, R.Varunprasanth",
    "mentors": null,
    "abstract": "This research publication titled \"Security in cloud computing using triple-des algorithm in blockchain\" was authored by Sathya G, UG Students(7th Sem):, Jefferson Agnew.A, S.Roopesh, R.Varunprasanth and published in \"13th International Conference On Contemporary Engineering And Technology 2025\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_42",
    "title": "Real Time Deep Fake detection in video Conferencing with deep learning",
    "type": "conference",
    "category": "AI & ML",
    "journal": "Proceeding of National Conference on Recent Trends in Computational Intelligence",
    "issn": "April 2024",
    "year": 2024,
    "contributors": "Dr.Mayuranathan, Mr.Saran.V",
    "mentors": "Dr.Mayuranathan",
    "abstract": "This research publication titled \"Real Time Deep Fake detection in video Conferencing with deep learning\" was authored by Dr.Mayuranathan, Mr.Saran.V and published in \"Proceeding of National Conference on Recent Trends in Computational Intelligence\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_43",
    "title": "Smart Voice assistant for the Visually Impaired Advancing Accessibility through Deep Learning on Mobile Platform",
    "type": "conference",
    "category": "AI & ML",
    "journal": "13th International conference on contemporary, Engineering and Technology",
    "issn": "ISBN :978-81-985365-9-4",
    "year": 2024,
    "contributors": "Ms.Sophiya sugantha Grace, UG Students(7th Sem):, S.Sabarishwar, X.R.Ritish, T.PrakashRaj",
    "mentors": null,
    "abstract": "This research publication titled \"Smart Voice assistant for the Visually Impaired Advancing Accessibility through Deep Learning on Mobile Platform\" was authored by Ms.Sophiya sugantha Grace, UG Students(7th Sem):, S.Sabarishwar, X.R.Ritish, T.PrakashRaj and published in \"13th International conference on contemporary, Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_44",
    "title": "The Future of Iv Therapy: Smart Saline Bottle Using Iot Solutions",
    "type": "conference",
    "category": "Cloud & DevOps",
    "journal": "International conference on engineering Technology and Science",
    "issn": "ISBN:978-93-342-3290-5",
    "year": 2024,
    "contributors": "Mrs. M. Mohanapriya, UG Students(7th Sem):, Abilash K2, Harish N3, Dhushiv S4",
    "mentors": null,
    "abstract": "This research publication titled \"The Future of Iv Therapy: Smart Saline Bottle Using Iot Solutions\" was authored by Mrs. M. Mohanapriya, UG Students(7th Sem):, Abilash K2, Harish N3, Dhushiv S4 and published in \"International conference on engineering Technology and Science\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_45",
    "title": "Customs TTS solution using Real HumAN Voice data-",
    "type": "conference",
    "category": "Data Engineering",
    "journal": "13th International conference on contemporary, Engineering and Technology",
    "issn": "ISBN :978-81-985365-9-4",
    "year": 2024,
    "contributors": "Ms.R.Gayathri, UG Students(7th Sem):, A. Aravind, P. Sivaraj, R.Vigneshwaran",
    "mentors": null,
    "abstract": "This research publication titled \"Customs TTS solution using Real HumAN Voice data-\" was authored by Ms.R.Gayathri, UG Students(7th Sem):, A. Aravind, P. Sivaraj, R.Vigneshwaran and published in \"13th International conference on contemporary, Engineering and Technology\". It contributes to the field of Data Engineering by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_46",
    "title": "Deepfake detection for Video and Audio",
    "type": "conference",
    "category": "AI & ML",
    "journal": "13th International conference on contemporary, Engineering and Technology",
    "issn": "ISBN :978-81-985365-9-4",
    "year": 2024,
    "contributors": "Ms.R.Gayathri, UG Students(7th Sem):, S.Dinesh, J.Akash, A.Anbuselvan, V.Hemaraj",
    "mentors": null,
    "abstract": "This research publication titled \"Deepfake detection for Video and Audio\" was authored by Ms.R.Gayathri, UG Students(7th Sem):, S.Dinesh, J.Akash, A.Anbuselvan, V.Hemaraj and published in \"13th International conference on contemporary, Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_47",
    "title": "Smart EDU hub AI powered education platform",
    "type": "conference",
    "category": "AI & ML",
    "journal": "International conference on Emerging trends in Engineering,management and computer application",
    "issn": "N/A",
    "year": 2024,
    "contributors": "Ms.R.Gayathri, UG Students(7th Sem):, S.Dhanushkumar, S.Balamurugan, R.Harikrishnan",
    "mentors": null,
    "abstract": "This research publication titled \"Smart EDU hub AI powered education platform\" was authored by Ms.R.Gayathri, UG Students(7th Sem):, S.Dhanushkumar, S.Balamurugan, R.Harikrishnan and published in \"International conference on Emerging trends in Engineering,management and computer application\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_48",
    "title": "Medicinal Plant Identification and Information Provision using AI",
    "type": "conference",
    "category": "AI & ML",
    "journal": "International Conference on Multi-Agent Systems for Collaborative Intelligence (ICMSCI-2025)",
    "issn": "ISBN: 979-8-3315-0981-1",
    "year": 2024,
    "contributors": "Anslam sibi S, UG Students(8th Sem):, Sundaresan C, S.Surya, J.P.Sujith",
    "mentors": null,
    "abstract": "This research publication titled \"Medicinal Plant Identification and Information Provision using AI\" was authored by Anslam sibi S, UG Students(8th Sem):, Sundaresan C, S.Surya, J.P.Sujith and published in \"International Conference on Multi-Agent Systems for Collaborative Intelligence (ICMSCI-2025)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_49",
    "title": "Malware Website Detection Using Ensemble Machine Learning Approach",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal for science and Advance Research in Technology (IJSART)",
    "issn": "Vol 10 Issue 3, ISSN: , 2395-1052, March 2024",
    "year": 2024,
    "contributors": "Dr.M.Mayuranathan /AP, UG Students(8th Sem):, T. Ragothaman, Agilen Napolean and N. Kalyan Kumar",
    "mentors": "Dr.M.Mayuranathan /AP",
    "abstract": "This research publication titled \"Malware Website Detection Using Ensemble Machine Learning Approach\" was authored by Dr.M.Mayuranathan /AP, UG Students(8th Sem):, T. Ragothaman, Agilen Napolean and N. Kalyan Kumar and published in \"International Journal for science and Advance Research in Technology (IJSART)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_50",
    "title": "Enhancing Customer Retention: A Voting Classifier Apporach",
    "type": "journal",
    "category": "General Tech",
    "journal": "Journal of Electronics Information Technology Science and Management",
    "issn": "Vol 14 Issue 3, ISSN: , 0258-7982, March 2024",
    "year": 2024,
    "contributors": "Dr.M.Mayuranathan , UG Students(8th Sem):, Vignesh D, Thirupathi M and M.Shiva Shankar",
    "mentors": "Dr.M.Mayuranathan",
    "abstract": "This research publication titled \"Enhancing Customer Retention: A Voting Classifier Apporach\" was authored by Dr.M.Mayuranathan , UG Students(8th Sem):, Vignesh D, Thirupathi M and M.Shiva Shankar and published in \"Journal of Electronics Information Technology Science and Management\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_51",
    "title": "wwwId-A Practical Internet-Scale Self-Sovereign, Self-Federated Identity System",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal Of Innovative Research In Technology",
    "issn": "Volume 10 Issue 10 , ISSN: , 2349-6002, March 2024",
    "year": 2024,
    "contributors": "Dr.V.Dhanakoti, UG Students(8th Sem):, Aadithya V, , Amutha varshini S, Bakkiyalakshmi V",
    "mentors": "Dr.V.Dhanakoti",
    "abstract": "This research publication titled \"wwwId-A Practical Internet-Scale Self-Sovereign, Self-Federated Identity System\" was authored by Dr.V.Dhanakoti, UG Students(8th Sem):, Aadithya V, , Amutha varshini S, Bakkiyalakshmi V and published in \"International Journal Of Innovative Research In Technology\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_52",
    "title": "AI as Personal Therapist",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Electronics Information Technology Science And Management",
    "issn": "Volume 14,Issue 3, ISSN: , 0258-7982",
    "year": 2024,
    "contributors": "Dr.V.Dhanakoti, UG Students(8th Sem):, , R.Maanasa, P.Mohankumar, B.Muthu Kiruba",
    "mentors": "Dr.V.Dhanakoti",
    "abstract": "This research publication titled \"AI as Personal Therapist\" was authored by Dr.V.Dhanakoti, UG Students(8th Sem):, , R.Maanasa, P.Mohankumar, B.Muthu Kiruba and published in \"International Journal of Electronics Information Technology Science And Management\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_53",
    "title": "Analytiguard: Pioneering Data Analytics for Proactive Credit Card Fraud Detection",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Research in Technology",
    "issn": "Volume 10 Issue 10 , ISSN: , 0258-7982, March 2024",
    "year": 2024,
    "contributors": "Dr.V.Dhanakoti, UG Students(8th Sem):, R.Maanasa, P.Mohankumar, B.Muthu Kiruba",
    "mentors": "Dr.V.Dhanakoti",
    "abstract": "This research publication titled \"Analytiguard: Pioneering Data Analytics for Proactive Credit Card Fraud Detection\" was authored by Dr.V.Dhanakoti, UG Students(8th Sem):, R.Maanasa, P.Mohankumar, B.Muthu Kiruba and published in \"International Journal of Innovative Research in Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_54",
    "title": "Breast Cancer Detection Using Ensemble Technique",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal Of Electronics Information Technology Science And Management",
    "issn": "Volume 14,Issue 3, ISSN: , 0258-7982, March 2024",
    "year": 2024,
    "contributors": "Ms.A.Vidhya, UG Students(8th Sem):, R.Nishanth, S.Keerthana, B.Kavya",
    "mentors": null,
    "abstract": "This research publication titled \"Breast Cancer Detection Using Ensemble Technique\" was authored by Ms.A.Vidhya, UG Students(8th Sem):, R.Nishanth, S.Keerthana, B.Kavya and published in \"Journal Of Electronics Information Technology Science And Management\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_55",
    "title": "Cloud Sentinel: A Robust Python-based cloud platform for secure and collaborative threat intelligence sharing, anonymization, dataaggregation and collective defense",
    "type": "journal",
    "category": "Cybersecurity",
    "journal": "International Journal of Electronics Information Technology Science and Management",
    "issn": "ISSN: , 0258-7982, March 2024",
    "year": 2024,
    "contributors": "Dr.K.Shanmugam/AP, UG Students(8th Sem):, , Mercy G, Mohanapriyan P S Keerthivasan",
    "mentors": "Dr.K.Shanmugam/AP",
    "abstract": "This research publication titled \"Cloud Sentinel: A Robust Python-based cloud platform for secure and collaborative threat intelligence sharing, anonymization, dataaggregation and collective defense\" was authored by Dr.K.Shanmugam/AP, UG Students(8th Sem):, , Mercy G, Mohanapriyan P S Keerthivasan and published in \"International Journal of Electronics Information Technology Science and Management\". It contributes to the field of Cybersecurity by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_56",
    "title": "Next Gen Self Driving Safety with Pothole Detection Via AI and YOLO v8 Deep Learning, (UGC)",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Electronics Information Technology Science and Management",
    "issn": "ISSN: , 0258-7982, March 2024",
    "year": 2024,
    "contributors": "Dr.K.Shanmugam,Asst Prof, , UG Students(8th Sem):, Mohana Priya G, P. Mohan Kumar, B. Praveena Shivaani G and N.Pradeep",
    "mentors": "Dr.K.Shanmugam, Asst Prof",
    "abstract": "This research publication titled \"Next Gen Self Driving Safety with Pothole Detection Via AI and YOLO v8 Deep Learning, (UGC)\" was authored by Dr.K.Shanmugam,Asst Prof, , UG Students(8th Sem):, Mohana Priya G, P. Mohan Kumar, B. Praveena Shivaani G and N.Pradeep and published in \"International Journal of Electronics Information Technology Science and Management\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_57",
    "title": "AI Based Bio Metric Smart Voting System Using Internet of Things",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Research in Technology",
    "issn": "Volume 10 Issue 10 , ISSN: , 2349-6002, March 2024",
    "year": 2024,
    "contributors": "Dr. M. Mayuranathan, UG Students(8th Sem):, C.R Dan prabhu, .M.,Bhuvaneshwari, K.Harthika",
    "mentors": "Dr. M. Mayuranathan",
    "abstract": "This research publication titled \"AI Based Bio Metric Smart Voting System Using Internet of Things\" was authored by Dr. M. Mayuranathan, UG Students(8th Sem):, C.R Dan prabhu, .M.,Bhuvaneshwari, K.Harthika and published in \"International Journal of Innovative Research in Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_58",
    "title": "Indian Corporate Stock Prediction Using Linear Regression",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal Of Electronics Information Technology Science And Management",
    "issn": "Volume 14,Issue 3 , ISSN:, 0258-7982, March 2024",
    "year": 2024,
    "contributors": "Dr. V. Dhanakoti, UG Students(8th Sem):, R.Dev preeth singh, M.Gokul, B.Dejaswarooba",
    "mentors": "Dr. V. Dhanakoti",
    "abstract": "This research publication titled \"Indian Corporate Stock Prediction Using Linear Regression\" was authored by Dr. V. Dhanakoti, UG Students(8th Sem):, R.Dev preeth singh, M.Gokul, B.Dejaswarooba and published in \"Journal Of Electronics Information Technology Science And Management\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_59",
    "title": "A Review on Role of Big Data Analytics During COVID-19",
    "type": "journal",
    "category": "Data Engineering",
    "journal": "Journal of Xidian University",
    "issn": "Volume 18,Issue 4, ISSN: , 1001-2400, April 2024",
    "year": 2024,
    "contributors": "Dr. V.Dhanakoti, UG Students(8th Sem):, M.Uttam",
    "mentors": "Dr. V.Dhanakoti",
    "abstract": "This research publication titled \"A Review on Role of Big Data Analytics During COVID-19\" was authored by Dr. V.Dhanakoti, UG Students(8th Sem):, M.Uttam and published in \"Journal of Xidian University\". It contributes to the field of Data Engineering by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_60",
    "title": "Adversarial Training and Boosting Robustness in Machine Learning systems",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Frontiers in Health Informatics",
    "issn": "Volume 13,Issue 4, ISSN: 2676-7104, March 2024",
    "year": 2024,
    "contributors": "Ms. Sangeetha G, UG Students(8th Sem):, K.Bharath, S.Balamanikandan, G.Bharath",
    "mentors": null,
    "abstract": "This research publication titled \"Adversarial Training and Boosting Robustness in Machine Learning systems\" was authored by Ms. Sangeetha G, UG Students(8th Sem):, K.Bharath, S.Balamanikandan, G.Bharath and published in \"Frontiers in Health Informatics\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_61",
    "title": "IOT based Intelligent Door Lock Ingress Control System with Digital Notification",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "Journal of Advanced Engineering Research",
    "issn": "ISSN: 2393-8447 Volume 10, Issue 2",
    "year": 2024,
    "contributors": "Dr. C.Pabitha, UG Students(8th Sem):, V.Nalina, M.Nandhini, I.RajaLakshmi",
    "mentors": "Dr. C.Pabitha",
    "abstract": "This research publication titled \"IOT based Intelligent Door Lock Ingress Control System with Digital Notification\" was authored by Dr. C.Pabitha, UG Students(8th Sem):, V.Nalina, M.Nandhini, I.RajaLakshmi and published in \"Journal of Advanced Engineering Research\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_62",
    "title": "Decentralized Network of public distribution system using Block Chain",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal of Advanced Engineering Research",
    "issn": "ISSN: 2393-8447 Volume 11, Issue 1",
    "year": 2024,
    "contributors": "Dr. C. Pabitha, UG Students(8th Sem):, N.Logesh, d.Kiran kumar, N.Kishore",
    "mentors": "Dr. C. Pabitha",
    "abstract": "This research publication titled \"Decentralized Network of public distribution system using Block Chain\" was authored by Dr. C. Pabitha, UG Students(8th Sem):, N.Logesh, d.Kiran kumar, N.Kishore and published in \"Journal of Advanced Engineering Research\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_63",
    "title": "Medical Mask Recognition using DL",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Creative Research Thoughts (IJCRT)",
    "issn": "Volume 12, Issue 4, ISSN: 2320-2882, April 2024",
    "year": 2024,
    "contributors": "Ms.Suma.S, UG Students(8th Sem):, S. Srijhanyee, SS.Yaashini, G.SaiSunitha",
    "mentors": null,
    "abstract": "This research publication titled \"Medical Mask Recognition using DL\" was authored by Ms.Suma.S, UG Students(8th Sem):, S. Srijhanyee, SS.Yaashini, G.SaiSunitha and published in \"International Journal of Creative Research Thoughts (IJCRT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_64",
    "title": "Object detection convert object name to text and text to speech",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology IJARSCT",
    "issn": "ISSN:2581-9429, Volume 4, Issue 4",
    "year": 2024,
    "contributors": "Ms.Sathya. G, UG Students(8th Sem):, S.Kamesh, S.Rishikumar, S.Saai sabathty",
    "mentors": null,
    "abstract": "This research publication titled \"Object detection convert object name to text and text to speech\" was authored by Ms.Sathya. G, UG Students(8th Sem):, S.Kamesh, S.Rishikumar, S.Saai sabathty and published in \"International Journal of Advanced Research in Science, Communication and Technology IJARSCT\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_65",
    "title": "Depth sensing Imaging System Autonomous Restored Fog",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology(IJARSCT)",
    "issn": "ISSN 2581-9429, Volume 4, Issue 4, , March 2024",
    "year": 2024,
    "contributors": "Ms.G.Sathya , UG Students(8th Sem):, R.Shivasjankaran, S.Diviyan",
    "mentors": null,
    "abstract": "This research publication titled \"Depth sensing Imaging System Autonomous Restored Fog\" was authored by Ms.G.Sathya , UG Students(8th Sem):, R.Shivasjankaran, S.Diviyan and published in \"International Journal of Advanced Research in Science, Communication and Technology(IJARSCT)\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_66",
    "title": "AI Resume Analyzer using Natural Language Processing",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science ,Communication and Technology(IJARSCT)",
    "issn": "Volume 4, Issue 4, ISSN (Online) 2581-9429",
    "year": 2024,
    "contributors": "Ms.M.Sophiya Sugantha Grace, UG Students(8th Sem):, R.Dharini, A.Deepan, M.Gowthaman",
    "mentors": null,
    "abstract": "This research publication titled \"AI Resume Analyzer using Natural Language Processing\" was authored by Ms.M.Sophiya Sugantha Grace, UG Students(8th Sem):, R.Dharini, A.Deepan, M.Gowthaman and published in \"International Journal of Advanced Research in Science ,Communication and Technology(IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_67",
    "title": "Non-Repeating, Normalized Questionnaire Sets Generation and Rendering Based on A Parsed Input Domain with Cryptographically Enforced Secure Access",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Vol.4, Issue.2, , ISSN (Online) 2581-9429",
    "year": 2024,
    "contributors": "Dr V Dhanakoti, V , UG Students(8th Sem):, Aadithya, S Amutha Varshini, V Bakkiyalakshmi",
    "mentors": null,
    "abstract": "This research publication titled \"Non-Repeating, Normalized Questionnaire Sets Generation and Rendering Based on A Parsed Input Domain with Cryptographically Enforced Secure Access\" was authored by Dr V Dhanakoti, V , UG Students(8th Sem):, Aadithya, S Amutha Varshini, V Bakkiyalakshmi and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_68",
    "title": "Parking Pixels: Pythons Vision for Urban Space Optimization",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of New Innovations in Engineering and Technology",
    "issn": "Vol.24, Issue.4",
    "year": 2024,
    "contributors": "Dr. V. Dhanakoti, UG Students(8th Sem):, S.Sakthivel, K.Vedavarshini, C.Sundaresan",
    "mentors": "Dr. V. Dhanakoti",
    "abstract": "This research publication titled \"Parking Pixels: Pythons Vision for Urban Space Optimization\" was authored by Dr. V. Dhanakoti, UG Students(8th Sem):, S.Sakthivel, K.Vedavarshini, C.Sundaresan and published in \"International Journal of New Innovations in Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_69",
    "title": "Fortifying Cyber Resilience",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Vol 4, Issue 4, ISSN 2581-9429",
    "year": 2024,
    "contributors": "Mr. N. Leo Bright Tennisson, UG Students(8th Sem):, V.Nithish, M.Parkavi, A.Priyadharshini",
    "mentors": null,
    "abstract": "This research publication titled \"Fortifying Cyber Resilience\" was authored by Mr. N. Leo Bright Tennisson, UG Students(8th Sem):, V.Nithish, M.Parkavi, A.Priyadharshini and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_70",
    "title": "STEVE JOBS: Pioneering AI in Software Engineering",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 4, ISSUE 2, ISSN: 2581-9429",
    "year": 2024,
    "contributors": "Ms.Priyadharshini.M, UG Students(8th Sem):, S N .Sriram, T.Sudhar Aathith, N.Vigneshwaran",
    "mentors": null,
    "abstract": "This research publication titled \"STEVE JOBS: Pioneering AI in Software Engineering\" was authored by Ms.Priyadharshini.M, UG Students(8th Sem):, S N .Sriram, T.Sudhar Aathith, N.Vigneshwaran and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_71",
    "title": "An Efficient Segmentation and Classification of Brain Tumor Detection using Deep Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 4, Issue 4, ISSN: 2581-9429",
    "year": 2024,
    "contributors": "Ms.Vijaypriya.V, UG Students(8th Sem):, B.Gokul, G.Gopinath, A.Hariharan",
    "mentors": null,
    "abstract": "This research publication titled \"An Efficient Segmentation and Classification of Brain Tumor Detection using Deep Learning\" was authored by Ms.Vijaypriya.V, UG Students(8th Sem):, B.Gokul, G.Gopinath, A.Hariharan and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_72",
    "title": "A Multifaceted Approach to Real Tim Online Proctoring with Gaze Tracking, Facial Aspect Ratio Analysis and Object Detection",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 4, Issue 4, ISSN: 2581-9429",
    "year": 2024,
    "contributors": "Ms.Vijaypriya.V, UG Students(8th Sem):, P M .Dhanesh, V.Giridhar, B L.Harish",
    "mentors": null,
    "abstract": "This research publication titled \"A Multifaceted Approach to Real Tim Online Proctoring with Gaze Tracking, Facial Aspect Ratio Analysis and Object Detection\" was authored by Ms.Vijaypriya.V, UG Students(8th Sem):, P M .Dhanesh, V.Giridhar, B L.Harish and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_73",
    "title": "Enhancing Customer Analytics: A Comprehensive Framework for Effective Churn Prediction",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 4, Issue 2, ISSN: 2581-9429",
    "year": 2024,
    "contributors": "Ms.Anitha R, UG Students(8th Sem):, P S Adithyan, V A.Akshaya, A.Bhunesh",
    "mentors": null,
    "abstract": "This research publication titled \"Enhancing Customer Analytics: A Comprehensive Framework for Effective Churn Prediction\" was authored by Ms.Anitha R, UG Students(8th Sem):, P S Adithyan, V A.Akshaya, A.Bhunesh and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_74",
    "title": "Dermacure  An Advanced skin Disease Detection using Deep Learning Algorithm",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology(IJARSCT)",
    "issn": "ISSN: 2581-9429, Volume 3, Issue 1",
    "year": 2024,
    "contributors": "Dr.Venkatesh S,, UG Students(8th Sem):, Bharath G, , Bharath K",
    "mentors": "Dr.Venkatesh S",
    "abstract": "This research publication titled \"Dermacure  An Advanced skin Disease Detection using Deep Learning Algorithm\" was authored by Dr.Venkatesh S,, UG Students(8th Sem):, Bharath G, , Bharath K and published in \"International Journal of Advanced Research in Science, Communication and Technology(IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_75",
    "title": "Melanoma Skin Cancer Prediction",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal for science and Advance Research in Technology (IJSART)",
    "issn": "Volume 10 Issue 3, ISSN 2395-1052",
    "year": 2024,
    "contributors": "Ms.A.Lalitha, UG Students(8th Sem):, J.Karthik, J.Pradeep, P.Nian Adthith",
    "mentors": null,
    "abstract": "This research publication titled \"Melanoma Skin Cancer Prediction\" was authored by Ms.A.Lalitha, UG Students(8th Sem):, J.Karthik, J.Pradeep, P.Nian Adthith and published in \"International Journal for science and Advance Research in Technology (IJSART)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_76",
    "title": "Video Surveillance and Security using Artificial Intelligence",
    "type": "journal",
    "category": "Cybersecurity",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "ISSN (Online) 2581-9429, Volume 4, Issue 4",
    "year": 2024,
    "contributors": "Dr.S. Venkatesh,, UG Students(8th Sem):, Akash V, , Hariharan S, Jayashri J",
    "mentors": "Dr.S. Venkatesh",
    "abstract": "This research publication titled \"Video Surveillance and Security using Artificial Intelligence\" was authored by Dr.S. Venkatesh,, UG Students(8th Sem):, Akash V, , Hariharan S, Jayashri J and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of Cybersecurity by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_77",
    "title": "Driver Drowsinesss Detection using AI",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "ISSN (Online) 2581-9429, Volume 4, Issue 4",
    "year": 2024,
    "contributors": "Ms.A.Lalitha, UG Students(8th Sem):, E.Pradeepkumar, V.Rajaramanan, M K.Ramharis",
    "mentors": null,
    "abstract": "This research publication titled \"Driver Drowsinesss Detection using AI\" was authored by Ms.A.Lalitha, UG Students(8th Sem):, E.Pradeepkumar, V.Rajaramanan, M K.Ramharis and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_78",
    "title": "Heritage Harbor with YOLOv8:Preserving Monuments through Audio Tales",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 4, Issue 4, ISSN (Online) 2581-9429, March 2024",
    "year": 2024,
    "contributors": "Ms.Sophiya sugantha Grace, UG Students(8th Sem):, Mr. Abishek C, , Mr. Harish Kanna P, 4Mr. Varun G",
    "mentors": null,
    "abstract": "This research publication titled \"Heritage Harbor with YOLOv8:Preserving Monuments through Audio Tales\" was authored by Ms.Sophiya sugantha Grace, UG Students(8th Sem):, Mr. Abishek C, , Mr. Harish Kanna P, 4Mr. Varun G and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_79",
    "title": "Deep Learning Based Knee Osteoarthritis Detection and Classification",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 4, Issue 4, , (Online) 2581-9429, March 2024",
    "year": 2024,
    "contributors": "Ms. Anitha R1, , UG Students(8th Sem):, Ms.ArchanaM2, Ms. Aswini R3, Ms. Christabell Smylin P4",
    "mentors": null,
    "abstract": "This research publication titled \"Deep Learning Based Knee Osteoarthritis Detection and Classification\" was authored by Ms. Anitha R1, , UG Students(8th Sem):, Ms.ArchanaM2, Ms. Aswini R3, Ms. Christabell Smylin P4 and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_80",
    "title": "Detection of Gastrointestinal Lesions using Deep Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 4, Issue 4, , (Online) 2581-9429, March 2024",
    "year": 2024,
    "contributors": "Ms. Sangeetha G, , UG Students(8th Sem):, 2Mr. Akash A, 3Mr. Dany Joseph C, 4Mr. Haarish Raj K",
    "mentors": null,
    "abstract": "This research publication titled \"Detection of Gastrointestinal Lesions using Deep Learning\" was authored by Ms. Sangeetha G, , UG Students(8th Sem):, 2Mr. Akash A, 3Mr. Dany Joseph C, 4Mr. Haarish Raj K and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_81",
    "title": "Online Auction System",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 4, Issue 4, , (Online) 2581-9429, March 2024",
    "year": 2024,
    "contributors": "Ms. Christina Sweetline B,, UG Students(8th Sem):, Jagadesh T,, Harish S, 4Mr. Vijay Karthikeyan G",
    "mentors": null,
    "abstract": "This research publication titled \"Online Auction System\" was authored by Ms. Christina Sweetline B,, UG Students(8th Sem):, Jagadesh T,, Harish S, 4Mr. Vijay Karthikeyan G and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_82",
    "title": "Scout And Deal: A Football Transfer Recommendation System",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal for science and Advance Research in Technology (IJSART)",
    "issn": "Volume 10 Issue 3 , ISSN [online]: 2395-1052, March 2024",
    "year": 2024,
    "contributors": "Dr.C.Pabitha4 , UG Students(8th Sem):, A.R. Nagaraja, N. Nirmal, J. Lokesh",
    "mentors": "Dr.C.Pabitha4",
    "abstract": "This research publication titled \"Scout And Deal: A Football Transfer Recommendation System\" was authored by Dr.C.Pabitha4 , UG Students(8th Sem):, A.R. Nagaraja, N. Nirmal, J. Lokesh and published in \"International Journal for science and Advance Research in Technology (IJSART)\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_83",
    "title": "Pedestrian Crossing Traffic Lightcontrol System Using Face Detection",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Research and Analytical Reviews (IJRAR)",
    "issn": "E-ISSN 2348-1269, Volume 10, Issue 2",
    "year": 2024,
    "contributors": "Dr. S.Benila, UG Students(8th Sem):, 1.S.Nandini, 2.K.Nithin, 3.B.Pradeepa Illakkiya",
    "mentors": "Dr. S.Benila",
    "abstract": "This research publication titled \"Pedestrian Crossing Traffic Lightcontrol System Using Face Detection\" was authored by Dr. S.Benila, UG Students(8th Sem):, 1.S.Nandini, 2.K.Nithin, 3.B.Pradeepa Illakkiya and published in \"International Journal of Research and Analytical Reviews (IJRAR)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_84",
    "title": "Survey of Deep Learning Techniques for Vehicle Detection",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 3, Issue 1,, ISSN (Online) 2581-9429",
    "year": 2024,
    "contributors": "Dr. Benila S, UG Students(8th Sem):, 1.Karan Kumar R, 2.Karthikraja N, 3.Kavimukilan M",
    "mentors": "Dr. Benila S",
    "abstract": "This research publication titled \"Survey of Deep Learning Techniques for Vehicle Detection\" was authored by Dr. Benila S, UG Students(8th Sem):, 1.Karan Kumar R, 2.Karthikraja N, 3.Kavimukilan M and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_85",
    "title": "CNN Based Real Time Sign Language To Text And Speech Conversion",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Research and Analytical Reviews (IJRAR)",
    "issn": "Volume 10, Issue 2,, E-ISSN 2348-1269",
    "year": 2024,
    "contributors": "Ms.A.Vidhya, UG Students(8th Sem):, P. Muthusathish, G. Mythreyan, M. Premkumar",
    "mentors": null,
    "abstract": "This research publication titled \"CNN Based Real Time Sign Language To Text And Speech Conversion\" was authored by Ms.A.Vidhya, UG Students(8th Sem):, P. Muthusathish, G. Mythreyan, M. Premkumar and published in \"International Journal of Research and Analytical Reviews (IJRAR)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_86",
    "title": "Arrythmia Disease Prediction using Deep Learning Technique",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science",
    "issn": "Volume 3, Issue 2,, ISSN (Online) 2581-9429",
    "year": 2024,
    "contributors": "Ms. S. Suma, UG Students(8th Sem):, S. Ahileshwaran, P. Devakumar, R. Dineshkumar",
    "mentors": null,
    "abstract": "This research publication titled \"Arrythmia Disease Prediction using Deep Learning Technique\" was authored by Ms. S. Suma, UG Students(8th Sem):, S. Ahileshwaran, P. Devakumar, R. Dineshkumar and published in \"International Journal of Advanced Research in Science\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_87",
    "title": "File Storage System using Hybrid Cryptography",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 3, Issue 2,, ISSN (Online) 2581-9429",
    "year": 2024,
    "contributors": "Ms. S. Suma, UG Students(8th Sem):, S. Failur Rahuman , A. Ghoushick, R. Hari Ganesh",
    "mentors": null,
    "abstract": "This research publication titled \"File Storage System using Hybrid Cryptography\" was authored by Ms. S. Suma, UG Students(8th Sem):, S. Failur Rahuman , A. Ghoushick, R. Hari Ganesh and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_88",
    "title": "Smart Stretcher System Using IOT",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "Journal Of Electronics Information Technology Science And Management",
    "issn": "VOLUME 13, ISSUE 3,, ISSN NO : 0258-7982",
    "year": 2024,
    "contributors": "MsAnitha R, UG Students(8th Sem):, Aarthika K, S.Aaslin Praise Gowtham S",
    "mentors": null,
    "abstract": "This research publication titled \"Smart Stretcher System Using IOT\" was authored by MsAnitha R, UG Students(8th Sem):, Aarthika K, S.Aaslin Praise Gowtham S and published in \"Journal Of Electronics Information Technology Science And Management\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_89",
    "title": "Global Disaster Tracker",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 3, Issue 2,ISSN (Online) 2581-9429",
    "year": 2024,
    "contributors": "Dr. M. Mayuranathan , UG Students(8th Sem):, Annamalai J, Ashwin R, Darrel P",
    "mentors": "Dr. M. Mayuranathan",
    "abstract": "This research publication titled \"Global Disaster Tracker\" was authored by Dr. M. Mayuranathan , UG Students(8th Sem):, Annamalai J, Ashwin R, Darrel P and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_90",
    "title": "Facial Recognition For Criminal Detection Using Deep Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Research Journal of Education and Technology",
    "issn": "Volume: 05 Issue: 04 | , ISSN (Online) 2581-7795",
    "year": 2024,
    "contributors": "Mrs. Sathya G , UG Students(8th Sem):, Tharani S, Shivani S, Sharmi S",
    "mentors": null,
    "abstract": "This research publication titled \"Facial Recognition For Criminal Detection Using Deep Learning\" was authored by Mrs. Sathya G , UG Students(8th Sem):, Tharani S, Shivani S, Sharmi S and published in \"International Research Journal of Education and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_91",
    "title": "Cognitive Radio network for minimizing network Traffic",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "International, Journal of Ceative Research Thoughts",
    "issn": "Vol 11,Issue:4,ISSN No:2320-2882",
    "year": 2024,
    "contributors": "Ms.S.Shanthi, UG Students(8th Sem):, S.Navin, A.Ragul, S.J.Ragunath",
    "mentors": null,
    "abstract": "This research publication titled \"Cognitive Radio network for minimizing network Traffic\" was authored by Ms.S.Shanthi, UG Students(8th Sem):, S.Navin, A.Ragul, S.J.Ragunath and published in \"International, Journal of Ceative Research Thoughts\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_92",
    "title": "Intelligent video surveillance using Deep Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 3, Issue 2,ISSN (Online) 2581-9429",
    "year": 2024,
    "contributors": "Ms.S.Shanthi, UG Students(8th Sem):, J.Ajith, A.Chran Kumar, K.Deepak Krishna, N.Gokul",
    "mentors": null,
    "abstract": "This research publication titled \"Intelligent video surveillance using Deep Learning\" was authored by Ms.S.Shanthi, UG Students(8th Sem):, J.Ajith, A.Chran Kumar, K.Deepak Krishna, N.Gokul and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_93",
    "title": "Browsecure",
    "type": "journal",
    "category": "Cybersecurity",
    "journal": "International Journal of Current Science",
    "issn": "Volume:13,Issue.3,ISSN No:2250-1770",
    "year": 2024,
    "contributors": "Ms.Ms. S. Suma, UG Students(8th Sem):, S.Reshma, S.Santhosh, S.Roshini",
    "mentors": null,
    "abstract": "This research publication titled \"Browsecure\" was authored by Ms.Ms. S. Suma, UG Students(8th Sem):, S.Reshma, S.Santhosh, S.Roshini and published in \"International Journal of Current Science\". It contributes to the field of Cybersecurity by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_94",
    "title": "Organ Donation And Matching System",
    "type": "journal",
    "category": "General Tech",
    "journal": "Science, Technology and Development",
    "issn": "Volume XII,Issue IV, ISSN : 0950-0707",
    "year": 2024,
    "contributors": "Ms.G.Sangeetha, UG Students(8th Sem):, S.Hariharan, C.Hemnath, K.Kabilesh",
    "mentors": null,
    "abstract": "This research publication titled \"Organ Donation And Matching System\" was authored by Ms.G.Sangeetha, UG Students(8th Sem):, S.Hariharan, C.Hemnath, K.Kabilesh and published in \"Science, Technology and Development\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_95",
    "title": "Human Activity Recognition Using DNN Classifier And Feature Analysis",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Creative Research Thoughts (IJCRT) www.ijcrt.org",
    "issn": "Volume 11, Issue 3 ISSN: 2320-2882",
    "year": 2024,
    "contributors": "Ms.G.Sangeetha, UG Students(8th Sem):, S.Shantha kumar, S.Harshavardhan, D.Varun",
    "mentors": null,
    "abstract": "This research publication titled \"Human Activity Recognition Using DNN Classifier And Feature Analysis\" was authored by Ms.G.Sangeetha, UG Students(8th Sem):, S.Shantha kumar, S.Harshavardhan, D.Varun and published in \"International Journal of Creative Research Thoughts (IJCRT) www.ijcrt.org\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_96",
    "title": "Smart Blind Stick Integration with IOT & SOS",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "Science, Technology and Development",
    "issn": "Volume XII,Issue IV, ISSN : 0950-0707",
    "year": 2024,
    "contributors": "Dr.S.Venkatesh, UG Students(8th Sem):, R.K.Rithanya, S.Subash, P.Surendar",
    "mentors": "Dr.S.Venkatesh",
    "abstract": "This research publication titled \"Smart Blind Stick Integration with IOT & SOS\" was authored by Dr.S.Venkatesh, UG Students(8th Sem):, R.K.Rithanya, S.Subash, P.Surendar and published in \"Science, Technology and Development\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_97",
    "title": "A mobile application for product verification using QR code and NFC Tags in Supply chain Management using BlockChain",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Creative Research Thoughts",
    "issn": "Volume 10,Issue 5,, ISSN No:2320-2882",
    "year": 2024,
    "contributors": "Dr.M.Mayuranathan, UG Students(8th Sem):, R.Aagash, P.Dillibabu, R.Balaji",
    "mentors": "Dr.M.Mayuranathan",
    "abstract": "This research publication titled \"A mobile application for product verification using QR code and NFC Tags in Supply chain Management using BlockChain\" was authored by Dr.M.Mayuranathan, UG Students(8th Sem):, R.Aagash, P.Dillibabu, R.Balaji and published in \"International Journal of Creative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_98",
    "title": "Analysis and Prediction of Employee Attrition",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume: 11, Issue: 04 , ISSN (Online) 2320-2882",
    "year": 2024,
    "contributors": "Mr.N.Leo Bright Tennission , UG Students(8th Sem):, K.Prem prasad, E.Praveen Kumar, K.Naveen Kumar",
    "mentors": null,
    "abstract": "This research publication titled \"Analysis and Prediction of Employee Attrition\" was authored by Mr.N.Leo Bright Tennission , UG Students(8th Sem):, K.Prem prasad, E.Praveen Kumar, K.Naveen Kumar and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_99",
    "title": "Smart Protection in Agricultural Fields",
    "type": "journal",
    "category": "General Tech",
    "journal": "Journal of Electronics Technology Science and Management",
    "issn": "Volume: 13, Issue: 04 , ISSN (Online) 1258-7982",
    "year": 2024,
    "contributors": "Mr.N.Leo Bright Tennission , UG Students(8th Sem):, Kanuparthi Saranya, K.Kavi Bharathi, D.Manoranjani",
    "mentors": null,
    "abstract": "This research publication titled \"Smart Protection in Agricultural Fields\" was authored by Mr.N.Leo Bright Tennission , UG Students(8th Sem):, Kanuparthi Saranya, K.Kavi Bharathi, D.Manoranjani and published in \"Journal of Electronics Technology Science and Management\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_100",
    "title": "An XGBoost-Based Regression Model for Wildfire Impact Prediction",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Research Journal of Engineering and Technology (IRJET)",
    "issn": "Vol-10, Issue 3, ISSN :2395-0056",
    "year": 2024,
    "contributors": "Mrs. M. Priyadharshini , UG Students(8th Sem):, Chrisolus Timonsingh J, Insuvai V",
    "mentors": null,
    "abstract": "This research publication titled \"An XGBoost-Based Regression Model for Wildfire Impact Prediction\" was authored by Mrs. M. Priyadharshini , UG Students(8th Sem):, Chrisolus Timonsingh J, Insuvai V and published in \"International Research Journal of Engineering and Technology (IRJET)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_101",
    "title": "Construction Of A Blockchain Web 3.0 Dapp With Nft Using Smart Contract",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Research Journal of Engineering and Technology",
    "issn": "2581-7795 volume 5 issue 03",
    "year": 2024,
    "contributors": "Mr.T.Rajasekar, UG Students(8th Sem):, B.Vignesh",
    "mentors": null,
    "abstract": "This research publication titled \"Construction Of A Blockchain Web 3.0 Dapp With Nft Using Smart Contract\" was authored by Mr.T.Rajasekar, UG Students(8th Sem):, B.Vignesh and published in \"International Research Journal of Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_102",
    "title": "Identification of false credit card transaction using machine learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume:11, Issue: 04 , ISSN (Online) 2320-2882",
    "year": 2024,
    "contributors": "Dr.A.Samydurai, UG Students(8th Sem):, P.Karthikeyan, T.Ram Prasath, DN. Karthikeyan",
    "mentors": "Dr.A.Samydurai",
    "abstract": "This research publication titled \"Identification of false credit card transaction using machine learning\" was authored by Dr.A.Samydurai, UG Students(8th Sem):, P.Karthikeyan, T.Ram Prasath, DN. Karthikeyan and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_103",
    "title": "Smart Vehicle Theft Detection and Recognition controlling intelligent system",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Research and Analytical reviews",
    "issn": "Volume:10, Issue: 02, ISSN (Online) 2348-1269",
    "year": 2024,
    "contributors": "Dr.L.Karthikeyan, UG Students(8th Sem):, K.Naveen Kumar, P.Prasanna, V.Rajalakshmi",
    "mentors": "Dr.L.Karthikeyan",
    "abstract": "This research publication titled \"Smart Vehicle Theft Detection and Recognition controlling intelligent system\" was authored by Dr.L.Karthikeyan, UG Students(8th Sem):, K.Naveen Kumar, P.Prasanna, V.Rajalakshmi and published in \"International Journal of Research and Analytical reviews\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_104",
    "title": "Intelligent Vehicle Black Box using IOT",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "International Journal of Research and Analytical reviews",
    "issn": "Volume:10, Issue: 02, ISSN (Online) 2348-1269",
    "year": 2024,
    "contributors": "Dr.L.Karthikeyan, UG Students(8th Sem):, S.J.Nithish, K.Pooja, S.Porselvi",
    "mentors": "Dr.L.Karthikeyan",
    "abstract": "This research publication titled \"Intelligent Vehicle Black Box using IOT\" was authored by Dr.L.Karthikeyan, UG Students(8th Sem):, S.J.Nithish, K.Pooja, S.Porselvi and published in \"International Journal of Research and Analytical reviews\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_105",
    "title": "Plant Life:An Intelligent mobile plant disease diagnostic system using Deep Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Technology Science communication and Technology",
    "issn": "Volume:3, Issue: 02, ISSN (Online) 2581-9429",
    "year": 2024,
    "contributors": "Dr.B.Muthusenthil, UG Students(8th Sem):, Mummaneni sravani, Konduru Theja Sree, M.P.Krithik Shri",
    "mentors": "Dr.B.Muthusenthil",
    "abstract": "This research publication titled \"Plant Life:An Intelligent mobile plant disease diagnostic system using Deep Learning\" was authored by Dr.B.Muthusenthil, UG Students(8th Sem):, Mummaneni sravani, Konduru Theja Sree, M.P.Krithik Shri and published in \"International Journal of Advanced Research in Technology Science communication and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_106",
    "title": "Smart Monitoring and wireless EV Charging",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "Science,Technology and Development",
    "issn": "Volume:XII, Issue: V, ISSN (Online) 0950-0707",
    "year": 2024,
    "contributors": "Mr.K.Shanmugam, UG Students(8th Sem):, R.Srinath, S.Silambarasan, P.Siddharth",
    "mentors": null,
    "abstract": "This research publication titled \"Smart Monitoring and wireless EV Charging\" was authored by Mr.K.Shanmugam, UG Students(8th Sem):, R.Srinath, S.Silambarasan, P.Siddharth and published in \"Science,Technology and Development\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_107",
    "title": "Sales forecasting of Non-Stationary time series sales data using Deep Learning Approach",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Education and Technology",
    "issn": "Volume:05, Issue: 04, ISSN (Online) 2581-7795",
    "year": 2024,
    "contributors": "Mr.K.Shanmugam, UG Students(8th Sem):, S.Anish Akshai, R.Brahadeeshram, P.Harish",
    "mentors": null,
    "abstract": "This research publication titled \"Sales forecasting of Non-Stationary time series sales data using Deep Learning Approach\" was authored by Mr.K.Shanmugam, UG Students(8th Sem):, S.Anish Akshai, R.Brahadeeshram, P.Harish and published in \"International Journal of Education and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_108",
    "title": "Automatic rain sensing wiper with drowsiness detection and alert systyem in Helmets",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Science,Technology and Development",
    "issn": "Volume:XII, Issue: V, ISSN (Online) 0950-0707",
    "year": 2024,
    "contributors": "Dr.Venkatesh, UG Students(8th Sem):, Sundar Naveen Kumar.C, M.Sivanarayanan, S. Vijaya Kumar",
    "mentors": "Dr.Venkatesh",
    "abstract": "This research publication titled \"Automatic rain sensing wiper with drowsiness detection and alert systyem in Helmets\" was authored by Dr.Venkatesh, UG Students(8th Sem):, Sundar Naveen Kumar.C, M.Sivanarayanan, S. Vijaya Kumar and published in \"Science,Technology and Development\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_109",
    "title": "Abnormal Event Detection in human behaviour",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume: 11, Issue: 04 , ISSN (Online) 2320-2882",
    "year": 2024,
    "contributors": "Ms.V.Prema, UG Students(8th Sem):, P.Sai mounish , R.Roach Amalan, K.Ranjith",
    "mentors": null,
    "abstract": "This research publication titled \"Abnormal Event Detection in human behaviour\" was authored by Ms.V.Prema, UG Students(8th Sem):, P.Sai mounish , R.Roach Amalan, K.Ranjith and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_110",
    "title": "Bone Fracture Detection and Recommendation using CNN",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume: 11, Issue: 04 , ISSN (Online) 2320-2882",
    "year": 2024,
    "contributors": "Ms.R.Anitha , UG Students(8th Sem):, T.Vasanth, S.Veeraragavan, K.Vigneshwaran",
    "mentors": null,
    "abstract": "This research publication titled \"Bone Fracture Detection and Recommendation using CNN\" was authored by Ms.R.Anitha , UG Students(8th Sem):, T.Vasanth, S.Veeraragavan, K.Vigneshwaran and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_111",
    "title": "Health care system using Blockchain",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume: 10, Issue: 05, ISSN (Online) 2320-2882",
    "year": 2024,
    "contributors": "Ms.A.Vidhya, UG Students(8th Sem):, C.Akileshwar, B.Hariharan, Mohd Aklad",
    "mentors": null,
    "abstract": "This research publication titled \"Health care system using Blockchain\" was authored by Ms.A.Vidhya, UG Students(8th Sem):, C.Akileshwar, B.Hariharan, Mohd Aklad and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_112",
    "title": "Framework for stock price prediction using ML and react JS",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Technology Science communication and Technology",
    "issn": "Volume: 3, Issue: 03, ISSN (Online) 2395-0072",
    "year": 2024,
    "contributors": "Dr.G.Kumaresan, UG Students(8th Sem):, B.Nithishkumar, R.Ajin, J.Gowtham",
    "mentors": "Dr.G.Kumaresan",
    "abstract": "This research publication titled \"Framework for stock price prediction using ML and react JS\" was authored by Dr.G.Kumaresan, UG Students(8th Sem):, B.Nithishkumar, R.Ajin, J.Gowtham and published in \"International Journal of Advanced Research in Technology Science communication and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_113",
    "title": "Negative Thinking Detection Using , Social Media Charts",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume: 11, Issue: 04 , ISSN (Online) 2320-2882",
    "year": 2024,
    "contributors": "Ms.A.Lalitha, UG Students(8th Sem):, Syed Muntasir SK, Surya GM, Roshan R",
    "mentors": null,
    "abstract": "This research publication titled \"Negative Thinking Detection Using , Social Media Charts\" was authored by Ms.A.Lalitha, UG Students(8th Sem):, Syed Muntasir SK, Surya GM, Roshan R and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_114",
    "title": "Diabetic Retinopathy microaneurysms detection using pretrained convoliution neural network",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume: 11, Issue: 03, ISSN (Online) 2320-2882",
    "year": 2024,
    "contributors": "V. Prema, UG Students(8th Sem):, V. Ripponika, V. Rishikesh, M.P. Roshan",
    "mentors": null,
    "abstract": "This research publication titled \"Diabetic Retinopathy microaneurysms detection using pretrained convoliution neural network\" was authored by V. Prema, UG Students(8th Sem):, V. Ripponika, V. Rishikesh, M.P. Roshan and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_115",
    "title": "Cryptomining Based Toll Collection and Charging Station System",
    "type": "conference",
    "category": "General Tech",
    "journal": "Fourth National Conference on Communication and System Design",
    "issn": "N/A",
    "year": 2024,
    "contributors": "Dr.K.Devi, UG Students(8th Sem):, S.Manikandan, B.Karthikeyan, M.Karna, Konduru Gajendra Raju",
    "mentors": "Dr.K.Devi",
    "abstract": "This research publication titled \"Cryptomining Based Toll Collection and Charging Station System\" was authored by Dr.K.Devi, UG Students(8th Sem):, S.Manikandan, B.Karthikeyan, M.Karna, Konduru Gajendra Raju and published in \"Fourth National Conference on Communication and System Design\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_116",
    "title": "Performance Analysis od NIDS dataset using decision tree classifier",
    "type": "journal",
    "category": "Data Engineering",
    "journal": "Emerging trends in artificial intelligence and Block chain Technology",
    "issn": "N/A",
    "year": 2024,
    "contributors": "Ms.A.Vidhya, PG Students:, J.Abinaya",
    "mentors": null,
    "abstract": "This research publication titled \"Performance Analysis od NIDS dataset using decision tree classifier\" was authored by Ms.A.Vidhya, PG Students:, J.Abinaya and published in \"Emerging trends in artificial intelligence and Block chain Technology\". It contributes to the field of Data Engineering by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_117",
    "title": "IOT based intelligent Door lock Ingress control system with digital Notification",
    "type": "conference",
    "category": "Cloud & DevOps",
    "journal": "5th International conference on Recent Innovations in Science & Technology(RIST 2023)",
    "issn": "N/A",
    "year": 2024,
    "contributors": "Dr.C.Pabitha, UG Students(8th Sem):, V.Nalina, N.Nandhini, I.Rajalakshmi",
    "mentors": "Dr.C.Pabitha",
    "abstract": "This research publication titled \"IOT based intelligent Door lock Ingress control system with digital Notification\" was authored by Dr.C.Pabitha, UG Students(8th Sem):, V.Nalina, N.Nandhini, I.Rajalakshmi and published in \"5th International conference on Recent Innovations in Science & Technology(RIST 2023)\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_118",
    "title": "Design and Implementation of public Distribution system using Block chain",
    "type": "conference",
    "category": "AI & ML",
    "journal": "5th International conference on Recent Innovations in Science & Technology(RIST 2023)",
    "issn": "N/A",
    "year": 2024,
    "contributors": "Dr.C.Pabitha, UG Students(8th Sem):, D.Kiran kumar, N.Kishore, N.Logesh",
    "mentors": "Dr.C.Pabitha",
    "abstract": "This research publication titled \"Design and Implementation of public Distribution system using Block chain\" was authored by Dr.C.Pabitha, UG Students(8th Sem):, D.Kiran kumar, N.Kishore, N.Logesh and published in \"5th International conference on Recent Innovations in Science & Technology(RIST 2023)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_119",
    "title": "Smart phone based autonomous vision enabled waste segregation system",
    "type": "conference",
    "category": "General Tech",
    "journal": "Fourth National Conference on communication and system design(NC2SD), PSG Institute of technology and Applied research",
    "issn": "N/A",
    "year": 2024,
    "contributors": "Dr B.Muthusenthil, UG Students(8th Sem):, J Muthtamiz Selvan",
    "mentors": null,
    "abstract": "This research publication titled \"Smart phone based autonomous vision enabled waste segregation system\" was authored by Dr B.Muthusenthil, UG Students(8th Sem):, J Muthtamiz Selvan and published in \"Fourth National Conference on communication and system design(NC2SD), PSG Institute of technology and Applied research\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_120",
    "title": "Newton algorithm based DELM for Enhancing offline Tamil Handwritten character Recognition",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Pattern Recognition and Artificial Intelligence",
    "issn": "DOI:10.11142/S021s00142500203",
    "year": 2022,
    "contributors": "Mr.K.Shanmugam, Dr.B.Vanathi",
    "mentors": "Dr.B.Vanathi",
    "abstract": "This research publication titled \"Newton algorithm based DELM for Enhancing offline Tamil Handwritten character Recognition\" was authored by Mr.K.Shanmugam, Dr.B.Vanathi and published in \"International Journal of Pattern Recognition and Artificial Intelligence\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.11142/S021s00142500203",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_121",
    "title": "An efficient optimal security system for intrusion detection in cloud computing environment using hybrid deep learning technique",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Advances in Engineering Software, - ELSEVIER",
    "issn": "Volume 173, https://doi.org/10.1016/j.advengsoft.2022.103236",
    "year": 2022,
    "contributors": "Dr.M.Mayuranathan, Dr.S.K.Saravanan, Dr.B.Muthusenthil, Dr.A.Samydurai",
    "mentors": "Dr.M.Mayuranathan, Dr.S.K.Saravanan, Dr.B.Muthusenthil, Dr.A.Samydurai",
    "abstract": "This research publication titled \"An efficient optimal security system for intrusion detection in cloud computing environment using hybrid deep learning technique\" was authored by Dr.M.Mayuranathan, Dr.S.K.Saravanan, Dr.B.Muthusenthil, Dr.A.Samydurai and published in \"Advances in Engineering Software, - ELSEVIER\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1016/j.advengsoft.2022.103236",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_122",
    "title": "Fuzzy-Dedup: A secure deduplication model using cosine based Fuzzy interference system in cloud application",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal of Intelligent & Fuzzy Systems",
    "issn": "Vol.43, Issue.3, pp.2819-2832,, DOI: 10.3233/JIFS-210511",
    "year": 2022,
    "contributors": "Dr.V.Dhanakoti",
    "mentors": "Dr.V.Dhanakoti",
    "abstract": "This research publication titled \"Fuzzy-Dedup: A secure deduplication model using cosine based Fuzzy interference system in cloud application\" was authored by Dr.V.Dhanakoti and published in \"Journal of Intelligent & Fuzzy Systems\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.3233/JIFS-210511",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_123",
    "title": "Adaptive DBN Using Hybrid Bayesian Lichtenberg Optimization for Intelligent Task Allocation",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Neural Processing Letters",
    "issn": "https://doi.org/10.1007/s11063-022-11071-6",
    "year": 2022,
    "contributors": "Ms.M. Priyadharshini, Ms.R. Anitha, Ms.S. Suma, Ms.V. Prema, Ms.A. Vidhya",
    "mentors": null,
    "abstract": "This research publication titled \"Adaptive DBN Using Hybrid Bayesian Lichtenberg Optimization for Intelligent Task Allocation\" was authored by Ms.M. Priyadharshini, Ms.R. Anitha, Ms.S. Suma, Ms.V. Prema, Ms.A. Vidhya and published in \"Neural Processing Letters\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1007/s11063-022-11071-6",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_124",
    "title": "An Enhanced Entity Model for Converting Relational to Non-Relational Documents in Hospital Management System Based on Cloud Computing",
    "type": "journal",
    "category": "AI & ML",
    "journal": "IETE Technical Review-Taylor & Francis",
    "issn": "https://doi.org/10.1080/02564602.2021.2016075",
    "year": 2022,
    "contributors": "Dr.A. Samydurai, Dr.Revathi, , Dr.L. Karthikeya, , Dr.B. Vanathi , Dr.K. Devi",
    "mentors": "Dr.A. Samydurai, Dr.Revathi, Dr.L. Karthikeya, Dr.B. Vanathi, Dr.K. Devi",
    "abstract": "This research publication titled \"An Enhanced Entity Model for Converting Relational to Non-Relational Documents in Hospital Management System Based on Cloud Computing\" was authored by Dr.A. Samydurai, Dr.Revathi, , Dr.L. Karthikeya, , Dr.B. Vanathi , Dr.K. Devi and published in \"IETE Technical Review-Taylor & Francis\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1080/02564602.2021.2016075",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_125",
    "title": "An Intelligent Deep Neural Sentiment classification Network",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Intelligent Automation & soft computing-Tech Science Press",
    "issn": "DOI:10.32604/iasc.2023.032108",
    "year": 2023,
    "contributors": "Dr.L.Karthikeyan, Dr.B.Chidambararajan",
    "mentors": "Dr.L.Karthikeyan, Dr.B.Chidambararajan",
    "abstract": "This research publication titled \"An Intelligent Deep Neural Sentiment classification Network\" was authored by Dr.L.Karthikeyan, Dr.B.Chidambararajan and published in \"Intelligent Automation & soft computing-Tech Science Press\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.32604/iasc.2023.032108",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_126",
    "title": "Blockchain based securing Medical Records in Big data Analytics",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Elsevier",
    "issn": "https://doi.org/10.1016/j.datak.2022.102122",
    "year": 2022,
    "contributors": "Mr.V.Santhana Marichamy",
    "mentors": null,
    "abstract": "This research publication titled \"Blockchain based securing Medical Records in Big data Analytics\" was authored by Mr.V.Santhana Marichamy and published in \"Elsevier\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1016/j.datak.2022.102122",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_127",
    "title": "Hybrid whale tabul algorithm optimized convolutional neural network architecture for intrusion detection in big data",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Concurrency computat pract Exper. Wiley publication",
    "issn": "DOI:10.1002kpe.7038",
    "year": 2022,
    "contributors": "Dr.V.Dhanakoti",
    "mentors": "Dr.V.Dhanakoti",
    "abstract": "This research publication titled \"Hybrid whale tabul algorithm optimized convolutional neural network architecture for intrusion detection in big data\" was authored by Dr.V.Dhanakoti and published in \"Concurrency computat pract Exper. Wiley publication\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1002kpe.7038",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_128",
    "title": "An efficient IoMT based health monitoring using complex valued deep CNN and political optimizer",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Emerging Telecommunication and Technologies",
    "issn": "https://doi.org/10.1002/ett.4610",
    "year": 2022,
    "contributors": "Ms.A. Vidhya,, Ms.V. Prema,, Ms.M. Priyadharshini,, Dr.G. Kumaresan,, Ms.G. Sangeetha",
    "mentors": "Dr.G. Kumaresan",
    "abstract": "This research publication titled \"An efficient IoMT based health monitoring using complex valued deep CNN and political optimizer\" was authored by Ms.A. Vidhya,, Ms.V. Prema,, Ms.M. Priyadharshini,, Dr.G. Kumaresan,, Ms.G. Sangeetha and published in \"Emerging Telecommunication and Technologies\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1002/ett.4610",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_129",
    "title": "Hybrid Fuzzy Archimedes-based Light GBM-XGBoost model for distributed task scheduling in mobile edge computing",
    "type": "journal",
    "category": "AI & ML",
    "journal": "John Wiley &Sons Ltd",
    "issn": "https://doi.org/10.1002/ett.4733",
    "year": 2022,
    "contributors": "Dr.G.Kumaresan,, Dr.K.Devi, Ms.Shanthi.S,, Dr.B.Muthusenthil, Dr.A.Samydurai",
    "mentors": "Dr.G.Kumaresan, Dr.K.Devi, Dr.B.Muthusenthil, Dr.A.Samydurai",
    "abstract": "This research publication titled \"Hybrid Fuzzy Archimedes-based Light GBM-XGBoost model for distributed task scheduling in mobile edge computing\" was authored by Dr.G.Kumaresan,, Dr.K.Devi, Ms.Shanthi.S,, Dr.B.Muthusenthil, Dr.A.Samydurai and published in \"John Wiley &Sons Ltd\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1002/ett.4733",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_130",
    "title": "An Investigation on Applicability of AD-HOC Routing Protocols in Fog-Assisted Smart Health Care System",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "ARPN Journal of Engineering and Applied Sciences",
    "issn": "Vol.18, No.6, ISSN: 1819-6608",
    "year": 2023,
    "contributors": "Dr.K.Devi",
    "mentors": "Dr.K.Devi",
    "abstract": "This research publication titled \"An Investigation on Applicability of AD-HOC Routing Protocols in Fog-Assisted Smart Health Care System\" was authored by Dr.K.Devi and published in \"ARPN Journal of Engineering and Applied Sciences\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_131",
    "title": "OSVR: an efcient support vector regression model based host, overload detection and secure virtual machine migration",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal of Ambient Intelligence and Humanized Computing",
    "issn": "https://doi.org/10.1007/s12652-022-04439-y",
    "year": 2022,
    "contributors": "Dr.S. Parthasarathy",
    "mentors": "Dr.S. Parthasarathy",
    "abstract": "This research publication titled \"OSVR: an efcient support vector regression model based host, overload detection and secure virtual machine migration\" was authored by Dr.S. Parthasarathy and published in \"Journal of Ambient Intelligence and Humanized Computing\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1007/s12652-022-04439-y",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_132",
    "title": "Support Vector Machine for real time analysis of rocks and structures",
    "type": "journal",
    "category": "General Tech",
    "journal": "Journal Of Algebraic Statistics",
    "issn": "Vol. 13 No. 3 (2022),ISSN: 1309-3452",
    "year": 2022,
    "contributors": "Mr.N. Leo Bright Tennisson",
    "mentors": null,
    "abstract": "This research publication titled \"Support Vector Machine for real time analysis of rocks and structures\" was authored by Mr.N. Leo Bright Tennisson and published in \"Journal Of Algebraic Statistics\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_133",
    "title": "Deep Learning Frame work for Edge Detecting and Classification in SAR Images of oil Spills using CNN",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Grenze International Journal of Engineering and Technology",
    "issn": "Grenze ID :01.GIJET.9.1.633.",
    "year": 2023,
    "contributors": "Dr.C.Pabitha, Dr.B.Vanathi, Ms.G.Sangeetha, Ms.S.Suma",
    "mentors": "Dr.C.Pabitha, Dr.B.Vanathi",
    "abstract": "This research publication titled \"Deep Learning Frame work for Edge Detecting and Classification in SAR Images of oil Spills using CNN\" was authored by Dr.C.Pabitha, Dr.B.Vanathi, Ms.G.Sangeetha, Ms.S.Suma and published in \"Grenze International Journal of Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_134",
    "title": "An Effective Hybrid Features For Driver Fatigue Detection Using Convolutional Neural Network",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal of Theoretical and Applied Information Technology",
    "issn": "Volume 101, Issue 4, ISSN: 1992-8645",
    "year": 2023,
    "contributors": "Ms.V.Vijay Priya",
    "mentors": null,
    "abstract": "This research publication titled \"An Effective Hybrid Features For Driver Fatigue Detection Using Convolutional Neural Network\" was authored by Ms.V.Vijay Priya and published in \"Journal of Theoretical and Applied Information Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_135",
    "title": "A Comprehensive Analysis Usage Of Data Science And Analytics",
    "type": "journal",
    "category": "Data Engineering",
    "journal": "International Journal of Multidisciplinary Educational Research",
    "issn": "ISSN:2277-7881, https://ijmer.in.doi./2022/11.06.09",
    "year": 2022,
    "contributors": "Dr. S. K. Saravanan, Mr. V. Santhana Marichamy",
    "mentors": "Dr. S. K. Saravanan",
    "abstract": "This research publication titled \"A Comprehensive Analysis Usage Of Data Science And Analytics\" was authored by Dr. S. K. Saravanan, Mr. V. Santhana Marichamy and published in \"International Journal of Multidisciplinary Educational Research\". It contributes to the field of Data Engineering by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://ijmer.in.doi./2022/11.06.09",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_136",
    "title": "Pedestrian Crossing Traffic Lightcontrol System Using Face Detection",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Research and Analytical Reviews (IJRAR)",
    "issn": "(E-ISSN 2348-1269, Volume 10, Issue 2",
    "year": 2023,
    "contributors": "Dr. S.Benila, UG Students:, 1.S.Nandini, 2.K.Nithin, 3.B.Pradeepa Illakkiya",
    "mentors": "Dr. S.Benila",
    "abstract": "This research publication titled \"Pedestrian Crossing Traffic Lightcontrol System Using Face Detection\" was authored by Dr. S.Benila, UG Students:, 1.S.Nandini, 2.K.Nithin, 3.B.Pradeepa Illakkiya and published in \"International Journal of Research and Analytical Reviews (IJRAR)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_137",
    "title": "Survey of Deep Learning Techniques for Vehicle Detection",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 3, Issue 1,, ISSN (Online) 2581-9429",
    "year": 2023,
    "contributors": "Dr. Benila S, UG Students:, 1.Karan Kumar R, 2.Karthikraja N, 3.Kavimukilan M",
    "mentors": "Dr. Benila S",
    "abstract": "This research publication titled \"Survey of Deep Learning Techniques for Vehicle Detection\" was authored by Dr. Benila S, UG Students:, 1.Karan Kumar R, 2.Karthikraja N, 3.Kavimukilan M and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_138",
    "title": "CNN Based Real Time Sign Language To Text And Speech Conversion",
    "type": "journal",
    "category": "AI & ML",
    "journal": "nternational Journal of Research and Analytical Reviews (IJRAR)",
    "issn": "Volume 10, Issue 2,, E-ISSN 2348-1269",
    "year": 2023,
    "contributors": "Ms.A.Vidhya, UG Students:, P. Muthusathish, G. Mythreyan, M. Premkumar",
    "mentors": null,
    "abstract": "This research publication titled \"CNN Based Real Time Sign Language To Text And Speech Conversion\" was authored by Ms.A.Vidhya, UG Students:, P. Muthusathish, G. Mythreyan, M. Premkumar and published in \"nternational Journal of Research and Analytical Reviews (IJRAR)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_139",
    "title": "Arrythmia Disease Prediction using Deep Learning Technique",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 3, Issue 2,, ISSN (Online) 2581-9429",
    "year": 2023,
    "contributors": "Ms. S. Suma, UG Students:, S. Ahileshwaran, P. Devakumar, R. Dineshkumar",
    "mentors": null,
    "abstract": "This research publication titled \"Arrythmia Disease Prediction using Deep Learning Technique\" was authored by Ms. S. Suma, UG Students:, S. Ahileshwaran, P. Devakumar, R. Dineshkumar and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_140",
    "title": "File Storage System using Hybrid Cryptography",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 3, Issue 2,, ISSN (Online) 2581-9429",
    "year": 2023,
    "contributors": "Ms. S. Suma, UG Students:, S. Failur Rahuman , A. Ghoushick, R. Hari Ganesh",
    "mentors": null,
    "abstract": "This research publication titled \"File Storage System using Hybrid Cryptography\" was authored by Ms. S. Suma, UG Students:, S. Failur Rahuman , A. Ghoushick, R. Hari Ganesh and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_141",
    "title": "Smart Stretcher System Using IOT",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "Journal Of Electronics Information Technology Science And Management",
    "issn": "VOLUME 13, ISSUE 3,, ISSN NO : 0258-7982",
    "year": 2023,
    "contributors": "MsAnitha R, UG Students:, Aarthika K, S.Aaslin Praise Gowtham S",
    "mentors": null,
    "abstract": "This research publication titled \"Smart Stretcher System Using IOT\" was authored by MsAnitha R, UG Students:, Aarthika K, S.Aaslin Praise Gowtham S and published in \"Journal Of Electronics Information Technology Science And Management\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_142",
    "title": "Global Disaster Tracker",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 3, Issue 2,ISSN (Online) 2581-9429",
    "year": 2023,
    "contributors": "Dr. M. Mayuranathan , UG Students:, Annamalai J, Ashwin R, Darrel P",
    "mentors": "Dr. M. Mayuranathan",
    "abstract": "This research publication titled \"Global Disaster Tracker\" was authored by Dr. M. Mayuranathan , UG Students:, Annamalai J, Ashwin R, Darrel P and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_143",
    "title": "Facial Recognition For Criminal Detection Using Deep Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Research Journal of Education and Technology",
    "issn": "Volume: 05 Issue: 04 | , ISSN (Online) 2581-7795",
    "year": 2023,
    "contributors": "Mrs. Sathya G , UG Students:, Tharani S, Shivani S, Sharmi S",
    "mentors": null,
    "abstract": "This research publication titled \"Facial Recognition For Criminal Detection Using Deep Learning\" was authored by Mrs. Sathya G , UG Students:, Tharani S, Shivani S, Sharmi S and published in \"International Research Journal of Education and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_144",
    "title": "Cognitive Radio network for minimizing network Traffic",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "International, Journal of Ceative Research Thoughts",
    "issn": "Vol 11,Issue:4,ISSN No:2320-2882",
    "year": 2023,
    "contributors": "Ms.S.Shanthi, UG Students:, S.Navin, A.Ragul, S.J.Ragunath",
    "mentors": null,
    "abstract": "This research publication titled \"Cognitive Radio network for minimizing network Traffic\" was authored by Ms.S.Shanthi, UG Students:, S.Navin, A.Ragul, S.J.Ragunath and published in \"International, Journal of Ceative Research Thoughts\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_145",
    "title": "Intelligent video surveillance using Deep Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 3, Issue 2,ISSN (Online) 2581-9429",
    "year": 2023,
    "contributors": "Ms.S.Shanthi, UG Students:, J.Ajith, A.Chran Kumar, K.Deepak Krishna, N.Gokul",
    "mentors": null,
    "abstract": "This research publication titled \"Intelligent video surveillance using Deep Learning\" was authored by Ms.S.Shanthi, UG Students:, J.Ajith, A.Chran Kumar, K.Deepak Krishna, N.Gokul and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_146",
    "title": "Browsecure",
    "type": "journal",
    "category": "Cybersecurity",
    "journal": "International Journal of Current Science",
    "issn": "Volume:13,Issue.3,ISSN No:2250-1770",
    "year": 2023,
    "contributors": "Ms.Ms. S. Suma, UG Students:, S.Reshma, S.Santhosh, S.Roshini",
    "mentors": null,
    "abstract": "This research publication titled \"Browsecure\" was authored by Ms.Ms. S. Suma, UG Students:, S.Reshma, S.Santhosh, S.Roshini and published in \"International Journal of Current Science\". It contributes to the field of Cybersecurity by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_147",
    "title": "Organ Donation And Matching System",
    "type": "journal",
    "category": "General Tech",
    "journal": "Science, Technology and Development",
    "issn": "Volume XII,Issue IV, ISSN : 0950-0707",
    "year": 2023,
    "contributors": "Ms.G.Sangeetha, UG Students:, S.Hariharan, C.Hemnath, K.Kabilesh",
    "mentors": null,
    "abstract": "This research publication titled \"Organ Donation And Matching System\" was authored by Ms.G.Sangeetha, UG Students:, S.Hariharan, C.Hemnath, K.Kabilesh and published in \"Science, Technology and Development\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_148",
    "title": "Human Activity Recognition Using DNN Classifier And Feature Analysis",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Creative Research Thoughts (IJCRT) www.ijcrt.org",
    "issn": "Volume 11, Issue 3 ISSN: 2320-2882",
    "year": 2022,
    "contributors": "Ms.G.Sangeetha, UG Students:, S.Shantha kumar, S.Harshavardhan, D.Varun",
    "mentors": null,
    "abstract": "This research publication titled \"Human Activity Recognition Using DNN Classifier And Feature Analysis\" was authored by Ms.G.Sangeetha, UG Students:, S.Shantha kumar, S.Harshavardhan, D.Varun and published in \"International Journal of Creative Research Thoughts (IJCRT) www.ijcrt.org\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_149",
    "title": "Smart Blind Stick Integration with IOT & SOS",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "Science, Technology and Development",
    "issn": "Volume XII,Issue IV, ISSN : 0950-0707",
    "year": 2023,
    "contributors": "Dr.S.Venkatesh, UG Students:, R.K.Rithanya, S.Subash, P.Surendar",
    "mentors": "Dr.S.Venkatesh",
    "abstract": "This research publication titled \"Smart Blind Stick Integration with IOT & SOS\" was authored by Dr.S.Venkatesh, UG Students:, R.K.Rithanya, S.Subash, P.Surendar and published in \"Science, Technology and Development\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_150",
    "title": "Recent Trends on the diverse application of blockchain using Ethereum client",
    "type": "journal",
    "category": "AI & ML",
    "journal": "GIS science Journal",
    "issn": "Volume 10,Issue 5,ISSN No:1869-9391",
    "year": 2023,
    "contributors": "Ms.R.Anitha",
    "mentors": null,
    "abstract": "This research publication titled \"Recent Trends on the diverse application of blockchain using Ethereum client\" was authored by Ms.R.Anitha and published in \"GIS science Journal\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_151",
    "title": "A mobile application for product verification using QR code and NFC Tags in Supply chain Management using BlockChain",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Creative Research Thoughts",
    "issn": "Volume 10,Issue 5,, ISSN No:2320-2882",
    "year": 2023,
    "contributors": "Dr.M.Mayuranathan, UG Students:, R.Aagash, P.Dillibabu, R.Balaji",
    "mentors": "Dr.M.Mayuranathan",
    "abstract": "This research publication titled \"A mobile application for product verification using QR code and NFC Tags in Supply chain Management using BlockChain\" was authored by Dr.M.Mayuranathan, UG Students:, R.Aagash, P.Dillibabu, R.Balaji and published in \"International Journal of Creative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_152",
    "title": "Analysis and Prediction of Employee Attrition",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume: 11, Issue: 04 , ISSN (Online) 2320-2882",
    "year": 2023,
    "contributors": "Mr.N.Leo Bright Tennission , UG Students:, K.Prem prasad, E.Praveen Kumar, K.Naveen Kumar",
    "mentors": null,
    "abstract": "This research publication titled \"Analysis and Prediction of Employee Attrition\" was authored by Mr.N.Leo Bright Tennission , UG Students:, K.Prem prasad, E.Praveen Kumar, K.Naveen Kumar and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_153",
    "title": "Smart Protection in Agricultural Fields",
    "type": "journal",
    "category": "General Tech",
    "journal": "Journal of Electronics Technology Science and Management",
    "issn": "Volume: 13, Issue: 04 , ISSN (Online) 1258-7982",
    "year": 2023,
    "contributors": "Mr.N.Leo Bright Tennission , UG Students:, Kanuparthi Saranya, K.Kavi Bharathi, D.Manoranjani",
    "mentors": null,
    "abstract": "This research publication titled \"Smart Protection in Agricultural Fields\" was authored by Mr.N.Leo Bright Tennission , UG Students:, Kanuparthi Saranya, K.Kavi Bharathi, D.Manoranjani and published in \"Journal of Electronics Technology Science and Management\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_154",
    "title": "An XGBoost-Based Regression Model for Wildfire Impact Prediction",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Research Journal of Engineering and Technology (IRJET)",
    "issn": "Vol-10, Issue 3, ISSN :2395-0056",
    "year": 2023,
    "contributors": "Mrs. M. Priyadharshini , UG Students:, Chrisolus Timonsingh J, Insuvai V",
    "mentors": null,
    "abstract": "This research publication titled \"An XGBoost-Based Regression Model for Wildfire Impact Prediction\" was authored by Mrs. M. Priyadharshini , UG Students:, Chrisolus Timonsingh J, Insuvai V and published in \"International Research Journal of Engineering and Technology (IRJET)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_155",
    "title": "Construction Of A Blockchain Web 3.0 Dapp With Nft Using Smart Contract",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Research Journal of Engineering and Technology",
    "issn": "2581-7795 volume 5 issue 03",
    "year": 2022,
    "contributors": "Mr.T.Rajasekar, UG Students:, B.Vignesh",
    "mentors": null,
    "abstract": "This research publication titled \"Construction Of A Blockchain Web 3.0 Dapp With Nft Using Smart Contract\" was authored by Mr.T.Rajasekar, UG Students:, B.Vignesh and published in \"International Research Journal of Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_156",
    "title": "Identification of false credit card transaction using machine learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume:11, Issue: 04 , ISSN (Online) 2320-2882",
    "year": 2023,
    "contributors": "Dr.A.Samydurai, UG Students:, P.Karthikeyan, T.Ram Prasath, DN. Karthikeyan",
    "mentors": "Dr.A.Samydurai",
    "abstract": "This research publication titled \"Identification of false credit card transaction using machine learning\" was authored by Dr.A.Samydurai, UG Students:, P.Karthikeyan, T.Ram Prasath, DN. Karthikeyan and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_157",
    "title": "Smart Vehicle Theft Detection and Recognition controlling intelligent system",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Research and Analytical reviews",
    "issn": "Volume:10, Issue: 02, ISSN (Online) 2348-1269",
    "year": 2023,
    "contributors": "Dr.L.Karthikeyan, UG Students:, K.Naveen Kumar, P.Prasanna, V.Rajalakshmi",
    "mentors": "Dr.L.Karthikeyan",
    "abstract": "This research publication titled \"Smart Vehicle Theft Detection and Recognition controlling intelligent system\" was authored by Dr.L.Karthikeyan, UG Students:, K.Naveen Kumar, P.Prasanna, V.Rajalakshmi and published in \"International Journal of Research and Analytical reviews\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_158",
    "title": "Intelligent Vehicle Black Box using IOT",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "International Journal of Research and Analytical reviews",
    "issn": "Volume:10, Issue: 02, ISSN (Online) 2348-1269",
    "year": 2023,
    "contributors": "Dr.L.Karthikeyan, UG Students:, S.J.Nithish, K.Pooja, S.Porselvi",
    "mentors": "Dr.L.Karthikeyan",
    "abstract": "This research publication titled \"Intelligent Vehicle Black Box using IOT\" was authored by Dr.L.Karthikeyan, UG Students:, S.J.Nithish, K.Pooja, S.Porselvi and published in \"International Journal of Research and Analytical reviews\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_159",
    "title": "Plant Life:An Intelligent mobile plant disease diagnostic system using Deep Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Technology Science communication and Technology",
    "issn": "Volume:3, Issue: 02, ISSN (Online) 2581-9429",
    "year": 2023,
    "contributors": "Dr.B.Muthusenthil, UG Students:, Mummaneni sravani, Konduru Theja Sree, M.P.Krithik Shri",
    "mentors": "Dr.B.Muthusenthil",
    "abstract": "This research publication titled \"Plant Life:An Intelligent mobile plant disease diagnostic system using Deep Learning\" was authored by Dr.B.Muthusenthil, UG Students:, Mummaneni sravani, Konduru Theja Sree, M.P.Krithik Shri and published in \"International Journal of Advanced Research in Technology Science communication and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_160",
    "title": "Smart Monitoring and wireless EV Charging",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "Science,Technology and Development",
    "issn": "Volume:XII, Issue: V, ISSN (Online) 0950-0707",
    "year": 2023,
    "contributors": "Mr.K.Shanmugam, UG Students:, R.Srinath, S.Silambarasan, P.Siddharth",
    "mentors": null,
    "abstract": "This research publication titled \"Smart Monitoring and wireless EV Charging\" was authored by Mr.K.Shanmugam, UG Students:, R.Srinath, S.Silambarasan, P.Siddharth and published in \"Science,Technology and Development\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_161",
    "title": "Sales forecasting of Non-Stationary time series sales data using Deep Learning Approach",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Education and Technology",
    "issn": "Volume:05, Issue: 04, ISSN (Online) 2581-7795",
    "year": 2023,
    "contributors": "Mr.K.Shanmugam, UG Students:, S.Anish Akshai, R.Brahadeeshram, P.Harish",
    "mentors": null,
    "abstract": "This research publication titled \"Sales forecasting of Non-Stationary time series sales data using Deep Learning Approach\" was authored by Mr.K.Shanmugam, UG Students:, S.Anish Akshai, R.Brahadeeshram, P.Harish and published in \"International Journal of Education and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_162",
    "title": "Automatic rain sensing wiper with drowsiness detection and alert systyem in Helmets",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Science,Technology and Development",
    "issn": "Volume:XII, Issue: V, ISSN (Online) 0950-0707",
    "year": 2023,
    "contributors": "Dr.Venkatesh, UG Students:, Sundar Naveen Kumar.C, M.Sivanarayanan, S. Vijaya Kumar",
    "mentors": "Dr.Venkatesh",
    "abstract": "This research publication titled \"Automatic rain sensing wiper with drowsiness detection and alert systyem in Helmets\" was authored by Dr.Venkatesh, UG Students:, Sundar Naveen Kumar.C, M.Sivanarayanan, S. Vijaya Kumar and published in \"Science,Technology and Development\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_163",
    "title": "Abnormal Event Detection in human behaviour",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume: 11, Issue: 04 , ISSN (Online) 2320-2882",
    "year": 2022,
    "contributors": "Ms.V.Prema, UG Students:, P.Sai mounish , R.Roach Amalan, K.Ranjith",
    "mentors": null,
    "abstract": "This research publication titled \"Abnormal Event Detection in human behaviour\" was authored by Ms.V.Prema, UG Students:, P.Sai mounish , R.Roach Amalan, K.Ranjith and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_164",
    "title": "Bone Fracture Detection and Recommendation using CNN",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume: 11, Issue: 04 , ISSN (Online) 2320-2882",
    "year": 2022,
    "contributors": "Ms.R.Anitha , UG Students:, T.Vasanth, S.Veeraragavan, K.Vigneshwaran",
    "mentors": null,
    "abstract": "This research publication titled \"Bone Fracture Detection and Recommendation using CNN\" was authored by Ms.R.Anitha , UG Students:, T.Vasanth, S.Veeraragavan, K.Vigneshwaran and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_165",
    "title": "Health care system using Blockchain",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume: 10, Issue: 05, ISSN (Online) 2320-2882",
    "year": 2022,
    "contributors": "Ms.A.Vidhya, UG Students:, C.Akileshwar, B.Hariharan, Mohd Aklad",
    "mentors": null,
    "abstract": "This research publication titled \"Health care system using Blockchain\" was authored by Ms.A.Vidhya, UG Students:, C.Akileshwar, B.Hariharan, Mohd Aklad and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_166",
    "title": "Framework for stock price prediction using ML and react JS",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Technology Science communication and Technology",
    "issn": "Volume: 3, Issue: 03, ISSN (Online) 2395-0072",
    "year": 2023,
    "contributors": "Dr.G.Kumaresan, UG Students:, B.Nithishkumar, R.Ajin, J.Gowtham",
    "mentors": "Dr.G.Kumaresan",
    "abstract": "This research publication titled \"Framework for stock price prediction using ML and react JS\" was authored by Dr.G.Kumaresan, UG Students:, B.Nithishkumar, R.Ajin, J.Gowtham and published in \"International Journal of Advanced Research in Technology Science communication and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_167",
    "title": "Negative Thinking Detection Using , Social Media Charts",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume: 11, Issue: 04 , ISSN (Online) 2320-2882",
    "year": 2023,
    "contributors": "Ms.A.Lalitha, UG Students:, Syed Muntasir SK, Surya GM, Roshan R",
    "mentors": null,
    "abstract": "This research publication titled \"Negative Thinking Detection Using , Social Media Charts\" was authored by Ms.A.Lalitha, UG Students:, Syed Muntasir SK, Surya GM, Roshan R and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_168",
    "title": "Diabetic Retinopathy microaneurysms detection using pretrained convoliution neural network",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Ceative Research Thoughts",
    "issn": "Volume: 11, Issue: 03, ISSN (Online) 2320-2882",
    "year": 2023,
    "contributors": "V. Prema, UG Students:, V. Ripponika, V. Rishikesh, M.P. Roshan",
    "mentors": null,
    "abstract": "This research publication titled \"Diabetic Retinopathy microaneurysms detection using pretrained convoliution neural network\" was authored by V. Prema, UG Students:, V. Ripponika, V. Rishikesh, M.P. Roshan and published in \"International Journal of Ceative Research Thoughts\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_169",
    "title": "Context Aware Fog-Assisted Vital Sign Monitoring System: Design and Implementation",
    "type": "conference",
    "category": "General Tech",
    "journal": "IEEE Conference Publication",
    "issn": "INSPEC Accession Number:22240273, DOI:10.1109/ICECAA55415.2022.9936287",
    "year": 2022,
    "contributors": "Dr.A.Samydurai",
    "mentors": "Dr.A.Samydurai",
    "abstract": "This research publication titled \"Context Aware Fog-Assisted Vital Sign Monitoring System: Design and Implementation\" was authored by Dr.A.Samydurai and published in \"IEEE Conference Publication\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1109/ICECAA55415.2022.9936287",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_170",
    "title": "Comparative Analysis for Detecting DrowsinessUsing Deep Learning Approach",
    "type": "conference",
    "category": "AI & ML",
    "journal": "IEEE Conference",
    "issn": "Volume ISSN: 979-8-3503-9763-5/23 DOI:10.1109/ICEEICT56924.2023.10157730",
    "year": 2022,
    "contributors": "Ms.V.Vijay Priya",
    "mentors": null,
    "abstract": "This research publication titled \"Comparative Analysis for Detecting DrowsinessUsing Deep Learning Approach\" was authored by Ms.V.Vijay Priya and published in \"IEEE Conference\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1109/ICEEICT56924.2023.10157730",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_171",
    "title": "Binary Classification Of Medical Chest Xray Using Gaussian Naive Bayes In Machine learning",
    "type": "conference",
    "category": "AI & ML",
    "journal": "Scopus Indexed International Conference On Next-Gen Technologies In Computational Intelligence",
    "issn": "N/A",
    "year": 2023,
    "contributors": "Ms.Shanthi S",
    "mentors": null,
    "abstract": "This research publication titled \"Binary Classification Of Medical Chest Xray Using Gaussian Naive Bayes In Machine learning\" was authored by Ms.Shanthi S and published in \"Scopus Indexed International Conference On Next-Gen Technologies In Computational Intelligence\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_172",
    "title": "WG-WaveNet: On-Demand Speech Synthesis on CPU",
    "type": "conference",
    "category": "General Tech",
    "journal": "39th Dubai International Conference on Literature, Humanities, Education and Social Sciences",
    "issn": "DIR1122412",
    "year": 2022,
    "contributors": "Dr.V.Dhanakoti, Dr.B.Muthusenthil, Dr.L.Karthikeyan",
    "mentors": "Dr.V.Dhanakoti, Dr.B.Muthusenthil, Dr.L.Karthikeyan",
    "abstract": "This research publication titled \"WG-WaveNet: On-Demand Speech Synthesis on CPU\" was authored by Dr.V.Dhanakoti, Dr.B.Muthusenthil, Dr.L.Karthikeyan and published in \"39th Dubai International Conference on Literature, Humanities, Education and Social Sciences\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_173",
    "title": "Cryptomining Based Toll Collection and Charging Station System",
    "type": "conference",
    "category": "General Tech",
    "journal": "Fourth National Conference on Communication and System Design",
    "issn": "N/A",
    "year": 2023,
    "contributors": "Dr.K.Devi, UG Students:, S.Manikandan, B.Karthikeyan, M.Karna, Konduru Gajendra Raju",
    "mentors": "Dr.K.Devi",
    "abstract": "This research publication titled \"Cryptomining Based Toll Collection and Charging Station System\" was authored by Dr.K.Devi, UG Students:, S.Manikandan, B.Karthikeyan, M.Karna, Konduru Gajendra Raju and published in \"Fourth National Conference on Communication and System Design\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_174",
    "title": "Machine Methods for classification of rocks and structure using outlier filter",
    "type": "conference",
    "category": "AI & ML",
    "journal": "14 th International conference on Engineering and Advancement in Technology",
    "issn": "N/A",
    "year": 2023,
    "contributors": "Mr.N.Leo Bright Tennisson Dr.C.Pabitha, Dr.B.Vanathi",
    "mentors": "Dr.B.Vanathi",
    "abstract": "This research publication titled \"Machine Methods for classification of rocks and structure using outlier filter\" was authored by Mr.N.Leo Bright Tennisson Dr.C.Pabitha, Dr.B.Vanathi and published in \"14 th International conference on Engineering and Advancement in Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_175",
    "title": "Deep Learning Framework for Edge Detecting and Classification in SAR images, of Oil Spills using CNN",
    "type": "conference",
    "category": "AI & ML",
    "journal": "International Conference on Recent Advancements in, Artificial Intelligence and Soft Computing ICAISC - 2022",
    "issn": "N/A",
    "year": 2022,
    "contributors": "Dr.C.Pabitha, Dr.B.Vanathi",
    "mentors": "Dr.C.Pabitha, Dr.B.Vanathi",
    "abstract": "This research publication titled \"Deep Learning Framework for Edge Detecting and Classification in SAR images, of Oil Spills using CNN\" was authored by Dr.C.Pabitha, Dr.B.Vanathi and published in \"International Conference on Recent Advancements in, Artificial Intelligence and Soft Computing ICAISC - 2022\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_176",
    "title": "IOT based intelligent Door lock Ingress control system with digital Notification",
    "type": "conference",
    "category": "Cloud & DevOps",
    "journal": "5th International conference on Recent Innovations in Science & Technology(RIST 2023)",
    "issn": "N/A",
    "year": 2023,
    "contributors": "Dr.C.Pabitha, UG Students:, V.Nalina, N.Nandhini, I.Rajalakshmi",
    "mentors": "Dr.C.Pabitha",
    "abstract": "This research publication titled \"IOT based intelligent Door lock Ingress control system with digital Notification\" was authored by Dr.C.Pabitha, UG Students:, V.Nalina, N.Nandhini, I.Rajalakshmi and published in \"5th International conference on Recent Innovations in Science & Technology(RIST 2023)\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_177",
    "title": "Design and Implementation of public Distribution system using Block chain",
    "type": "conference",
    "category": "AI & ML",
    "journal": "5th International conference on Recent Innovations in Science & Technology(RIST 2023)",
    "issn": "N/A",
    "year": 2023,
    "contributors": "Dr.C.Pabitha, UG Students:, D.Kiran kumar, N.Kishore, N.Logesh",
    "mentors": "Dr.C.Pabitha",
    "abstract": "This research publication titled \"Design and Implementation of public Distribution system using Block chain\" was authored by Dr.C.Pabitha, UG Students:, D.Kiran kumar, N.Kishore, N.Logesh and published in \"5th International conference on Recent Innovations in Science & Technology(RIST 2023)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_178",
    "title": "Smart phone based autonomous vision enabled waste segregation system",
    "type": "conference",
    "category": "General Tech",
    "journal": "Fourth National Conference on communication and system design(NC2SD), PSG Institute of technology and Applied research",
    "issn": "N/A",
    "year": 2022,
    "contributors": "Dr B.Muthusenthil, UG Students:, J Muthtamiz Selvan",
    "mentors": null,
    "abstract": "This research publication titled \"Smart phone based autonomous vision enabled waste segregation system\" was authored by Dr B.Muthusenthil, UG Students:, J Muthtamiz Selvan and published in \"Fourth National Conference on communication and system design(NC2SD), PSG Institute of technology and Applied research\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_179",
    "title": "Composable data Analytics and its Applications",
    "type": "journal",
    "category": "Data Engineering",
    "journal": "Book chapter-Emerging Applications and smart systems based on blockchain , Technology",
    "issn": "ISBN:978-81-9535921119",
    "year": 2022,
    "contributors": "Dr.S.K.Saravanan, Mr.V.Santhana Marichamy",
    "mentors": "Dr.S.K.Saravanan",
    "abstract": "This research publication titled \"Composable data Analytics and its Applications\" was authored by Dr.S.K.Saravanan, Mr.V.Santhana Marichamy and published in \"Book chapter-Emerging Applications and smart systems based on blockchain , Technology\". It contributes to the field of Data Engineering by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_180",
    "title": "Recent Trends in Engineering and operation Management",
    "type": "journal",
    "category": "General Tech",
    "journal": "Book chapter-Recent trends in Engineering and operation management",
    "issn": "ISBN:978-81-9535921119",
    "year": 2022,
    "contributors": "Dr.S.K.Saravanan, Dr.S.Parthasarathy",
    "mentors": "Dr.S.K.Saravanan, Dr.S.Parthasarathy",
    "abstract": "This research publication titled \"Recent Trends in Engineering and operation Management\" was authored by Dr.S.K.Saravanan, Dr.S.Parthasarathy and published in \"Book chapter-Recent trends in Engineering and operation management\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_181",
    "title": "Machine Learning using Python",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Scientific International publishing House",
    "issn": "ISBN No:978-93-5757-343-6",
    "year": 2022,
    "contributors": "Dr.M.Mayuranathan",
    "mentors": "Dr.M.Mayuranathan",
    "abstract": "This research publication titled \"Machine Learning using Python\" was authored by Dr.M.Mayuranathan and published in \"Scientific International publishing House\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_182",
    "title": "Understanding Security Principles-, Cryptography,Cyber law",
    "type": "journal",
    "category": "Cybersecurity",
    "journal": "Scientific International publishing House",
    "issn": "ISBN No:978-935625-283-7",
    "year": 2022,
    "contributors": "Mr.V.Santhana, Marichamy",
    "mentors": null,
    "abstract": "This research publication titled \"Understanding Security Principles-, Cryptography,Cyber law\" was authored by Mr.V.Santhana, Marichamy and published in \"Scientific International publishing House\". It contributes to the field of Cybersecurity by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_183",
    "title": "A secure framework for managing data in cloud storage using rapid asymmetric maximum based dynamic size chunking and fuzzy logic for deduplication (SCI)",
    "type": "journal",
    "category": "Cybersecurity",
    "journal": "Wireless Networks",
    "issn": "ISSN: 1572-8196",
    "year": 2023,
    "contributors": "K. Rajkumar, U. Hariharan, V.Dhanakoti/Prof, N. Muthukumaran",
    "mentors": "V.Dhanakoti/Prof",
    "abstract": "This research publication titled \"A secure framework for managing data in cloud storage using rapid asymmetric maximum based dynamic size chunking and fuzzy logic for deduplication (SCI)\" was authored by K. Rajkumar, U. Hariharan, V.Dhanakoti/Prof, N. Muthukumaran and published in \"Wireless Networks\". It contributes to the field of Cybersecurity by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_184",
    "title": "Development and Implementation of an Intelligent Health monitoring System using IoT and Advanced Machine Learning Techniques",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal of Machine and Computing 3(4)(2023)",
    "issn": "ISSN: 27887669",
    "year": 2023,
    "contributors": "Dr.C.Pabitha",
    "mentors": "Dr.C.Pabitha",
    "abstract": "This research publication titled \"Development and Implementation of an Intelligent Health monitoring System using IoT and Advanced Machine Learning Techniques\" was authored by Dr.C.Pabitha and published in \"Journal of Machine and Computing 3(4)(2023)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_185",
    "title": "Dense Mesh RCNN: assessment of human skin burn and burn depth severity (SCI)",
    "type": "journal",
    "category": "AI & ML",
    "journal": "The Journal of Supercomputing",
    "issn": "https://doi.org/10.1007/s11227-023-05660-y",
    "year": 2023,
    "contributors": "Dr.C.pabitha , Dr.B.vanathi",
    "mentors": "Dr.C.pabitha, Dr.B.vanathi",
    "abstract": "This research publication titled \"Dense Mesh RCNN: assessment of human skin burn and burn depth severity (SCI)\" was authored by Dr.C.pabitha , Dr.B.vanathi and published in \"The Journal of Supercomputing\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1007/s11227-023-05660-y",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_186",
    "title": "Humming bird optimization based deep belief neural network for Tamil handwritten character recognition , (SCI)",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Biomedical signal processing and control",
    "issn": "ISSN: , 1746-8094",
    "year": 2024,
    "contributors": "Dr.K.Shanmugam /Asst.Prof, Dr.B.Vanathi/Prof",
    "mentors": "Dr.K.Shanmugam /Asst.Prof, Dr.B.Vanathi/Prof",
    "abstract": "This research publication titled \"Humming bird optimization based deep belief neural network for Tamil handwritten character recognition , (SCI)\" was authored by Dr.K.Shanmugam /Asst.Prof, Dr.B.Vanathi/Prof and published in \"International Journal of Biomedical signal processing and control\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_187",
    "title": "The resilience of HermiteGaussian and orbital angular momentum modes for free space optical communication in atmospheric turbulence (SCI)",
    "type": "journal",
    "category": "General Tech",
    "journal": "Signal, Image and Video Processing",
    "issn": "ISSN: , 1863-1711",
    "year": 2024,
    "contributors": "Dr.A.Samydurai/Prof",
    "mentors": "Dr.A.Samydurai/Prof",
    "abstract": "This research publication titled \"The resilience of HermiteGaussian and orbital angular momentum modes for free space optical communication in atmospheric turbulence (SCI)\" was authored by Dr.A.Samydurai/Prof and published in \"Signal, Image and Video Processing\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_188",
    "title": "DeepLG SecNet:Utilizing deep LSTM and GRU with secure network for Enhanced Intrusion Detection in IoT Environment , (SCI)",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal of Cluster Computing",
    "issn": "ISSN: , 1386-7857",
    "year": 2024,
    "contributors": "Dr.A.Samydurai/Prof",
    "mentors": "Dr.A.Samydurai/Prof",
    "abstract": "This research publication titled \"DeepLG SecNet:Utilizing deep LSTM and GRU with secure network for Enhanced Intrusion Detection in IoT Environment , (SCI)\" was authored by Dr.A.Samydurai/Prof and published in \"Journal of Cluster Computing\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_189",
    "title": "Overcoming the Challenge of Accurate Segmentation of Lung Nodules: A Multi-crop CNN Approach(SCI)",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal of Imaging Informatics in medicine",
    "issn": "ISSN: , 2948-2933",
    "year": 2024,
    "contributors": "B Christina Sweetline /Asst.Prof, Dr.A.Samydurai/Prof",
    "mentors": "B Christina Sweetline /Asst.Prof, Dr.A.Samydurai/Prof",
    "abstract": "This research publication titled \"Overcoming the Challenge of Accurate Segmentation of Lung Nodules: A Multi-crop CNN Approach(SCI)\" was authored by B Christina Sweetline /Asst.Prof, Dr.A.Samydurai/Prof and published in \"Journal of Imaging Informatics in medicine\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_190",
    "title": "Dynamic 8-bit XOR algorithm with AES crypto algorithm for image, steganography, (SCI)",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Signal Image and Video Processing",
    "issn": "ISSN: 1863-1711",
    "year": 2024,
    "contributors": "Dr.A. Samydurai",
    "mentors": "Dr.A. Samydurai",
    "abstract": "This research publication titled \"Dynamic 8-bit XOR algorithm with AES crypto algorithm for image, steganography, (SCI)\" was authored by Dr.A. Samydurai and published in \"Signal Image and Video Processing\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_191",
    "title": "HEL-MCNN: Hybrid extreme learning modified convolutional neural network for allocating suitable donors for patients with minimized waiting time",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Expert Systems with Applications",
    "issn": "Volume 232, ISSN 0957-4174,120673",
    "year": 2023,
    "contributors": "Ms.G.Sangeetha, , Dr.B.Vanathi",
    "mentors": "Dr.B.Vanathi",
    "abstract": "This research publication titled \"HEL-MCNN: Hybrid extreme learning modified convolutional neural network for allocating suitable donors for patients with minimized waiting time\" was authored by Ms.G.Sangeetha, , Dr.B.Vanathi and published in \"Expert Systems with Applications\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_192",
    "title": "HBO-GMRNN: Honey badger optimization based gain modulated recurrent neural network for classification of breast cancer",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Elsevier - Biomedical Signal Processing and Control",
    "issn": "Volume 91, May 2024, 105910",
    "year": 2024,
    "contributors": "Ms.A.Vidhya , Dr.B.Vanathi",
    "mentors": "Dr.B.Vanathi",
    "abstract": "This research publication titled \"HBO-GMRNN: Honey badger optimization based gain modulated recurrent neural network for classification of breast cancer\" was authored by Ms.A.Vidhya , Dr.B.Vanathi and published in \"Elsevier - Biomedical Signal Processing and Control\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_193",
    "title": "TriKSV-LG: a robust approach to disease prediction in healthcare systems using AI and Levy Gazelle optimization",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Taylor & Francis, Computer Methods in Biomechanics and Biomedical Engineering",
    "issn": "?https://doi.org/10.1080/10255842.2024.2339479",
    "year": 2024,
    "contributors": "Ms.Prema.V, Ms.Vidhya. A",
    "mentors": null,
    "abstract": "This research publication titled \"TriKSV-LG: a robust approach to disease prediction in healthcare systems using AI and Levy Gazelle optimization\" was authored by Ms.Prema.V, Ms.Vidhya. A and published in \"Taylor & Francis, Computer Methods in Biomechanics and Biomedical Engineering\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1080/10255842.2024.2339479",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_194",
    "title": "Deep Learning Framework for Edge Detecting and, Classification in SAR Images of Oil Spills using CNN",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Grenze International Journal of Engineering and Technology",
    "issn": "Grenze ID: 01.GIJET.9.1.733",
    "year": 2023,
    "contributors": "Dr. C. Pabitha, Dr. B.Vanathi Ms.G.Sangeetha, Ms.S.Suma",
    "mentors": "Dr. C. Pabitha, Dr. B.Vanathi Ms.G.Sangeetha",
    "abstract": "This research publication titled \"Deep Learning Framework for Edge Detecting and, Classification in SAR Images of Oil Spills using CNN\" was authored by Dr. C. Pabitha, Dr. B.Vanathi Ms.G.Sangeetha, Ms.S.Suma and published in \"Grenze International Journal of Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_195",
    "title": "Deep Learning Based Human Emotion Exposure Detection Using Vocal and Countenance",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Migration Letters",
    "issn": "Vol 20 No S13, ISSN: , 1741-8992",
    "year": 2023,
    "contributors": "Dr.C.Pabitha /Asst.Prof, Dr.B.Vanathi/Prof",
    "mentors": "Dr.C.Pabitha /Asst.Prof, Dr.B.Vanathi/Prof",
    "abstract": "This research publication titled \"Deep Learning Based Human Emotion Exposure Detection Using Vocal and Countenance\" was authored by Dr.C.Pabitha /Asst.Prof, Dr.B.Vanathi/Prof and published in \"Migration Letters\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_196",
    "title": "Fuzzy optimal solution for the shortest mapping in the univariate search approach using decagonal fuzzy numbers",
    "type": "journal",
    "category": "General Tech",
    "journal": "Journal of basic science and engineering",
    "issn": "Vol 21, No 1, ISSN: , 1005-0930",
    "year": 2024,
    "contributors": "Ms.S.Suma/Asst.prof",
    "mentors": null,
    "abstract": "This research publication titled \"Fuzzy optimal solution for the shortest mapping in the univariate search approach using decagonal fuzzy numbers\" was authored by Ms.S.Suma/Asst.prof and published in \"Journal of basic science and engineering\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_197",
    "title": "Malware Website Detection Using Ensemble Machine Learning Approach",
    "type": "journal",
    "category": "AI & ML",
    "journal": "IJSART",
    "issn": "Vol 10 Issue 3, ISSN: , 2395-1052",
    "year": 2024,
    "contributors": "Dr.M.Mayuranathan /AP, UG Students: , T. Ragothaman, Agilen Napolean and N. Kalyan Kumar",
    "mentors": "Dr.M.Mayuranathan /AP",
    "abstract": "This research publication titled \"Malware Website Detection Using Ensemble Machine Learning Approach\" was authored by Dr.M.Mayuranathan /AP, UG Students: , T. Ragothaman, Agilen Napolean and N. Kalyan Kumar and published in \"IJSART\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_198",
    "title": "Patient Monitoring for Personalized Mobile, Health (PMH) Based on Medical Virtual Instruments",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal of Interactive Mobile Technologies (iJIM)",
    "issn": "Vol 17 No 16 ISSN: , 1865-7923",
    "year": 2023,
    "contributors": "B.Christina Sweetline/Asst.Prof, Dr.A. Samydurai/Prof",
    "mentors": "B.Christina Sweetline/Asst.Prof, Dr.A. Samydurai/Prof",
    "abstract": "This research publication titled \"Patient Monitoring for Personalized Mobile, Health (PMH) Based on Medical Virtual Instruments\" was authored by B.Christina Sweetline/Asst.Prof, Dr.A. Samydurai/Prof and published in \"International Journal of Interactive Mobile Technologies (iJIM)\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_199",
    "title": "Enhancing Customer Retention: A Voting Classifier Apporach",
    "type": "journal",
    "category": "General Tech",
    "journal": "Journal of Electronics Information Technology Science and Management",
    "issn": "Vol 14 Issue 3, ISSN: , 0258-7982",
    "year": 2024,
    "contributors": "Dr.M.Mayuranathan /AP , UG Students: , Vignesh D, Thirupathi M and M.Shiva Shankar",
    "mentors": "Dr.M.Mayuranathan /AP",
    "abstract": "This research publication titled \"Enhancing Customer Retention: A Voting Classifier Apporach\" was authored by Dr.M.Mayuranathan /AP , UG Students: , Vignesh D, Thirupathi M and M.Shiva Shankar and published in \"Journal of Electronics Information Technology Science and Management\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_200",
    "title": "New Tactic of Factorization with Triangular Fuzzy Numbers",
    "type": "journal",
    "category": "General Tech",
    "journal": "Acta Biomed",
    "issn": "DOI: 10.23750/abm.v94i3.13441,Vol. 94, N. 3: e2023717",
    "year": 2023,
    "contributors": "Ms.S.Suma , Ms.A.Lalitha, Ms.A.Vidhya",
    "mentors": null,
    "abstract": "This research publication titled \"New Tactic of Factorization with Triangular Fuzzy Numbers\" was authored by Ms.S.Suma , Ms.A.Lalitha, Ms.A.Vidhya and published in \"Acta Biomed\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.23750/abm.v94i3.13441,Vol.",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_201",
    "title": "Innovations In AI-Enhanced Mental Health Care",
    "type": "journal",
    "category": "AI & ML",
    "journal": "IJSART",
    "issn": "Volume 9 Issue 9 ISSN [ONLINE]: 2395-1052",
    "year": 2023,
    "contributors": "Dr.K.Shanmugam, UG Students:, G.Bharath , J. Lokesh, N.Nirmal",
    "mentors": "Dr.K.Shanmugam",
    "abstract": "This research publication titled \"Innovations In AI-Enhanced Mental Health Care\" was authored by Dr.K.Shanmugam, UG Students:, G.Bharath , J. Lokesh, N.Nirmal and published in \"IJSART\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_202",
    "title": "wwwId-A Practical Internet-Scale Self-Sovereign, Self-Federated Identity System",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal Of Innovative Research In Technology",
    "issn": "Volume 10 Issue 10 , ISSN: , 2349-6002",
    "year": 2024,
    "contributors": "Dr.V.Dhanakoti, UG Students:, Aadithya V,, Amutha varshini S, Bakkiyalakshmi V",
    "mentors": "Dr.V.Dhanakoti",
    "abstract": "This research publication titled \"wwwId-A Practical Internet-Scale Self-Sovereign, Self-Federated Identity System\" was authored by Dr.V.Dhanakoti, UG Students:, Aadithya V,, Amutha varshini S, Bakkiyalakshmi V and published in \"International Journal Of Innovative Research In Technology\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_203",
    "title": "AuthentiGuard: Decentralized Product Authentication System using Blockchain for Counterfeit Detection",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Research in Technology",
    "issn": "Volume 10 Issue 10 , ISSN: , 2349-6002",
    "year": 2023,
    "contributors": "Dr.V.Dhanakoti, UG Students:, Dejaswarooba B, , Gokul M, , Dev Preeth Singh R",
    "mentors": "Dr.V.Dhanakoti",
    "abstract": "This research publication titled \"AuthentiGuard: Decentralized Product Authentication System using Blockchain for Counterfeit Detection\" was authored by Dr.V.Dhanakoti, UG Students:, Dejaswarooba B, , Gokul M, , Dev Preeth Singh R and published in \"International Journal of Innovative Research in Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_204",
    "title": "AI as Personal Therapist",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Electronics Information Technology Science And Management",
    "issn": "Volume 14,Issue 3, ISSN: , 0258-7982",
    "year": 2024,
    "contributors": "Dr.V.Dhanakoti, UG Students:, R.Maanasa, P.Mohankumar, B.Muthu Kiruba",
    "mentors": "Dr.V.Dhanakoti",
    "abstract": "This research publication titled \"AI as Personal Therapist\" was authored by Dr.V.Dhanakoti, UG Students:, R.Maanasa, P.Mohankumar, B.Muthu Kiruba and published in \"International Journal of Electronics Information Technology Science And Management\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_205",
    "title": "Analytiguard: Pioneering Data Analytics for Proactive Credit Card Fraud Detection",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Research in Technology",
    "issn": "Volume 10 Issue 10 , ISSN: , 0258-7982",
    "year": 2024,
    "contributors": "Dr.V.Dhanakoti, UG Students:, R.Maanasa, P.Mohankumar, B.Muthu Kiruba",
    "mentors": "Dr.V.Dhanakoti",
    "abstract": "This research publication titled \"Analytiguard: Pioneering Data Analytics for Proactive Credit Card Fraud Detection\" was authored by Dr.V.Dhanakoti, UG Students:, R.Maanasa, P.Mohankumar, B.Muthu Kiruba and published in \"International Journal of Innovative Research in Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_206",
    "title": "Breast Cancer Detection Using Ensemble Technique",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal Of Electronics Information Technology Science And Management",
    "issn": "Volume 14,Issue 3, ISSN: , 0258-7982",
    "year": 2024,
    "contributors": "Ms.A.Vidhya, UG Students:, R.Nishanth, S.Keerthana, B.Kavya",
    "mentors": null,
    "abstract": "This research publication titled \"Breast Cancer Detection Using Ensemble Technique\" was authored by Ms.A.Vidhya, UG Students:, R.Nishanth, S.Keerthana, B.Kavya and published in \"Journal Of Electronics Information Technology Science And Management\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_207",
    "title": "Cloud Sentinel: A Robust Python-based cloud platform for secure and collaborative threat intelligence sharing, anonymization, dataaggregation and collective defense(UGC)",
    "type": "journal",
    "category": "Cybersecurity",
    "journal": "International Journal of Electronics Information Technology Science and Management",
    "issn": "ISSN: , 0258-7982",
    "year": 2024,
    "contributors": "Dr.K.Shanmugam/AP, UG Students: , Mercy G, , Mohanapriyan P S Keerthivasan",
    "mentors": "Dr.K.Shanmugam/AP",
    "abstract": "This research publication titled \"Cloud Sentinel: A Robust Python-based cloud platform for secure and collaborative threat intelligence sharing, anonymization, dataaggregation and collective defense(UGC)\" was authored by Dr.K.Shanmugam/AP, UG Students: , Mercy G, , Mohanapriyan P S Keerthivasan and published in \"International Journal of Electronics Information Technology Science and Management\". It contributes to the field of Cybersecurity by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_208",
    "title": "Next Gen Self Driving Safety with Pothole Detection Via AI and YOLO v8 Deep Learning, (UGC)",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Electronics Information Technology Science and Management",
    "issn": "ISSN: , 0258-7982",
    "year": 2024,
    "contributors": "Dr.K.Shanmugam,Asst Prof, UG Students:, Mohana Priya G, P. Mohan Kumar, B. Praveena Shivaani G N.Pradeep",
    "mentors": "Dr.K.Shanmugam, Asst Prof",
    "abstract": "This research publication titled \"Next Gen Self Driving Safety with Pothole Detection Via AI and YOLO v8 Deep Learning, (UGC)\" was authored by Dr.K.Shanmugam,Asst Prof, UG Students:, Mohana Priya G, P. Mohan Kumar, B. Praveena Shivaani G N.Pradeep and published in \"International Journal of Electronics Information Technology Science and Management\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_209",
    "title": "Virtual Fitting Room Using Deep Learning, (UGC)",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal Of Electronics Information Technology Science And Management",
    "issn": "ISSN: , 0258-7982",
    "year": 2024,
    "contributors": "Dr. B. Vanathi/Prof, UG Students: , Rajasundari J,, Mohammad Abrar Z, Priyadharshini P",
    "mentors": "Dr. B. Vanathi/Prof",
    "abstract": "This research publication titled \"Virtual Fitting Room Using Deep Learning, (UGC)\" was authored by Dr. B. Vanathi/Prof, UG Students: , Rajasundari J,, Mohammad Abrar Z, Priyadharshini P and published in \"Journal Of Electronics Information Technology Science And Management\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_210",
    "title": "AI Based Bio Metric Smart Voting System Using Internet of Things",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Research in Technology",
    "issn": "Volume 10 Issue 10 , ISSN: , 2349-6002",
    "year": 2024,
    "contributors": "Dr. M. Mayuranathan, UG Students:, C.R Dan prabhu, .M.,Bhuvaneshwari, K.Harthika",
    "mentors": "Dr. M. Mayuranathan",
    "abstract": "This research publication titled \"AI Based Bio Metric Smart Voting System Using Internet of Things\" was authored by Dr. M. Mayuranathan, UG Students:, C.R Dan prabhu, .M.,Bhuvaneshwari, K.Harthika and published in \"International Journal of Innovative Research in Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_211",
    "title": "Indian Corporate Stock Prediction Using Linear Regression",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal Of Electronics Information Technology Science And Management",
    "issn": "Volume 14,Issue 3 , ISSN:, 0258-7982",
    "year": 2024,
    "contributors": "Dr. V. Dhanakoti, UG Students:, R.Dev preeth singh, M.Gokul, B.Dejaswarooba",
    "mentors": "Dr. V. Dhanakoti",
    "abstract": "This research publication titled \"Indian Corporate Stock Prediction Using Linear Regression\" was authored by Dr. V. Dhanakoti, UG Students:, R.Dev preeth singh, M.Gokul, B.Dejaswarooba and published in \"Journal Of Electronics Information Technology Science And Management\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_212",
    "title": "A Review on Role of Big Data Analytics During COVID-19",
    "type": "journal",
    "category": "Data Engineering",
    "journal": "Journal of Xidian University",
    "issn": "Volume 18,Issue 4, ISSN: , 1001-2400",
    "year": 2024,
    "contributors": "Dr. V.Dhanakoti, UG Students:, M.Uttam",
    "mentors": "Dr. V.Dhanakoti",
    "abstract": "This research publication titled \"A Review on Role of Big Data Analytics During COVID-19\" was authored by Dr. V.Dhanakoti, UG Students:, M.Uttam and published in \"Journal of Xidian University\". It contributes to the field of Data Engineering by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_213",
    "title": "Adversarial Training and Boosting Robustness in Machine Learning Frameworks",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology",
    "issn": "Volume 4,Issue 4, ISSN: 2581-9429",
    "year": 2023,
    "contributors": "Ms. Sangeetha G, UG Students:, K.Bharath, S.Balamanikandan, G.Bharath",
    "mentors": null,
    "abstract": "This research publication titled \"Adversarial Training and Boosting Robustness in Machine Learning Frameworks\" was authored by Ms. Sangeetha G, UG Students:, K.Bharath, S.Balamanikandan, G.Bharath and published in \"International Journal of Advanced Research in Science, Communication and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_214",
    "title": "IOT based Intelligent Door Lock Ingress Control System with Digital Notification",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "Journal of Advanced Engineering Research",
    "issn": "ISSN: 2393-8447 Volume 10, Issue 2",
    "year": 2023,
    "contributors": "Dr. C.Pabitha, UG Students:, V.Nalina, M.Nandhini, I.RajaLakshmi",
    "mentors": "Dr. C.Pabitha",
    "abstract": "This research publication titled \"IOT based Intelligent Door Lock Ingress Control System with Digital Notification\" was authored by Dr. C.Pabitha, UG Students:, V.Nalina, M.Nandhini, I.RajaLakshmi and published in \"Journal of Advanced Engineering Research\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_215",
    "title": "Decentralized Network of public distribution system using Block Chain",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal of Advanced Engineering Research",
    "issn": "ISSN: 2393-8447 Volume 11, Issue 1",
    "year": 2024,
    "contributors": "Dr. C. Pabitha, UG Students:, N.Logesh, d.Kiran kumar, N.Kishore",
    "mentors": "Dr. C. Pabitha",
    "abstract": "This research publication titled \"Decentralized Network of public distribution system using Block Chain\" was authored by Dr. C. Pabitha, UG Students:, N.Logesh, d.Kiran kumar, N.Kishore and published in \"Journal of Advanced Engineering Research\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_216",
    "title": "Medical Mask Recognition using DL",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Creative Research Thoughts (IJCRT)",
    "issn": "Volume 12, Issue 4, ISSN: 2320-2882",
    "year": 2024,
    "contributors": "Ms.Suma.S, UG Students:, S. Srijhanyee, SS.Yaashini, G.SaiSunitha",
    "mentors": null,
    "abstract": "This research publication titled \"Medical Mask Recognition using DL\" was authored by Ms.Suma.S, UG Students:, S. Srijhanyee, SS.Yaashini, G.SaiSunitha and published in \"International Journal of Creative Research Thoughts (IJCRT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_217",
    "title": "Object detection convert object name to text and text to speech",
    "type": "journal",
    "category": "AI & ML",
    "journal": "IJARSCT",
    "issn": "ISSN:2581-9429, Volume 4, Issue 4",
    "year": 2024,
    "contributors": "Ms.Sathya. G, UG Students:, S.Kamesh, S.Rishikumar, S.Saai sabathty",
    "mentors": null,
    "abstract": "This research publication titled \"Object detection convert object name to text and text to speech\" was authored by Ms.Sathya. G, UG Students:, S.Kamesh, S.Rishikumar, S.Saai sabathty and published in \"IJARSCT\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_218",
    "title": "Depth sensing Imaging System Autonomous Restored Fog",
    "type": "journal",
    "category": "General Tech",
    "journal": "IJARSCT",
    "issn": "ISSN 2581-9429, Volume 4, Issue 4",
    "year": 2024,
    "contributors": "Ms.G.Sathya , UG Students:, R.Shivasjankaran, S.Diviyan",
    "mentors": null,
    "abstract": "This research publication titled \"Depth sensing Imaging System Autonomous Restored Fog\" was authored by Ms.G.Sathya , UG Students:, R.Shivasjankaran, S.Diviyan and published in \"IJARSCT\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_219",
    "title": "AI Resume Analyzer using Natural Language Processing",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science ,Communication and Technology(IJARSCT)",
    "issn": "Volume 4, Issue 4, ISSN (Online) 2581-9429",
    "year": 2024,
    "contributors": "Ms.M.Sophiya Sugantha Grace, UG Students:, R.Dharini, A.Deepan, M.Gowthaman",
    "mentors": null,
    "abstract": "This research publication titled \"AI Resume Analyzer using Natural Language Processing\" was authored by Ms.M.Sophiya Sugantha Grace, UG Students:, R.Dharini, A.Deepan, M.Gowthaman and published in \"International Journal of Advanced Research in Science ,Communication and Technology(IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_220",
    "title": "Non-Repeating, Normalized Questionnaire Sets Generation and Rendering Based on A Parsed Input Domain with Cryptographically Enforced Secure Access",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Vol.4, Issue.2, , ISSN (Online) 2581-9429",
    "year": 2024,
    "contributors": "Dr V Dhanakoti, V , UG Students:, Aadithya, S Amutha Varshini, V Bakkiyalakshmi",
    "mentors": null,
    "abstract": "This research publication titled \"Non-Repeating, Normalized Questionnaire Sets Generation and Rendering Based on A Parsed Input Domain with Cryptographically Enforced Secure Access\" was authored by Dr V Dhanakoti, V , UG Students:, Aadithya, S Amutha Varshini, V Bakkiyalakshmi and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_221",
    "title": "Parking Pixels: Pythons Vision for Urban Space Optimization",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of New Innovations in Engineering and Technology",
    "issn": "Vol.24, Issue.4",
    "year": 2024,
    "contributors": "Dr. V. Dhanakoti, UG Students:, S.Sakthivel, K.Vedavarshini, C.Sundaresan",
    "mentors": "Dr. V. Dhanakoti",
    "abstract": "This research publication titled \"Parking Pixels: Pythons Vision for Urban Space Optimization\" was authored by Dr. V. Dhanakoti, UG Students:, S.Sakthivel, K.Vedavarshini, C.Sundaresan and published in \"International Journal of New Innovations in Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_222",
    "title": "Fortifying Cyber Resilience",
    "type": "journal",
    "category": "General Tech",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Vol 4, Issue 4, ISSN 2581-9429",
    "year": 2024,
    "contributors": "Mr. N. Leo Bright Tennisson, UG Students:, V.Nithish, M.Parkavi, A.Priyadharshini",
    "mentors": null,
    "abstract": "This research publication titled \"Fortifying Cyber Resilience\" was authored by Mr. N. Leo Bright Tennisson, UG Students:, V.Nithish, M.Parkavi, A.Priyadharshini and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_223",
    "title": "STEVE JOBS: Pioneering AI in Software Engineering",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 4, ISSUE 2, ISSN: 2581-9429",
    "year": 2024,
    "contributors": "Ms.Priyadharshini.M, UG Students:, S N .Sriram, T.Sudhar Aathith, N.Vigneshwaran",
    "mentors": null,
    "abstract": "This research publication titled \"STEVE JOBS: Pioneering AI in Software Engineering\" was authored by Ms.Priyadharshini.M, UG Students:, S N .Sriram, T.Sudhar Aathith, N.Vigneshwaran and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_224",
    "title": "An Efficient Segmentation and Classification of Brain Tumor Detection using Deep Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 4, Issue 4, ISSN: 2581-9429",
    "year": 2024,
    "contributors": "Ms.Vijaypriya.V, UG Students:, B.Gokul, G.Gopinath, A.Hariharan",
    "mentors": null,
    "abstract": "This research publication titled \"An Efficient Segmentation and Classification of Brain Tumor Detection using Deep Learning\" was authored by Ms.Vijaypriya.V, UG Students:, B.Gokul, G.Gopinath, A.Hariharan and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_225",
    "title": "A Multifaceted Approach to Real Tim Online Proctoring with Gaze Tracking, Facial Aspect Ratio Analysis and Object Detection",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 4, Issue 4, ISSN: 2581-9429",
    "year": 2024,
    "contributors": "Ms.Vijaypriya.V, UG Students:, P M .Dhanesh, V.Giridhar, B L.Harish",
    "mentors": null,
    "abstract": "This research publication titled \"A Multifaceted Approach to Real Tim Online Proctoring with Gaze Tracking, Facial Aspect Ratio Analysis and Object Detection\" was authored by Ms.Vijaypriya.V, UG Students:, P M .Dhanesh, V.Giridhar, B L.Harish and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_226",
    "title": "Enhancing Customer Analytics: A Comprehensive Framework for Effective Churn Prediction",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "Volume 4, Issue 2, ISSN: 2581-9429",
    "year": 2024,
    "contributors": "Ms.Anitha R, UG Students:, P S Adithyan, V A.Akshaya, A.Bhunesh",
    "mentors": null,
    "abstract": "This research publication titled \"Enhancing Customer Analytics: A Comprehensive Framework for Effective Churn Prediction\" was authored by Ms.Anitha R, UG Students:, P S Adithyan, V A.Akshaya, A.Bhunesh and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_227",
    "title": "Dermacure  An Advanced skin Disease Detection using Deep Learning Algorithm",
    "type": "journal",
    "category": "AI & ML",
    "journal": "IJARSCT",
    "issn": "ISSN: 2581-9429, Volume 3, Issue 1",
    "year": 2023,
    "contributors": "Dr.Venkatesh S,, UG Students, Bharath G, , Bharath K",
    "mentors": "Dr.Venkatesh S",
    "abstract": "This research publication titled \"Dermacure  An Advanced skin Disease Detection using Deep Learning Algorithm\" was authored by Dr.Venkatesh S,, UG Students, Bharath G, , Bharath K and published in \"IJARSCT\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_228",
    "title": "Melanoma Skin Cancer Prediction",
    "type": "journal",
    "category": "AI & ML",
    "journal": "IJSART",
    "issn": "Volume 10 Issue 3, ISSN 2395-1052",
    "year": 2024,
    "contributors": "Ms.A.Lalitha, UG Students:, J.Karthik, J.Pradeep, P.Nian Adthith",
    "mentors": null,
    "abstract": "This research publication titled \"Melanoma Skin Cancer Prediction\" was authored by Ms.A.Lalitha, UG Students:, J.Karthik, J.Pradeep, P.Nian Adthith and published in \"IJSART\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_229",
    "title": "Video Surveillance and Security using Artificial Intelligence",
    "type": "journal",
    "category": "Cybersecurity",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "ISSN (Online) 2581-9429, Volume 4, Issue 4",
    "year": 2024,
    "contributors": "Dr.S. Venkatesh,, UG Students, Akash V, , Hariharan S, , Jayashri J",
    "mentors": "Dr.S. Venkatesh",
    "abstract": "This research publication titled \"Video Surveillance and Security using Artificial Intelligence\" was authored by Dr.S. Venkatesh,, UG Students, Akash V, , Hariharan S, , Jayashri J and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of Cybersecurity by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_230",
    "title": "Driver Drowsinesss Detection using AI",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)",
    "issn": "ISSN (Online) 2581-9429, Volume 4, Issue 4",
    "year": 2024,
    "contributors": "Ms.A.Lalitha, UG Students:, E.Pradeepkumar, V.Rajaramanan, M K.Ramharis",
    "mentors": null,
    "abstract": "This research publication titled \"Driver Drowsinesss Detection using AI\" was authored by Ms.A.Lalitha, UG Students:, E.Pradeepkumar, V.Rajaramanan, M K.Ramharis and published in \"International Journal of Advanced Research in Science, Communication and Technology (IJARSCT)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_231",
    "title": "A Methodical Examination in the Pursuit of Big, Data Analytics in Digital Media Broadcasting",
    "type": "journal",
    "category": "Data Engineering",
    "journal": "International Journal of New Innovations in Engineering and Technology",
    "issn": "Volume 24,Issue 4, ISSN: , 2319-6319",
    "year": 2024,
    "contributors": "Dr. V.Dhanakoti/Prof",
    "mentors": "Dr. V.Dhanakoti/Prof",
    "abstract": "This research publication titled \"A Methodical Examination in the Pursuit of Big, Data Analytics in Digital Media Broadcasting\" was authored by Dr. V.Dhanakoti/Prof and published in \"International Journal of New Innovations in Engineering and Technology\". It contributes to the field of Data Engineering by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_232",
    "title": "Contrasting a Conventional Approach with Digital, Approach for Brand Communication Scrutiny",
    "type": "journal",
    "category": "General Tech",
    "journal": "Journal of Xidian University",
    "issn": "Volume 18,Issue 7, ISSN: , 1001-2400",
    "year": 2024,
    "contributors": "Dr. V.Dhanakoti/Prof",
    "mentors": "Dr. V.Dhanakoti/Prof",
    "abstract": "This research publication titled \"Contrasting a Conventional Approach with Digital, Approach for Brand Communication Scrutiny\" was authored by Dr. V.Dhanakoti/Prof and published in \"Journal of Xidian University\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_233",
    "title": "Scalable Computing in Resource Allocation",
    "type": "conference",
    "category": "General Tech",
    "journal": "International Conference on Edge computing and Applications",
    "issn": "ISBN: 979-8-3503-4757-9",
    "year": 2023,
    "contributors": "Ms.S.Suma",
    "mentors": null,
    "abstract": "This research publication titled \"Scalable Computing in Resource Allocation\" was authored by Ms.S.Suma and published in \"International Conference on Edge computing and Applications\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_234",
    "title": "Comparative Analysis for Detecting Drowsiness, Using Deep Learning Approach",
    "type": "journal",
    "category": "AI & ML",
    "journal": "IEEE Xplore.",
    "issn": "10.1109/ICEEICT5624.2023.10157730",
    "year": 2023,
    "contributors": "Ms.V.Vijayapriya",
    "mentors": null,
    "abstract": "This research publication titled \"Comparative Analysis for Detecting Drowsiness, Using Deep Learning Approach\" was authored by Ms.V.Vijayapriya and published in \"IEEE Xplore.\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_235",
    "title": "Machine Learning Techniques for Classification and Prediction of Structures and Rocks",
    "type": "conference",
    "category": "AI & ML",
    "journal": "International Conference on Recent Advances in Science & Engineering Technology",
    "issn": "10.1109/ICRASET59632.2023, 979-8-3503-0692-7/23",
    "year": 2023,
    "contributors": "1.Mr.N. Leo Bright Tennisson, 2. Dr. B. Vanathi , 3.Dr. C. Pabitha",
    "mentors": null,
    "abstract": "This research publication titled \"Machine Learning Techniques for Classification and Prediction of Structures and Rocks\" was authored by 1.Mr.N. Leo Bright Tennisson, 2. Dr. B. Vanathi , 3.Dr. C. Pabitha and published in \"International Conference on Recent Advances in Science & Engineering Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_236",
    "title": "Revolutionizing Intrusion Detection in Industrial IOT with Deep Generative Techniques",
    "type": "conference",
    "category": "AI & ML",
    "journal": "International Conference on Recent Innovations In Science, Engineering and Technology, (Paper ID: ICRISET24 63)",
    "issn": "ISBN: 978-81-972699-5-0",
    "year": 2024,
    "contributors": "Ms.Mohanapriya.M",
    "mentors": null,
    "abstract": "This research publication titled \"Revolutionizing Intrusion Detection in Industrial IOT with Deep Generative Techniques\" was authored by Ms.Mohanapriya.M and published in \"International Conference on Recent Innovations In Science, Engineering and Technology, (Paper ID: ICRISET24 63)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_237",
    "title": "Harnessing Deep Learning for Early Detection: A Performance Evaluation of RESNET V250, VGG 16, and CNN in Breast Cancer Histopathology",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Artificial Intelligence in Nanomaterials Engineering, Environmental & Healthcare Applications(IC-ANEHA 24)",
    "issn": "ISBN: 978-93-6155-898-6",
    "year": 2024,
    "contributors": "Ms.Vidhya. A, Dr.Vanathi. B",
    "mentors": "Dr.Vanathi. B",
    "abstract": "This research publication titled \"Harnessing Deep Learning for Early Detection: A Performance Evaluation of RESNET V250, VGG 16, and CNN in Breast Cancer Histopathology\" was authored by Ms.Vidhya. A, Dr.Vanathi. B and published in \"Artificial Intelligence in Nanomaterials Engineering, Environmental & Healthcare Applications(IC-ANEHA 24)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_238",
    "title": "Binary Classification of Medical Chest X-Ray Using Gaussian Naive Bayes in Machine Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Next Gen Technologies in computational Intelligence",
    "issn": "ISBN 9781003430452,528-533",
    "year": 2024,
    "contributors": "Ms.Shanthi.S,, Dr.M.Murugan,, Dr.M.Mayuranathan",
    "mentors": "Dr.M.Murugan, Dr.M.Mayuranathan",
    "abstract": "This research publication titled \"Binary Classification of Medical Chest X-Ray Using Gaussian Naive Bayes in Machine Learning\" was authored by Ms.Shanthi.S,, Dr.M.Murugan,, Dr.M.Mayuranathan and published in \"Next Gen Technologies in computational Intelligence\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_239",
    "title": "Navigating the Circular Age of a Sustainable Digital Revolution",
    "type": "journal",
    "category": "AI & ML",
    "journal": "IGI Global Engineering Science Reference",
    "issn": "ISBN 979-8-3693-2827-9",
    "year": 2024,
    "contributors": "Dr.M.Mayuranathan",
    "mentors": "Dr.M.Mayuranathan",
    "abstract": "This research publication titled \"Navigating the Circular Age of a Sustainable Digital Revolution\" was authored by Dr.M.Mayuranathan and published in \"IGI Global Engineering Science Reference\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_240",
    "title": "Sustainable Business Models for Smart City Using Artificial Intelligence Techniques",
    "type": "journal",
    "category": "AI & ML",
    "journal": "IGI Global Engineering Science Reference",
    "issn": "DOI:10.4018/979-8-3693-2827-9",
    "year": 2024,
    "contributors": "Dr.M.Mayuranathan",
    "mentors": "Dr.M.Mayuranathan",
    "abstract": "This research publication titled \"Sustainable Business Models for Smart City Using Artificial Intelligence Techniques\" was authored by Dr.M.Mayuranathan and published in \"IGI Global Engineering Science Reference\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.4018/979-8-3693-2827-9",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_241",
    "title": "A data-driven framework for fair and efficient organ transplantation using gradient boosting and adaptive genetic allocation",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Journal of Artificial Organs",
    "issn": "Vol.28,, eISSN: 1619-0904",
    "year": 2025,
    "contributors": "Dr.G.Sangeetha, Dr.B.Vanathi",
    "mentors": "Dr.G.Sangeetha, Dr.B.Vanathi",
    "abstract": "This research publication titled \"A data-driven framework for fair and efficient organ transplantation using gradient boosting and adaptive genetic allocation\" was authored by Dr.G.Sangeetha, Dr.B.Vanathi and published in \"Journal of Artificial Organs\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_242",
    "title": "Network Lifetime improvement in wireless sensor network using Energy-Efficient Bat-Moth Flame Optimization Technique",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Scientific reports, Springer Nature, Impact factor  3.8. (Q1), (Web of Science)",
    "issn": "Vol.15, pp.1-11",
    "year": 2025,
    "contributors": "Anslam Sibi S et. al.",
    "mentors": null,
    "abstract": "This research publication titled \"Network Lifetime improvement in wireless sensor network using Energy-Efficient Bat-Moth Flame Optimization Technique\" was authored by Anslam Sibi S et. al. and published in \"Scientific reports, Springer Nature, Impact factor  3.8. (Q1), (Web of Science)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_243",
    "title": "Advanced chest X-ray image classification for early detection and treatment monitoring of respiratory conditions",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Biomedical Signal Processing and Control",
    "issn": "Volume 110, Part A,2025,107990,ISSN 1746-8094,https://doi.org/10.1016/j.bspc.2025.107990-SCI ,page-1 to 13",
    "year": 2025,
    "contributors": "Shanthi S, Dr.M.Murugan",
    "mentors": "Dr.M.Murugan",
    "abstract": "This research publication titled \"Advanced chest X-ray image classification for early detection and treatment monitoring of respiratory conditions\" was authored by Shanthi S, Dr.M.Murugan and published in \"Biomedical Signal Processing and Control\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1016/j.bspc.2025.107990-SCI",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_244",
    "title": "Privacy-preserving collaboration in blockchain-enabled IoT:, The synergy of modified homomorphic encryption and, federated learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Int J Commun Syst. 2024;37:e5955.",
    "issn": "VOL.7/ISSUE 28/",
    "year": 2024,
    "contributors": "Ms.Anitha R,, Dr.M.Murugan.",
    "mentors": "Dr.M.Murugan.",
    "abstract": "This research publication titled \"Privacy-preserving collaboration in blockchain-enabled IoT:, The synergy of modified homomorphic encryption and, federated learning\" was authored by Ms.Anitha R,, Dr.M.Murugan. and published in \"Int J Commun Syst. 2024;37:e5955.\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_245",
    "title": "Leveraging Support Vector Machines for Optimizing Cluster Head Selection and Energy Management in Large-Scale Wireless Sensor Networks",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "International Journal of Computer Sciences and engineering(IF:3.802) (Accepted for Publication in May 2025)",
    "issn": "Vol 13/Pg 1-7/",
    "year": 2025,
    "contributors": "Dr S.K Susee,, Dr S.Venkatesh(2nd Author), Dr M.Senthil Kumar,, Dr B.Chidambararajan",
    "mentors": null,
    "abstract": "This research publication titled \"Leveraging Support Vector Machines for Optimizing Cluster Head Selection and Energy Management in Large-Scale Wireless Sensor Networks\" was authored by Dr S.K Susee,, Dr S.Venkatesh(2nd Author), Dr M.Senthil Kumar,, Dr B.Chidambararajan and published in \"International Journal of Computer Sciences and engineering(IF:3.802) (Accepted for Publication in May 2025)\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_246",
    "title": "Deep Convolutional Multi-Relational Graph Attention Network for Autonomous Drone Navigation in Urban Wind Zones",
    "type": "journal",
    "category": "Cloud & DevOps",
    "journal": "IEEE Xplore: 27 February 2025 (SCOPUS INDEXED)",
    "issn": "2025, pp. 784-790, doi: 10.1109/ICMSCI62561.2025.10893994",
    "year": 2024,
    "contributors": "C. Pabitha (First Author)",
    "mentors": null,
    "abstract": "This research publication titled \"Deep Convolutional Multi-Relational Graph Attention Network for Autonomous Drone Navigation in Urban Wind Zones\" was authored by C. Pabitha (First Author) and published in \"IEEE Xplore: 27 February 2025 (SCOPUS INDEXED)\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1109/ICMSCI62561.2025.10893994",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_247",
    "title": "Predication of Stock Market using Technical Trading Indicators",
    "type": "journal",
    "category": "General Tech",
    "journal": "VDI-Z Integrierte Produktion",
    "issn": "Vol.11, Issue.7, pp.70-83",
    "year": 2024,
    "contributors": "V.Dhanakoti, /Prof, UG Student:, Uttam M",
    "mentors": "/Prof",
    "abstract": "This research publication titled \"Predication of Stock Market using Technical Trading Indicators\" was authored by V.Dhanakoti, /Prof, UG Student:, Uttam M and published in \"VDI-Z Integrierte Produktion\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_248",
    "title": "Integrated Road Safety System for Real-Time Waterlogging Detection and Traffic Management Using Google Maps API",
    "type": "journal",
    "category": "AI & ML",
    "journal": "IEEE Xplore: 27 February 2025 (SCOPUS INDEXED)",
    "issn": "pp. 1165-1170, doi: 10.1109/ICMSCI62561.2025",
    "year": 2025,
    "contributors": "Pabitha C, UG Student:, Vignesh R, Shamritha V, Prathija A",
    "mentors": null,
    "abstract": "This research publication titled \"Integrated Road Safety System for Real-Time Waterlogging Detection and Traffic Management Using Google Maps API\" was authored by Pabitha C, UG Student:, Vignesh R, Shamritha V, Prathija A and published in \"IEEE Xplore: 27 February 2025 (SCOPUS INDEXED)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1109/ICMSCI62561.2025",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_249",
    "title": "Comprehensive Analysis for Diagnosing Attention Deficit Hyperactivity Disorder Using Support Vector Machine and Multilayer Perceptron",
    "type": "journal",
    "category": "General Tech",
    "journal": "IEEE Xplore, (scopus Indexed)",
    "issn": "10.1109/ICCCT63501.2025.11019010",
    "year": 2025,
    "contributors": "Dr.B.Vanathi(2nd Author)",
    "mentors": "Dr.B.Vanathi(2nd Author)",
    "abstract": "This research publication titled \"Comprehensive Analysis for Diagnosing Attention Deficit Hyperactivity Disorder Using Support Vector Machine and Multilayer Perceptron\" was authored by Dr.B.Vanathi(2nd Author) and published in \"IEEE Xplore, (scopus Indexed)\". It contributes to the field of General Tech by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_250",
    "title": "Optimizing Blood Cell Segmentation in Hematological Analysis Using Advanced Image Processing Techniques",
    "type": "journal",
    "category": "AI & ML",
    "journal": "IJIRT",
    "issn": "Volume 11 Issue 10 | ISSN: 2349-6002",
    "year": 2025,
    "contributors": "Dr.B.Vanathi, UG Students(8th Sem):, Ifthikaar Ahmed A,, Haari Vignesh T, Akshaya E",
    "mentors": "Dr.B.Vanathi",
    "abstract": "This research publication titled \"Optimizing Blood Cell Segmentation in Hematological Analysis Using Advanced Image Processing Techniques\" was authored by Dr.B.Vanathi, UG Students(8th Sem):, Ifthikaar Ahmed A,, Haari Vignesh T, Akshaya E and published in \"IJIRT\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_251",
    "title": "Innovations in Stroke Identification - A Deep Learning- Based Diagnostic Model Using Neuroimages",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Science and Research Technology",
    "issn": "Volume 11 Issue 10 , ISSN: 2349-6002",
    "year": 2025,
    "contributors": "C.Pabitha,, UG Students(8th Sem):, G. Santhiya, R. Sharulatha, B.S. Shobika",
    "mentors": null,
    "abstract": "This research publication titled \"Innovations in Stroke Identification - A Deep Learning- Based Diagnostic Model Using Neuroimages\" was authored by C.Pabitha,, UG Students(8th Sem):, G. Santhiya, R. Sharulatha, B.S. Shobika and published in \"International Journal of Innovative Science and Research Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_252",
    "title": "Multi Label Classification of Lung Diseases Using, Deep Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Research in Technology",
    "issn": "Volume 11, ISSN: 2349-6002",
    "year": 2025,
    "contributors": "M. Sophiya Sugantha, UG Students(8th Sem):, Sanjay C, Sugapriyan V, Harish V",
    "mentors": null,
    "abstract": "This research publication titled \"Multi Label Classification of Lung Diseases Using, Deep Learning\" was authored by M. Sophiya Sugantha, UG Students(8th Sem):, Sanjay C, Sugapriyan V, Harish V and published in \"International Journal of Innovative Research in Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_253",
    "title": "Multi Label Classification of Lung Diseases Using Deep Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Research in Technology",
    "issn": "Volume 11/April 2025/ISSN: 2349-6002",
    "year": 2025,
    "contributors": "M.Sophiya Sugantha Grace",
    "mentors": null,
    "abstract": "This research publication titled \"Multi Label Classification of Lung Diseases Using Deep Learning\" was authored by M.Sophiya Sugantha Grace and published in \"International Journal of Innovative Research in Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_254",
    "title": "A Methodical Examination in the Pursuit of Big Data Analytics in Digital Media Broadcasting",
    "type": "journal",
    "category": "Data Engineering",
    "journal": "International Journal of New Innovations in Engineering and Technology",
    "issn": "Volume 24 Issue 4 June 2024",
    "year": 2024,
    "contributors": "Dr. V.Dhanakoti",
    "mentors": "Dr. V.Dhanakoti",
    "abstract": "This research publication titled \"A Methodical Examination in the Pursuit of Big Data Analytics in Digital Media Broadcasting\" was authored by Dr. V.Dhanakoti and published in \"International Journal of New Innovations in Engineering and Technology\". It contributes to the field of Data Engineering by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_255",
    "title": "Prediction of seed price using machine Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "International Journal of Innovative Research Technology",
    "issn": "Volume 11, Issue 12",
    "year": 2025,
    "contributors": "Dr. A.Samydurai",
    "mentors": "Dr. A.Samydurai",
    "abstract": "This research publication titled \"Prediction of seed price using machine Learning\" was authored by Dr. A.Samydurai and published in \"International Journal of Innovative Research Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_256",
    "title": "Blockchain Based Loan Management System using Smart Contracts",
    "type": "conference",
    "category": "AI & ML",
    "journal": "Proceeding of 13th International Conference on Contemporary E, gineering and Technology",
    "issn": "ISBN :978-81-985365-9-4",
    "year": 2024,
    "contributors": "Dr. A.Samydurai, UG Students(7th Sem):, Aswath.M, Jaikanht. R",
    "mentors": "Dr. A.Samydurai",
    "abstract": "This research publication titled \"Blockchain Based Loan Management System using Smart Contracts\" was authored by Dr. A.Samydurai, UG Students(7th Sem):, Aswath.M, Jaikanht. R and published in \"Proceeding of 13th International Conference on Contemporary E, gineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_257",
    "title": "Revolutionizing Intrusion Detection In, Industrial Iot With Deep Generative, , Techniques",
    "type": "conference",
    "category": "AI & ML",
    "journal": "International Conference on Recent Innovations in Science,, Engineering and Technology - Icriset  2024",
    "issn": "ISBN Number : 978-81-972699-5-0",
    "year": 2024,
    "contributors": "Mrs. M. Mohanapriya",
    "mentors": null,
    "abstract": "This research publication titled \"Revolutionizing Intrusion Detection In, Industrial Iot With Deep Generative, , Techniques\" was authored by Mrs. M. Mohanapriya and published in \"International Conference on Recent Innovations in Science,, Engineering and Technology - Icriset  2024\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_258",
    "title": "Next Generation Embedded systems with synergies VLSI with DeepLearning:Design Methodologies,optimization Techniques and Real world Applications",
    "type": "conference",
    "category": "AI & ML",
    "journal": "IEEE Conference",
    "issn": "ISBN:979-8-3315-2983-3",
    "year": 2025,
    "contributors": "Mrs. M. Mohanapriya",
    "mentors": null,
    "abstract": "This research publication titled \"Next Generation Embedded systems with synergies VLSI with DeepLearning:Design Methodologies,optimization Techniques and Real world Applications\" was authored by Mrs. M. Mohanapriya and published in \"IEEE Conference\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_259",
    "title": "Artificial Intelligence based Real smart phishing detection and defence system",
    "type": "conference",
    "category": "AI & ML",
    "journal": "13th International conference on contemporary, Engineering and Technology",
    "issn": "N/A",
    "year": 2025,
    "contributors": "Ms.V.Vijaypriya",
    "mentors": null,
    "abstract": "This research publication titled \"Artificial Intelligence based Real smart phishing detection and defence system\" was authored by Ms.V.Vijaypriya and published in \"13th International conference on contemporary, Engineering and Technology\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_260",
    "title": "Efficient vehicle detection in aerial imagery from unmanned, air vehicles (UAVs) through computer vision techniques",
    "type": "journal",
    "category": "AI & ML",
    "journal": "AIP Publishing",
    "issn": "978-0-7354-5202-2, Proc. 3306, 050017-1050017-8;",
    "year": 2025,
    "contributors": "Dr.C. Pabitha, Dr.G. Sangeetha , Dr. B. Vanathi",
    "mentors": "Dr.C. Pabitha, Dr.G. Sangeetha, Dr. B. Vanathi",
    "abstract": "This research publication titled \"Efficient vehicle detection in aerial imagery from unmanned, air vehicles (UAVs) through computer vision techniques\" was authored by Dr.C. Pabitha, Dr.G. Sangeetha , Dr. B. Vanathi and published in \"AIP Publishing\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_261",
    "title": "Neural Based Drug Target Prediction",
    "type": "conference",
    "category": "AI & ML",
    "journal": "National Conference on Recent Trends in Computational Intelligence",
    "issn": "NCRTCI 24/ 12",
    "year": 2024,
    "contributors": "Anbuvizhi R",
    "mentors": null,
    "abstract": "This research publication titled \"Neural Based Drug Target Prediction\" was authored by Anbuvizhi R and published in \"National Conference on Recent Trends in Computational Intelligence\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_262",
    "title": "\"Game Theory-based Resource Allocation in Edge Environment\"",
    "type": "conference",
    "category": "Cloud & DevOps",
    "journal": "11th International Conference on Mathematics and Computing, organized by IIT Bhilai from January 09-11, 2025.",
    "issn": "Volume 2",
    "year": 2025,
    "contributors": "M.Sophiya Sugantha Grace (1st author)",
    "mentors": null,
    "abstract": "This research publication titled \"\"Game Theory-based Resource Allocation in Edge Environment\"\" was authored by M.Sophiya Sugantha Grace (1st author) and published in \"11th International Conference on Mathematics and Computing, organized by IIT Bhilai from January 09-11, 2025.\". It contributes to the field of Cloud & DevOps by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_263",
    "title": "Smart Voice Assistant for the visually impaired : Advancing Accessabilty through deep learning on Mobile Platform",
    "type": "conference",
    "category": "AI & ML",
    "journal": "ICCET 2025,13th International Conference on Contemporary Engineering and Technology,organized by Prince Shri Venkateshwara Padmavathy Engineering College, Chennai.",
    "issn": "535/March/2025/ISBN 978-81-985365-9-4",
    "year": 2025,
    "contributors": "M.Sophiya Sugantha Grace (2nd author)",
    "mentors": null,
    "abstract": "This research publication titled \"Smart Voice Assistant for the visually impaired : Advancing Accessabilty through deep learning on Mobile Platform\" was authored by M.Sophiya Sugantha Grace (2nd author) and published in \"ICCET 2025,13th International Conference on Contemporary Engineering and Technology,organized by Prince Shri Venkateshwara Padmavathy Engineering College, Chennai.\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_264",
    "title": "Mental Health Assistance and Early Detection of Alzheimer and Parkinson diseases using Deep Learning",
    "type": "conference",
    "category": "AI & ML",
    "journal": "The International Conference on Computer Engineering, Network and Intelligent Multimedia (CENIM) CENIM 2024, November 19th  20th, 2024 Surabaya, Indonesia",
    "issn": "DOI.No.979-8-3503-6880-2/24/$31.00 ©2024 IEEE",
    "year": 2024,
    "contributors": "Dr B Muthusenthil, Dr V Dhanakoti, P Jeyakani and B Aditya Bharathi",
    "mentors": null,
    "abstract": "This research publication titled \"Mental Health Assistance and Early Detection of Alzheimer and Parkinson diseases using Deep Learning\" was authored by Dr B Muthusenthil, Dr V Dhanakoti, P Jeyakani and B Aditya Bharathi and published in \"The International Conference on Computer Engineering, Network and Intelligent Multimedia (CENIM) CENIM 2024, November 19th  20th, 2024 Surabaya, Indonesia\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_265",
    "title": "Enhancing Network Security using Hybrid Machine Learning Techniques",
    "type": "conference",
    "category": "AI & ML",
    "journal": "International Conference on Advances in Computing, Communication and Applied Informatics (ACCAI)",
    "issn": "DOI.No.10.1109/ACCAI61061.2024.10601791, , ieee",
    "year": 2024,
    "contributors": "P. Sirenjeevi and V. Dhanakoti",
    "mentors": null,
    "abstract": "This research publication titled \"Enhancing Network Security using Hybrid Machine Learning Techniques\" was authored by P. Sirenjeevi and V. Dhanakoti and published in \"International Conference on Advances in Computing, Communication and Applied Informatics (ACCAI)\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_266",
    "title": "Deep learning approaches for structuring, Clinical data: a comprehensive review",
    "type": "conference",
    "category": "AI & ML",
    "journal": "International Conference on Sustainable AI Innovations in Biotechnology andHealthcare",
    "issn": "N/A",
    "year": 2025,
    "contributors": "B.Vanathi",
    "mentors": null,
    "abstract": "This research publication titled \"Deep learning approaches for structuring, Clinical data: a comprehensive review\" was authored by B.Vanathi and published in \"International Conference on Sustainable AI Innovations in Biotechnology andHealthcare\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_267",
    "title": "Artificial Intelligence in Cybersecurity:Revolutionizing Threat Detection and Defence",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Imaginex Inks Publication",
    "issn": "ISBN:978-81-982083-0-9",
    "year": 2024,
    "contributors": "Ms.R.Gayathri",
    "mentors": null,
    "abstract": "This research publication titled \"Artificial Intelligence in Cybersecurity:Revolutionizing Threat Detection and Defence\" was authored by Ms.R.Gayathri and published in \"Imaginex Inks Publication\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_268",
    "title": "Pulse rate and hypertension diagnosis using optimization approach",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Hybrid and Advanced Technologies, ISBN 978-1-032-90254-8, Open Access: TAYLOR & FRANCIS",
    "issn": "DOI: 10.1201/9781003559115-47, pp 278 - 283",
    "year": 2024,
    "contributors": "C. Pabitha (first author)",
    "mentors": null,
    "abstract": "This research publication titled \"Pulse rate and hypertension diagnosis using optimization approach\" was authored by C. Pabitha (first author) and published in \"Hybrid and Advanced Technologies, ISBN 978-1-032-90254-8, Open Access: TAYLOR & FRANCIS\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1201/9781003559115-47",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_269",
    "title": "Development of robotic sensor nodes in wireless sensor networks using embedded systems and machine learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Hybrid and Advanced Technologies, ISBN 978-1-032-90254-8, Open Access: TAYLOR & FRANCIS",
    "issn": "DOI: 10.1201/9781003559139-76 pp 513 -518",
    "year": 2024,
    "contributors": "C. Pabitha (first author)",
    "mentors": null,
    "abstract": "This research publication titled \"Development of robotic sensor nodes in wireless sensor networks using embedded systems and machine learning\" was authored by C. Pabitha (first author) and published in \"Hybrid and Advanced Technologies, ISBN 978-1-032-90254-8, Open Access: TAYLOR & FRANCIS\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1201/9781003559139-76",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_270",
    "title": "Dual-stage deep learning: A new approach to enhancing, species-specific plant disease detection",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Hybrid and Advanced Technologies, ISBN 978-1-032-90254-8, Open Access: TAYLOR & FRANCIS",
    "issn": "DOI: 10.1201/9781003559115-11 , pp 60 - 65",
    "year": 2024,
    "contributors": "C. Pabitha (First author)",
    "mentors": null,
    "abstract": "This research publication titled \"Dual-stage deep learning: A new approach to enhancing, species-specific plant disease detection\" was authored by C. Pabitha (First author) and published in \"Hybrid and Advanced Technologies, ISBN 978-1-032-90254-8, Open Access: TAYLOR & FRANCIS\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1201/9781003559115-11",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_271",
    "title": "Enhancing pepper growth and yield through disease identification in plants using leaf-based deep learning techniques",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Hybrid and Advanced Technologies, ISBN 978-1-032-90254-8, Open Access: TAYLOR & FRANCIS",
    "issn": "DOI: 10.1201/9781003559115-10 , pp 54-59",
    "year": 2024,
    "contributors": "C. Pabitha(Second author)",
    "mentors": null,
    "abstract": "This research publication titled \"Enhancing pepper growth and yield through disease identification in plants using leaf-based deep learning techniques\" was authored by C. Pabitha(Second author) and published in \"Hybrid and Advanced Technologies, ISBN 978-1-032-90254-8, Open Access: TAYLOR & FRANCIS\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1201/9781003559115-10",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_272",
    "title": "Weapon detection in armed forces for security purposes using artificial intelligence through fuzzy logic system",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Hybrid and Advanced Technologies, ISBN 978-1-032-90254-8, Open Access: TAYLOR & FRANCIS",
    "issn": "DOI: 10.1201/9781003559139-102, pp 685 - 690",
    "year": 2024,
    "contributors": "C. Pabitha (First author)",
    "mentors": null,
    "abstract": "This research publication titled \"Weapon detection in armed forces for security purposes using artificial intelligence through fuzzy logic system\" was authored by C. Pabitha (First author) and published in \"Hybrid and Advanced Technologies, ISBN 978-1-032-90254-8, Open Access: TAYLOR & FRANCIS\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": "https://doi.org/10.1201/9781003559139-102,",
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_273",
    "title": "Artificial Intelligence and Machine Learning",
    "type": "journal",
    "category": "AI & ML",
    "journal": "ISBN 978-81-980462-0-8",
    "issn": "Deccan International Academic Publisher",
    "year": 2024,
    "contributors": "Dr.C.Pabitha, Dr.B.Vanathi, Dr.G.Sangeetha, Dr.K.Shanmugam",
    "mentors": "Dr.C.Pabitha, Dr.B.Vanathi, Dr.G.Sangeetha, Dr.K.Shanmugam",
    "abstract": "This research publication titled \"Artificial Intelligence and Machine Learning\" was authored by Dr.C.Pabitha, Dr.B.Vanathi, Dr.G.Sangeetha, Dr.K.Shanmugam and published in \"ISBN 978-81-980462-0-8\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_274",
    "title": "Sustainable Business Models for Smart City Using Artificial Intelligence Techniques",
    "type": "journal",
    "category": "AI & ML",
    "journal": "Published in the United States of America by IGI Global",
    "issn": "N/A",
    "year": 2024,
    "contributors": "M Mayuranathan,, Garima Nahar,A Vijayakumar",
    "mentors": null,
    "abstract": "This research publication titled \"Sustainable Business Models for Smart City Using Artificial Intelligence Techniques\" was authored by M Mayuranathan,, Garima Nahar,A Vijayakumar and published in \"Published in the United States of America by IGI Global\". It contributes to the field of AI & ML by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  },
  {
    "id": "pub_imported_275",
    "title": "Foundations of Data Science",
    "type": "journal",
    "category": "Data Engineering",
    "journal": "CHARULATHA PUBLICATIONS",
    "issn": "ISBN No. : 978-93-6260-314-2",
    "year": 2025,
    "contributors": "Dr. G. Kumaresan , Dr. G. Sangeetha Ms.S.Shanthi",
    "mentors": "Dr. G. Kumaresan, Dr. G. Sangeetha Ms.S.Shanthi",
    "abstract": "This research publication titled \"Foundations of Data Science\" was authored by Dr. G. Kumaresan , Dr. G. Sangeetha Ms.S.Shanthi and published in \"CHARULATHA PUBLICATIONS\". It contributes to the field of Data Engineering by exploring advanced methodologies, analysis, and implementations in modern computer science and engineering.",
    "url": null,
    "authorName": "Sys Admin",
    "authorRole": "faculty_admin",
    "createdAt": "2026-08-29T18:47:19.609Z"
  }
]

  function init() {
    // Always seed from the latest embedded data so stale browser caches are replaced
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PUBLICATIONS));
  }

  function getPublications() {
    init();
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      return list.sort((a, b) => {
        // 1. Year (descending)
        if (b.year !== a.year) {
          return b.year - a.year;
        }
        // 2. Staff Name / Contributors (ascending)
        const nameA = (a.contributors || '').toLowerCase();
        const nameB = (b.contributors || '').toLowerCase();
        const nameCompare = nameA.localeCompare(nameB);
        if (nameCompare !== 0) return nameCompare;
        // 3. Topics / Category (ascending)
        const catA = (a.category || '').toLowerCase();
        const catB = (b.category || '').toLowerCase();
        return catA.localeCompare(catB);
      });
    } catch {
      return [];
    }
  }

  function savePublications(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  // Sync with Supabase table 'publications' if available
  async function fetchAsync() {
    // Wait up to 2s for supabase.js module to set window.supabase
    let attempts = 0;
    while (!window.supabase && attempts < 20) {
      await new Promise(r => setTimeout(r, 100));
      attempts++;
    }

    if (window.supabase) {
      try {
        const { data, error } = await window.supabase
          .from('publications')
          .select('*')
          .order('year', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(item => ({
            id: item.id,
            title: item.title,
            type: item.type,
            category: item.category,
            journal: item.journal_name,
            issn: item.issn_isbn,
            year: item.year,
            contributors: item.contributors,
            mentors: item.mentors || '',
            abstract: item.abstract,
            url: item.url || '',
            authorName: item.author_name,
            authorId: item.author_id,
            authorRole: item.author_role,
            createdAt: item.created_at
          }));
          mapped.sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year;
            const nameA = (a.contributors || '').toLowerCase();
            const nameB = (b.contributors || '').toLowerCase();
            const nameCompare = nameA.localeCompare(nameB);
            if (nameCompare !== 0) return nameCompare;
            return (a.category || '').toLowerCase().localeCompare((b.category || '').toLowerCase());
          });
          savePublications(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase publications fetch skipped/failed, using cache:', err);
      }
    }
    return getPublications();
  }

  async function createPublication(item) {
    const items = getPublications();
    const newPub = {
      id: 'pub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      title: item.title.trim(),
      type: item.type,
      category: item.category,
      journal: item.journal.trim(),
      issn: item.issn.trim(),
      year: parseInt(item.year),
      contributors: item.contributors.trim(),
      mentors: (item.mentors || '').trim(),
      abstract: item.abstract.trim(),
      url: (item.url || '').trim(),
      authorName: item.authorName || 'Guest User',
      authorId: item.authorId || 'anonymous',
      authorRole: item.authorRole || 'student',
      createdAt: new Date().toISOString()
    };

    items.unshift(newPub);
    savePublications(items);

    // Try syncing to Supabase
    if (window.supabase && item.authorId && item.authorId !== 'anonymous') {
      try {
        await window.supabase
          .from('publications')
          .insert([{
            title: newPub.title,
            type: newPub.type,
            category: newPub.category,
            journal_name: newPub.journal,
            issn_isbn: newPub.issn,
            year: newPub.year,
            contributors: newPub.contributors,
            mentors: newPub.mentors || null,
            abstract: newPub.abstract,
            url: newPub.url || null,
            author_name: newPub.authorName,
            author_id: newPub.authorId,
            author_role: newPub.authorRole
          }]);
      } catch (err) {
        console.warn('Supabase publications insert skipped/failed:', err);
      }
    }

    return newPub;
  }

  return {
    getPublications,
    fetchAsync,
    createPublication
  };
})();

// DOM Interactions and Renderers
document.addEventListener('DOMContentLoaded', () => {
  // Set up login prompt visibility
  checkAuthAndSession();

  // Form type changer to customize labels dynamically
  const formType = document.getElementById('formType');
  if (formType) {
    formType.addEventListener('change', (e) => {
      const type = e.target.value;
      const journalLabel = document.getElementById('journalLabel');
      const issnLabel = document.getElementById('issnLabel');
      const formJournal = document.getElementById('formJournal');
      const formIssn = document.getElementById('formIssn');
      
      if (type === 'patent') {
        journalLabel.textContent = 'Patent Office / Authority Name *';
        formJournal.placeholder = 'e.g. United States Patent and Trademark Office (USPTO) or IPO';
        issnLabel.textContent = 'Patent Registration or Application Number *';
        formIssn.placeholder = 'e.g. Patent No: US-11928372-B2';
      } else {
        journalLabel.textContent = 'Journal / Conference Name *';
        formJournal.placeholder = 'e.g. IEEE Access or Springer Journal';
        issnLabel.textContent = 'ISSN / ISBN Number *';
        formIssn.placeholder = 'e.g. ISSN: 2169-3536';
      }
    });
  }

  // Modal Open/Close Event Listeners
  const openModalBtn = document.getElementById('openSubmitModalBtn');
  const submitModal = document.getElementById('submitModal');
  const closeModalBtn = document.getElementById('closeSubmitModal');
  const cancelBtn = document.getElementById('cancelSubmit');

  if (openModalBtn && submitModal) {
    openModalBtn.addEventListener('click', () => {
      submitModal.classList.add('open');
      // Autofill Year
      document.getElementById('formYear').value = new Date().getFullYear();
    });
  }

  const hideModal = () => {
    if (submitModal) submitModal.classList.remove('open');
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
  if (cancelBtn) cancelBtn.addEventListener('click', hideModal);

  // Filter Bindings
  const searchInput = document.getElementById('pubSearchInput');
  const typeSelect = document.getElementById('typeSelect');
  const topicPills = document.getElementById('topicPills');
  const yearPills = document.getElementById('yearPills');

  let activeTopic = 'all';
  let activeYear = 'all';

  // Initial render from seed data so page isn't blank
  renderPublications();
  // Fetch from Supabase in background (waits for window.supabase to be ready), then re-render with live data
  PubDB.fetchAsync().then(() => renderPublications());

  if (searchInput) searchInput.addEventListener('input', renderPublications);
  if (typeSelect) typeSelect.addEventListener('change', renderPublications);

  if (topicPills) {
    topicPills.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      topicPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      activeTopic = btn.dataset.topic;
      renderPublications();
    });
  }

  if (yearPills) {
    yearPills.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      yearPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active-gold'));
      btn.classList.add('active-gold');
      activeYear = btn.dataset.year;
      renderPublications();
    });
  }

  // Handle Form Submission
  const submitForm = document.getElementById('pubSubmitForm');
  if (submitForm) {
    submitForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const user = window.Auth ? window.Auth.currentUser() : null;
      
      const newPubData = {
        title: document.getElementById('formTitle').value,
        type: document.getElementById('formType').value,
        category: document.getElementById('formCategory').value,
        journal: document.getElementById('formJournal').value,
        issn: document.getElementById('formIssn').value,
        year: document.getElementById('formYear').value,
        url: document.getElementById('formUrl').value,
        contributors: document.getElementById('formContributors').value,
        mentors: document.getElementById('formMentors').value,
        abstract: document.getElementById('formAbstract').value,
        authorName: user ? user.name : 'Guest Scholar',
        authorId: user ? (user.id || user.userId) : 'anonymous',
        authorRole: user ? user.role : 'student'
      };

      await PubDB.createPublication(newPubData);
      submitForm.reset();
      hideModal();
      renderPublications();
    });
  }

  // Dynamic Publications Grid Render Function
  function renderPublications() {
    const list = PubDB.getPublications();
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const selectedType = typeSelect ? typeSelect.value : 'all';

    // Filters
    const filtered = list.filter(pub => {
      // Search matching
      const matchesSearch = 
        pub.title.toLowerCase().includes(query) ||
        pub.contributors.toLowerCase().includes(query) ||
        pub.journal.toLowerCase().includes(query) ||
        pub.issn.toLowerCase().includes(query) ||
        (pub.mentors && pub.mentors.toLowerCase().includes(query));

      // Type matching
      const matchesType = selectedType === 'all' || pub.type === selectedType;

      // Topic matching
      const matchesTopic = activeTopic === 'all' || pub.category === activeTopic;

      // Year matching
      let matchesYear = true;
      if (activeYear !== 'all') {
        if (activeYear === 'before-2024') {
          matchesYear = pub.year < 2024;
        } else {
          matchesYear = pub.year === parseInt(activeYear);
        }
      }

      return matchesSearch && matchesType && matchesTopic && matchesYear;
    });

    const grid = document.getElementById('publicationsGrid');
    if (!grid) return;

    // Update Stats Card Live
    updateStats(list);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-publications">
          <i class="fa-solid fa-file-circle-question"></i>
          <h3>No Publications Found</h3>
          <p>We couldn't find any papers matching your selected year, topic, or search terms. Try modifying your filters!</p>
        </div>`;
      return;
    }

    const isLoggedIn = !!(window.Auth && window.Auth.currentUser());

    grid.innerHTML = filtered.map(pub => {
      // Map icons to types
      let typeIcon = 'fa-file-invoice';
      let typeLabel = 'Publication';
      if (pub.type === 'journal') { typeIcon = 'fa-file-lines'; typeLabel = 'Journal'; }
      else if (pub.type === 'patent') { typeIcon = 'fa-award'; typeLabel = 'Patent'; }
      else if (pub.type === 'conference') { typeIcon = 'fa-users-rectangle'; typeLabel = 'Conference Paper'; }
      else if (pub.type === 'book_chapter') { typeIcon = 'fa-book-open'; typeLabel = 'Book Chapter'; }

      // Extra external links
      const linkHtml = pub.url 
        ? `<a href="${pub.url}" target="_blank" class="btn-link-action" onclick="event.stopPropagation();"><i class="fa-solid fa-arrow-up-right-from-square"></i> Read Full Text</a>`
        : `<span style="font-size:0.8rem;color:#94a3b8;font-weight:600;"><i class="fa-solid fa-circle-info"></i> Abstract View Only</span>`;

      const guideHtml = pub.mentors 
        ? `<div class="pub-meta-item"><i class="fa-solid fa-chalkboard-user"></i> Guided by: <strong style="color:#1e293b;">${pub.mentors}</strong></div>`
        : '';

      const detailJournalLabel = pub.type === 'patent' ? 'Patent Office / Authority' : 'Journal / Conference';
      const detailNumberLabel = pub.type === 'patent' ? 'Patent / Registration No.' : 'ISSN / ISBN Index';

      // Restrict details drawer contents for guest users
      const detailsDrawerContent = isLoggedIn ? `
        <div class="details-grid">
          <div class="details-cell">
            <div class="details-cell-label">${detailJournalLabel}</div>
            <div class="details-cell-value">${pub.journal}</div>
          </div>
          <div class="details-cell">
            <div class="details-cell-label">${detailNumberLabel}</div>
            <div class="details-cell-value">${pub.issn}</div>
          </div>
        </div>

        <div class="abstract-box">
          <h4>Abstract Summary</h4>
          <p>${pub.abstract}</p>
        </div>

        <div class="pub-card-actions">
          ${linkHtml}
          <span style="font-size:0.75rem;color:#94a3b8;font-weight:500;">Submitted by: ${pub.authorName} (${pub.authorRole})</span>
        </div>
      ` : `
        <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 1.5rem; text-align: center; margin-bottom: 0.5rem; cursor: default;" onclick="event.stopPropagation();">
          <i class="fa-solid fa-lock" style="font-size: 1.8rem; color: #94a3b8; margin-bottom: 0.75rem; display: block;"></i>
          <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; color: var(--primary-navy); margin-bottom: 0.35rem; font-weight: 700;">Access Restricted to CSE Members</h4>
          <p style="font-size: 0.85rem; color: #64748b; max-width: 420px; margin: 0 auto 1.25rem auto; line-height: 1.5;">
            To read the full abstract, indexing codes, contributors guides, and access official DOI full-text links, please sign in with your student or faculty account.
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <a href="student-corner.html" class="btn btn-blue btn-sm" style="padding: 0.5rem 1.2rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.35rem; text-decoration: none;"><i class="fa-solid fa-user-graduate"></i> Student Login</a>
            <a href="teachers-corner.html" class="btn btn-primary btn-sm" style="background: var(--primary-navy); border-color: var(--primary-navy); padding: 0.5rem 1.2rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.35rem; text-decoration: none;"><i class="fa-solid fa-chalkboard-user"></i> Faculty Login</a>
          </div>
        </div>
      `;

      const expandIndicatorText = isLoggedIn ? 'View Details' : '🔒 Read Full Paper';

      return `
        <div class="pub-card type-${pub.type}" data-id="${pub.id}" onclick="toggleCard(this)">
          <div class="pub-card-header">
            <div class="pub-badges">
              <span class="badge badge-${pub.type}"><i class="fa-solid ${typeIcon}"></i> ${typeLabel}</span>
              <span class="badge badge-topic">${pub.category}</span>
            </div>
            <span class="pub-year">${pub.year}</span>
          </div>

          <h3 class="pub-title">${pub.title}</h3>

          <div class="pub-meta-line">
            <div class="pub-meta-item">
              <i class="fa-solid fa-user-pen"></i> Authors: <span class="pub-contributors">${pub.contributors}</span>
            </div>
            ${guideHtml}
          </div>

          <!-- Animated Expanded Content Drawer -->
          <div class="pub-details-drawer">
            ${detailsDrawerContent}
          </div>

          <div style="display:flex;justify-content:flex-end;margin-top:0.25rem;">
            <span class="expand-indicator">
              <span>${expandIndicatorText}</span>
              <i class="fa-solid fa-chevron-down"></i>
            </span>
          </div>

        </div>`;
    }).join('');
  }

  // Update metrics dashboard counters dynamically
  function updateStats(items) {
    const total = items.length;
    const patents = items.filter(i => i.type === 'patent').length;
    const journals = items.filter(i => i.type !== 'patent').length;
    
    // Guided counts include any papers guides list or guide guides are listed
    const guided = items.filter(i => i.mentors && i.mentors.trim().length > 0).length;

    document.getElementById('statsTotal').textContent = total;
    document.getElementById('statsPatents').textContent = patents;
    document.getElementById('statsJournals').textContent = journals;
    document.getElementById('statsFaculty').textContent = guided;
  }

  // Authenticated checks
  function checkAuthAndSession() {
    const user = window.Auth ? window.Auth.currentUser() : null;
    const authBanner = document.getElementById('authBannerPrompt');
    const userActiveBanner = document.getElementById('userActivePrompt');
    const loggedUserName = document.getElementById('loggedUserName');

    if (user) {
      if (authBanner) authBanner.style.display = 'none';
      if (userActiveBanner) userActiveBanner.style.display = 'flex';
      if (loggedUserName) loggedUserName.textContent = user.name + ` (${user.role})`;
    } else {
      if (authBanner) authBanner.style.display = 'flex';
      if (userActiveBanner) userActiveBanner.style.display = 'none';
    }
  }
});

// Card Toggle Global Function
window.toggleCard = (cardElement) => {
  const isExpanded = cardElement.classList.contains('expanded');
  const isLoggedIn = !!(window.Auth && window.Auth.currentUser());
  const defaultText = isLoggedIn ? 'View Details' : '🔒 Read Full Paper';
  const activeText = isLoggedIn ? 'Collapse Details' : 'Collapse Drawer';

  // Collapse all other cards first for clean tech dashboard accordion view
  document.querySelectorAll('.pub-card').forEach(c => {
    c.classList.remove('expanded');
    const ind = c.querySelector('.expand-indicator span');
    if (ind) {
      ind.textContent = defaultText;
    }
  });

  if (!isExpanded) {
    cardElement.classList.add('expanded');
    const ind = cardElement.querySelector('.expand-indicator span');
    if (ind) ind.textContent = activeText;
  }
};
