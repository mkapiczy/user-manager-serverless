import {APIGatewayEvent} from 'aws-lambda';
import {constants} from 'http2';
import userService from '../UserService';

export const handler = async (event: APIGatewayEvent) => {
    const users = await userService.getUsers()
    return {
        statusCode: constants.HTTP_STATUS_OK,
        body: JSON.stringify(users)
    };
};