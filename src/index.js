import { GraphQLServer } from 'graphql-yoga'
import { db } from './db'
import { UserAPI } from './dataSources/user'
import { PostAPI } from './dataSources/post'
import { CommentAPI } from './dataSources/comment'

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'

const resolvers = { Query, Mutation, Post, User, Comment }

const dataSources = () => ({
    blogAPI: () => ({
        users: new UserAPI({ db }),
        posts: new PostAPI({ db }),
        comments: new CommentAPI({ db }),
    })
})

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { dataSources }
})

server.start(() => console.log('Server is running on http://localhost:4000'))