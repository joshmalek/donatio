import Medal from "../schemas/medal.schema";

const MedalAPI = {
  getMedals: async () => {
    return await Medal.find();
  },
};

module.exports = MedalAPI;
