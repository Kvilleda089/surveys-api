import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SurveyEntity } from "./survey.entity";
import { QuestionsOptionsEntity } from "./questions_options.entity";

@Entity({name: 'questions'})
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => SurveyEntity, survey => survey.questions)
  @JoinColumn({name: 'survey_id'})
  survey!: SurveyEntity;

  @Column({name:'question_text'})
  questionText!: string;

  @Column({name: 'question_type'})
  questionType!: string;

  @Column({name: 'isRequired', default: false})
  isRequired!: boolean;

  @OneToMany(() => QuestionsOptionsEntity, (option) => option.question, { cascade: true, onDelete: 'CASCADE' })
  options!: QuestionsOptionsEntity[];
}