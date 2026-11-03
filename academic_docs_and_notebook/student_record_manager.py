"""
CIC-311 Mini Project: Student Record Manager
Experiments: Linked List + Sorting (Merge Sort) + Searching (Binary Search) + Visualization
"""

from typing import List, Optional, Tuple
import matplotlib.pyplot as plt


class StudentNode:
    """Node representing a single student record."""

    def __init__(self, roll_no: int, name: str, department: str, marks: float):
        self.roll_no = int(roll_no)
        self.name = str(name).strip()
        self.department = str(department).strip()
        self.marks = float(marks)
        self.next: Optional['StudentNode'] = None

    def __str__(self) -> str:
        return f"Roll: {self.roll_no}, Name: {self.name}, Dept: {self.department}, Marks: {self.marks}"


class StudentLinkedList:
    """Singly linked list to store and manage student records."""

    def __init__(self):
        self.head: Optional[StudentNode] = None
        self.count: int = 0

    def __len__(self) -> int:
        return self.count

    def insert(self, roll_no: int, name: str, department: str, marks: float) -> bool:
        """Insert a student record at the end of the list."""
        if self.search(roll_no) is not None:
            print(f"Roll number {roll_no} already exists.")
            return False

        new_node = StudentNode(roll_no, name, department, marks)
        if self.head is None:
            self.head = new_node
        else:
            curr = self.head
            while curr.next is not None:
                curr = curr.next
            curr.next = new_node

        self.count += 1
        return True

    def delete(self, roll_no: int) -> bool:
        """Delete a student record by roll number."""
        if self.head is None:
            print("List is empty.")
            return False

        if self.head.roll_no == int(roll_no):
            self.head = self.head.next
            self.count -= 1
            return True

        prev = self.head
        curr = self.head.next
        while curr is not None and curr.roll_no != int(roll_no):
            prev = curr
            curr = curr.next

        if curr is None:
            print(f"Roll number {roll_no} not found.")
            return False

        prev.next = curr.next
        self.count -= 1
        return True

    def search(self, roll_no: int) -> Optional[StudentNode]:
        """Linear search to find a student by roll number in the linked list."""
        curr = self.head
        while curr is not None:
            if curr.roll_no == int(roll_no):
                return curr
            curr = curr.next
        return None

    def display(self):
        """Display all student records in a table."""
        if self.head is None:
            print("No records found.")
            return

        print("-" * 65)
        print(f"{'Roll No':<10} {'Name':<20} {'Department':<18} {'Marks':<8}")
        print("-" * 65)
        curr = self.head
        while curr is not None:
            print(f"{curr.roll_no:<10} {curr.name:<20} {curr.department:<18} {curr.marks:<8.1f}")
            curr = curr.next
        print("-" * 65)
        print(f"Total students: {self.count}\n")

    def to_list(self) -> List[StudentNode]:
        """Convert linked list to a Python list."""
        records = []
        curr = self.head
        while curr is not None:
            records.append(curr)
            curr = curr.next
        return records

    def from_list(self, records: List[StudentNode]):
        """Rebuild linked list from a list of nodes."""
        self.head = None
        self.count = 0
        for s in records:
            self.insert(s.roll_no, s.name, s.department, s.marks)


def merge_sort(records: List[StudentNode], key: str = "marks", reverse: bool = False) -> List[StudentNode]:
    """Sort student records using merge sort."""
    if len(records) <= 1:
        return records

    mid = len(records) // 2
    left = merge_sort(records[:mid], key=key, reverse=reverse)
    right = merge_sort(records[mid:], key=key, reverse=reverse)

    return _merge(left, right, key=key, reverse=reverse)


def _merge(left: List[StudentNode], right: List[StudentNode], key: str, reverse: bool) -> List[StudentNode]:
    result: List[StudentNode] = []
    i = j = 0

    while i < len(left) and j < len(right):
        val1 = getattr(left[i], key)
        val2 = getattr(right[j], key)

        condition = (val1 >= val2) if reverse else (val1 <= val2)
        if condition:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result


def binary_search(sorted_records: List[StudentNode], roll_no: int) -> Tuple[Optional[StudentNode], int]:
    """Search student by roll number using binary search on sorted records."""
    low = 0
    high = len(sorted_records) - 1
    comparisons = 0

    while low <= high:
        comparisons += 1
        mid = (low + high) // 2
        mid_roll = sorted_records[mid].roll_no

        if mid_roll == roll_no:
            return sorted_records[mid], comparisons
        elif mid_roll < roll_no:
            low = mid + 1
        else:
            high = mid - 1

    return None, comparisons


def plot_top_5_scorers(records: List[StudentNode], save_path: Optional[str] = None):
    """Plot bar chart of top 5 students by marks."""
    if not records:
        print("No student data to plot.")
        return

    # Sort descending by marks
    sorted_students = merge_sort(records, key="marks", reverse=True)
    top_5 = sorted_students[:5]

    names = [f"{s.name}\n({s.roll_no})" for s in top_5]
    marks = [s.marks for s in top_5]

    plt.figure(figsize=(8, 5))
    bars = plt.bar(names, marks, color="#3b82f6", edgecolor="black", width=0.5)

    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width() / 2, yval + 1, f"{yval:.1f}", ha="center", va="bottom")

    plt.title("Top 5 Scorers")
    plt.xlabel("Student")
    plt.ylabel("Marks")
    plt.ylim(0, max(marks) + 10)
    plt.grid(axis="y", linestyle="--", alpha=0.7)
    plt.tight_layout()

    if save_path:
        plt.savefig(save_path)
    plt.show()


sample_data = [
    (101, "Aarav Sharma", "Computer", 94.5),
    (102, "Diya Patel", "IT", 88.0),
    (103, "Rohan Verma", "Computer", 76.5),
    (104, "Ananya Iyer", "Electronics", 91.0),
    (105, "Vikram Singh", "Mechanical", 68.5),
    (106, "Neha Gupta", "Computer", 85.0),
    (107, "Karan Mehta", "IT", 72.0),
    (108, "Pooja Nair", "Electronics", 96.0),
    (109, "Aditya Rao", "Computer", 82.5),
    (110, "Sneha Joshi", "Civil", 79.0),
    (111, "Rahul Deshmukh", "Mechanical", 89.5),
    (112, "Tanvi Kulkarni", "Computer", 98.0),
]


def menu():
    records_list = StudentLinkedList()
    for roll, name, dept, marks in sample_data:
        records_list.insert(roll, name, dept, marks)

    while True:
        print("\n--- Student Record Manager ---")
        print("1. Display All Students")
        print("2. Add Student")
        print("3. Delete Student")
        print("4. Search Student by Roll No (Binary Search)")
        print("5. Sort by Marks")
        print("6. Sort by Roll No")
        print("7. Plot Top 5 Scorers")
        print("0. Exit")

        choice = input("Enter choice: ").strip()

        if choice == "1":
            records_list.display()
        elif choice == "2":
            try:
                r = int(input("Roll No: "))
                n = input("Name: ")
                d = input("Department: ")
                m = float(input("Marks: "))
                if records_list.insert(r, n, d, m):
                    print("Student added successfully.")
            except ValueError:
                print("Invalid input.")
        elif choice == "3":
            try:
                r = int(input("Roll No to delete: "))
                if records_list.delete(r):
                    print("Student deleted successfully.")
            except ValueError:
                print("Invalid input.")
        elif choice == "4":
            try:
                r = int(input("Roll No to search: "))
                sorted_r = merge_sort(records_list.to_list(), key="roll_no", reverse=False)
                res, comp = binary_search(sorted_r, r)
                if res:
                    print(f"Found: Roll {res.roll_no}, {res.name}, {res.department}, Marks: {res.marks} (Comparisons: {comp})")
                else:
                    print(f"Roll {r} not found (Comparisons: {comp})")
            except ValueError:
                print("Invalid input.")
        elif choice == "5":
            sorted_m = merge_sort(records_list.to_list(), key="marks", reverse=True)
            records_list.from_list(sorted_m)
            print("Sorted by marks (highest first):")
            records_list.display()
        elif choice == "6":
            sorted_r = merge_sort(records_list.to_list(), key="roll_no", reverse=False)
            records_list.from_list(sorted_r)
            print("Sorted by roll number:")
            records_list.display()
        elif choice == "7":
            plot_top_5_scorers(records_list.to_list())
        elif choice == "0":
            print("Exiting.")
            break
        else:
            print("Invalid choice.")


if __name__ == "__main__":
    menu()
