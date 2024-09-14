import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SurveyEntity } from "./survey.entity";
import { UserEntity } from "./user.entity";
import { AnswerDetailEntity } from "./answer-detail.entity";


@Entity({name: 'answers'})
export class AnswerEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => SurveyEntity)
    @JoinColumn({name: 'id_survey'})
    survey!: SurveyEntity;

    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: 'modified_user_id' })
    modifiedUser!: UserEntity;

    @Column({ name: 'response_date', type: 'datetime', default: () => 'GETDATE()' })
    response_date!: Date;

    @OneToMany(() => AnswerDetailEntity, answerDetail => answerDetail.answer)
    details!: AnswerDetailEntity[];
}