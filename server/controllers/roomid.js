const roomidModel = require('../models/roomid');

async function createRoomId (req, res) {
    const roomid = req.body.roomid;
    const owner = req.body.owner;
    const details = req.body.details;

    const newRoomId = new roomidModel({
        roomid: roomid,
        owner: owner,
        details: details
    });

    try {
        await newRoomId.save();
        res.status(200).json({message: 'Room ID created!'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

async function verifyOwner (req,res) {
    const roomid = req.body.roomid;
    const owner = req.body.owner;

    const id = await roomidModel.findOne({roomid: roomid});

    if(!id || id === null)
    return res.status(400).json({message: 'Room ID not found!'});

    if (id.owner === owner) {
        res.status(200).json({meetingId: roomid , isAdmin: true});
    }

    else {
        res.status(200).json({meetingId: roomid , isAdmin: false});
    }
}

async function getAdminDetails (req,res) {
    const roomid = req.body.roomid;

    const admin = await roomidModel.findOne({roomid: roomid});
    if(!admin)
    return res.status(400).json({message: 'Room ID not found!'});
    const details = admin.details;

    res.status(200).json({details: details});
}

module.exports = {
    createRoomId,
    verifyOwner,
    getAdminDetails
}