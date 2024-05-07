import { QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, vi } from 'vitest';
import { type Education, type Project, type Resume, type WorkExperience } from '../lib/types';
import { ResumeForm } from '../src/components/resume-builder/builder/sections';
import { type FormValues } from '../src/pages/resumes/[resume]';
import { createTestQueryClient } from '../vitest/setup';

const resume: Resume = { full_name: 'Username' }
const projects: Project[] = [{}]
const workExperience: WorkExperience[] = [{}]
const education: Education[] = [{}]

const defaultValues: FormValues = {
    education,
    workExperience,
    projects,
    resume
}

function FormWrapper({ defaultValues }: { defaultValues: FormValues }) {
    const form = useForm<FormValues>({ defaultValues });
    return (
        <FormProvider {...form}>
            <ResumeForm resume={defaultValues.resume} />
        </FormProvider>
    )
}

describe('Resume Form', () => {
    afterEach(() => {
        testClient.clear();
        cleanup();
    })

    const testClient = createTestQueryClient()
    const setup = () => {
        return render(
            <QueryClientProvider client={testClient}>
                <FormWrapper defaultValues={defaultValues} />
            </QueryClientProvider>
        )
    }

    it('Renders without errors', () => {
        // 
    })
});