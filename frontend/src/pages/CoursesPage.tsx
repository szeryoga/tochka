import { useEffect, useState } from "react";
import { api } from "../api";
import { CourseCard } from "../components/CourseCard";
import { PageHero } from "../components/PageHero";
import { useAppData } from "../store/AppDataContext";
import { CourseItem } from "../types";

export function CoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const { settings } = useAppData();

  useEffect(() => {
    void api.getCourses().then(setCourses);
  }, []);

  return (
    <>
      <PageHero
        title={settings?.courses_page_title ?? "Курсы"}
        subtitle={settings?.courses_page_subtitle ?? "Освой новые навыки и выступай увереннее"}
      />
      <section className="stack-list">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>
    </>
  );
}
