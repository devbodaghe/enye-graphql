const { ApolloServer, gql } = require('apollo-server');
const fetch = require('node-fetch')

const columns = ['latitude','longitude','radius','searchTerm','timeStamp']

const typeDefs = gql`

  type Result {
    latitude: Float,
    longitude: Float,
    radius: Int,
    searchTerm: String,
    timeStamp: String,
  }


  type Query {
    results (id : ID!): [Result]
  }
`;

const resolvers = {
  Query: {
    results: async (_,args) => {

      const response = await fetch(`https://enye-bfbc2.firebaseio.com/search.json`);
      const data =  await response.json();
      const result = []
      for (let key in data) {
        if(data[key].userID == args.id){
          const obj = {}
          columns.map(column => {
            obj[`${column}`] = data[key][`${column}`]
          })
          result.push(obj)
        }
      }
      return result
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀   Server ready at ${url}`);
});