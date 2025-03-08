const Group = require('../models/groupModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const UserGroupMembership = require('../models/userGroupMembershipModel');
const GroupInvitation = require('../models/groupInvitationModel');
const { addMembersToGroup } = require('../utils/invitationUtils');

const inviteMembersToGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const members = req.body.members;

    const group = await Group.findById(groupId);

    if (group === null)
      return next(new AppError('This is not a valid group ID', 400));

    if (!group.admin.equals(req.user._id))
      return next(
        new AppError('You are not authorized to invite members', 401)
      );

    await addMembersToGroup(group._id, members, req.user.id);
    res.status(201).json({
      status: 'success',
      message:
        'Invitation successfully sent to all the valid members of the group',
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const declineGroupInvitation = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    const invitation = await GroupInvitation.findOneAndDelete({
      groupId,
      recieverId: req.user._id,
    });

    if (!invitation) {
      return next(new AppError('You are not invited to this group', 400));
    }

    res.status(200).json({
      status: 'success',
      message: 'Invitation has been deleted successfully',
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const acceptGroupInvitation = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    const invitation = await GroupInvitation.findOneAndDelete({
      groupId,
      recieverId: req.user._id,
    });

    if (!invitation) {
      return next(new AppError('You are not invited to this group', 400));
    }

    await UserGroupMembership.create({
      userId: req.user._id,
      groupId,
    });

    res.status(200).json({
      status: 'success',
      message: 'You are now a member of the group',
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const createGroup = async (req, res, next) => {
  try {
    const groupDetails = {
      name: req.body.name,
      admin: req.user.id,
    };
    const group = await Group.create(groupDetails);

    const userGroupMembershipDetails = {
      userId: req.user.id,
      groupId: group._id,
      role: 'admin',
    };
    await UserGroupMembership.create(userGroupMembershipDetails);
    await addMembersToGroup(group._id, req.body.members, req.user.id);

    res.status(201).json({
      status: 'success',
      data: {
        group,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const getGroupDetails = async (req, res, next) => {
  try {
    const groupIds = req.body.groupIds;
    console.log(groupIds);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

module.exports = {
  getGroupDetails,
  createGroup,
  inviteMembersToGroup,
  acceptGroupInvitation,
  declineGroupInvitation,
};
