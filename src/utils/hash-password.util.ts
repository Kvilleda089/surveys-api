import bcrypt from 'bcryptjs'

export class HashAndComparePasswordUtil {

    public static async hashPassword(password: string): Promise<String> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    };

    public static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    };
}