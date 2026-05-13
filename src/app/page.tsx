import ReservationPage from '@/components/reservation/ReservationPage';
import { getInitialData } from './actions/get-initial-data';

export default async function Home() {
  const metadata = await getInitialData();

  return (
    <main>
      <ReservationPage initialMetadata={metadata} />
    </main>
  );
}
