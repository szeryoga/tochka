import { Link } from "react-router-dom";
import { CourseItem } from "../types";
import { ArrowIcon } from "./Icons";
import { formatCourseDate } from "../utils/format";

interface CourseCardProps {
  course: CourseItem;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link className="course-card" to={`/courses/${course.id}`}>
      <img className="course-card__image" src={course.image_url} alt={course.title} />
      <div className="course-card__body">
        <h3>{course.title}</h3>
        <p>{course.short_description}</p>
        <div className="content-card__pill">Старт {formatCourseDate(course.start_date)}</div>
      </div>
      <div className="content-card__action">
        <ArrowIcon width={22} height={22} />
      </div>
    </Link>
  );
}
