import mongoose,{Schema,Document} from "mongoose";

export interface Inote extends Document{
    title: string;
    content?: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema:Schema<Inote> = new Schema(
    {
        title:{type:String,required:true},
        content:{type:String,required:true},
        userId:{type:Schema.Types.ObjectId,ref:'User',required:true}
    },
    {timestamps:true}
);

export default mongoose.model<Inote>('Note', NoteSchema);