import { Share } from 'lucide-react';
import { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useFormContext, useWatch, type DeepPartialSkipArrayKey } from 'react-hook-form';
import { Complex, Simple } from 'resume-templates';
import { type FormValues } from '@/pages/resumes-archive/[resume]';
import { Button, Select } from 'ui';

/**
 * 
 * @param html - html string statically rendered with React
 * @returns {Promise<Blob>} - pdf buffer blob
 */
async function fetchPDF(html: string): Promise<Blob> {
    // read the generated css file for the templates
    // compose a new html file

    try {
        const response = await fetch('/api/export-resume', {
            method: 'POST',
            body: JSON.stringify({ html }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (!response.ok) {
            throw new Error(`An error occurred ${response.status}`)
        }

        return await response.blob()
    } catch (e) {
        throw e;
    }
}

/**
 * @param values - form values
 * @returns {Promise<string>} - a URL blob from the pdf buffer
 */
const getObjectURL = async (values: DeepPartialSkipArrayKey<FormValues>, resumeTemplate: Template = 'simple'): Promise<string> => {
    const html = renderToStaticMarkup(<ResumeTemplate values={values} template={resumeTemplate} />)
    const pdfBlob = await fetchPDF(html)
    return window.URL.createObjectURL(pdfBlob)
}

/**
 * Resume Preview
 */
export function Preview() {
    const { control } = useFormContext<FormValues>();
    const values = useWatch<FormValues>({ control: control });
    const [downloading, setDownloading] = useState(false)
    const [resumeTemplate, setResumeTemplate] = useState<Template>('simple')

    const handleExport = () => {
        setDownloading(true)
        getObjectURL(values, resumeTemplate).then(res => {
            window.open(res)
        }).catch(err => {
            // 
        }).finally(() => setDownloading(false))
    }

    return (
        <section className="bg-gray-100 flex-1 p-6 overflow-auto flex flex-col items-end">
            <header className="flex justify-between w-full items-center mb-2">
                <Select
                    options={[{ label: 'Simple', value: 'simple' }, { label: 'Complex', value: 'complex' }]}
                    trigger="Select template"
                    defaultValue="simple"
                    onValueChange={val => {
                        setResumeTemplate(val === 'simple' ? 'simple' : 'complex')
                    }}
                />
                <Button type="button" disabled={downloading} variant="outline" className="flex items-center gap-1" onClick={handleExport}>
                    <Share className="text-xs h-4 w-4" />
                    {downloading ? 'Exporting...' : 'Export'}
                </Button>
            </header>

            {/* TODO: fix button loading states for all variants */}
            <div className="bg-white w-full">
                <ResumeTemplate
                    values={values}
                    template={resumeTemplate}
                />
            </div>
        </section>
    )
}

type Template = 'simple' | 'complex'

function ResumeTemplate({ template, values }: { template?: Template, values: DeepPartialSkipArrayKey<FormValues> }) {
    switch (template) {
        case 'simple':
        default:
            return <Simple values={values} />

        case 'complex':
            return <Complex values={values} />
    }
}