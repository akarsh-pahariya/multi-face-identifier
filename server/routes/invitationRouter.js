const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  declineGroupInvitation,
  acceptGroupInvitation,
  inviteMembersToGroup,
} = require('../controllers/groupController');

const Router = express.Router();

Router.route('/:groupId').post(protect, inviteMembersToGroup);
Router.route('/:groupId/accept').get(protect, acceptGroupInvitation);
Router.route('/:groupId/decline').delete(protect, declineGroupInvitation);

module.exports = Router;
