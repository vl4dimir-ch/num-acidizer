import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CounterHandler } from './modules/counter/counter.handler';
import { createErrorResponse } from './utils/api.utils';
import { GLOBAL_ERRORS } from './utils/constants/global.errors';

type RouteHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

interface Route {
    path: string;
    method: string;
    handler: RouteHandler;
}

export class Router {
    private static instance: Router;
    private readonly routes: Route[];

    private readonly counterHandler: CounterHandler;

    private constructor() {
        this.counterHandler = new CounterHandler();

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
                return createErrorResponse(GLOBAL_ERRORS.ROUTE_NOT_FOUND);
            }

            return await route.handler(event);
        } catch (error) {
            console.error('Error handling request:', error);
            return createErrorResponse(GLOBAL_ERRORS.INTERNAL_SERVER_ERROR);
        }
    }
}