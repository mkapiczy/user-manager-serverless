import {APIGatewayEvent} from 'aws-lambda';

export const extractUserId = (event: APIGatewayEvent) => {
    if (event && event.pathParameters && event.pathParameters.userId) {
        return event.pathParameters.userId;
    }
    throw new Error('Missing userId path param');
};

export default {
    extractUserId
};