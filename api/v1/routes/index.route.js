const routeTask=require("./task.route");
const routeUser=require('./user.route');

const authMiddleware=require("../middlewares/auth.middleware");

module.exports=(app)=>{
    
    const version= "/api/v1";
    
    app.use(`${version}/tasks`, authMiddleware.requireAuth, routeTask);
    
    app.use(`${version}/users`,routeUser);
    
}