import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Profesor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numeroEmpleado: string;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column('int')
  horasClase: number;
}
