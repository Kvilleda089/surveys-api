import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({unique: true})
    email!: string;

    @Column()
    password!: string;

    @Column({nullable: true})
    googleId!: string;
}