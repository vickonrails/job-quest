'use client'

import { Briefcase, Construction, Contact2, GraduationCap, Library, Zap } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from 'ui/alert';
import { Button } from 'ui/button';
import { SetupLink } from './profile-setup-link';

export default function SetupNav() {
    return (
        <aside className="w-1/5 border-r sticky top-0 px-3 py-6">
            <ul className="text-sm flex flex-col mb-4">
                <SetupLink href="/profile/setup">
                    <Library size={20} />
                    <span>Basic Information</span>
                </SetupLink>
                <SetupLink href="/profile/setup/work-experience">
                    <Briefcase size={20} />
                    <span>Work Experience</span>
                </SetupLink>
                <SetupLink href="/profile/setup/education">
                    <GraduationCap size={20} />
                    <span>Education</span>
                </SetupLink>
                <SetupLink href="/profile/setup/projects">
                    <Construction size={20} />
                    <span>Projects</span>
                </SetupLink>
                <SetupLink href="/profile/setup/skills">
                    <Zap size={20} />
                    <span>Skills</span>
                </SetupLink>
                <SetupLink href="/profile/setup/contact">
                    <Contact2 />
                    <span>Contact Information</span>
                </SetupLink>
            </ul>

            <Alert className="text-sm">
                <AlertTitle>Setup With Resume (Beta)</AlertTitle>
                <AlertDescription className="text-muted-foreground mb-3">Setup your profile by uploading a resume. Vital information is extracted into your profile.</AlertDescription>
                <Button size="xs" asChild>
                    <Link href="/profile/resume-upload" className="text-accent-foreground hover:underline">Upload Now</Link>
                </Button>
                
            </Alert>
        </aside>
    )
}
