import { Input } from 'ui'
import { StepContainer } from './container'

export default function ContactInformation() {
    return (
        <StepContainer title="Contact Information">
            <p className="mb-4 text-gray-500">Contact Information</p>
            <form>
                <section className="p-4 border bg-white mb-8">
                    <section className="mb-4 grid grid-cols-2 gap-3 rounded-md">
                        <Input
                            type="email"
                            autoFocus
                            label="Email Address"
                            placeholder="Email Address"
                        />
                    </section>
                </section>
            </form>
        </StepContainer>
    )
}