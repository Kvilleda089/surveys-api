import { Database } from '../Data/database';
import { UserEntity } from "../Data/models/user.entity";



export class UserService {
    private userRepository = Database.getInstance().getRepository(UserEntity);
    public async createUser(email: string, password: string, googleId: string): Promise<UserEntity> {
        const newUser = this.userRepository.create({
            email,
            password,
            googleId
        }); 
        return await this.userRepository.save(newUser);
    };

    public async getUserById(userId: number): Promise<UserEntity | null> {
        return await this.userRepository.findOneBy({id: userId});
    };
}