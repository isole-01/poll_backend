import {gql} from "apollo-server-core";


const typeDefs = gql`
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    # This "Book" type defines the queryable fields for every book in our data source.
    
    enum Choices{
            A,B,C,D
    }
    
    type Poll {
        id: ID!
        name: String!
        questions:[Question!]!
#        forms : [FilledForm]!
    }
    
#    type FilledForm{
#        id: ID!
#        poll: Poll!
#        answers:[Choices!]!
#    }
    
    
    
    type Question{
        poll: Poll!
        id: ID!
        text:String!
        choice_a:String!
        number_a: Int!
        choice_b:String!
        number_b: Int!
        choice_c:String!
        number_c: Int!
        choice_d:String!
        number_d:Int!
    }
    
    type Mutation{
        addPoll(name:String!,questions:[QuestionIn!]!):Poll
        fillPoll(id:String!,choices:[Choices!]!):Boolean!
    }
    
    type Subscription{
        pollAdded: Poll!
        poll(id: String!):Poll
    }
    
    input QuestionIn{
        text:String!
        choice_a:String!
        choice_b:String!
        choice_c:String!
        choice_d:String!
    }

    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "books" query returns an array of zero or more Books (defined above).
    type Query {
        polls: [Poll]!
        poll(id:String!):Poll!
    }
    
`;
export default typeDefs;