import { createParamDecorator } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';

export type RequestMetadataForSession = {
  ipAddress: string;
  userAgent: string;
};

export const GetMetadataForSession = createParamDecorator(
  (_: unknown, context: any): RequestMetadataForSession => {
    const metadata: Metadata = context.getArgByIndex(1);

    if (!metadata) {
      return {
        ipAddress: 'unknown',
        userAgent: 'unknown',
      };
    }

    const ipAddress = String(metadata.get('x-forwarded-for')[0] || '0.0.0.0');
    const userAgent = String(metadata.get('user-agent')[0] || '');

    return { ipAddress, userAgent };
  },
);
