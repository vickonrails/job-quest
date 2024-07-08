'use client'

import { createClient } from '@/utils/supabase/client'
import { useMutation } from '@tanstack/react-query'
import { ChevronRight, UploadCloud } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from 'ui/button'
import { UploadButton } from '../pdf-upload-button'
import { useToast } from '../toast/use-toast'
import { UploadCardContent, UploadCardHint, type SupportedFormats } from './upload-card'

import { extractResumeData, validateProfile, type ProfileSetupType } from '@/utils/resume-import'
import { CodeBlock } from './resume-code-block'
import { UploadErrorHint } from './resume-upload-hint'

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