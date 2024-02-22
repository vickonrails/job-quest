import { SimpleTemplate } from '../templates/simple';

export function Preview() {
    return (
        <section className="bg-gray-100 flex-1 p-6 overflow-auto">
            <div className="bg-white p-6">
                <SimpleTemplate />
            </div>
        </section>
    )
}