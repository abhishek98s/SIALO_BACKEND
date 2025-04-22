export const docs = {
    '/auth/login': {
        post: {
            tags: [
                'Authentication',
            ],
            summary: 'Login',
            requestBody: {
                description: 'Login credentials',
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type: 'string',
                                },
                                password: {
                                    type: 'string',
                                },
                            },
                            required: [
                                'email',
                                'password',
                            ],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            accessToken: {
                                                type: 'string',
                                            },
                                            refreshToken: {
                                                type: 'string',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: { description: 'Invalid crediantials' },
                404: { description: 'User doesn\'t exit' },
            },
        },
    },
    '/auth/refresh': {
        post: {
            tags: [
                'Authentication',
            ],
            summary: 'Refresh',
            requestBody: {
                description: 'Refresh token',
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                refreshToken: {
                                    type: 'string',
                                },
                            },
                            required: [
                                'refreshToken',
                            ],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            accessToken: {
                                                type: 'string',
                                            },
                                            refreshToken: {
                                                type: 'string',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: { description: 'Invalid refresh token' },
            },
        },
    },
    '/auth/changePassword': {
        post: {
            tags: [
                'Authentication',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Change password',
            requestBody: {
                description: 'Password credentials',
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                newPassword: {
                                    type: 'string',
                                },
                                currentPassword: {
                                    type: 'string',
                                },
                            },
                            required: [
                                'newPassword',
                                'currentPassword',
                            ],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'array',
                                        default: [],
                                    },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                400: { description: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' },
                404: { description: 'User doesn\'t exit' },
                500: { description: 'Failed to update the database' },
            },
        },
    },
};

export const schema = {
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
    },
};
