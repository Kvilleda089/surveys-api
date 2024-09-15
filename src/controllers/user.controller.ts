import { Request, Response } from "express";
import { UserService } from "../service/user.service";



const userService = new UserService();

export class UserController {
    public async createUser(request: Request, response: Response): Promise<Response> {
        const { email, password, googleId } = request.body;

        try {
            const newUser = await userService.createUser(email, password, googleId);
            return response.status(201).json(newUser);
        } catch (error) {
            console.log(`Error creating user ${error}`);
            return response.status(500).json({ message: `Error creating user` })
        };
    };

    public async getUserById(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        try {
            const user = await userService.getUserById(Number(id));
            if (!user) {
                return response.status(204).json({ message: 'User not Found' });
            };

            return response.status(200).json(user);
        } catch (error) {
            console.log(`Error fetching user: ${error}`);
            return response.status(500).json({ message: "Error fetching user: " });
        };
    };

    public async login(request: Request, response: Response): Promise<Response> {
        const {email, password} = request.body;
        try {
            const resultLogin = await userService.login(email, password);

            if(!resultLogin){
                return response.status(401).json({message: `Invalid credentials.`})
            }
            const {user, token} = resultLogin;
            return response.status(200).json({user, token});
        } catch (error) {
            return response.status(500).json({message: `Error: ${error}`});
        }
    };

};