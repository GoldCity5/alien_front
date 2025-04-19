/**
 * 配置接口，定义应用程序配置属性
 */
interface Config {
    apiBaseUrl: string; // API基础URL
}

/**
 * 环境配置接口，包含不同环境的配置
 */
interface EnvConfig {
    development: Config; // 开发环境配置
    production: Config;  // 生产环境配置
}

/**
 * 应用程序配置对象，包含各环境的具体配置
 
const config: EnvConfig = {
    development: {
        apiBaseUrl: 'http://127.0.0.1:8080/api', // 开发环境API地址
    },
    production: {
        apiBaseUrl: 'http://14.103.160.4:8080/api', // 这里替换为实际的生产环境API地址
    }
};

*/
/*
何立勇开发前端环境下的配置
*/
const config: EnvConfig = {
    development: {
        apiBaseUrl: 'http://14.103.160.4:8080/api',
    },
    production: {
        apiBaseUrl: 'https://www.freealley.com/api', // 这里替换为实际的生产环境API地址
    }
};

// 获取当前环境，默认为开发环境
const env = import.meta.env.MODE || 'development';
// 导出当前环境的配置
export const currentConfig: Config = config[env as keyof EnvConfig];