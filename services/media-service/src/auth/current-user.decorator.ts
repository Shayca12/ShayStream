import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// דקורטור נוח: @CurrentUser() ישלוף את המשתמש שה-Guard הצמיד לבקשה.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as { id: string; email: string };
  },
);
