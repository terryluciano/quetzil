export const errorResponse = (
    msg = "Internal Server Error",
): { msg: string; error: true } => {
    return {
        msg,
        error: true,
    };
};
