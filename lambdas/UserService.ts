import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import {UserInputDto} from "./model/UserInputDto";
import {v4} from 'uuid';
import * as AWSXRay from 'aws-xray-sdk-core';
import {UserDto} from "./model/UserDto";

const documentClient = new DocumentClient();
AWSXRay.captureAWSClient((documentClient as any).service);

export  class UserService {
    public async createUser(user: UserInputDto): Promise<UserDto> {
        const newUser = {
            id: v4(),
            ...user
        };
        const params = {
            TableName: process.env.USERS_TABLE || '',
            Item: newUser
        };
        await documentClient.put(params).promise().catch(e => {
            console.error('Create user failed', e);
            throw new Error('Create user failed');
        });
        return newUser;
    }

    public async getUserById(id: string): Promise<UserDto> {
        const params = {
            TableName: process.env.USERS_TABLE || '',
            Key: {id}
        };
        const result = await documentClient.get(params).promise();
        if (result && result.Item) {
            return result.Item as UserDto;
        }
        throw new Error('User not found');
    }

    public async updateUser(id: string, userToUpdate: UserInputDto): Promise<UserDto> {
        const existingUser = await this.getUserById(id);
        const updatedUser = {
            ...existingUser,
            ...userToUpdate
        };
        const params = {
            TableName: process.env.USERS_TABLE || '',
            Item: updatedUser
        };
        await documentClient.put(params).promise().catch(e => {
            console.error('Update user error', e);
            throw new Error('Update user error');
        });
        return updatedUser;
    }

    public async getUsers(): Promise<UserDto[]> {
        const params = {
            TableName: process.env.USERS_TABLE || '',
        };
        const result = await documentClient.scan(params).promise();
        if (result && result.Items) {
            return result.Items.map(i => i as UserDto);
        }
        throw new Error('Get users error');
    }

    public async deleteUser(id: string): Promise<void> {
        const params = {
            TableName: process.env.USERS_TABLE || '',
            Key: {
                id
            }
        };
        await documentClient.delete(params).promise()
            .catch(e => {
                console.error('Delete user error', e);
                throw new Error('Delete user error');
            });
    }
}

export default new UserService();

