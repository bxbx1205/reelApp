import mongoose, { Schema,model,models } from "mongoose";

export const VIDEO_DIMENSIONS ={
    width:1080,
    height:1920,
} as const 



export interface Ivideo{
    _id?:mongoose.Types.ObjectId;
    title:string;
    description:string;
    videoUrl:string;
    thumbnailUrl:string;
    controls?:boolean;
    likes: number;
    likedBy: string[];
    userEmail?: string;
    createdAt?: Date;
    transformation?:{
        height:number
        width:number
        quality?:number
    }
}

const videoSchema = new Schema<Ivideo>({
    title:{type:String,required:true},
    description:{type:String,required:true},
    videoUrl:{type:String,required:true},
    thumbnailUrl:{type:String,required:true},
    controls:{type:Boolean,default:true},
    likes: {type: Number, default: 0},
    likedBy: [{type: String}],
    userEmail: {type: String},
    transformation:{
        height:{type:Number, default:VIDEO_DIMENSIONS.height},
        width:{type:Number, default:VIDEO_DIMENSIONS.width},
        quality:{type:Number, min:1, max:100},
    }
},{timestamps:true})


const Video =models?.Video || model<Ivideo>("Video", videoSchema)

export default Video;