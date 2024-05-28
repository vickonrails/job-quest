import { isLinkedIn } from '~contents/linkedin';
import type { Job } from '~types';

/**
 * Get the important content from the web page
 */
export function getJobDetails(): Partial<Job> {
    const link = window.location.href;

    if (!isLinkedIn) return { link }

    const isFullPage = window.location.href.includes('jobs/view');
    let title: HTMLElement | ChildNode | null;

    const img = document.querySelector('.jobs-company img');
    const container = document.querySelector('.job-details-jobs-unified-top-card__container--two-pane')
    const source = isLinkedIn ? 'linkedIn' : null;

    if (isFullPage) {
        title = document.querySelector('.job-details-jobs-unified-top-card__job-title');
    } else {
        title = document.querySelector('.job-details-jobs-unified-top-card__job-title');
    }

    if (container) {
        const info = container.querySelector('.job-details-jobs-unified-top-card__primary-description-without-tagline')
        const company = info.querySelector('a.app-aware-link')
        const location = info.childNodes[3] ?? ''
        const details = document.querySelector('.jobs-description__container');

        return {
            id: '',
            img: img?.getAttribute('src') ?? '',
            position: title?.textContent.trim() ?? '',
            company_name: company.textContent,
            location: location ? location.textContent.split(' ')[1] : '',
            priority: 1,
            status: 0,
            source,
            description: details?.innerHTML ?? '',
            link
        }
    }

    return {
        id: '',
        img: img?.getAttribute('src') ?? '',
        position: title?.textContent.trim() ?? '',
        priority: 1,
        status: 0,
        source
    }
}

/**
 * get the url of the current page (where the job is located)
 */
export function getJobUrl() {
    return window.location.href;
}