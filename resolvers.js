import Medal from './schemas/medal.schema'
import User from './schemas/user.schema'

export const resolvers = {
  Query: {
    getUser(_, {id}){
      User.findById(id, function(err, user){
        if(err){
          console.log("Error");
          return null;
        }
        else{
          console.log(user);
          return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            experience: user.experience,
            medals: [],
            total_donated: user.total_donated
          };
        }
      });
    }
  }

}
