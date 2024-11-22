import express from 'express';
import cloudinary from '../cloudinary.js';
import multer from 'multer'
import Blog from '../model/blog.js';
import { isAuth } from '../utils.js';

const blog = express.Router();

        async function handleUpload(file) {
          const res = await cloudinary.uploader.upload(file, {
            resourse_type: "auto"
        });
        return res;

        }
        
        const storage = new multer.memoryStorage()
        const upload = multer({
          storage,
        })

        blog.post('/add-blog', upload.single("my_file"), isAuth, async (req, res) => {
          const title = req.body.title
          const content = req.body.content
          const category1 = req.body.category1
          const category2 = req.body.category2
          const category3 = req.body.category3

        try {
          if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
          }

          const b64 = Buffer.from(req.file.buffer).toString("base64");
          let dataURI = "data:" + req.file.mimetype + ";base64," + b64
          const cldRes = await handleUpload(dataURI);
          if(cldRes){
            const blog = new Blog({
                  title: title,
                  image: cldRes.secure_url,
                  content: content,
                  category1: category1,
                  category2: category2,
                  category3: category3
              
      })
      const savedBlogs = await blog.save()
      res.status(200).send(savedBlogs)
          }

        } catch (error) {
          res.status(500).json({ error: "An error occurred while processing the file" });  
        }
      })


blog.get('/getBlogs', isAuth, async(req, res) => {
    try {
        const blogs = await Blog.find({})
        res.status(200).send(blogs)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

})

blog.delete(
  '/:id',
async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      await blog.remove();
      res.send({ message: 'Blog Deleted' });
    } else {
      res.status(404).send({ message: 'Blog Not Found' });
    }
  });

// const PAGE_SIZE = 3;

// router.get(
//   '/search',
// async (req, res) => {
//     const { query } = req;
//     const pageSize = query.pageSize || PAGE_SIZE;
//     const page = query.page || 1;
//     const category = query.category || '';
//     const price = query.price || '';
//     const order = query.order || '';
//     const searchQuery = query.query || '';

//     const queryFilter =
//       searchQuery && searchQuery !== 'all'
//         ? {
//             name: {
//               $regex: searchQuery,
//               $options: 'i',
//             },
//           }
//         : {};
//     const categoryFilter = category && category !== 'all' ? { category } : {};
//     const priceFilter =
//       price && price !== 'all'
//         ? {
            
//             price: {
//               $gte: Number(price.split('-')[0]),
//               $lte: Number(price.split('-')[1]),
//             },
//           }
//         : {};
//     const sortOrder =
//       order === 'featured'
//         ? { featured: -1 }
//         : order === 'lowest'
//         ? { price: 1 }
//         : order === 'highest'
//         ? { price: -1 }
//         : order === 'toprated'
//         ? { rating: -1 }
//         : order === 'newest'
//         ? { createdAt: -1 }
//         : { _id: -1 };

//     const products = await Product.find({
//       ...queryFilter,
//       ...categoryFilter,
//       ...priceFilter,
//     })
//       .sort(sortOrder)
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);

//     const countProducts = await Product.countDocuments({
//       ...queryFilter,
//       ...categoryFilter,
//       ...priceFilter,
//     });
//     res.send({
//       products,
//       countProducts,
//       page,
//       pages: Math.ceil(countProducts / pageSize),
//     });
//   }
// );

blog.get(
  '/categories',
  async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  }
);


  blog.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.send(blog);
    } else {
      res.status(404).send({ message: 'Blog Not Found' });
    }
  });

export default blog