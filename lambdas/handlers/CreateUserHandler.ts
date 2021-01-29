import {APIGatewayEvent} from 'aws-lambda';
import {constants} from 'http2';

export const handler = async (event: APIGatewayEvent) => {
    console.log('Create user', event);
    return {
        statusCode: constants.HTTP_STATUS_CREATED,
        body: JSON.stringify({userId: '1', firstName: 'Michal', lastName: 'Kapiczynski'})
    };
};