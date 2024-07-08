'use client'

import { resumeSchema } from '@/utils/resume-schema'
import { createClient } from '@/utils/supabase/client'
import { useMutation } from '@tanstack/react-query'
import JsonView from '@uiw/react-json-view'
import { ChevronRight, FileWarning, UploadCloud } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Button } from 'ui/button'
import { z, type ZodIssue } from 'zod'
import { UploadButton } from '../pdf-upload-button'
import { useToast } from '../toast/use-toast'
import { UploadCardContent, UploadCardHint, type SupportedFormats } from './upload-card'

import { githubDarkTheme } from '@uiw/react-json-view/githubDark'
import { githubLightTheme } from '@uiw/react-json-view/githubLight'
import { Alert, AlertDescription, AlertTitle } from 'ui/alert'

type ProfileSetupType = z.infer<typeof resumeSchema>;

export function CodeBlock({ value }: { value: object }) {
    const { theme, systemTheme } = useTheme()

    const styleTheme = useMemo(() => {
        let themeValue;
        if (theme === 'light' || theme === 'dark') {
            themeValue = theme
        } else {
            themeValue = systemTheme
        }
        return themeValue === 'dark' ? githubDarkTheme : githubLightTheme
    }, [theme, systemTheme])

    return (
        <JsonView value={value} style={styleTheme} />
    )
}

// TODO: haven an intermediate component
async function extractResumeData(file: ArrayBuffer, filename: string, onMessage: (text: ProfileSetupType) => void) {
    const formData = new FormData();
    formData.append('file', new Blob([file]), filename);
    formData.append('filename', filename);
    const response = await fetch('resume-upload/api', {
        method: 'POST',
        body: formData
    })

    if (!response.ok) return;

    const reader = response.body?.getReader()
    const decoder = new TextDecoder();
    if (!reader) return

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true })
        const objects = chunk.split('\n').filter(Boolean).map(x => JSON.parse(x))[0];
        onMessage(objects)
    }
}

const validateProfile = (object: ProfileSetupType) => {
    let validationErrors: ZodIssue[] = []
    let value

    try {
        value = resumeSchema.parse(object)
    } catch (error) {
        if (error instanceof z.ZodError) {
            validationErrors = error.errors
        } else {
            // TODO: handle errors properly
            // console.error('An unexpected error occurred:', error);
        }
    }

    return { value, validationErrors }
}

const maxSize = 5

export function ResumeUploadCardContent({ supportedFormats }: { supportedFormats: SupportedFormats[] }) {
    const client = createClient()
    const [uploading, setUploading] = useState(false)
    const [filename, setFilename] = useState('')
    const { toast } = useToast()
    const [content, setContent] = useState<ProfileSetupType | null>(null)
    const [errors, setErrors] = useState<{ message: string, path: string }[]>([])
    const router = useRouter()

    const handleMessage = (text: ProfileSetupType) => {
        setContent(text)
    }

    const updateProfileMutation = useMutation({
        mutationFn: async ({ values, userId }: { userId: string, values: ProfileSetupType }) => {
            const { education, projects, profile, work_experience } = values
            const preparedValues = {
                user_id_param: userId,
                education: education.map(x => ({ ...x, user_id: userId })),
                profile: { ...profile, email_address: '', github_url: '', personal_website: '', linkedin_url: '' },
                work_experience: work_experience.map(x => ({ ...x, user_id: userId })),
                projects: projects.map(x => ({ ...x, user_id: userId, description: '', url: '' }))
            }
            const { error } = await client.rpc('setup_profile', {
                ...preparedValues,
                user_id_param: userId
            })
            if (error) throw new Error(error.hint)
            return { userId }
        },
        onSuccess: async (_, variables) => {
            const { userId } = variables
            toast({
                variant: 'success',
                title: 'Profile updated successfully'
            })
            await client.from('profiles').update({ is_profile_setup: true }).eq('id', userId)
            router.push('/profile/setup')
        },
        onError: () => {
            toast({
                variant: 'destructive',
                title: 'An error occurred'
            })
        }
    })

    const onFilePicked = async (file: ArrayBuffer, filename: string) => {
        setUploading(true)
        setFilename(filename)
        setContent(null)
        try {
            await extractResumeData(file, filename, handleMessage)
        } catch (error) {
            toast({
                title: 'An error occurred',
                variant: 'destructive'
            })
        } finally {
            setUploading(false)
        }
    }

    const handleCancelClick = () => {
        setContent(null)
    }

    const updateProfile = async () => {
        setErrors([])
        if (!content) return
        const { validationErrors, value: values } = validateProfile(content)
        if (validationErrors.length > 0) {
            const errors = validationErrors.map(x => ({ path: x.path.join('.'), message: x.message }))
            setErrors(errors)
            return
        }
        if (!values) return
        const { data: { user } } = await client.auth.getUser()
        if (!user) return
        await updateProfileMutation.mutateAsync({ values, userId: user.id })
    }

    return (
        <section>
            {errors.length > 0 && (
                <UploadErrorHint errors={errors} />
            )}
            {content ? (
                <section>
                    <section className="max-h-96 min-h-96 overflow-auto border p-2">
                        <CodeBlock value={content} />
                    </section>
                    <footer className="flex justify-between items-center">
                        <div className="flex-1">
                            {updateProfileMutation.isLoading && (
                                <p className="text-sm text-muted-foreground">Extracting from {filename}.pdf...</p>
                            )}
                        </div>
                        <section className="gap-2 flex justify-end pt-3">
                            <Button onClick={handleCancelClick} variant="ghost" size="sm">Cancel</Button>
                            <Button loading={updateProfileMutation.isLoading} size="sm" onClick={updateProfile}>Proceed</Button>
                        </section>
                    </footer>
                </section>

            ) : (
                <section className="mb-4">
                    <UploadCardContent>
                        <span className="border rounded-full p-3" >
                            <UploadCloud size={30} />
                        </span>
                        <div className="text-center max-w-sm">
                            <p className="text-muted-foreground text-sm">
                                Import a recent resume to setup your profile. <span className="font-bold text-accent-foreground">Overwrites previous profile Info!</span>
                            </p>
                        </div>

                        <UploadButton
                            loadingContent={uploading && 'Uploading...'}
                            loading={uploading}
                            onFilePicked={onFilePicked}
                            variant="outline"
                        >
                            Select Resume
                        </UploadButton>
                    </UploadCardContent>

                    <UploadCardHint>
                        <p>Supported format {supportedFormats?.join(',').toUpperCase()}</p>
                        <p>Max size {maxSize}MB</p>
                    </UploadCardHint>

                    <div className="flex justify-end items-center">
                        <Button variant="link" asChild className="p-0" disabled={uploading}>
                            <Link href="/profile/setup" className="flex">
                                Skip to manual setup
                                <ChevronRight size={16} />
                            </Link>
                        </Button>
                    </div>
                </section>
            )}
        </section>
    )
}

/**
 * show errors from the import
 * TODO: fix to provide a more human-friendly error
 */
function UploadErrorHint({ errors }: { errors: { path: string, message: string }[] }) {
    return (
        <Alert className="bg-accent text-sm text-accent-foreground border-destructive mb-4">
            <FileWarning size={18} />
            <AlertTitle>Invalid import data</AlertTitle>
            {errors.map(err => (
                <AlertDescription key={err.path} className="text-muted-foreground">
                    {err.message} in {err.path}
                </AlertDescription>
            ))}
        </Alert>
    )
}