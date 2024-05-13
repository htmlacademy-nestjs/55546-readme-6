import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Newsletter } from '@project/shared/core';

@Schema({
  collection: 'newsletter',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class NewsletterModel extends Document implements Newsletter {
  @Prop({ required: true })
  lastMailingDate: Date;
}

export const NewsletterSchema = SchemaFactory.createForClass(NewsletterModel);

NewsletterSchema.virtual('id').get(function() {
  return this._id.toString();
});
