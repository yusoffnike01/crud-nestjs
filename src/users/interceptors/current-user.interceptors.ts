import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptors implements NestInterceptor {
  constructor(private usersService: UsersService) {}
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userid } = request.session || {};
    console.log(userid);
    if (userid) {
      const user = await this.usersService.findOne(userid);
      request.currentUser = user;
    }
    return handler.handle();
  }
}
