const uuidv4 = require('uuid/v4')
import UserAPI from './user'
import CommentAPI from './comment'
import UpdatePostValidator from '../validators/udpate-post'

export default class PostAPI {

    constructor({ db, pubsub }) {
        this.db = db
        this.pubsub = pubsub
    }

    create = (attributes) => {
        const userQuery = new UserAPI({ db: this.db })
        const userExists = userQuery.find(attributes.author)
        if (!userExists) { throw new Error('That author id does not exists.') }

        const post = { id: uuidv4(), ...attributes }
        this.db.posts.push(post)

        if (post.published) {
            this.pubsub.publish('postCreated', { postCreated: post })
        }

        return post
    }

    update = (id, input) => {
        const updatePostValidator = new UpdatePostValidator({ postAPI: this })
        updatePostValidator.validate(id, input)

        let post = this.find(id)
        post = Object.assign(post, input)

        return post
    }

    delete = (attributes) => {
        const postId = attributes.id
        const index = this.findIndexOrFail(postId)

        const commentQuery = new CommentAPI({ db: this.db })
        commentQuery.deleteByPostId(postId)
        const deletedPosts = this.db.posts.splice(index, 1)
        return deletedPosts[0]
    }

    all = (query) => {
        if (!query) { return this.db.posts }

        const valueToFind = query.toLowerCase()

        return this.db.posts.filter((post) => {
            return post.title.toLowerCase().includes(valueToFind)
                || post.body.toLowerCase().includes(valueToFind)
        })
    }

    find = (postId) => {
        return this.db.posts.find((post) => { return post.id === postId })
    }

    getByAuthorId = (authorId) => {
        return this.db.posts.filter((post) => { return post.author === authorId })
    }

    deleteByAuthorId = (authorId) => {
        const userQuery = new UserAPI({ db: this.db })
        const commentQuery = new CommentAPI({ db: this.db })
        userQuery.findOrFail(authorId)

        this.db.posts = this.db.posts.filter((post) => {
            const shouldDeletePost = post.author === authorId
            if (shouldDeletePost) { commentQuery.deleteByPostId(post.id) }

            return !shouldDeletePost
        })
    }

    findOrFail = (id) => {
        const post = this.db.posts.find((post) => { return post.id === id })
        if (!post) { throw new Error('That post id is invalid.') }
        return post
    }

    findIndexOrFail = (id) => {
        const index = this.db.posts.findIndex((post) => { return post.id === id })
        if (index === -1) { throw new Error('That post id is invalid.') }
        return index
    }
}