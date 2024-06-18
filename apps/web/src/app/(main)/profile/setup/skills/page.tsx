import { StepContainer } from '@/components/resume-builder/setup/components/container'
import ProfileSkills from '@/components/resume-builder/setup/skills/skills'
import { getUserProfile } from '@/db/api/profile'

export default async function Skills() {
    const { data } = await getUserProfile()
    if (!data) return null

    return (
        <StepContainer
            data-testid="skills"
            title="Skills"
            description="Highlight the skills that set you apart, including technical and soft skills. Focus on those that are most relevant to the job you want."
        >
            <ProfileSkills profile={data} />
        </StepContainer>
    )
}