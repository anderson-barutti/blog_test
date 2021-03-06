
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , friendly = require('mongoose-friendly');

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

/**
 * Post Schema
 */

var PostSchema = new Schema({
  title: {type : String, default : '', trim : true},
  body: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  comments: [{
    email: {type : String, default : '', trim : true},
    body: { type : String, default : '' },
    createdAt: { type : Date, default : Date.now }
  }],
  tags: {type: [], get: getTags, set: setTags},
  createdAt  : {type : Date, default : Date.now},
  updateAt  : {type : Date, default : Date.now}
});

/**
 * Plugins
 */

PostSchema.plugin(friendly)

/**
 * Validations
 */

PostSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Post title cannot be blank');

PostSchema.path('body').validate(function (body) {
  return body.length > 0
}, 'Post body cannot be blank');

/**
 * Methods
 */

PostSchema.methods = {

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  addComment: function (comment, cb) {
    this.comments.push({
      email: comment.email,
      body: comment.body
    })

    this.save(cb)
  },

  /**
   * Del comment
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  delComment: function (id, cb) {
    this.comments = this.comments.filter(function(el) { return el._id != id; });

    this.save(cb)
  }

}

mongoose.model('Post', PostSchema)
