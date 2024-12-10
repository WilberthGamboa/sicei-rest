import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Alumno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  matricula: string;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column('float')
  promedio: number;

  @Column({default:'asdsa'})
  fotoPerfilUrl: string;

  @Column()
  password: string;
}
