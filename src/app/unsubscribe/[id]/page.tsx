import UnsubscribePageClient from './page.client';

interface UnsubscribePageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Unsubscribe',
  description: 'Unsubscribe from our mailing list',
}

export default function UnsubscribePage({ params }: UnsubscribePageProps) {
  return <UnsubscribePageClient params={params} />
}
