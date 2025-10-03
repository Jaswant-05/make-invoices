import ResetPasswordPage from '@/components/ResetPassword'
import { connection } from 'next/server'

export default async function Page() {
  await connection()
  return(
    <ResetPasswordPage/>
  )

}
