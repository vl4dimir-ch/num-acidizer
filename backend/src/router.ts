import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CounterHandler } from './modules/counter/counter.handler';

type RouteHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

interface Route {
    path: string;
    method: string;
    handler: RouteHandler;
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

export class Router {
    private static instance: Router;
    private readonly routes: Route[];

    private readonly counterHandler: CounterHandler;

    private constructor() {
        // Initialize handlers
        this.counterHandler = new CounterHandler();

        // Define routes
        this.routes = [
            {
                path: '/counter',
                method: 'GET',
                handler: (): Promise<APIGatewayProxyResult> => this.counterHandler.getCounter(),
            },
            {
                path: '/counter/increment',
                method: 'POST',
                handler: (): Promise<APIGatewayProxyResult> => this.counterHandler.incrementCounter(),
            },
            {
                path: '/counter/decrement',
                method: 'POST',
                handler: (): Promise<APIGatewayProxyResult> => this.counterHandler.decrementCounter(),
            },
        ];
    }

    public static getInstance(): Router {
        if (!Router.instance) {
            Router.instance = new Router();
        }
        return Router.instance;
    }

    public async handleRequest(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
            const route = this.routes.find(
                (r) => r.path === event.path && r.method === event.httpMethod
            );

            if (!route) {
                return {
                    statusCode: 404,
                    headers: corsHeaders,
                    body: JSON.stringify({ message: 'Route not found' }),
                };
            }

            return await route.handler(event);
        } catch (error) {
            console.error('Error handling request:', error);
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Internal server error' }),
            };
        }
    }
}