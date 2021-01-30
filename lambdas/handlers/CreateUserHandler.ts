import {APIGatewayEvent} from 'aws-lambda';
import {constants} from 'http2';
import {JSONParse} from "../utils/JSONParse";
import {UserInputDto} from "../model/UserInputDto";
import userService from '../UserService';

export const handler = async (event: APIGatewayEvent) => {
    const userInputDto = JSONParse<UserInputDto>(event.body);
    const createdUser = await userService.createUser(userInputDto)
    return {
        statusCode: constants.HTTP_STATUS_CREATED,
        body: JSON.stringify(createdUser)
    };
};