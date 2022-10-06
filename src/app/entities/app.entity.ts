import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class App extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [] })
  items: string[];

  @Prop({ default: 0 })
  intents: number;

  @Prop({ default: false })
  locked: boolean;
}

export const appSchema = SchemaFactory.createForClass(App);
