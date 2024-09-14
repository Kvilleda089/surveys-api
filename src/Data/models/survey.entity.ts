import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { QuestionEntity } from "./question.entity";

@Entity({ name: 'surveys' })
export class SurveyEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({name: 'title'})
    title!: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description!: string;

    @Column({name: 'created_user_id'})
    createdUserId!: number;

    @Column({ type: 'datetime', name: 'createAt', default: () => 'CURRENT_TIMESTAMP' })
    createAt!: Date;

    @UpdateDateColumn({ type: 'datetime', name: 'updateAt', default: () => 'CURRENT_TIMESTAMP' })
    updateAt!: Date;

    @OneToMany(() => QuestionEntity, (question) => question.survey, {cascade: true, onDelete: 'CASCADE'})
    questions!: QuestionEntity[];
}