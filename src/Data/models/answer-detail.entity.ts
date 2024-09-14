import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AnswerEntity } from './answer.entity';
import { QuestionEntity } from "./question.entity";
import { QuestionsOptionsEntity } from "./questions_options.entity";


@Entity({name: 'answers_detail'})
export class AnswerDetailEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => AnswerEntity, answer => answer.details, { nullable: false })
    @JoinColumn({ name: 'answers_id' })
    answer!: AnswerEntity;

   
    @ManyToOne(() => QuestionEntity)
    @JoinColumn({name:'id_question'})
    question!: QuestionEntity;

    @ManyToOne(() => QuestionsOptionsEntity, { nullable: true })
    @JoinColumn({ name: 'question_option_id' })
    questionOption!: QuestionsOptionsEntity | null;

    @Column({ name: 'text_answer', type: 'nvarchar', length: 'MAX', nullable: true })
    textAnswer!: string | null;

}