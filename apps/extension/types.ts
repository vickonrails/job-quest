export interface BackgroundResponse<T> {
    success: boolean
    data: T
}

export interface Job {
    id?: string
    position: string
    company_name: string
    company_site?: string
    location: string
    link: string
    description: string
    priority?: number
    source_id?: string
    source?: string
    status?: number
}