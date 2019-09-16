const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {

    async index(req, res){

        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        const users = await Dev.find({

            $and: [

                { _id: { $ne: user } },
                { _id: { $nin: loggedDev.likes }},
                { _id: { $nin: loggedDev.dislikes } },

            ],

        })

        return res.json(users);

    },

    async store(req, res){

        const { username } = req.body;

        const userExists = await Dev.findOne({ user: username });

        if(userExists){
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`)

        const { name, bio, avatar_url: avatar } = response.data;

        const dev = await Dev.create({ 

            name,
            user: username,
            bio,
            avatar
        })

        return res.json(dev);
    }
//await antes da função, diz que o node vai esperar a linha acabar para prosseguir com o programa.
//Porém precisa colocar o "async" antes da função para funcionar
}