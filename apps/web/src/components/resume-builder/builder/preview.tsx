import { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useFormContext, useWatch, type DeepPartialSkipArrayKey } from 'react-hook-form';
import { type FormValues } from 'src/pages/resumes/[resume]';
import { Button } from 'ui';
import { Simple } from 'resume-templates'

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
    const html = renderToStaticMarkup(<Simple values={values} />)
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
            {/* TODO: fix button loading states for all variants */}
            <Button type="button" variant="ghost" onClick={handleExport} className="mb-2">
                {downloading ? 'Exporting...' : 'Export'}
            </Button>
            <div className="bg-white p-6">
                <Simple values={values} />
            </div>
        </section>
    )
}