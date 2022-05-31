import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'ArmoniK.api.grpc.v1',
    protoPath: join(__dirname, './app/core/proto/submitter_service.proto'),
    // if url contains http or https, remove it
    url: process.env.ControlPlane__Endpoint.replace(/^https?:\/\//, ''),
  },
};
