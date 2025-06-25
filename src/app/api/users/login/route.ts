import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel"
import { NextRequest,NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { error } from "console";
import { use } from "react";
import jwt from 'jsonwebtoken'


connect();

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, password} = reqBody

        console.log(reqBody);

        //? Check User Exist
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "User does not exist"},{status: 400})
        }
        //! Check Password is correct
        const validPassword = await bcrypt.compare(password,user.password)

        if(!validPassword){
            return NextResponse.json({error: "Invalid Password."},{status:400})

        }

        //? Create a Token
        const tokenData = {
            id: user._id,
            username: user.username,
            email:user.email
        }

        const token =  jwt.sign(tokenData,process.env.JWT_TOKEN!,{expiresIn:"1d"})

        const response = NextResponse.json({
            message:"Login successful",
            success: true,
        })
        response.cookies.set("token", token,{
            httpOnly: true,
            // path:"/"
        })
        return response;
    } catch (error:any) {
        console.log("Error :",error)
        return NextResponse.json({error: error.message},{status:500})
    }
}