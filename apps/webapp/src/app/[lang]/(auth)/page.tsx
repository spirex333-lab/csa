import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export default async function Index({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    redirect(`/${lang}/login`);
  }

  return <></>;
}
