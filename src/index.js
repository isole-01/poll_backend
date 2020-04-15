
import "@babel/polyfill";
import {ApolloServer,PubSub} from "apollo-server";
import typeDefs from "./schema";
import {ApolloError, AuthenticationError, UserInputError} from "apollo-server-errors";
import { v4 as uuid } from 'uuid';
import mongoose from "mongoose";
import Poll from "./Poll";
mongoose.set('useUnifiedTopology', true);




const pubsub = new PubSub();
const POLL_ADDED='POLL_ADDED';


const resolvers = {
    Subscription: {
        pollAdded: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe: () => pubsub.asyncIterator([POLL_ADDED]),
        },
        poll:{
            subscribe: async (parent, args, context, info) => {
                const poll= await Poll.findById(args.id);
                if (poll === null){
                    throw new ApolloError("poll doesn't exist","INVALID_POLL")
                }
                return pubsub.asyncIterator([`poll_${poll.id}`])
            },
        }
    },
    Query: {
        polls:(parent, args, context, info)=>{
            return Poll.find();
        },


        poll:async (parent, args, context, info)=>{
            const poll= await Poll.findById(args.id)
            if (poll === null){
                throw new ApolloError("poll doesn't exist","INVALID_POLL")
            }
            return poll
        }
    },
    Mutation:{
        addPoll:async (parent, args, context, info)=>{
            const poll = await Poll.findOne({name:args.name});
            // console.log(poll);
            if (poll === null){
                const pollAdded= new Poll(
                    {
                        _id:uuid(),
                        name: args.name,
                        questions: args.questions.map((el)=>{
                            el._id=uuid();
                            el.number_a=0;
                            el.number_b=0;
                            el.number_c=0;
                            el.number_d=0;
                            return el
                        }),
                    }
                );
                const res=await pollAdded.save();
                pubsub.publish(POLL_ADDED, { pollAdded:res});
                return res
            }
            else
                throw new ApolloError("name exists","NAME");
        },
        fillPoll:async (parent, args, context, info)=>{
            let poll= await Poll.findById(args.id);
            if (poll === null){
                throw new ApolloError("poll doesn't exist","INVALID_POLL")
            }
            else {
                for (let i=0;i<args.choices.length;i++){
                    poll.questions[i][`number_${args.choices[i].toLowerCase()}`]++;
                }
                poll=await poll.save();
                pubsub.publish(`poll_${poll.id}`,{poll});
                return true
            }
        }
    }
};


const server = new ApolloServer({
    typeDefs, resolvers,
});

// The `listen` method launches a web server.
mongoose.connect(`mongodb+srv://isole01:${process.env.PASSWORD}@cluster0-jgnjf.mongodb.net/test?retryWrites=true&w=majority`,{ useNewUrlParser: true })
    .then((res)=>{
        server.listen({port:process.env.PORT||4000}).then(({ url }) => {
            // test().then((res=>console.log(res)));
            console.log(`🚀  Server ready at ${url}`);
        });
    }).catch(err=>console.log(err));

