import { Schema, model } from 'mongoose';

// Schema dei commenti
const commentSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
    _id: true
  },
);

// Schema delle Posts
const postsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      required: false 
    },
    category: {
      type: String,
    },
    telegram: {
      type: Boolean,
      default: false
    },
    cover: {
      type: String
    },
    tags: {
      type: [String],
      default: []
    },
    comments: [commentSchema]
  },
  {
    timestamps: true,
    collection: 'news'
  }
);

const Posts = model('Posts', postsSchema);

export default Posts;

