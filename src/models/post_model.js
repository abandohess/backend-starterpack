import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: String,
  tags: String,
  content: String,
  cover_url: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  username: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

// create model class
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
