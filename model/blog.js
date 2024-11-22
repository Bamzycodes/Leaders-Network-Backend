import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true},
  category1: { type: String, required: true },
  category2: { type: String, required: true },
  category3: { type: String, required: true },
},

{
  timestamps: true,
}
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
