import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AuthUser } from "@project/shared/core";
import { Document } from "mongoose";

@Schema({ collection: 'users', timestamps: true })
export class BlogUserModel extends Document implements AuthUser {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  avatar?: string;

  @Prop()
  registrationDate: Date;

  @Prop({ required: true })
  passwordHash: string;
}

export const BlogUserSchema = SchemaFactory.createForClass(BlogUserModel);
