import { StepContainer } from '@/components/resume-builder/setup/components/container'
import { ProfileWorkExperience } from '@/components/resume-builder/setup/work-experience/profile-work-experience'
import { getWorkExperience } from '@/db/api/work-experience'

export default async function WorkExperience() {
    const workExperiences = await getWorkExperience({ resumeId: null })
    if (!workExperiences) return null

    return (
        <StepContainer
            title="Work Experience"
            data-testid="work-experience"
            description="Detail your professional history, including past positions held, responsibilities, key achievements, and the skills you developed. Tailor this section to the job you&apos;re applying for.."
        >
            <ProfileWorkExperience workExperience={workExperiences} />
        </StepContainer>
    )
}