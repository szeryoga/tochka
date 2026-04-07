import { Link } from "react-router-dom";
import { CourseItem } from "../types";
import { ArrowIcon, GraduationIcon } from "./Icons";
import { formatCourseDate } from "../utils/format";

interface CourseCardProps {
  course: CourseItem;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link className="course-card" to={`/courses/${course.id}`}>
      <div className="course-card__media">
        <img className="course-card__image" src={course.image_url} alt={course.title} />
        <div className="course-card__icon">
          <GraduationIcon width={16} height={16} />
        </div>
      </div>
      <div className="course-card__body">
        <h3>{course.title}</h3>
        <p>{course.short_description}</p>
        <div className="course-card__footer">
          <div className="content-card__pill">Для всех уровней</div>
          <div className="content-card__action">
            <ArrowIcon width={18} height={18} />
          </div>
        </div>
        <div className="course-card__start">Старт {formatCourseDate(course.start_date)}</div>
      </div>
    </Link>
  );
}
