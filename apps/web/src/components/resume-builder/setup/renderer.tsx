import { type Profile } from '@lib/types'
import { useSetupContext } from 'src/hooks/useSetupContext'
import { BasicInformation } from './basic-info'
import { Education } from './education'
import { OtherLinks } from './links'
import { WorkExperience } from './work-experience/experience'

export function Steps({ profile }: { profile: Profile }) {
    const { step } = useSetupContext();
    switch (step) {
        case 1: return <BasicInformation profile={profile} />
        case 2: return <WorkExperience />
        case 3: return <Education />
        case 4: return <OtherLinks />
    }
}