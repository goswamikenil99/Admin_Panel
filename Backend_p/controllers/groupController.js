const mongoose = require('mongoose');

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await mongoose.connection.db.collection('channels').find().toArray();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const { id } = req.body; // Using req.body instead of req.params
    const group = await mongoose.connection.db
      .collection('channels')
      .findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!group) return res.status(404).json({ message: 'Group not found' });

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.body; // Using req.body instead of req.params
    await mongoose.connection.db
      .collection('channels')
      .deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Backend API to get group details

exports.getGroupDetails = async (req, res) => {
  try {
    // Fetch all groups from the 'groups' collection
    const groups = await mongoose.connection.db
      .collection("channels")
      .find()
      .toArray();

    // Populate each group with admin details, member names, and message count
    const populatedGroups = await Promise.all(
      groups.map(async (group) => {
        // Fetch the admin details
        const admin = await mongoose.connection.db
          .collection("users")
          .findOne({ _id: new mongoose.Types.ObjectId(group.admin) });
        
        const adminName = admin ? `${admin.firstName} ${admin.lastName}` : "Unknown Admin";

        // Fetch all member names
        const memberNames = await Promise.all(
          group.members.map(async (memberId) => {
            const member = await mongoose.connection.db
              .collection("users")
              .findOne({ _id: new mongoose.Types.ObjectId(memberId) });

            return member ? `${member.firstName} ${member.lastName}` : "Unknown Member";
          })
        );

        // Get the total number of messages in the group
        const messageCount = group.messages ? group.messages.length : 0;

        // Format the created date
        const createdDate = new Date(group.createdAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        // Return the populated group details
        return {
          _id: group._id,
          name: group.name,
          admin: adminName,
          members: memberNames.join(", "),
          totalMessages: messageCount,
          createdAt: createdDate,
        };
      })
    );

    // Send the response with populated group details
    res.json(populatedGroups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

