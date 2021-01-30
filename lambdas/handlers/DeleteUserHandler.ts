import {APIGatewayEvent} from 'aws-lambda';
import {constants} from 'http2';
import userService from '../UserService';
import {extractUserId} from "../utils/PathParametersUtils";

export const handler = async (event: APIGatewayEvent) => {
    const userId = extractUserId(event);
    await userService.deleteUser(userId)
    return {
        statusCode: constants.HTTP_STATUS_OK
    };
};