import tracer from 'dd-trace';

// Initialize DataDog tracer with proper configuration
tracer.init({
    // Common DataDog configuration
    service: 'piq-backend',
    env: process.env.NODE_ENV || 'development',
    logInjection: true,
    // Add any other DataDog config options you need
});

// Use Fastify plugin for DataDog
tracer.use('fastify');

console.log('DataDog tracer initialized for Fastify');

export default tracer; 