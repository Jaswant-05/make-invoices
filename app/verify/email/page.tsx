import VerifyEmailPage from '@/components/VerifyEmailPage';
import { connection } from 'next/server'


export default async function Page() {
    await connection();
    return(
        <VerifyEmailPage/>
    )
}
