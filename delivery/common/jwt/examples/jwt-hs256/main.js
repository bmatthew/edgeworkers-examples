import { logger } from 'log';
import { JWTValidator} from './jwt.js';
import { crypto } from 'crypto';
import { base16 } from 'encoding';

//advanced options for jwt validator
const jwtOption = {
  //check token expiry
  ignoreExpiration: false,
  //check token nbf
  ignoreNotBefore: false
};

const jwtValidator = new JWTValidator(jwtOption);

export async function onClientRequest (request) {
  try {
    // Fetch hmac veification key from Propery Manager
    const secretKey = request.getVariable('PMUSER_JWT_HMAC_KEY');
    const sKey = await crypto.subtle.importKey(
      'raw',
      base16.decode(secretKey, 'Uint8Array').buffer,
      {
        name: 'HMAC',
        hash: 'SHA-256'
      },
      false,
      ['verify']
    );
    //Fetch the Authorization header from request
    let jwt = request.getHeader('Authorization');
    if (jwt) {
      jwt = jwt[0];
      //replace auth scheme before validating
      jwt = jwt.replace('Bearer ',''); 
      const jwtJSON = await jwtValidator.validate(jwt,[sKey]);
      logger.log('jwtJSON %s: ',JSON.stringify(jwtJSON));
      const result = {
        jwt: jwtJSON,
        verifed: true
      };
      request.respondWith(200, {}, JSON.stringify(result));
    } else {
      //Return bad request of authorization header is not found
      request.respondWith(400, {}, 'Authorization header is missing!');
    }
  } catch (error) {
    logger.log(error);
    request.respondWith(400, {}, error);
  }
}
