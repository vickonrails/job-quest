import { ProjectForm } from '@components/resume-builder/setup/projects/project-form-item';
import { type Project } from '@lib/types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AddSectionBtn } from '.';

/**
 * Projects section in resume builder
 */
export function ProjectsSection() {
    const form = useFormContext<{ projects: Project[] }>();
    const { fields } = useFieldArray<{ projects: Project[] }, 'projects', '_id'>({ control: form.control, name: 'projects', keyName: '_id' });

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Projects</h3>
            <p className="mb-4 text-sm text-muted-foreground">Showcase specific projects you&apos;ve worked on that demonstrate your expertise and contributions. Include outcomes, technologies used, and your role in these projects.</p>
            {fields.map((field, index) => (
                <ProjectForm
                    field={field}
                    index={index}
                    form={form}
                    key={field._id}
                    onDeleteClick={() => {/** */ }}
                />
            ))}

            <AddSectionBtn>Add Project</AddSectionBtn>
        </section>
    )
}

