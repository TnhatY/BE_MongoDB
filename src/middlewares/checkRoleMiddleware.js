export const checkRole = (requiredRole) => {
    return (req, res, next) => {
        try {
            const userRole = req.user.role;
            //console.log(userRole)
            if (!userRole) {
                return res.status(403).json({ message: "Access Denied: No role assigned" });
            }

            if (userRole !== requiredRole) {
                return res.status(403).json({ message: "Access Denied: Insufficient permissions" });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
};

