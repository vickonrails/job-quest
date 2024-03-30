export interface BackgroundResponse<T> {
    success: boolean
    data: T
}

export interface Job {
    id?: string
    img?: string
    position: string
    company_name: string
    location: string
    link: string
    description: string
    priority?: number
    source?: string
    status?: number
    notes?: string
}