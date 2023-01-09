import { Response } from 'express'
import { UserRequest } from '../auth/tokenController'
import Friend from '../../model/Friend'

export const getAllFriends = async (req: UserRequest, res: Response) => {}

export const addFriend = async (req: UserRequest, res: Response) => {}

export const removeFriend = async (req: UserRequest, res: Response) => {}

export const acceptFriend = async (req: UserRequest, res: Response) => {}
