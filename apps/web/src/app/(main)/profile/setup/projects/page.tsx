import { StepContainer } from '@/components/resume-builder/setup/components/container'
import ProfileProjects from '@/components/resume-builder/setup/projects/profile-projects'
import { getProfileProjects } from '@/db/api/projects.api'

export default async function EducationStep() {
    const projects = await getProfileProjects()
    if (!projects) return null

    return (
        <StepContainer
            data-testid="projects"
            title="Projects"
            description="Showcase specific projects you&apos;ve worked on that demonstrate your expertise and contributions. Include outcomes, technologies used, and your role in these projects."
        >
            <ProfileProjects projects={projects} />
        </StepContainer>
    )
}