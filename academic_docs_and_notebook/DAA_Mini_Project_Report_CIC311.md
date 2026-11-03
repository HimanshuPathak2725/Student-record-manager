# DAA Mini Project REPORT
## STUDENT RECORD MANAGER

**Supervisor:** Prof. (Dr.) Pinky Nayak  
**Department:** Department of Computer Science & Engineering  
**Institute:** Dr. Akhilesh Das Gupta Institute of Professional Studies (Formerly ADGITM), FC-26, Shastri Park, New Delhi  
**Affiliated to:** Guru Gobind Singh Indraprastha University (GGSIPU), Sector-16C, Dwarka, Delhi - 110075  
**Academic Batch:** 2024–2028  

**Submitted by:**
1. **Nitesh Agarwal** (Enrollment No: 14715602724, CSE – T3)
2. **Himanshu Pathak** (Enrollment No: 14815602724, CSE – T3)
3. **Shivag Shukla** (Enrollment No: 14915602724, CSE – T3)

---

## DECLARATION

This is to certify that the material embodied in this mini Project titled **“Student Record Manager”** being submitted in the partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in Computer Science & Engineering is based on our original work. It is further certified that this work has not been submitted in full or in part to this university or any other university for the award of any other degree or diploma. Our indebtedness to other works has been duly acknowledged at the relevant places.

| Student Name | Enrollment No | Class & Department |
|---|---|---|
| **Nitesh Agarwal** | 14715602724 | B.Tech CSE – T3 |
| **Himanshu Pathak** | 14815602724 | B.Tech CSE – T3 |
| **Shivag Shukla** | 14915602724 | B.Tech CSE – T3 |

Department of Computer Science & Engineering  
Dr. Akhilesh Das Gupta Institute of Professional Studies (ADGIPS), New Delhi  

---

## ACKNOWLEDGEMENT

We express our deepest sense of gratitude and sincere indebtedness to our respected supervisor, **Prof. (Dr.) Pinky Nayak**, Department of Computer Science & Engineering, for her invaluable guidance, meticulous review, continuous encouragement, and intellectual support throughout the duration of this Design and Analysis of Algorithms (CIC-311) mini project. Her constructive feedback and domain expertise were instrumental in shaping our algorithm formulations, time-complexity derivations, and system implementation.

We also convey our sincere thanks to the Department of Computer Science & Engineering and the visionary administration of **Dr. Akhilesh Das Gupta Institute of Professional Studies (ADGIPS)**, New Delhi, for providing state-of-the-art laboratory infrastructure, computational resources, and a stimulating academic ambience that enabled us to successfully test, analyze, and document this project.

Finally, we wish to express our heartfelt appreciation to our parents, family members, and classmates for their constant moral support, cooperative spirit, and helpful suggestions during the various phases of this project work.

**Nitesh Agarwal (14715602724)**  
**Himanshu Pathak (14815602724)**  
**Shivag Shukla (14915602724)**  
B.Tech CSE – T3  

---

## LIST OF FIGURES

| Figure No. | Figure Title | Page No. |
|---|---|:---:|
| **Figure 1** | Context Diagram (Level 0 Data Flow Diagram) | 4 |
| **Figure 2** | Level 1 Data Flow Diagram (DFD) of Student Record Manager | 5 |
| **Figure 3** | Entity-Relationship (ER) Architecture Diagram | 7 |
| **Figure 4** | Use Case Interaction Diagram of System Operations | 9 |
| **Figure 5** | Singly Linked List Dynamic Memory Architecture & Pointers | 11 |
| **Figure 6** | Merge Sort Divide-and-Conquer Recurrence Tree | 14 |
| **Figure 7** | Binary Search Decision Flowchart ($O(\log n)$) | 16 |
| **Figure 8** | Top 5 Scorers Performance Visualization (Matplotlib) | 21 |
| **Figure 9** | Search Performance Comparison: Binary Search vs Linear Search | 23 |

---

## LIST OF TABLES

| Table No. | Table Title | Page No. |
|---|---|:---:|
| **Table 1.1** | System Requirements & Development Environment | 3 |
| **Table 3.1** | Data Dictionary: Student Entity Attributes | 8 |
| **Table 4.1** | Use Case Specifications Summary | 10 |
| **Table 5.1** | Asymptotic Time and Space Complexity Comparison | 17 |
| **Table 6.1** | Sample Student Callset from CSV Dataset | 19 |
| **Table 7.1** | Empirical Search Comparison: Linear Search vs Binary Search | 24 |
| **Table 7.2** | Comparative Evaluation of Sorting Algorithms | 25 |

---

## TABLE OF CONTENTS

1. [Chapter 1: Problem Statement](#chapter-1-problem-statement)
2. [Chapter 2: Context Diagram & Data Flow Diagrams (DFDs)](#chapter-2-context-diagram--data-flow-diagrams-dfds)
3. [Chapter 3: Entity-Relationship (ER) Modeling & Architecture](#chapter-3-entity-relationship-er-modeling--architecture)
4. [Chapter 4: Use Case Modeling & Specifications](#chapter-4-use-case-modeling--specifications)
5. [Chapter 5: Algorithm Design & Mathematical Analysis](#chapter-5-algorithm-design--mathematical-analysis)
6. [Chapter 6: Implementation Details](#chapter-6-implementation-details)
7. [Chapter 7: Results and Discussions](#chapter-7-results-and-discussions)
8. [Chapter 8: Conclusion & Future Work](#chapter-8-conclusion--future-work)
9. [References](#references)

---

# CHAPTER 1: PROBLEM STATEMENT

### 1.1 Introduction
Modern educational environments require highly responsive, dependable, and computationally sound mechanisms for maintaining student performance archives. Historically, educational institutions relied on physical registers, manual spreadsheets, or basic tabular databases that lacked dynamic memory scaling and required linear scans for record retrieval. As academic institutions expand and student cohorts diversify across numerous departments, relying on antiquated record-keeping leads to severe operational bottlenecks, high time complexity during evaluations, data entry redundancy, and an inability to generate immediate analytical insights. In modern Computer Science and Engineering education, the Student Record Manager represents an ideal paradigm to evaluate foundational principles in Data Structures and Algorithms (DSA), demonstrating how dynamic heap memory structures, divide-and-conquer sorting, and logarithmic binary search can transform academic record administration.

### 1.2 Academic Context and Real-world Motivation
Under the Design and Analysis of Algorithms curriculum (CIC-311), computational efficiency is not merely a theoretical concept, but an engineering mandate. In an operational college registry, records are continually inserted when new students enroll and removed when transfers or graduations occur. Utilizing static array representations imposes rigid capacity boundaries: allocating a massive array wastes heap space, whereas allocating a small array necessitates costly reallocation and element-shifting operations of order $O(n)$. Furthermore, administrative faculty frequently require fast generation of merit rankings and instant retrieval of specific student profiles by their registration roll numbers. Addressing these dual requirements demands a synthesis of linked structures for agile dynamic storage and contiguous sorted indexing for divide-and-conquer searching algorithms.

### 1.3 Problem Definition and Algorithmic Challenges
The problem investigated in this project is formalized as follows: Design and implement an interactive, memory-efficient Student Record Management System capable of executing in Google Colab (Jupyter Notebook) and local Python execution environments, addressing the following architectural challenges:
1. **Dynamic Memory Management**: The storage layer must dynamically instantiate independent node memory without requiring contiguous pre-allocated space, supporting arbitrary insertions and deletions without element reallocation.
2. **Guaranteed $O(n \log n)$ Ranking**: Sorting algorithms must stably organize students by academic marks in descending order without degrading to quadratic $O(n^2)$ performance under worst-case inputs.
3. **Optimal $O(\log n)$ Query Retrieval**: The retrieval engine must eliminate linear scans by providing an exact binary search mechanism over sorted roll numbers, keeping search comparisons strictly bounded by $\lceil \log_2(n + 1) \rceil$.
4. **Automated Data Visualization**: The system must automatically analyze the academic register and generate an intuitive graphical bar chart of top scorers against class benchmarks using Matplotlib.

### 1.4 Objectives and Scope
- To engineer a custom Singly Linked List (SLL) encapsulating `StudentNode` objects with full insertion, deletion, and traversal routines.
- To implement a pure Divide-and-Conquer Merge Sort routine capable of sorting student records dynamically based on either marks (descending) or roll number (ascending).
- To design and evaluate an iterative Binary Search algorithm over roll numbers, reporting quantitative comparison metrics.
- To build an analytical data visualization module highlighting the top 5 academic achievers and plotting the cohort average.
- To provide dual execution capability: a zero-dependency Google Colab notebook and a standalone modular Python script.

### 1.5 System Inputs, Processes, and Expected Outputs
- **Inputs**: Unique Student Roll Number (integer primary key), Student Full Name (string), Academic Department (string), and Academic Marks (float in the range [0.0, 100.0]). Data can be inputted interactively via terminal prompts or batch-loaded from standardized CSV files.
- **Computational Processes**: Dynamic heap node instantiation, pointer rewiring for insertions/deletions, recursive sublist bisection, linear merging with stability preservation, iterative binary division of search windows, and Matplotlib figure rendering.
- **Expected Outputs**: Well-formatted tabular console reports, real-time search verification logs reporting exact comparison counts, sorted rank registers, and publication-ready PNG bar chart graphics.

#### Table 1.1: System Requirements and Development Environment
| Specification Category | Details |
|---|---|
| **Hardware Requirements** | Intel Core i3/i5/i7 or AMD Ryzen, Minimum 4 GB RAM, 500 MB Free Storage |
| **Operating System** | Cross-Platform: Windows 10/11, Ubuntu Linux, macOS, or Google Colab Cloud |
| **Programming Language** | Python 3.10+ (Standard Library: `csv`, `typing`, `math`, `unittest`) |
| **Visualization Library** | Matplotlib 3.8+ (`pyplot` backend) |
| **Core Data Structure** | Custom Singly Linked List (SLL) via `StudentNode` and `StudentLinkedList` |
| **Primary Algorithms** | Merge Sort ($O(n \log n)$) and Binary Search ($O(\log n)$) |

---

# CHAPTER 2: CONTEXT DIAGRAM & DATA FLOW DIAGRAMS (DFD)

### 2.1 Context Diagram (Level 0 DFD)
The Context Diagram (Level 0 DFD) views the entire Student Record Manager as a single unified process (Process 0.0) interacting with external entities: the Academic User (faculty, student, or lab examiner) and the Output Visualization Engine (Matplotlib runtime). The user dispatches student records, deletion targets, and search queries into Process 0.0. In return, the system generates validated tabular displays, search telemetry (record details and comparison counts), and rendered graphical bar charts.

![Figure 1: Context Diagram](report_figures/fig1_context_diagram.png)  
*Figure 1: Context Diagram (Level 0 Data Flow Diagram)*

### 2.2 Level 1 Data Flow Diagram (DFD)
The Level 1 Data Flow Diagram decomposes Process 0.0 into five interconnected functional sub-processes:
- **Process 1.0 (Record Input & Validation)**: Validates incoming student attributes (ensuring valid marks range and unique roll numbers).
- **Process 2.0 (Linked List Management)**: Instantiates `StudentNode` structures, binds `next` pointers, and interfaces with in-memory heap storage (Data Store D1).
- **Process 3.0 (Merge Sort Engine)**: Exports node references into an indexable array and executes divide-and-conquer sorting based on specified keys (marks or roll number).
- **Process 4.0 (Binary Search Engine)**: Receives roll-sorted records, applies iterative bisection, and returns found node data along with comparison metrics.
- **Process 5.0 (Performance Visualization)**: Extracts the top 5 records from marks-sorted arrays and renders a publication-ready Matplotlib plot.

![Figure 2: Level 1 DFD](report_figures/fig2_level1_dfd.png)  
*Figure 2: Level 1 Data Flow Diagram (DFD) of Student Record Manager*

---

# CHAPTER 3: ER MODELING & DATA ARCHITECTURE

### 3.1 ER Model Description
The system models two core entities: `STUDENT` and `DEPARTMENT`. The primary entity is `STUDENT`, uniquely identified by the `roll_no` primary key attribute, containing composite attributes including student name, academic marks, and an internal next pointer reference. The secondary entity is `DEPARTMENT`, characterized by `dept_code` and `dept_name`. The relationship between them is `ENROLLED_IN`, maintaining an $N:1$ cardinality.

![Figure 3: ER Diagram](report_figures/fig3_er_diagram.png)  
*Figure 3: Entity-Relationship (ER) Architecture Diagram*

#### Table 3.1: Data Dictionary: Student Entity Attributes
| Attribute | Data Type | Constraint | Functional Description |
|---|---|---|---|
| `roll_no` | Integer | Primary Key (Unique) | Unique academic registration identifier (e.g., 101, 102) |
| `name` | String | Not Null, Max 50 char | Full legal name of the enrolled student |
| `department` | String | Not Null, Alpha | Branch of study (Computer, IT, Electronics, Mechanical, Civil) |
| `marks` | Float | Range: 0.0 to 100.0 | Aggregate academic score obtained by the student |

### 3.2 Singly Linked List Data Structure & Memory Allocation
Each `StudentNode` instance stores its own payload along with an explicit reference to the subsequent node. Insertion at the head is $O(1)$, and deletion requires merely updating the predecessor's next pointer without moving elements in memory.

![Figure 5: Linked List Architecture](report_figures/fig5_linked_list_arch.png)  
*Figure 5: Singly Linked List Dynamic Memory Architecture & Pointers*

---

# CHAPTER 4: USE CASE MODELING & SPECIFICATIONS

### 4.1 Use Case Diagram Overview
Six core use cases are identified and modeled, covering data insertion, deletion, traversal, sorting, binary search, and visualization.

![Figure 4: Use Case Diagram](report_figures/fig4_use_case_diagram.png)  
*Figure 4: Use Case Interaction Diagram of System Operations*

#### Table 4.1: Use Case Specifications Summary
| UC ID | Use Case Name | Primary Objective & Postcondition |
|---|---|---|
| **UC-01** | Insert Student Record | Instantiate new `StudentNode` and append to linked list without duplicates. |
| **UC-02** | Delete Student Record | Locate node by `roll_no`, rewire pointer, and decrement list size. |
| **UC-03** | Display All Records | Traverse linked list sequentially from `head` to `NULL` in tabular format. |
| **UC-04** | Sort Records (Merge Sort) | Divide-and-conquer sort by marks (descending) or roll (ascending). |
| **UC-05** | Binary Search by Roll | Execute $O(\log n)$ search on sorted records and report comparison count. |
| **UC-06** | Visualize Top 5 Scorers | Generate Matplotlib bar chart highlighting top marks and class average. |

---

# CHAPTER 5: ALGORITHM DESIGN & MATHEMATICAL ANALYSIS

### 5.1 Merge Sort Algorithm and Recurrence Analysis
Merge Sort recursively decomposes an array of size $n$ into two subarrays of size $\lfloor n/2 \rfloor$ and $\lceil n/2 \rceil$, sorts each half recursively, and combines the two sorted sublists using a linear merge procedure.

![Figure 6: Merge Sort Tree](report_figures/fig6_merge_sort_tree.png)  
*Figure 6: Merge Sort Divide-and-Conquer Recurrence Tree*

#### Recurrence Relation & Master Theorem Proof
$$T(n) = 2T(n/2) + \Theta(n) \quad \text{for } n > 1$$
$$T(1) = \Theta(1)$$

Using the Master Theorem ($a = 2, b = 2, f(n) = \Theta(n)$):
$$\log_b a = \log_2 2 = 1 \implies f(n) = \Theta(n^1) = \Theta(n^{\log_b a})$$
By Case 2 of the Master Theorem:
$$T(n) = \Theta(n^{\log_b a} \log n) = \Theta(n \log n)$$

### 5.2 Binary Search Algorithm and Logarithmic Analysis

![Figure 7: Binary Search Flowchart](report_figures/fig7_binary_search_flowchart.png)  
*Figure 7: Binary Search Decision Flowchart ($O(\log n)$)*

$$T(n) = T(n/2) + \Theta(1) \implies T(n) = \Theta(\log n)$$
Maximum comparisons required: $\lceil \log_2(n + 1) \rceil$. For $n = 1000$ students, Binary Search requires at most 10 comparisons.

#### Table 5.1: Asymptotic Time and Space Complexity Comparison
| Operation / Routine | Best Case | Average Case | Worst Case | Auxiliary Space |
|---|---|---|---|---|
| **SLL Insertion (Append)** | $O(1)$ with tail | $O(n)$ | $O(n)$ | $O(1)$ heap allocation |
| **SLL Deletion by Roll** | $O(1)$ head | $O(n)$ | $O(n)$ | $O(1)$ pointer update |
| **Merge Sort Algorithm** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ auxiliary array |
| **Binary Search (Roll No)** | $O(1)$ midpoint | $O(\log n)$ | $O(\log n)$ | $O(1)$ iterative state |

---

# CHAPTER 6: IMPLEMENTATION DETAILS

### 6.1 Dataset Description (`students_data.csv`)
#### Table 6.1: Sample Student Callset from CSV Dataset
| Roll No | Student Name | Department | Marks |
|---|---|---|---|
| 101 | Aarav Sharma | Computer Science | 94.5 |
| 102 | Diya Patel | Information Technology | 88.0 |
| 104 | Ananya Iyer | Electronics | 91.0 |
| 108 | Pooja Nair | Electronics | 96.0 |
| 111 | Rahul Deshmukh | Mechanical | 89.5 |
| 112 | Tanvi Kulkarni | Computer Science | 98.0 |

---

# CHAPTER 7: RESULTS AND DISCUSSIONS

### 7.1 Visualization Analysis (Top 5 Scorers Bar Chart)
![Figure 8: Top 5 Scorers](report_figures/fig8_top_5_scorers.png)  
*Figure 8: Matplotlib Visualization of Top 5 Scorers*

### 7.2 Empirical Performance Benchmarking: Binary vs Linear Search
![Figure 9: Search Comparisons](report_figures/fig9_search_comparisons.png)  
*Figure 9: Search Performance Comparison: Binary Search vs Linear Search*

#### Table 7.1: Empirical Search Comparison: Linear Search vs Binary Search
| Target Roll No | Target Student | Linear Comps | Binary Comps | Speedup |
|---|---|---|---|---|
| **Roll 101** | Aarav Sharma | 1 | 3 | 0.33x |
| **Roll 106** | Neha Gupta | 6 | 1 | 6.00x |
| **Roll 112** | Tanvi Kulkarni | 12 | 4 | 3.00x |
| **Roll 999** | Not in Dataset | 12 | 4 | 3.00x |

#### Table 7.2: Comparative Evaluation of Sorting Algorithms
| Algorithm | Best Case | Worst Case | Stability | Auxiliary Space |
|---|---|---|---|---|
| **Bubble Sort** | $O(n)$ | $O(n^2)$ | Stable | $O(1)$ in-place |
| **Quick Sort** | $O(n \log n)$ | $O(n^2)$ | Unstable | $O(\log n)$ call stack |
| **Merge Sort** | $O(n \log n)$ | $O(n \log n)$ | Stable | $O(n)$ auxiliary |

---

# CHAPTER 8: CONCLUSION & FUTURE WORK

### 8.1 Summary of Project Achievements
The CIC-311 Design and Analysis of Algorithms Mini Project titled 'Student Record Manager' was successfully designed, implemented, and validated. By combining dynamic Singly Linked Lists, Merge Sort, Binary Search, and Matplotlib data visualization, the project demonstrated how theoretical algorithm design directly solves real-world academic registry challenges.

---

# REFERENCES

[1] T. H. Cormen, C. E. Leiserson, R. L. Rivest, and C. Stein, *Introduction to Algorithms*, 4th ed. Cambridge, MA, USA: MIT Press, 2022.  
[2] E. Horowitz, S. Sahni, and S. Rajasekaran, *Fundamentals of Computer Algorithms*, 2nd ed. Hyderabad, India: Universities Press, 2008.  
[3] D. E. Knuth, *The Art of Computer Programming, Volume 3: Sorting and Searching*, 2nd ed. Boston, MA, USA: Addison-Wesley, 1998.  
[4] J. D. Hunter, “Matplotlib: A 2D graphics environment,” *Computing in Science & Engineering*, vol. 9, no. 3, pp. 90–95, 2007.  
[5] G. van Rossum and F. L. Drake, *Python 3 Reference Manual*. Scotts Valley, CA, USA: CreateSpace, 2009.  
[6] M. T. Goodrich, R. Tamassia, and M. H. Goldwasser, *Data Structures and Algorithms in Python*. Hoboken, NJ, USA: John Wiley & Sons, 2013.  
[7] R. Sedgewick and K. Wayne, *Algorithms*, 4th ed. Upper Saddle River, NJ, USA: Addison-Wesley Professional, 2011.  
[8] IEEE Editorial Style Manual, IEEE Periodicals, Transactions/Journals Dept., Piscataway, NJ, USA, 2023.  
