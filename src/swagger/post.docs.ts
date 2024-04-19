
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
 *     summary: Get a user by id.
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
 *               $ref: '#/components/schemas/User'
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
 *       example:
 *         userId: Examp
 *         caption: example@gmail.com
 *         post_image: Example123!
 */
