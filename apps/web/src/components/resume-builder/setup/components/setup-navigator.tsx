import { Briefcase, Construction, Contact2, GraduationCap, Library, Zap } from 'lucide-react'
import { SetupLink } from './profile-setup-link'
import { useSetupContext } from '@/hooks/useSetupContext';
import { Alert, AlertDescription, AlertTitle } from 'ui/alert';
import Link from 'next/link';

export default function SetupNav() {
    const { setStep } = useSetupContext();
    return (
        <aside className="w-1/5 border-r sticky top-0 px-3 py-6">
            <ul className="text-sm flex flex-col mb-4">
                <SetupLink step={1} onClick={() => setStep(1)}>
                    <Library size={20} />
                    <span>Basic Information</span>
                </SetupLink>
                <SetupLink step={2} onClick={() => setStep(2)}>
                    <Briefcase size={20} />
                    <span>Work Experience</span>
                </SetupLink>
                <SetupLink step={3} onClick={() => setStep(3)}>
                    <GraduationCap size={20} />
                    <span>Education</span>
                </SetupLink>
                <SetupLink step={4} onClick={() => setStep(4)}>
                    <Construction size={20} />
                    <span>Projects</span>
                </SetupLink>
                <SetupLink step={5} onClick={() => setStep(5)}>
                    <Zap size={20} />
                    <span>Skills</span>
                </SetupLink>
                <SetupLink step={6} onClick={() => setStep(6)}>
                    <Contact2 />
                    <span>Contact Information</span>
                </SetupLink>
            </ul>

            <Alert className="text-sm">
                <AlertTitle>Setup With Resume</AlertTitle>
                <AlertDescription className="text-muted-foreground">Setup your profile by uploading a resume. Vital information is extracted into your profile. {' '}
                    <Link href="/profile/resume-upload" className="text-accent-foreground hover:underline">Upload Now</Link>
                </AlertDescription>
            </Alert>
        </aside>
    )
}
