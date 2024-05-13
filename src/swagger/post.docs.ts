
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
 *       - name: no_of_posts
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
 *     summary: Delete a post.
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
