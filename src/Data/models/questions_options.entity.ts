import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { QuestionEntity } from "./question.entity";


@Entity({name: 'questions_options'})
export class QuestionsOptionsEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => QuestionEntity, question => question.options)
  @JoinColumn({name:'question_id'})
  question!: QuestionEntity;

  @Column({name: 'option_text'})
  optionText!: string;
}