/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: user login. 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object 
 *            properties:
 *             email:
 *              type: string
 *              description: user email.
 *              example: ravi@gmail.com 
 *             password:
 *              type: string
 *              description: User password.
 *              example: 123456  
 *     responses:
 *       200:
 *         description: User sign in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 data:
 *                   type: object
 *                   properties: 
 *                     status:
 *                       type: string                     
 *                       example: success
 *                     message:
 *                       type: string 
 *                       example: successfully change
 * /api/auth/logout/{token}:
 *   get:
 *     summary: User log out.
 *     description: User log out.
 *     parameters:
 *           - in: path
 *             name: token
 *             required: true 
 *             schema:
 *              type: string
 *     responses:
 *       200:
 *         description: Vehicle information.
 *         content:
 *           application/json:  
*/
/**
 * @swagger 
 * /api/auth/signup:
 *   post:
 *     summary: user signup. 
 *     parameters:
 *      - in: header
 *        name: Route
 *        schema:
 *          type: integer 
 *        required: true 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object 
 *            properties:
 *             first_name:
 *              type: string
 *              description: First name.
 *              example: ravi
 *             last_name:
 *              type: string
 *              description: last name.
 *              example: kr
 *             email:
 *              type: string
 *              description: user email.
 *              example: ravi@gmail.com
 *             phone:
 *              type: integer
 *              description: user phone number.
 *              example: 8686876675
 *             role:
 *              type: integer
 *              description: user role.
 *              example: 1
 *             password:
 *              type: string
 *              description: User password.
 *              example: 123456 
 *     responses:
 *       200:
 *         description: User signup.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 data:
 *                   type: object
 *                   properties: 
 *                     status:
 *                       type: string                     
 *                       example: success
 *                     message:
 *                       type: string 
 *                       example: successfully change
 * /api/users:
 *   get:
 *     summary: Get user list on role and entity type based.
 *     description: Get user list on role and entity type based.
 *     parameters:
 *          - in: header
 *            name: Route
 *            schema:
 *               type: integer 
 *            required: true
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Ravi
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single  user.
 *     description: Retrieve a single  user. 
 *     parameters:
 *           - in: path
 *             name: id
 *             required: true
 *             description: Numeric ID of the user to retrieve.
 *             schema:
 *              type: integer
 *           - in: header
 *             name: Route
 *             schema:
 *               type: integer 
 *             required: true 
 *     responses:
 *       200:
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user ID.
 *                       example: 0
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                       example: Ravi 
 * /api/auth/updateProfile:
 *   post:
 *     summary: Update user. 
 *     parameters:
 *          - in: header
 *            name: Route
 *            schema:
 *               type: integer 
 *            required: true 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object 
 *            properties:
 *             id:
 *              type: integer
 *              description: The user ID.
 *              example: 0
 *             name:
 *              type: string
 *              description: The user's name.
 *              example: Ravi
 *             email:
 *              type: string
 *              description: The user email.
 *              example: ravi@gmail
 *             phone:
 *              type: string
 *              description: The user email.
 *              example: 876545689
 *     responses:
 *       200:
 *         description: User update.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user ID.
 *                       example: 0
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                       example: Ravi
 *                     email:
 *                       type: string
 *                       description: The user email id.
 *                       example: ravi@gmail
 *                     phone:
 *                       type: string
 *                       description: The user phone.
 *                       example: 7898766557
 * /api/users/delete:
 *   post:
 *     summary: Delete user. 
 *     parameters:
 *          - in: header
 *            name: Route
 *            schema:
 *               type: integer 
 *            required: true 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object 
 *            properties:
 *             id:
 *              type: integer
 *              description: The user ID.
 *              example: 0 
 *     responses:
 *       200:
 *         description: User delete.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 data:
 *                   type: object
 *                   properties: 
 *                     status:
 *                       type: string                    
 *                       example: Success
 *                     message:
 *                       type: string                       
 *                       example: Successfully deleted
 * /api/users/changepassword:
 *   post:
 *     summary: change password. 
 *     parameters:
 *          - in: header
 *            name: Route
 *            schema:
 *               type: integer 
 *            required: true 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object 
 *            properties:
 *             current_password:
 *              type: string
 *              description: user current password.
 *              example: 123456
 *             new_password:
 *              type: string
 *              description: User new password.
 *              example: 123456
 *             confirm_password:
 *              type: string
 *              description: User confirm password.
 *              example: 123456 
 *     responses:
 *       200:
 *         description: User change password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 data:
 *                   type: object
 *                   properties: 
 *                     status:
 *                       type: string                     
 *                       example: success
 *                     message:
 *                       type: string 
 *                       example: successfully change
 */

