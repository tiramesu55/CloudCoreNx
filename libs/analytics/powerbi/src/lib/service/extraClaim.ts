import { OktaAuth, IDToken as Tk, JWTObject } from "@okta/okta-auth-js";

import jwt_decode, { JwtPayload } from "jwt-decode";
/* 
interface ExJwtPayload extends JwtPayload{
    extraData: string,
}


const getAuthObject = async (oktaAuth: OktaAuth):Promise<any> =>{     //@todo this any has to be changed to a type
    let idTok = oktaAuth.getIdToken();
    debugger;
    if(!idTok) return;
    let decodedIdt = jwt_decode<ExJwtPayload>(idTok);
    if( !decodedIdt.extraData ) 
    {  //we did not get a claim on a first pass do a timer
        
         const tokenToRenew :Tk = {
             idToken : idTok,
             claims :  { sub: decodedIdt.sub!},
             issuer: decodedIdt.iss!,
             clientId: '',
             authorizeUrl: '',
             expiresAt: decodedIdt.exp!,
             scopes: ['openid', 'email', 'profile', 'offline_access']

         }
         await new Promise( resolve => setTimeout(resolve, 2000));   
         await oktaAuth.token.renew(tokenToRenew);
         idTok = oktaAuth.getIdToken();
         if(!idTok) return;
         decodedIdt = jwt_decode<ExJwtPayload>(idTok);

     }
    return decodedIdt.extraData;
}
export {getAuthObject}
*/