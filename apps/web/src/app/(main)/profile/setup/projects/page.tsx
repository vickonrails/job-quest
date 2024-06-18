import { StepContainer } from '@/components/resume-builder/setup/components/container'
import ProfileProjects from '@/components/resume-builder/setup/projects/profile-projects'
import { getProjects } from '@/db/api/projects'

export default async function EducationStep() {
    const projects = await getProjects({ resumeId: null })
    if (!projects) return null

    return (
        <StepContainer
            data-testid="education"
            title="Education"
            description="List your academic background, including degrees earned, institutions attended, and any honors or awards received. Relevant coursework can also be included here."
        >
            <ProfileProjects projects={projects} />
        </StepContainer>
    )
}