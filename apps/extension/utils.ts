import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Job } from '~types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Get the important content from the web page
 */
export function getJobContent(): Job {
    const isFullPage = window.location.href.includes('jobs/view');
    const container = document.querySelector('.jobs-unified-top-card');
    const position = container.querySelector(`${isFullPage ? 'h1' : 'h2'}`).textContent.trim()
    const locationContainer = container.querySelector('.jobs-unified-top-card__primary-description > div');
    const location = locationContainer.childNodes[3].textContent.trim();
    const company_name = locationContainer.querySelector('a').textContent.trim();
    const link = window.location.href.split('?')[0];
    const description = document.querySelector('.jobs-box__html-content').innerHTML

    return {
        position,
        company_name,
        location,
        link,
        description
    }
}

/**
 * fetch the ID of the job from the URL
 */
export function getJobId() {
    const strPattern = /\b\d{10}\b/g;
    const url = window.location.href;
    return url.match(strPattern)[0];
}