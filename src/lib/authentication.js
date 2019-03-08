import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import {USER_POOL_ID, USER_POOL_CLIENT_ID} from "./environment";
/* the user pool for registration and login operations */
const userPool = new AmazonCognitoIdentity.CognitoUserPool({
	UserPoolId: USER_POOL_ID,
	ClientId: USER_POOL_CLIENT_ID
});
/**
 * Examples of Amazon Cognito Identity can be found at:
 * https://docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html
 */
export default class Authentication {
	constructor(){
		this.cognitoUser = null;
	}
	getCognitoUser = (username) => {
		if(this.cognitoUser){
			return this.cognitoUser;
		}
		/* otherwise return current user in session */
		return new AmazonCognitoIdentity.CognitoUser({
			Username: username,
			Pool: userPool
		});
	}
	/**
	 * Sign up user to serverless user pool.
	 * @param {String} username
	 * @param {String} password
	 * @param {String[]} attributes
	 */
	signUp = (username, password, attributes) => {
		return new Promise((resolve, reject) => {
			/* convert all attributes to cognito attributes */
			let cognitoAttributes = attributes.map(a => {
				return new AmazonCognitoIdentity.CognitoUserAttribute(a);
			});
			/* sign up user */
			userPool.signUp(username, password, cognitoAttributes, null, (err, result)=> {
				if (err) {
					reject(err);
				}else{
					/* set the user */
					this.cognitoUser = result.user;
					/* resolve */
					resolve(result.user);
				}
			});
		});
	}
	/**
	 * Sign in user to serverless user pool.
	 * @param {String} username
	 * @param {String} password
	 */
	signIn = (username, password) => {
		return new Promise((resolve, reject) => {
			/* the authentication details */
			let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
				Username: username,
				Password: password
			});
			let cognitoUser = this.getCognitoUser(username);
			/* sign in this user to the pool */
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: (result) => {
					/* set the user */
					this.cognitoUser = cognitoUser;
					/* resolve authentication credentials */
					resolve({
						accessToken: result.getAccessToken().getJwtToken(),
						idToken: result.getIdToken().getJwtToken(),
						refreshToken: result.getRefreshToken().getToken()
					});
				},
				onFailure: (err) => {
					reject(err);
				}
			});
		});
	}
	/**
	 * 	Resend confirmation code to user email.
	 * @param {String} username 
	 */
	resendConfirmation = (username) => {
		let cognitoUser = this.getCognitoUser(username);
		return new Promise((resolve, reject)=>{
			cognitoUser.resendConfirmationCode((err, result) => {
				(err) ? reject(err) : resolve(result);
			});
		});
	}
	/**
	 * Validate using sign up using code.
	 * @param {String} username 
	 * @param {String} code 
	 */
	confirmRegistration = (username, code) => {
		let cognitoUser = this.getCognitoUser(username);
		return new Promise((resolve, reject) => {
			cognitoUser.confirmRegistration(code, true, (err, result)=> {
				(err) ? reject(err) : resolve(result);
			});
		});
	}
	/**
	 * @param {String} username 
	 * @param {String} oldPassword 
	 * @param {String} newPassword 
	 */
	changePassword = (username, oldPassword, newPassword) => {
		let cognitoUser = this.getCognitoUser(username);
		return new Promise((resolve, reject) => {
			cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
				(err) ? reject(err) : resolve(result);
			});
		});
	}
}