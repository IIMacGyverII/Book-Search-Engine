// based on act 26 unit-21
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    _id: ID
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]!
  }
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    user(userId: ID!): User
    users: [User]
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(userId: ID!, authors: [String], description: String, bookId: String, image: String, link: String, title: String): User
    removeBook(userId: ID!, bookId: ID!): User
  }
`;

module.exports = typeDefs;