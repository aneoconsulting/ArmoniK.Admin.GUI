import { ClientOptions, Transport } from '@nestjs/microservices';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: process.env.GRPC_PACKAGE,
    protoPath: '',
    url: process.env.GRPC_URL,
  },
};
