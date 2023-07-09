const express= require('express')
const router= express.Router()
const {joinStream,leaveStream,startStream}= require('../stream/stream_controller')
router.post('/start',startStream)
router.post('/join',joinStream)
router.post('/leave',leaveStream)
module.exports=router