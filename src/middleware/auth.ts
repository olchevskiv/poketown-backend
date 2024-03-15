import { auth } from "express-oauth2-jwt-bearer";
import {Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from "../models/user";

// add custom properties to Express Request
declare global {
    namespace Express {
        interface Request {
            userId: string;
            auth0Id: string;
        }
    }
}

/*
    Validates JWT Authorization request token comes from our Auth0 server
*/
export const validateJWT = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
});

/* 
    Parses JWT Authorization request to retrieve user Auth0Id and database id by parsing out 
    Auth0ID and finding corresponding user with that Auth0Id in the database.
    If fails, returns Unauthorized Status 
*/
export const parseJWT = async(req: Request, res: Response, next: NextFunction)=> {
    const { authorization } = req.headers;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }

    const token = authorization.split(" ")[1];

    try {
        const decodedToken = jwt.decode(token) as jwt.JwtPayload;
        const auth0Id = decodedToken.sub;

        const user = await User.findOne({ auth0Id });

        if (!user) {
            return res.sendStatus(401);
        }

        req.auth0Id = auth0Id as string;
        req.userId = user._id.toString();

        next(); // continue with next request

    } catch (error) {
        return res.sendStatus(401);
    }

};