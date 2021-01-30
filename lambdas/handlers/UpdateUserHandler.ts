import {APIGatewayEvent} from 'aws-lambda';
import {constants} from 'http2';
import {JSONParse} from "../utils/JSONParse";
import {UserInputDto} from "../model/UserInputDto";
import userService from '../UserService';
import {extractUserId} from "../utils/PathParametersUtils";

export const handler = async (event: APIGatewayEvent) => {
    const userId = extractUserId(event);
    const userInputDto = JSONParse<UserInputDto>(event.body);
    const updatedUser = await userService.updateUser(userId, userInputDto)
    return {
        statusCode: constants.HTTP_STATUS_OK,
        body: JSON.stringify(updatedUser)
    };
};