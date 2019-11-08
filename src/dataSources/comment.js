const uuidv4 = require('uuid/v4')
import { CommentValidator } from '../validators/comment'
import { UserValidator } from '../validators/user'

class Comment {
    static data = []

    static create(attributes) {
        CommentValidator.validateCreation(attributes)

        const comment = { id: uuidv4(), ...attributes }
        Comment.data.push(comment)

        return comment
    }

    static all() { return Comment.data }

    static getByAuthorId(authorId) {
        return Comment.data.filter((comment) => { return authorId === comment.author })
    }

    static getByPostId(postId) {
        return Comment.data.filter((comment) => { return postId === comment.post })
    }

    static deleteByAuthorId(authorId){
        UserValidator.validateDeletion(authorId)

        Comment.data = Comment.data.filter(comment => comment.author !== authorId)
    }
}

Comment.data = [
    { id: '20', author: '2', post: '2048', text: 'Interplanetary space is the space around the Sun and planets of the Solar System. ' },
    { id: '25', author: '2', post: '2048', text: 'Interstellar space is the physical space within a galaxy not occupied by stars or their planetary systems. ' },
    { id: '10', author: '2', post: '2049', text: 'On Earth, space begins at the Kármán line (100 km above sea level).' },
    { id: '5', author: '1', post: '2050', text: 'Space, also known as outer space, is the near-vacuum between celestial bodies.' },
    { id: '15', author: '1', post: '2050', text: 'eospace is the region of outer space near Earth. ' },
]

export { Comment }