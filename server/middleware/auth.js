const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	
	console.log(authHeader);
	console.log('token: ');
	console.log(token);

	if (!token) {
		return res.sendStatus(401);
	}

	jwt.verify(token, "secret", (err, user) => {
		if (err) {
			return res.sendStatus(403);
		}
		req.user = user;
		next();
	});
};

module.exports = authenticateToken;
