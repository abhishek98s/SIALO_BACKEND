
/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: Get all the users.
 *     description: Create a user.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: Get a user by id.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   delete:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a user by id.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * /user/search:
 *   get:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: Get users by name
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Name of a user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * /user/recommendation:
 *   get:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: User recommendation.
 *     description: Get user recommendation.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * /user/friend/add/{friendId}:
 *   patch:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: friendId
 *         in: path
 *         description: ID of user to sent friend request.
 *         required: true
 *         schema:
 *           type: string
 *     summary: Sent friend request to a user.
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * /user/friend/accept/{friendId}:
 *   patch:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: friendId
 *         in: path
 *         description: ID of user to accept the friend request.
 *         required: true
 *         schema:
 *           type: string
 *     summary: Accept friend request of a user.
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * /user/friend/reject/{friendId}:
 *   patch:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: friendId
 *         in: path
 *         description: ID of user to reject the friend request.
 *         required: true
 *         schema:
 *           type: string
 *     summary: Reject friend request of a user.
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - name
 *         - email
 *         - password
 *       example:
 *         name: Examp
 *         email: example@gmail.com
 *         password: Example123!
 */

export const docs = {
    '/user': {
        get: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Get all the users.',
            description: 'Create a user.',
            responses: {
                '200': {
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/User',
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
    '/user/{id}': {
        get: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Get a user by id.',
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
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        $ref: '#/components/schemas/User',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        delete: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Delete a user by id.',
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
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/user/profilePicture': {
        patch: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Update the profile picture of the user',
            requestBody: {
                description: 'Image to upload',
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                sialo_profile_image: {
                                    type: 'string',
                                    format: 'binary',
                                    required: true,
                                },
                            },
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
                                        default: []
                                    },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/user/coverPicture': {
        patch: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Update the cover picture of the user',
            requestBody: {
                description: 'Image to upload',
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                sialo_cover_image: {
                                    type: 'string',
                                    format: 'binary',
                                    required: true,
                                },
                            },
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
                                        default: []
                                    },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/user/search': {
        get: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Get users by name',
            parameters: [
                {
                    name: 'name',
                    in: 'query',
                    description: 'Name of a user',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'array',
                                        items: {
                                            properties: {
                                                _id: { type: 'string' },
                                                img: { type: 'string' },
                                                name: { type: 'string' },
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
    '/user/recommendation': {
        get: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'User recommendation.',
            description: 'Get user recommendation.',
            responses: {
                '200': {
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'array',
                                        items: {
                                            properties: {
                                                _id: { type: 'string' },
                                                name: { type: 'string' },
                                                img: { type: 'string' },
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
    '/user/friend': {
        get: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Get all the friends of a user',
            responses: {
                '200': {
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'array',
                                        items: {
                                            properties: {
                                                id: { type: 'string' },
                                                name: { type: 'string' },
                                                image: { type: 'string' },
                                                pending: { type: 'boolean' },
                                                isFriend: { type: 'boolean' },
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
    '/user/friendRequests': {
        get: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Get all the friend requests',
            responses: {
                '200': {
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'array',
                                        items: {
                                            properties: {
                                                id: { type: 'string' },
                                                name: { type: 'string' },
                                                image: { type: 'string' },
                                                pending: { type: 'boolean' },
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
    '/user/friend/add/{friendId}': {
        patch: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'friendId',
                    in: 'path',
                    description: 'ID of user to sent friend request.',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            summary: 'Sent friend request to a user.',
            responses: {
                '200': {
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/user/friend/accept/{friendId}': {
        patch: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'friendId',
                    in: 'path',
                    description: 'ID of user to accept the friend request.',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            summary: 'Accept friend request of a user.',
            responses: {
                '200': {
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/user/friend/reject/{friendId}': {
        patch: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'friendId',
                    in: 'path',
                    description: 'ID of user to reject the friend request.',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            summary: 'Reject friend request of a user.',
            responses: {
                '200': {
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    message: { type: 'string' },
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
    User: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                'readOnly': true,
            },
            name: {
                type: 'string',
            },
            email: {
                type: 'string',
            },
            password: {
                type: 'string',
            },
            img: {
                type: 'string',
            },
            friends: {
                type: 'array',
                items: {
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        image: { type: 'string' },
                        pending: { type: 'string' },
                        _id: { type: 'string' },
                    },
                },
            },
            isFriend: {
                type: 'boolean',
            },
            coverImg: {
                type: 'string',
            },
            isFriendRequestPending: {
                type: 'boolean',
            },
        },
        required: ['name', 'email', 'password'],
    },
};

