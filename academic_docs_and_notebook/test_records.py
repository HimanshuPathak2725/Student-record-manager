import unittest
import os
from student_record_manager import (
    StudentNode,
    StudentLinkedList,
    merge_sort,
    binary_search,
    plot_top_5_scorers,
)


class TestStudentRecordManager(unittest.TestCase):

    def setUp(self):
        self.sll = StudentLinkedList()
        self.test_data = [
            (105, "Vikram", "Mechanical", 68.5),
            (102, "Diya", "IT", 88.0),
            (101, "Aarav", "CS", 94.5),
            (104, "Ananya", "ECE", 91.0),
            (103, "Rohan", "CS", 76.5),
            (106, "Neha", "CS", 85.0),
        ]
        for roll, name, dept, marks in self.test_data:
            self.sll.insert(roll, name, dept, marks)

    def test_insert_and_count(self):
        self.assertEqual(len(self.sll), 6)
        self.assertFalse(self.sll.insert(101, "Duplicate", "CS", 50.0))
        self.assertEqual(len(self.sll), 6)

    def test_delete(self):
        self.assertTrue(self.sll.delete(105))
        self.assertEqual(len(self.sll), 5)
        self.assertIsNone(self.sll.search(105))
        self.assertFalse(self.sll.delete(999))

    def test_merge_sort_marks(self):
        records = self.sll.to_list()
        sorted_records = merge_sort(records, key="marks", reverse=True)
        marks = [s.marks for s in sorted_records]
        self.assertEqual(marks, sorted(marks, reverse=True))

    def test_merge_sort_roll(self):
        records = self.sll.to_list()
        sorted_records = merge_sort(records, key="roll_no", reverse=False)
        rolls = [s.roll_no for s in sorted_records]
        self.assertEqual(rolls, [101, 102, 103, 104, 105, 106])

    def test_binary_search(self):
        records = self.sll.to_list()
        sorted_records = merge_sort(records, key="roll_no", reverse=False)

        found, comparisons = binary_search(sorted_records, 104)
        self.assertIsNotNone(found)
        self.assertEqual(found.roll_no, 104)
        self.assertTrue(comparisons > 0)

        not_found, comparisons_nf = binary_search(sorted_records, 999)
        self.assertIsNone(not_found)
        self.assertTrue(comparisons_nf > 0)


if __name__ == "__main__":
    unittest.main()
