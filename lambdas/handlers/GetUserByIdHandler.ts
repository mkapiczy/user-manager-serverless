import {APIGatewayEvent} from 'aws-lambda';
import {constants} from 'http2';
import userService from '../UserService';
import {extractUserId} from "../utils/PathParametersUtils";
import NotFoundError from "../error/NotFoundError";

export const handler = async (event: APIGatewayEvent) => {
    try {
        const userId = extractUserId(event);
        const user = await userService.getUserById(userId)
        return {
            statusCode: constants.HTTP_STATUS_OK,
            body: JSON.stringify(user)
        };
    } catch (e) {
        if (e instanceof NotFoundError) {
            return {
                statusCode: constants.HTTP_STATUS_NOT_FOUND,
                body: 'User not found'
            };
        }
        throw e;
    }
};