import clsx from 'clsx';
import { type HTMLAttributes } from 'react';

export function DashboardSidebar({ className, ...props }: HTMLAttributes<HTMLElement>) {
    return (
        <aside className={clsx('bg-white rounded-xl p-4', className)} {...props}>
            <h2 className="text-lg font-medium mb-12">Upcoming reminders</h2>
            <section className="flex flex-col">
                <div className="mx-auto mb-5">
                    <EmptyNotification />
                </div>
                <p className="text-center text-gray-500 max-w-xs">You have no reminders. Upcoming reminders will show here </p>
            </section>
        </aside>
    )
}

function EmptyNotification() {
    return (
        <svg width="182" height="170" viewBox="0 0 182 170" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="105.96" cy="75.295" r="75.1856" fill="#F3F0FF" />
            <path d="M93.4637 46.6815L93.8422 46.9001L94.0608 46.5215L96.1371 42.9252C98.8531 38.221 104.868 36.6092 109.572 39.3252C114.277 42.0411 115.888 48.0563 113.172 52.7605L111.096 56.3568L110.878 56.7354L111.256 56.954C127.355 66.2485 132.871 86.8339 123.576 102.933L103.031 138.517C100.496 142.908 102.001 148.522 106.391 151.057C107.018 151.419 107.233 152.221 106.871 152.848L100.533 163.827C100.171 164.454 99.3686 164.669 98.7414 164.307L2.58665 108.792C1.95943 108.43 1.74452 107.628 2.10665 107L8.44497 96.0221C8.8071 95.3948 9.60913 95.1799 10.2363 95.5421L11.372 96.1977C15.7626 98.7326 21.3768 97.2283 23.9117 92.8378L42.7081 60.2814C52.9683 42.5101 75.6924 36.4212 93.4637 46.6815Z" fill="#EDE8FC" stroke="#683DF5" stroke-width="0.874251" />
            <mask id="path-3-inside-1_562_11090" fill="white">
                <path d="M57.0837 143.789C55.2288 147.002 54.7262 150.82 55.6863 154.403C56.6465 157.987 58.9909 161.042 62.2037 162.897C65.4165 164.752 69.2347 165.254 72.8181 164.294C76.4015 163.334 79.4568 160.99 81.3117 157.777L69.1977 150.783L57.0837 143.789Z" />
            </mask>
            <path d="M57.0837 143.789C55.2288 147.002 54.7262 150.82 55.6863 154.403C56.6465 157.987 58.9909 161.042 62.2037 162.897C65.4165 164.752 69.2347 165.254 72.8181 164.294C76.4015 163.334 79.4568 160.99 81.3117 157.777L69.1977 150.783L57.0837 143.789Z" fill="#EDE8FC" stroke="#683DF5" stroke-width="1.7485" mask="url(#path-3-inside-1_562_11090)" />
            {/* TODO: abstract these colors inside tailwind config */}
            <circle cx="53.9424" cy="20.6543" r="5.24551" fill="#EDE8FC" stroke="#683DF5" stroke-width="0.874251" />
            <circle cx="145.739" cy="91.4688" r="5.24551" fill="#EDE8FC" stroke="#683DF5" stroke-width="0.874251" />
            <circle cx="16.3495" cy="77.4805" r="5.24551" fill="#EDE8FC" stroke="#683DF5" stroke-width="0.874251" />
        </svg>

    );
}
