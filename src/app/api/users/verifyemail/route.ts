import { connect } from "@/dbConfig/dbConfig";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/userModel";

connect()

export async function POST(request:NextRequest) {

    try {
        const reqBody = await request.json()
        const {token} = reqBody
        console.log(token);

        const user = await User.findOne({
            verifyToken: token,
        verifyTokenExpiry: {$gt: Date.now()}
        });

        console.log("User :",user)

        if(!user){
            return NextResponse.json({error: "Invalid token"},{status:400})
        }

        user.isVerfied = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry= undefined;
        await user.save();

        return NextResponse.json({
            message: "Email Verified",
            success: true
        })
    } catch (error) {
        return NextResponse.json({error: error},{status:500})
    }
    
}