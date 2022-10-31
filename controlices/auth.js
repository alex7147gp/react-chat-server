const { connect } = require('getStream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const api_id = process.env.STREAM_API_ID;
  
const signup = async (req, res) => {
  try{
    const { fullName, username, password, phoneNumber } = req.body;

    const userId = crypto.randomBytes(16).toString('hex');
  
    const serverClient = connect(api_key, api_secret, api_id);

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('line 22 ' +hashedPassword);

    const token = serverClient.createUserToken(userId);
    
    res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber });

  }
  catch (err) {
  	console.log(err+' '+api_key+' '+' '+api_secret+' '+api_id);

    res.status(500).json({ message: `error in line/31 ${err}`});
  }
}
const login = async (req, res) => {
  try{
    const { username, password } = req.body;

    const serverClient = connect(api_key, api_secret, api_id);
    
    const client = StreamChat.getInstance(api_key, api_secret);

    const { users } = await client.queryUsers({ name: username });
   
    console.log(users.lenght);

    console.log(users);

    if(users.lenght === 0) return res.status(408).json({ message: `User not found line/44 ${users}` });
   
    const sucess = await bcrypt.compare(password, users[0].hashedPassword);
    
    const token = serverClient.createUserToken(users[0].id);
    
    console.log('line/53 '+ password);

    console.log(sucess);

    if(sucess){
      res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id});
    }
    else{
      res.status(500).json({ message: 'incorrect password' });
    }

  }
  catch (err) {
  	console.log(err);

  	res.status(500).json({ message: `error in line/62 ${err}`});
  }
}
module.exports = { signup, login };