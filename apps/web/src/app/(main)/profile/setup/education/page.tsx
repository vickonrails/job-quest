import { StepContainer } from '@/components/resume-builder/setup/components/container'
import { ProfileEducation } from '@/components/resume-builder/setup/education/profile-education'
import { getEducation } from '@/db/api/education'

export default async function EducationStep() {
    const education = await getEducation({ resumeId: null })
    if (!education) return null
    return (
        <StepContainer
            data-testid="education"
            title="Education"
            description="List your academic background, including degrees earned, institutions attended, and any honors or awards received. Relevant coursework can also be included here."
        >
            <ProfileEducation education={education} />
        </StepContainer>
    )
}