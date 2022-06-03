// imported from act 26 unit-21
const {AuthenticationError} = require('apollo-server-express');
const {User} = require('../models');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, {userId}) => {
            return User.findOne({_id: userId});
        },
        users: async (parent) => {
            return User.find();
        },
    },

    Mutation: {
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);
            return {token, user};
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if (!user) {
                throw new AuthenticationError("No user found with this email address");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw){
                throw new AuthenticationError("Incorrect credentials");
            }

            const token = signToken(user);

            return {token, user};
        },
        saveBook: async (
            parent, 
            {userId, authors, description, bookId, image, link, title}
        ) => {
            return User.findOneAndUpdate(
                {_id: userId},
                {
                    $addToSet: {
                        savedBooks: {authors, description, bookId, image, link, title},
                    },
                },
                {
                    new: true, 
                    runValidators: true,
                }
            );
        },
        removeBook: async (parent, {userId, bookId}) => {
            return User.findOneAndUpdate(
                {_id: userId},
                {
                    $pull : {
                        savedBooks: {
                            bookId: bookId,
                        },
                    },
                },
                {new: true}
            );
        },
    },
};

module.exports = resolvers;