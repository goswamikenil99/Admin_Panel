const mongoose = require('mongoose');

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await mongoose.connection.db.collection('messages').find().toArray();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.body; // Using req.body instead of req.params
    const message = await mongoose.connection.db
      .collection('messages')
      .findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!message) return res.status(404).json({ message: 'Message not found' });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.body; // Using req.body instead of req.params
    await mongoose.connection.db
      .collection('messages')
      .deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllMessagesWithUserDetails = async (req, res) => {
  try {
    // Fetch all messages from the 'messages' collection
    const messages = await mongoose.connection.db.collection('messages').find().toArray();

    // Map through each message and fetch the sender's and receiver's first and last names
    const populatedMessages = await Promise.all(
      messages.map(async (message) => {
        const senderId = message.sender;
        const receiverId = message.recipient; 

        // Fetch the sender details from the 'users' collection
        const sender = await mongoose.connection.db
          .collection('users')
          .findOne({ _id: new mongoose.Types.ObjectId(senderId) });
          // console.log(sender)
        
        // Fetch the receiver details from the 'users' collection
        const receiver = await mongoose.connection.db
          .collection('users')
          .findOne({ _id: new mongoose.Types.ObjectId(receiverId) });

        // Add the sender's and receiver's first and last names to the message object
        return {
          ...message,
          senderFirstName: sender?.firstName || 'Unknown',
          senderLastName: sender?.lastName || '',
          receiverFirstName: receiver?.firstName || 'Unknown',
          receiverLastName: receiver?.lastName || '',
          senderemail:sender?.email || 'Deleted',                           
          receiveremail:receiver?.email || 'Deleted',
        };
      })
    );

    // Return the populated messages
    res.json(populatedMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
