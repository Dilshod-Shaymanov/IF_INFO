const { to } = require("../helpers/to_promise");
const myJwt = require("../services/jwt_serves");


module.exports = async function (req, res, next){
    try {
        const authorization = req.headers.authorization;
        // console.log(authorization);
        if (!authorization) {
            return res.status(403).send({ message: "Token berilmagan!" });
        }
        const bearer = authorization.split(" ")[0];
        const token = authorization.split(" ")[1];

        if (bearer !== "Bearer" || !token) {
            return res.status(403).send({ message: "Token Noto'g'ri!" });
        }
        const [error,decodedToken] = await to(myJwt.verifyAccessToken(token));
        // console.log("Error: ",error);
        // console.log("Token: ",decodedToken);

        if(error){
            return res.status(403).send({message:error.message});
        }
        req.author = decodedToken; // Keyingi darsda tushubib olamiz;

        
        next();
    } catch (error) {
        console.log(error);
        res.status(403).send({message:"Avtor ro'yxatdan o'tmagan!"});
    }
}
