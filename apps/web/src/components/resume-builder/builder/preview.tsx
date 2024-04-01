import { Share } from 'lucide-react';
import { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useFormContext, useWatch, type DeepPartialSkipArrayKey } from 'react-hook-form';
import { Complex } from 'resume-templates';
import { type FormValues } from 'src/pages/resumes/[resume]';
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
const getObjectURL = async (values: DeepPartialSkipArrayKey<FormValues>): Promise<string> => {
    const html = renderToStaticMarkup(<Complex values={values} />)
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

    const handleExport = () => {
        setDownloading(true)
        getObjectURL(values).then(res => {
            window.open(res)
        }).catch(err => {
            // 
        }).finally(() => setDownloading(false))
    }

    return (
        <section className="bg-gray-100 flex-1 p-6 overflow-auto flex flex-col items-end">
            <header className="flex justify-between w-full items-center">
                <Select
                    options={[{ label: 'Simple', value: 'simple' }, { label: 'Complex', value: 'complex' }]}
                    trigger="Select template"
                />
                <Button type="button" disabled={downloading} variant="outline" className="flex items-center gap-1" onClick={handleExport}>
                    <Share className="text-xs h-5 w-5" />
                    {downloading ? 'Exporting...' : 'Export'}
                </Button>
            </header>

            {/* TODO: fix button loading states for all variants */}
            <div className="bg-white w-full">
                <Complex values={values} />
            </div>
        </section>
    )
}