export function mongoConnectionString(): string {
  return `${mongoConnectionURL(mongoClientVar)}${mongoConnectionOptions(
    mongoClientVar
  )}`;
}

const mongoClientVar = {
  env: process.env.NODE_ENV ?? 'development',
  user: process.env.MongoDB__User,
  pass: process.env.MongoDB__Password,
  host: process.env.MongoDB__Host ?? 'localhost',
  port: process.env.MongoDB__Port ?? '27017',
  databaseName: process.env.MongoDB__DatabaseName ?? 'test',
  directConnection: process.env.MongoDB__DirectConnection,
  caFile: process.env.MongoDB__CAFile,
  tls: process.env.MongoDB__Tls,
  allowInsecureTls: process.env.MongoDB__AllowInsecureTls,
};

function mongoConnectionURL(config: typeof mongoClientVar): string {
  if (config.env === 'production')
    // In production, we use a user / password authentication.
    return `mongodb://${config.user}:${config.pass}@${config.host}:${config.port}/${config.databaseName}`;

  // In dev mode, no authentication is needed.
  return `mongodb://${config.host}:${config.port}/${config.databaseName}`;
}

function mongoConnectionOptions(config: typeof mongoClientVar): string {
  if (config.env === 'production')
    // In production, we use TLS connection.
    return `?tls=${config.tls}&tlsAllowInvalidCertificates=${config.allowInsecureTls}&directConnection=${config.directConnection}&tlsCAFile=${config.caFile}`;

  // In dev mode, we don't need to specify any options to connect to a local MongoDB instance.
  return '';
}
