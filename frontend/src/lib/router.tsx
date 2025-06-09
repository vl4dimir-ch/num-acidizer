import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { CounterPage } from '../features/counter/pages/CounterPage';

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Acidizer</h1>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  ),
});

const counterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CounterPage,
});

const routeTree = rootRoute.addChildren([counterRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
} 