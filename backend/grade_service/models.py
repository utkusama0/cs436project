from typing import List, Optional

class GradeModel:
    _grades: List[dict] = []
    _id_counter: int = 1

    @classmethod
    def all(cls):
        return cls._grades

    @classmethod
    def get(cls, grade_id: int) -> Optional[dict]:
        return next((g for g in cls._grades if g["id"] == grade_id), None)

    @classmethod
    def create(cls, data: dict) -> dict:
        data["id"] = cls._id_counter
        cls._id_counter += 1
        cls._grades.append(data)
        return data

    @classmethod
    def update(cls, grade_id: int, data: dict) -> Optional[dict]:
        grade = cls.get(grade_id)
        if grade:
            grade.update(data)
        return grade

    @classmethod
    def delete(cls, grade_id: int) -> bool:
        grade = cls.get(grade_id)
        if grade:
            cls._grades.remove(grade)
            return True
        return False