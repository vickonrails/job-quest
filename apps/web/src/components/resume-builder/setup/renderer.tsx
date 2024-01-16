import { useSetupContext } from 'src/pages/profile/setup'
import { BasicInformation } from './basic-info'
import { Education } from './education'
import { OtherLinks } from './links'
import { WorkExperience } from './work-experience/experience'

export function Steps() {
    const { step } = useSetupContext()
    switch (step) {
        case 1: return <BasicInformation />
        case 2: return <WorkExperience />
        case 3: return <Education />
        case 4: return <OtherLinks />
    }
}