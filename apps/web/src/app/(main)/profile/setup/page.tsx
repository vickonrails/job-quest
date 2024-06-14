import ProfileSetup from '@/components/resume-builder/setup/components/profile-setup'
import { getUser, getUserProfile } from '@/db/api'

export default async function ProfileSetupPage() {
  const { data: profile } = await getUserProfile()
  const { data } = await getUser()
  const user = data.user
  if (!profile || !user) return <p>No Profile oh</p>

  return (
    <div className="overflow-auto flex">
      <ProfileSetup profile={profile} user={user} />
    </div>
  )
}
