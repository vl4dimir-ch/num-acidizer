import { Counter } from '../components/Counter';

export function CounterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
          <Counter />
        </div>
      </div>
    </div>
  );
} 