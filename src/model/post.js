import * as _ from 'ramda';
import * as util from '../lib/util.js';
import createError from 'http-errors';
import Mongoose, {Schema} from 'mongoose';

const postSchema = new Schema({
  url: {type: String, required: true},
  description: {type: String, required: true},
  owner: {type: Schema.Types.ObjectId, required: true, ref:'user'},
  comments: [{type: Schema.Types.ObjectId}],
});

const Post = Mongoose.model('post', postSchema); 

Post.validateRequest = function(req){

  if(req.files.length > 1) {
    let err = createError(400, 'VALIDATION ERROR: must have one file');
    return util.removeMulterFiles(req.files)
      .then(() => {throw err;});
  }

  let [file] = req.files;
  if(file){
    if(file.fieldname !== 'photo'){
      let err = createError(400, 'VALIDATION ERROR: file must be on field photo');
      return util.removeMulterFiles(req.files)
        .then(() => {throw err;});
    }
  }

  return Promise.resolve(file);
};

Post.create = function(req){
  return Post.validateRequest(req)
    .then(file => {
      return util.s3UploadMulterFileAndClean(file)
        .then(s3Data => {
          return new Post({
            owner: req.user._id,
            url: s3Data.Location,
            description: req.body.description,
          }).save();
        });
    })
    .then(post => {
      return Post.findById(post._id)
        .populate('user');
    });
};


Post.fetchOne = function(req){
  return Post.findById(req.params.id)
    // .populate('profile comments')
    .then(photo => {
      if(!photo)
        throw createError(404, 'NOT FOUND ERROR: photo not found'); 
      return photo;
    });
};

Post.updatePostWithFile = function(req){
  return Post.validateRequest(req)
    .then(file => {
      return util.s3UploadMulterFileAndClean(file)
        .then(s3Data => {
          let update = {url: s3Data.Location};
          if(req.body.description) update.description = req.body.description; 
          return Post.findByIdAndUpdate(req.params.id, update, {new: true, runValidators: true});
        });
    });
};

Post.update = function(req){
  if(req.files && req.files[0])
    return Post.updatePostWithFile(req)
      .then(post => {
        return Post.findById(post._id)
          .populate('user');
      });
  let options = {new: true, runValidators: true};
  let update = {description: req.body.description};
  return Post.findByIdAndUpdate(req.params.id, update, options)
    .then(post => {
      return Post.findById(post._id)
        .populate('user');
    });
};

Post.delete = function(req){
  return Post.findOneAndRemove({_id: req.params.id, owner: req.user._id})
    .then(user => {
      if(!user)
        throw createError(404, 'NOT FOUND ERROR: user not found');
    });
};

export default Post;

