import AWS from 'aws-sdk';
import nanoid from 'nanoid';
import { DATA_TABLE_NAME } from 'lib/types';
import { AWS_REGION } from "lib/environment";

export default class DataStorage{
    constructor(credentials){
        /* instantiate the document client with desired region */
        this.docClient = new AWS.DynamoDB.DocumentClient({ 
            region: AWS_REGION,
            credentials 
        });
    }
    getPictureRecords = async ()=>{
        let params = {
            TableName: DATA_TABLE_NAME,
            ExpressionAttributeValues: {
                ':userId': this.identityId
            },
            KeyConditionExpression: 'userId = :userId',
        };
        let data = await this.docClient.query(params).promise();
        /* return data items */
        return data.Items;
    }
    putPictureRecord = ({name, description, rating})=>{
        let params = {
            TableName: DATA_TABLE_NAME,
            Item: {
                userId: this.identityId, 
                pictureId: nanoid(),
                name,
                description,
                rating
            }
        };  
        return this.docClient.put(params).promise()
    }
    deletePictureRecord = ({id}) =>{
        let params = {
            TableName: DATA_TABLE_NAME,
            Key: {
                userId: this.identityId,
                pictureId: id
            }
        };
        return this.docClient.delete(params).promise();
    }
}