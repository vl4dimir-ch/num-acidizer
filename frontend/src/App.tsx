import { CounterPage } from './features/counter/pages/CounterPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <CounterPage />
        </div>
      </main>
    </div>
  );
}

export default App;
