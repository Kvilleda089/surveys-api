import { HashAndComparePasswordUtil } from '../utils/hash-password.util';
import { Database } from '../Data/database';
import { UserEntity } from "../Data/models/user.entity";
import jwt from 'jsonwebtoken';
import { envs } from '../config/env';



export class UserService {
    private userRepository = Database.getInstance().getRepository(UserEntity);
    public async createUser(email: string, password: string, googleId: string): Promise<{ user: UserEntity, token: string }> {
        const hashedPassword = await HashAndComparePasswordUtil.hashPassword(password);
        const newUser = this.userRepository.create({
            email,
            password: hashedPassword as string,
            googleId
        }); 
        const user = await  this.userRepository.save(newUser);
        const token = this.generateToken(newUser);

        return {user, token}
    };


    private generateToken(user: UserEntity): string{
        return jwt.sign({ id: user.id, email: user.email }, envs.JWT_SECRET, {
            expiresIn: '1h'
        });
    }; 

    public async getUserById(userId: number): Promise<UserEntity | null> {
        return await this.userRepository.findOne({where: {id: userId}})
    };

   public async login(email: string, password: string): Promise<{ user: UserEntity, token: string } | null>{
      const user = await this.userRepository.findOneBy({email});
      
      if(!user) return null;

      const isPassword = await HashAndComparePasswordUtil.comparePassword(password, user.password);
      if(!isPassword) return null;

      const token = this.generateToken(user);
      return {user, token};
   }
}