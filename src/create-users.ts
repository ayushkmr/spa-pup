import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const usersService = app.get(UsersService);
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await usersService.create({
      username: 'admin',
      password: adminPassword,
      role: 'admin',
    });
    console.log('Admin user created:', admin);
    
    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await usersService.create({
      username: 'user',
      password: userPassword,
      role: 'user',
    });
    console.log('Regular user created:', user);
    
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
