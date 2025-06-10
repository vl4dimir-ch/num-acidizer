import { ErrorResponse } from "../api.utils";
import { HTTP_STATUS_CODES } from "./http.status-codes";

export const GLOBAL_ERRORS = {
    ROUTE_NOT_FOUND: {
        message: 'Route not found',
        statusCode: HTTP_STATUS_CODES.NOT_FOUND,
        code: 'ROUTER_ROUTE_NOT_FOUND'
    },
    INTERNAL_SERVER_ERROR: {
        message: 'Internal server error',
        statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        code: 'COUNTER_INTERNAL_ERROR'
    },
} as const satisfies Record<string, ErrorResponse>;