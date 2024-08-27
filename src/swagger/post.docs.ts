
/**
 * @swagger
 * /post:
 *   get:
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     summary: Get all posts.
 *     description: Fetch posts of all user.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *   post:
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new post.
 *     description: Create a new post.
 *     requestBody:
 *       description: Post content
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 * /post/{userId}:
 *   get:
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     summary: Get all post of a user.
 *     parameters:
 *       - name: userId
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
 *               $ref: '#/components/schemas/Post'
 * /post/comment/{postId}:
 *   patch:
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: Post ID
 *         required: true
 *         schema:
 *           type: string
 *     summary: Add comment on a post. 
 *     requestBody:
 *       description: Comment Data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 * /post/reqPost:
 *   get:
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     summary: Get n no of posts.
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Number of post to get.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 * /post/like:
 *   patch:
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: query
 *         description: Post ID
 *         required: true
 *         schema:
 *           type: string
 *     summary: Add or remove like on a post.
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 * /post/{id}:
 *   patch:
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Post ID
 *         required: true
 *         schema:
 *           type: string
 *     summary: Update the caption of a post.
 *     requestBody:
 *       description: Comment Data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caption:
 *                 type: string
 *             required:
 *               - caption
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *   delete:
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Post ID
 *         required: true
 *         schema:
 *           type: string
 *     summary: Delete a post by id.
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *         name:
 *           type: string
 *           readOnly: true
 *         userId:
 *           type: string
 *         caption:
 *           type: string
 *         post_image:
 *           type: string
 *           readOnly: true
 *         sialo_image:
 *           type: string
 *           format: binary
 *         likes:
 *           type: integer
 *           readOnly: true
 *         comments:
 *           type: Array
 *           items: 
 *              properties:
 *                  comment:
 *                      type: string
 *                  comment_user_name:
 *                      type: string
 *                  comment_user-picture:
 *                      type: string
 *           readOnly: true
 *       required:
 *         - userId
 *         - caption
 *         - sialo_image
 */

export const docs = {
    '/post': {
        get: {
            tags: [
                'Post',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Get all posts.',
            description: 'Fetch posts of all user.',
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
                                        items: {
                                            $ref: '#/components/schemas/Post',
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
                'Post',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Create a new post.',
            description: 'Create a new post.',
            requestBody: {
                description: 'Post content',
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            $ref: '#/components/schemas/Post',
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
                                        properties: {
                                            _id: {
                                                type: 'string',
                                            },
                                            name: {
                                                type: 'string',
                                            },
                                            userId: {
                                                type: 'string',
                                            },
                                            caption: {
                                                type: 'string',
                                            },
                                            post_image: {
                                                type: 'string',
                                            },
                                            likes: {
                                                type: 'array',
                                                items: {
                                                    type: 'string',
                                                },
                                            },
                                            comments: {
                                                type: 'array',
                                                items: {
                                                    properties: {
                                                        comment: {
                                                            type: 'string',
                                                        },
                                                        comment_user_name: {
                                                            type: 'string',
                                                        },
                                                        comment_user_picture: {
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
    '/post/{userId}': {
        get: {
            tags: [
                'Post',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Get all post of a user.',
            parameters: [
                {
                    name: 'userId',
                    in: 'path',
                    description: 'User ID',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
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
                                        items: {
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                },
                                                name: {
                                                    type: 'string',
                                                },
                                                userId: {
                                                    type: 'string',
                                                },
                                                caption: {
                                                    type: 'string',
                                                },
                                                post_image: {
                                                    type: 'string',
                                                },
                                                likes: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                    },
                                                },
                                                comments: {
                                                    type: 'array',
                                                    items: {
                                                        properties: {
                                                            comment: {
                                                                type: 'string',
                                                            },
                                                            comment_user_name: {
                                                                type: 'string',
                                                            },
                                                            comment_user_picture: {
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
    },
    '/post/random': {
        get: {
            tags: [
                'Post',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Get random n no of post.',
            parameters: [
                {
                    name: 'noOfPosts',
                    in: 'query',
                    description: 'No of post to request',
                    required: true,
                    schema: {
                        type: 'number',
                    },
                },
            ],
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
                                        items: {
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                },
                                                name: {
                                                    type: 'string',
                                                },
                                                userId: {
                                                    type: 'string',
                                                },
                                                caption: {
                                                    type: 'string',
                                                },
                                                post_image: {
                                                    type: 'string',
                                                },
                                                likes: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                    },
                                                },
                                                comments: {
                                                    type: 'array',
                                                    items: {
                                                        properties: {
                                                            comment: {
                                                                type: 'string',
                                                            },
                                                            comment_user_name: {
                                                                type: 'string',
                                                            },
                                                            comment_user_picture: {
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
    },
    '/post/comment/{postId}': {
        patch: {
            tags: [
                'Post',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'postId',
                    in: 'path',
                    description: 'Post ID',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            summary: 'Add comment on a post.',
            requestBody: {
                description: 'Comment Data.',
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                status: { type: 'boolean' },
                                comment: {
                                    type: 'string',
                                },
                            },
                            required: [
                                'name',
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
                                        properties: {
                                            _id: {
                                                type: 'string',
                                            },
                                            lastComment: {
                                                type: 'object',
                                                properties: {
                                                    comment: { type: 'string' },
                                                    comment_user_name: { type: 'string' },
                                                    comment_user_picture: { type: 'string' },
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
    '/post/reqPost': {
        get: {
            tags: [
                'Post',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Get n no of posts.',
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'Number of post to get.',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
            ],
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
                                        items: {
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                },
                                                name: {
                                                    type: 'string',
                                                },
                                                userId: {
                                                    type: 'string',
                                                },
                                                caption: {
                                                    type: 'string',
                                                },
                                                post_image: {
                                                    type: 'string',
                                                },
                                                likes: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'string',
                                                    },
                                                },
                                                comments: {
                                                    type: 'array',
                                                    items: {
                                                        properties: {
                                                            comment: {
                                                                type: 'string',
                                                            },
                                                            comment_user_name: {
                                                                type: 'string',
                                                            },
                                                            comment_user_picture: {
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
    },
    '/post/like': {
        patch: {
            tags: [
                'Post',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'postId',
                    in: 'query',
                    description: 'Post ID',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            summary: 'Add or remove like on a post.',
            responses: {
                200: {
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
    '/post/{id}': {
        patch: {
            tags: [
                'Post',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'Post ID',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            summary: 'Update the caption of a post.',
            requestBody: {
                description: 'Comment Data.',
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                caption: {
                                    type: 'string',
                                },
                            },
                            required: [
                                'caption',
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
                                            _id: {
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
        delete: {
            tags: [
                'Post',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'Post ID',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            summary: 'Delete a post by id.',
            responses: {
                200: {
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
    Post: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                readOnly: true,
            },
            name: {
                type: 'string',
                readOnly: true,
            },
            userId: {
                type: 'string',
                readOnly: true,
            },
            caption: {
                type: 'string',
            },
            post_image: {
                type: 'string',
                readOnly: true,
            },
            sialo_image: {
                type: 'string',
                format: 'binary',
            },
            likes: {
                type: 'array',
                items: {
                    type: 'string',
                },
                readOnly: true,
            },
            comments: {
                type: 'array',
                items: {
                    properties: {
                        comment: {
                            type: 'string',
                        },
                        comment_user_name: {
                            type: 'string',
                        },
                        comment_user_picture: {
                            type: 'string',
                        },
                    },
                },
                readOnly: true,
            },
        },
    },
};
