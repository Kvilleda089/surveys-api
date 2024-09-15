import { Router } from "express";
import { UserController } from '../controllers/user.controller';


const userRouter = Router();
const userController = new UserController();

userRouter.post('/login', (request, response) =>{userController.login(request, response)});
userRouter.post('/', (request, response) =>{userController.createUser(request, response)});
userRouter.get('/:id', (request, response) =>{userController.getUserById(request, response)});

export default userRouter;