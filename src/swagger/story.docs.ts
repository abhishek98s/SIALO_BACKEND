export const docs = {
    '/story': {
        get: {
            tags: [
                'Story',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Get all the stories of friends',
            description: 'Fetch storeis of friends',
            responses: {
                '200': {
                    description: 'Successfully Opearation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'array',
                                        items: {
                                            properties: {
                                                user_id: {
                                                    type: 'string',
                                                },
                                                user_name: {
                                                    type: 'string',
                                                },
                                                user_image: {
                                                    type: 'string',
                                                },
                                                stories: {
                                                    type: 'array',
                                                    items: {
                                                        properties: {
                                                            story_id: {
                                                                type: 'string',
                                                            },
                                                            story_image: {
                                                                type: 'string',
                                                            },
                                                            caption: {
                                                                type: 'string',
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        post: {
            tags: [
                'Story',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Post a story',
            requestBody: {
                description: 'Story content',
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            $ref: '#/components/schemas/Story',
                            required: [
                                'caption',
                            ],
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Successfully Opearation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                            },
                                            user: {
                                                type: 'string',
                                            },
                                            caption: {
                                                type: 'string',
                                            },
                                            story_image: {
                                                type: 'string',
                                            },
                                            createdAt: {
                                                type: 'date',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/story/{id}': {
        get: {
            tags: [
                'Story',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Get stories by Id',
            description: 'Fetch storeis of of user',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'User ID',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Successfully Opearation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'array',
                                        items: {
                                            properties: {
                                                id: {
                                                    type: 'string',
                                                },
                                                user_id: {
                                                    type: 'string',
                                                },
                                                user_name: {
                                                    type: 'string',
                                                },
                                                user_image: {
                                                    type: 'string',
                                                },
                                                caption: {
                                                    type: 'string',
                                                },
                                                story_image: {
                                                    type: 'string',
                                                },
                                                date: {
                                                    type: 'string',
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        patch: {
            tags: [
                'Story',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Update story of a user.',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'Story ID',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            requestBody: {
                description: 'Story Data.',
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                caption: {
                                    type: 'string',
                                    required: true,
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Successfully Opearation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                            },
                                            user: {
                                                type: 'string',
                                            },
                                            caption: {
                                                type: 'string',
                                            },
                                            story_image: {
                                                type: 'string',
                                            },
                                            createdAt: {
                                                type: 'string',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        delete: {
            tags: [
                'Story',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Delete a story by id.',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'Story ID',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Successfully Operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                            },
                                            user: {
                                                type: 'string',
                                            },
                                            caption: {
                                                type: 'string',
                                            },
                                            story_image: {
                                                type: 'string',
                                            },
                                            createdAt: {
                                                type: 'string',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const schema = {
    Story: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                readOnly: true,
            },
            user: {
                type: 'string',
                readOnly: true,
            },
            caption: {
                type: 'string',
                required: true,
            },
            story_image: {
                type: 'string',
                readOnly: true,
            },
            sialo_image: {
                type: 'string',
                format: 'binary',
            },
            createdAt: {
                type: 'date',
                readOnly: true,
            },
        },
    },
};
