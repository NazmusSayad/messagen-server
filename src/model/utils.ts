export const createdAtField = (required = true) => {
  return {
    required,
    type: Date,
    default: Date.now,
  }
}

export const getFriendsQuery = (id: string) => {
  return {
    name: { $exists: false },
    users: { $size: 1 },
    $or: [{ owner: id }, { users: { $elemMatch: { user: id } } }],
  }
}

export const getAcceptedFriendsQuery = (id: string, accepted: boolean) => {
  return {
    name: { $exists: false },
    users: { $size: 1, $elemMatch: { accepted } },
    $or: [{ owner: id }, { users: { $elemMatch: { user: id } } }],
  }
}

export const getGroupsQuery = (id: string) => {
  return {
    name: { $exists: true },
    $or: [{ owner: id }, { users: { $elemMatch: { user: id } } }],
  }
}

export const getAcceptedGroupsQuery = (id: string, accepted: boolean) => {
  return {
    name: { $exists: true },
    $or: [{ owner: id }, { users: { $elemMatch: { user: id, accepted } } }],
  }
}
