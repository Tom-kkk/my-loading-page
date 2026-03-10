import ProjectCard from './ProjectCard';
import { projects } from '../../data/site';

export default function Projects() {
  return (
    <section
      id="projects"
      className="mb-16 sm:mb-24 scroll-mt-24"
      aria-labelledby="projects-heading"
    >
      <h2
        id="projects-heading"
        className="font-caveat text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-8"
      >
        个人项目
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            href={project.href}
            theme={project.theme}
            icon={project.icon}
          />
        ))}
      </div>
    </section>
  );
}
