import { isLinkedIn } from '~contents';
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
    const container = document.querySelector('.job-details-jobs-unified-top-card__primary-description-without-tagline')
    const source = isLinkedIn ? 'linkedIn' : null;

    if (isFullPage) {
        title = document.querySelector('.jobs-unified-top-card .job-details-jobs-unified-top-card__job-title').childNodes[0];
    } else {
        title = document.querySelector('.jobs-unified-top-card .job-details-jobs-unified-top-card__job-title-link');
    }

    if (container) {
        const company = container.querySelector('.app-aware-link')
        const location = Boolean(container) ? container.childNodes[3] : ''
        const details = document.querySelector('#job-details');

        return {
            id: '',
            img: img?.getAttribute('src') ?? '',
            position: title?.textContent ?? '',
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
        // TODO: remove img and use initials
        id: '',
        img: img?.getAttribute('src') ?? '',
        position: title?.textContent ?? '',
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