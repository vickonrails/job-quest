import { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useFormContext, useWatch, type DeepPartialSkipArrayKey } from 'react-hook-form';
import { type FormValues } from 'src/pages/resumes/[resume]';
import { Button } from 'ui';
import { SimpleTemplate } from '../templates/simple';

const apiServiceURL = process.env.NEXT_PUBLIC_API_SERVICE_URL as string;

/**
 * 
 * @param html - html string statically rendered with React
 * @returns {Promise<Blob>} - pdf buffer blob
 */
async function fetchPDF(html: string): Promise<Blob> {
    try {
        const response = await fetch(`${apiServiceURL}/api/resume-export`, {
            method: 'POST',
            body: JSON.stringify({ html, template: 'lora' }),
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
    const html = renderToStaticMarkup(<SimpleTemplate values={values} />)
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
                <SimpleTemplate values={values} />
            </div>
        </section>
    )
}