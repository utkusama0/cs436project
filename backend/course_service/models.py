from typing import List, Optional

class CourseModel:
    _courses: List[dict] = []
    _id_counter: int = 1

    @classmethod
    def all(cls):
        return cls._courses

    @classmethod
    def get(cls, course_id: int) -> Optional[dict]:
        return next((c for c in cls._courses if c["id"] == course_id), None)

    @classmethod
    def create(cls, data: dict) -> dict:
        data["id"] = cls._id_counter
        cls._id_counter += 1
        cls._courses.append(data)
        return data

    @classmethod
    def update(cls, course_id: int, data: dict) -> Optional[dict]:
        course = cls.get(course_id)
        if course:
            course.update(data)
        return course

    @classmethod
    def delete(cls, course_id: int) -> bool:
        course = cls.get(course_id)
        if course:
            cls._courses.remove(course)
            return True
        return False