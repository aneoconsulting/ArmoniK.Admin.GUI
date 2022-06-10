import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'ArmoniK.api.grpc.v1',
    protoPath: join(
      __dirname,
      './assets/ArmoniK.Api/Protos/V1/submitter_service.proto'
    ),
    url: process.env.ControlPlane__Endpoint?.replace(/^https?:\/\//, ''),
  },
};
