import { useCounterWithStore } from '../../../stores/counterStore';
import { Button } from '../../../components/ui/Button';
import { useCounterAnimation } from '../hooks/useCounterAnimation';
import { LoadingCounter } from './LoadingCounter';
import { ErrorCounter } from './ErrorCounter';

export function Counter() {
  const {
    count,
    increment,
    decrement,
    canIncrement,
    canDecrement,
    isLoading,
    isError,
    error,
    isIncrementing,
    isDecrementing,
    refetch,
  } = useCounterWithStore();
  
  const displayCount = useCounterAnimation(count);

  const handleIncrement = () => {
    increment();
  };

  const handleDecrement = () => {
    decrement();
  };

  if (isLoading) {
    return <LoadingCounter />;
  }

  if (isError && error) {
    return <ErrorCounter error={error} onRetry={refetch} />;
  }

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Counter</h2>
        <div className="text-8xl font-bold text-blue-600 mb-8">
          {displayCount}
        </div>
      </div>
      
      <div className="flex items-center gap-x-8">
        <Button
          onClick={handleDecrement}
          variant="outline"
          size="lg"
          className="w-16 h-16 text-2xl relative"
          circle
          disabled={!canDecrement}
        >
          {isDecrementing ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2"></div>
          ) : (
            '-'
          )}
        </Button>
        
        <Button
          onClick={handleIncrement}
          variant="primary"
          size="lg"
          className="w-16 h-16 text-2xl relative"
          circle
          disabled={!canIncrement}
        >
          {isIncrementing ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2"></div>
          ) : (
            '+'
          )}
        </Button>
      </div>
    </div>
  );
} 