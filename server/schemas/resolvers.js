const {AuthenticationError} = require('apollo-server-express');
const {User} = require('../models');
const {signToken} = require('../utils/auth');
// const { Tech, Matchup } = require('../models');

const resolvers = {
  Query: {
      users: async (parent) => {
          return User.find();
        },
      user: async (parent, {userId}) => {
          return User.findOne({_id: userId});
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
    // createVote: async (parent, { _id, techNum }) => {
    //   const vote = await Matchup.findOneAndUpdate(
    //     { _id },
    //     { $inc: { [`tech${techNum}_votes`]: 1 } },
    //     { new: true }
    //   );
    //   return vote;
    // },
  },
};

module.exports = resolvers;