import { AppProviders } from './app/providers';
import { CounterPage } from './features/counter/pages/CounterPage';

function App() {
  return (
    <AppProviders>
      <CounterPage />
    </AppProviders>
  );
}

export default App;
