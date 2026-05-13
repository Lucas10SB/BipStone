import ReservationPage from '@/components/reservation/ReservationPage';
import { getInitialData, getNextLoadingOrder } from './actions/get-initial-data';

export default async function Home() {
  const metadata = await getInitialData();
  const nextOrder = await getNextLoadingOrder();

  return (
    <main>
      <ReservationPage initialMetadata={metadata} nextOrderSuggestion={nextOrder} />
    </main>
  );
}
