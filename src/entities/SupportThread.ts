import {ThreadStatus} from "../pages/support/components/ThreadStatus";
import {FileInfo} from "./FileInfo";
import {ReactElement} from "react";

export interface Support {
     id:string
     accountId:string;
     threadId:string;
     type: 'TEXT' | 'MEDIA' | 'SYSTEM'
     message: string|ReactElement;
     createdAt:string;
}

export interface SupportThread {
     id:string
     accountId:string
     email:string
     name:string
     subject:string
     status:ThreadStatus
     message:string
     createdAt:string
     updatedAt:string
     files:FileInfo[]
     posts: Support[]
}