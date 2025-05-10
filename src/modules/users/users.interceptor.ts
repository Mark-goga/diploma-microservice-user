import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersMap } from '@modules/users/users.map';

@Injectable()
export class UserResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'id' in data) {
          return UsersMap.mapPrismaUserToProtoUser(data);
        }

        if (data && data.users.length > 0) {
          const { users, ...rest } = data;

          return {
            users: UsersMap.mapArrPrismaUsersToProtoUsers(users),
            ...rest,
          };
        }

        return data;
      }),
    );
  }
}
