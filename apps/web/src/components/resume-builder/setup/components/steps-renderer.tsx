'use client'

import { type Profile } from 'lib/types'
import { useSetupContext } from 'src/hooks/useSetupContext'
import { BasicInformation } from '../basic-info'
import ContactInformation from '../contact-information'
import { EducationStep as Education } from '../education/profile-education'
import Projects from '../projects/profile-projects'
import Skills from '../skills/skills'
import { WorkExperience } from '../work-experience/profile-experience'

export function Steps({ profile }: { profile: Profile }) {
    const { step } = useSetupContext();
    switch (step) {
        case 1: return <BasicInformation profile={profile} />
        case 2: return <WorkExperience />
        case 3: return <Education />
        case 4: return <Projects />
        case 5: return <Skills profile={profile} />
        case 6: return <ContactInformation profile={profile} />
    }
}