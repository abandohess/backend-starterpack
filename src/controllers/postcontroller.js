import PostModel from '../models/post_model';

export const createPost = (req, res) => {
  const post = new PostModel();
  post.title = req.body.title;
  post.content = req.body.content;
  post.tags = req.body.tags;
  post.cover_url = req.body.cover_url;
  post.author = req.user;
  post.username = req.user.username;
  post.save()
    .then((result) => {
      res.json({ message: 'Post created!' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
  // res.send('post should be created here');
};
export const getPosts = (req, res) => {
  PostModel.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getPost = (req, res) => {
  PostModel.findById(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const deletePost = (req, res) => {
  PostModel.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.json({ message: 'Post removed!' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const updatePost = (req, res) => {
  PostModel.findById(req.params.id)
    .then((post) => {
      post.title = req.body.title;
      post.content = req.body.content;
      post.tags = req.body.tags;
      post.cover_url = req.body.cover_url;
      post.save()
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    });
};
