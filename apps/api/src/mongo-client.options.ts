export function mongoConnectionString(): string {
  return `${mongoConnectionURL(mongoClientVar)}${mongoConnectionOptions(
    mongoClientVar
  )}`;
}

const mongoClientVar = {
  env: process.env.NODE_ENV ?? 'development',
  user: process.env.MongoDB__User ?? null,
  pass: process.env.MongoDB__Password ?? null,
  host: process.env.MongoDB__Host ?? null,
  port: process.env.MongoDB__Port ?? null,
  databaseName: process.env.MongoDB__DatabaseName ?? null,
  directConnection: process.env.MongoDB__DirectConnection ?? null,
  caFile: process.env.MongoDB__CAFile ?? null,
  tls: process.env.MongoDB__Tls ?? null,
  allowInsecureTls: process.env.MongoDB__AllowInsecureTls ?? null,
};

function mongoConnectionURL(config: typeof mongoClientVar): string {
  if (config.env === 'production')
    return `mongodb://${config.user}:${config.pass}@${config.host}:${config.port}/${config.databaseName}`;

  return `mongodb://${config.host}:${config.port}/${config.databaseName}`;
}

function mongoConnectionOptions(config: typeof mongoClientVar): string {
  if (config.env === 'production')
    return `?tls=${config.tls}&tlsAllowInvalidCertificates=${config.allowInsecureTls}&directConnection=${config.directConnection}&tlsCAFile=${config.caFile}`;

  return '';
}
