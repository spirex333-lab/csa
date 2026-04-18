import { SetMetadata } from '@nestjs/common';

// Custom decorator to mark routes as public
export const Authenticated = () => SetMetadata('isAuthenticated', true);
