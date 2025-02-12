export const errorHandler = (err, req, res,next) =>{
    if(res.headersSent){
        return next(err);
    }
    res.status(err?.status || 500);
    res.json({message: err?.message || "Internal server error"});
}

export const catchAsync = (handler) => (req, res, next) => {
    const result = handler (req, res);
    result.catch ((err)=>{
        next(err);
    });
};