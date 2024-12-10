import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DynamoDB, DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { InjectRepository } from '@nestjs/typeorm';
import { Alumno } from './entities/alumno.entity';
import { Repository } from 'typeorm';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import {  VerifyAlumnoDto } from './dto/verify-login-alumno.dto';
import { v4 as uuidv4 } from 'uuid';  // Para generar un UUID
import * as crypto from 'crypto';  // Para generar un string aleatorio
import { LoginAlumnoDto } from './dto/login-alumno.dto copy';
import { LogoutAlumnoDto } from './dto/logout-alumno.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AlumnosService {
  constructor(
    @InjectRepository(Alumno)
    private alumnosRepository: Repository<Alumno>,
    private configService: ConfigService
  ) {}
  

  // Configuración para AWS S3
  private s3 = new S3Client({
    region: "us-east-1",
     // Define la región en las variables de entorno
    credentials: {
      accessKeyId: this.configService.getOrThrow<string>('accessKeyId'),// Tu Access Key ID
      secretAccessKey: this.configService.getOrThrow<string>('secretAccessKey'),
      sessionToken:this.configService.getOrThrow<string>('sessionToken') // Tu Secret Access Key
    },
  });

  private snsClient = new SNSClient({
    region: 'us-east-1', // Cambia a tu región
    credentials: {
      accessKeyId: this.configService.getOrThrow<string>('accessKeyId'),// Tu Access Key ID
      secretAccessKey: this.configService.getOrThrow<string>('secretAccessKey'),
      sessionToken:this.configService.getOrThrow<string>('sessionToken') // Tu Secret Access Key
    },
  });


  private dynamoDb  = new DynamoDBClient({
    region: 'us-east-1', // Cambia a tu región
    credentials: {
      accessKeyId: this.configService.getOrThrow<string>('accessKeyId'),// Tu Access Key ID
      secretAccessKey: this.configService.getOrThrow<string>('secretAccessKey'),
      sessionToken:this.configService.getOrThrow<string>('sessionToken') // Tu Secret Access Key
    },
  });
 

  // Obtener todos los alumnos
  async findAll() {

    return await this.alumnosRepository.find();
  }

  // Obtener un alumno por su ID
  async findOne(id: number) {
    const alumno = await this.alumnosRepository.findOneBy({id});
    if (!alumno) {
      throw new NotFoundException(`Alumno con id ${id} no encontrado`);
    }
    return alumno;
  }

  // Crear un nuevo alumno
  async create(createAlumnoDto: CreateAlumnoDto) {
    const newAlumno = this.alumnosRepository.create(createAlumnoDto);
    return await this.alumnosRepository.save(newAlumno);
  }

  // Actualizar un alumno existente
  async update(id: number, updateAlumnoDto: UpdateAlumnoDto) {
    const alumno = await this.alumnosRepository.findOneBy({id});
    const updatedAlumno = Object.assign(alumno, updateAlumnoDto);
    return await this.alumnosRepository.save(updatedAlumno);
  }

  // Eliminar un alumno por su ID
  async delete(id: number) {
    const alumno = await this.findOne(id);
    await this.alumnosRepository.remove(alumno);
    return { message: 'Alumno eliminado exitosamente' };
  }


  async uploadPhotoToS3(id: number, file: Express.Multer.File) {
    const bucketName = 'siceiaws2'; // Cambia a tu bucket
    const key = `alumnos/${id}-${Date.now()}-${file.originalname}`;

    try {
      const command = new PutObjectCommand({
        Bucket: 'siceiaws2',
        Key: key,
        Body: file.buffer, // Buffer del archivo
       ContentType: 'image/jpeg',
        ContentDisposition:"inline"
       
      });

      await this.s3.send(command);

      // Construcción de la URL pública del archivo subido
      const url = `https://${bucketName}.s3.amazonaws.com/${key}`;
      
      const alumno = await this.alumnosRepository.findOneBy({id});
      // console.log({alumno})
    await this.alumnosRepository.update(alumno.id,{
      fotoPerfilUrl:url
    });
      return url;
    } catch (error) {
      console.error('Error al subir archivo a S3:', error);
      throw new HttpException('Error al subir archivo a S3', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async email(id:number) {
    const alumno = await this.findOne(id)
    try {
      const command = new PublishCommand({
        TopicArn: 'arn:aws:sns:us-east-1:518231789944:sicei',
        Message: `CALIFICACIONES DE: ${alumno.nombres} ${alumno.apellidos} | PROMEDIO: ${alumno.promedio}   `,
        Subject: `CALIFICACIONES DE: ${alumno.nombres} ${alumno.apellidos}`,
      });

      const response = await this.snsClient.send(command);
      return response; // Devuelve el ID del mensaje u otra información relevante
    } catch (error) {
      console.error('Error publicando mensaje en SNS:', error);
      throw new HttpException(
        'Error al publicar el mensaje en SNS',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async login(id:number,loginAlumnoDto: LoginAlumnoDto) {
    const alumno = await this.findOne(id)
    if (alumno.password!=loginAlumnoDto.password) {
      throw new BadRequestException('password incorrecta')
    }

    const sessionString = crypto.randomBytes(64).toString('hex');  // Generamos un string aleatorio de 128 caracteres hexadecimales

   
    // 4. Crear un nuevo ítem para DynamoDB
    const params = {
      TableName: 'test',
      Item: {
        id: { S: uuidv4() },  // Generamos un UUID para el id de la sesión
        fecha: { N: Date.now().toString() },  // Unix timestamp actual
        alumnoId: { S: id.toString() },  // ID del alumno
        active: { BOOL: true },  // Sesión activa
        sessionString: { S: sessionString },  // String de la sesión generado
      },
    };

 
    try {
      const command = new PutItemCommand(params);
      const x = await this.dynamoDb.send(command);
      // console.log(x.$metadata)
      // console.log(x.Attributes)
      // console.log(x.ConsumedCapacity)
      // console.log(x)
      
      return sessionString;
    } catch (error) {
      console.error('Error al guardar el ítem:', error);
      throw new BadRequestException('400');
    }
  }



  async verify(id: number, loginAlumnoDto: VerifyAlumnoDto) {
    const alumno = await this.findOne(id);
  
    const params = {
      TableName: 'test',
      IndexName: 'alumnoId',
      KeyConditionExpression: 'alumnoId = :alumnoId',
      ExpressionAttributeValues: {
        ':alumnoId': { S: id.toString() },
      },
    };
  
    const command = new QueryCommand(params);
    const data = await this.dynamoDb.send(command);
  
    if (!data.Items || !data.Items[0]) {
      throw new BadRequestException('Sesión no encontrada');
    }
  
    if (!data.Items[0].active.BOOL) {
      throw new BadRequestException('No es activo');
    }
  
    if (String(data.Items[0].sessionString.S) !== loginAlumnoDto.sessionString) {
      console.log(String(data.Items[0].sessionString.S) !== loginAlumnoDto.sessionString)
      throw new BadRequestException('El session id es distinto');
    }
  
    return data.Items[0].sessionString.S; // Solo retorna el string de la sesión
  }


  async logout(id: number, loginAlumnoDto: LogoutAlumnoDto) {
    const alumno = await this.findOne(id);

    const params = {
      TableName: 'test',
      IndexName: 'alumnoId', // Especificamos el GSI que hemos creado
      KeyConditionExpression: 'alumnoId = :alumnoId', // Condición de la clave de partición en el GSI
      ExpressionAttributeValues: {
        ':alumnoId': { S: id.toString() }, // Valor para la clave de partición
      },
    };

    try {
      // Ejecutar la consulta GetItem
      const command = new QueryCommand(params);
      const data = await this.dynamoDb.send(command);

      if (!data.Items || !data.Items[0]) {
        throw new BadRequestException('Sesión no encontrada');
      }

      const item = data.Items[0];

      if (!item.active.BOOL) {
        throw new BadRequestException('No es activo');
      }

      if (String(item.sessionString.S) !== loginAlumnoDto.sessionString) {
        throw new BadRequestException('Sesión no encontrada');
      }

      // Actualizar el valor de active a false
      const updateParams = {
        TableName: 'test',
        Key: {
         
          id: { S: data.Items[0].id.S }, // La clave de clasificación si aplica
        },
        UpdateExpression: 'SET active = :active',
        ExpressionAttributeValues: {
          ':active': { BOOL: false }, // Nuevo valor para la propiedad active
        },
       // Opcional: devuelve el nuevo estado del ítem
      };

      const updateCommand = new UpdateItemCommand(updateParams);
      const updatedData = await this.dynamoDb.send(updateCommand);

      return updatedData.Attributes; // Retorna el ítem actualizado
    } catch (error) {
      console.error('Error al procesar el logout:', error);
      throw new BadRequestException('Error al procesar la solicitud');
    }
  }


  
}

