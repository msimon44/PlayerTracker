import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/auth/decorators/public.decorator';

@Controller()
export class AppController {
    @Public()
    @Get('health')
    healthCheck() {
        return { status: 'ok', message: 'PlayerTracker API is running' };
    }
}
