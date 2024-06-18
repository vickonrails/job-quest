import { BasicInformationForm } from '@/components/resume-builder/setup/basic-info';
import { StepContainer } from '@/components/resume-builder/setup/components/container';
import { getUserProfile } from '@/db/api/profile';

export default async function BasicInformation() {
    const { data } = await getUserProfile();

    if (!data) {
        return null;
    }

    return (
        <StepContainer
            title="Basic Information"
            description="Provide your full name, professional title, and a brief overview of your personal profile. This section is your first impression, so make it count." data-testid="basic-information"
        >
            <BasicInformationForm profile={data} />
        </StepContainer>
    )
}