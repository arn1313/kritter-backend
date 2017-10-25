import * as _ from 'ramda';
import * as util from '../lib/util.js';
import createError from 'http-errors';
import Mongoose, {Schema} from 'mongoose';

const postSchema = new Schema({
  url: {type: String},
  description: {type: String, required: true},
  timeStamp: {type: String, required: true},
  // owner: {type: Schema.Types.ObjectId, required: true, ref:'user'},
  ownerName: {type: String, required: true},
  ownerId: {type: String, required: true},
  ownerAvatar: {type: String},
  comments: [{type: Schema.Types.ObjectId}],
});

const Post = Mongoose.model('post', postSchema);

Post.validateReqFile = function (req) {
  if(req.files.length > 1){
    return util.removeMulterFiles(req.files)
      .then(() => {
        throw createError(400, 'VALIDATION ERROR: only one file permited');
      });
  }

  let [file] = req.files;
  if(file)
    if(file.fieldname !== 'url')
      return util.removeMulterFiles(req.files)
        .then(() => {
          throw createError(400, 'VALIDATION ERROR: file must be for avatar');
        });

  return Promise.resolve(file);
};

Post.create = function(req){
  return Post.validateReqFile(req)
    .then((file) => {
      return util.s3UploadMulterFileAndClean(file)
        .then((s3Data) => {
          console.log('%%%%%%%%%%%%', s3Data)
          return new Post({
            ownerName: req.body.ownerName,
            ownerAvatar: req.body.ownerAvatar, 
            ownerId: req.body.ownerId, 
            description: req.body.description,
            url: s3Data.Location,
            timeStamp: req.body.timeStamp,
          }).save();
        });
    });
};

Post.fetch = util.pagerCreate(Post);


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
  return Post.validateReqFile(req)
    .then(file => {
      return util.s3UploadMulterFileAndClean(file)
        .then(s3Data => {
          let update = {url: s3Data.Location};
          if(req.body.description) update.description = req.body.description;
          if(req.body) update.timeStamp = req.body.timeStamp; 

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
  console.log('%%%%%%%%reqq',req);
  return Post.findOneAndRemove({_id: req.params.id, ownerName: req.user.username})
    .then(user => {
      if(!user)
        throw createError(404, 'NOT FOUND ERROR: user not found');
    });
};

export default Post;
