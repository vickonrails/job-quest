import { MainShell } from '@/app/(main)/layout'
import BackButton from '@/components/back-button'
import { getJob } from '@/queries/jobs'
import { Save, Wand2 } from 'lucide-react'
import { Button } from 'ui/button'

export default async function CoverLetter({ params }: { params: { id: string } }) {
    const job = await getJob(params.id)
    return (
        <MainShell title={`Cover Letter - ${job?.position}`}>
            <section className="p-6 overflow-hidden">
                <BackButton>Back to Job</BackButton>
                <div className="flex h-full gap-1">
                    <form className="flex flex-col items-start h-full p-1 flex-1 w-3/5 pb-6">
                        <textarea
                            // onChange={onChange}
                            placeholder="Write your cover letter here"
                            rows={20}
                            // value={value}
                            // disabled={writing}
                            className="w-full p-4 pb-0 flex-1 text-accent-foreground mb-2 border"
                            autoFocus
                        />
                        <div className="flex gap-2 w-full justify-end items-center">
                            {/* {saving && (
                            <div className="flex-1">
                                <Spinner className="h-6 w-6" />
                            </div>
                        )} */}

                            <Button type="button" variant="outline" className="flex gap-1" /** onClick={handleMagicWriteClick} loading={writing}**/>
                                <Wand2 size={18} />
                                <span>Magic Write</span>
                            </Button>
                            <Button type="button" className="flex gap-1">
                                <Save size={18} />
                                <span>Copy</span>
                            </Button>
                        </div>
                    </form>
                    <div className="p-4 w-2/5 border overflow-auto mt-1">
                        <p>{job?.position}</p>
                        <div
                            className="text-neutral-600 text-sm"
                            dangerouslySetInnerHTML={{ __html: job?.description ?? '' }}
                        />
                    </div>
                </div>
            </section>
        </MainShell>
    )
}