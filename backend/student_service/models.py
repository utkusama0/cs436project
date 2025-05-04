from typing import List, Optional

class StudentModel:
    _students: List[dict] = []
    _id_counter: int = 1

    @classmethod
    def all(cls):
        return cls._students

    @classmethod
    def get(cls, student_id: int) -> Optional[dict]:
        return next((s for s in cls._students if s["id"] == student_id), None)

    @classmethod
    def create(cls, data: dict) -> dict:
        data["id"] = cls._id_counter
        cls._id_counter += 1
        cls._students.append(data)
        return data

    @classmethod
    def update(cls, student_id: int, data: dict) -> Optional[dict]:
        student = cls.get(student_id)
        if student:
            student.update(data)
        return student

    @classmethod
    def delete(cls, student_id: int) -> bool:
        student = cls.get(student_id)
        if student:
            cls._students.remove(student)
            return True
        return False