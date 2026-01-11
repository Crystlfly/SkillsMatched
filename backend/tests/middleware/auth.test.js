import jwt from "jsonwebtoken"
import {authMiddleware} from "../../middleware/auth.js"
import { json } from "express";
import { jest } from '@jest/globals';
describe("authMiddleware",()=>{
    let req, res, next;
    beforeAll(()=>{
        process.env.JWT_SECRET = "test_secret";
    })
    beforeEach(()=>{
        req={
            headers:{},
        };
        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn().mockReturnThis(),
        };
        next=jest.fn();
    });

    test("should call next for valid token", ()=>{
        const userId="user123";
        const token=jwt.sign({userId,role:"CANDIDATE"},process.env.JWT_SECRET,{expiresIn:"1h"});
        req.headers["authorization"]=`Bearer ${token}`;
        authMiddleware(req,res,next);        
        expect(next).toHaveBeenCalled();
    });

    test("should block access if no token is provided", () => {
        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test("should return 403 if token is invalid or expired", () => {
        // signed a token with a DIFFERENT secret to make verification fail
        const invalidToken = jwt.sign({ userId: "123" }, "WRONG_SECRET");
        req.headers["authorization"] = `Bearer ${invalidToken}`;

        authMiddleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
        expect(next).not.toHaveBeenCalled();
    });
})