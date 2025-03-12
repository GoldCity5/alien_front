interface Config {
    apiBaseUrl: string;
}

interface EnvConfig {
    development: Config;
    production: Config;
}

const config: EnvConfig = {
    development: {
        apiBaseUrl: 'http://127.0.0.1:8080/api',
    },
    production: {
        apiBaseUrl: 'https://api.yourdomain.com', // 这里替换为实际的生产环境API地址
    }
};

const env = import.meta.env.MODE || 'development';
export const currentConfig: Config = config[env as keyof EnvConfig];