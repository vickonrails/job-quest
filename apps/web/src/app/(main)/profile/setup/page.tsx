import ProfileSetup from '@/components/resume-builder/setup/components/profile-setup'
import { getUser, getUserProfile } from '@/queries/auth'

export default async function ProfileSetupPage() {
  const profile = await getUserProfile()
  const { user } = await getUser()
  if (!profile || !user) return <p>No Profile oh</p>

  return (
    <main>
      <section className="flex">
        <ProfileSetup profile={profile} user={user ?? undefined} />
      </section>
    </main>
  )
}
