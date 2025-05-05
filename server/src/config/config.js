const config = {
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },
    logging: {
        level: process.env.LOG_LEVEL || 'debug'
    }
};

export default config; 