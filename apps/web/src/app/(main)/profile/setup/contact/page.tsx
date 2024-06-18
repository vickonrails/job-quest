import { StepContainer } from '@/components/resume-builder/setup/components/container'
import ProfileContactInformation from '@/components/resume-builder/setup/contact-information'
import { getUserProfile } from '@/db/api/profile'

export default async function ContactInformation() {
    const { data } = await getUserProfile()
    if (!data) return null
    return (
        <StepContainer
            data-testid="contact-information"
            title="Contact Information"
            description="Make it easy for employers to reach you by providing your up-to-date contact details, including your phone number, email address, and professional networking profile links."
        >
            <ProfileContactInformation profile={data} />
        </StepContainer>
    )
}