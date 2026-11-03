# CIC-311: Student Record Manager

**Design and Analysis of Algorithms (CIC-311) — Mini Project**  
Department of Computer Science & Engineering  
Dr. Akhilesh Das Gupta Institute of Professional Studies (ADGIPS), New Delhi  
Guru Gobind Singh Indraprastha University (GGSIPU)

---

## Academic Credentials

* **Project Supervisor:** Prof. (Dr.) Pinky Nayak
* **Submitted By (CSE – T3):**
  * **Nitesh Agarwal** (Enrollment No: 14715602724)
  * **Himanshu Pathak** (Enrollment No: 14815602724)
  * **Shivag Shukla** (Enrollment No: 14915602724)
* **Academic Session:** 2024–2028 (Third Semester)

---

## Core Algorithms Implemented

1. **Dynamic Singly Linked List (Memory Allocation):**
   * Implements dynamic node allocation for student records in heap memory.
   * Node insertion in O(1) time and sequential node traversal in O(n) time.

2. **Divide-and-Conquer Merge Sort ($O(n \log n)$):**
   * Stable recursive sorting mechanism applied to student aggregate scores and roll numbers.
   * Guarantees worst-case $O(n \log n)$ time complexity across all input distributions.

3. **Binary Search ($O(\log n)$):**
   * Logarithmic search space halving for roll number lookups over sorted contiguous arrays.
   * Reduces comparisons from 20 (worst-case linear scan) to at most 5 checks.

4. **Academic Performance Analytics:**
   * Dynamic visual bar charts mapping top 5 student performers against the batch mean line ($83.2\%$).
   * Departmental comparative analytics across Computer Science, IT, Electronics, Mechanical, and Civil Engineering.
   * Grade frequency distribution across distinction and division bands.

---

## Technology Stack

* **Frontend:** React 18, TypeScript, Tailwind CSS, Radix UI, Recharts, Lucide Icons, Wouter Routing
* **Backend:** Node.js v22, Express.js, TypeScript, In-Memory SQLite Engine
* **Build System:** Vite 5, ESBuild
* **Deployment Platform:** Netlify (with Netlify Serverless Functions)

---

## Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Niteshagarwal01/Student-record-manager.git
   cd Student-record-manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5000` in your web browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## Deployment on Netlify

This project is pre-configured for one-click continuous deployment on Netlify using the included `netlify.toml` and `netlify/functions/api.ts`.

### Steps:
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **Add new site** > **Import an existing project**.
3. Select **GitHub** and authorize access to `Niteshagarwal01/Student-record-manager`.
4. Netlify will automatically detect the build settings from `netlify.toml`:
   * **Build Command:** `npm run build`
   * **Publish Directory:** `dist/public`
   * **Functions Directory:** `netlify/functions`
5. Click **Deploy Site**.
