import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'ArmoniK.api.grpc.v1',
    protoPath: join(__dirname, './proto/submitter.proto'),
    url: process.env.GRPC_URL,
  },
};
