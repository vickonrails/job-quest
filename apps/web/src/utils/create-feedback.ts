export type FeedbackAPIResponse = {
    success: boolean
    error: string
}

export type FeedbackFormValues = {
    content: string,
    reason?: string | null,
    mailMe: boolean
}

export async function createFeedback(feedback: FeedbackFormValues): Promise<FeedbackAPIResponse> {
    const response = await fetch('/api/feedback', {
        body: JSON.stringify(feedback),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error('An error occurred')
    }
    return response.json() as Promise<FeedbackAPIResponse>;
}