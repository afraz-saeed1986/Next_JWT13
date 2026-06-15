import connectToDB from "@/configs/db";
import { verifyToken } from "@/utils/auth";
import userModel from "@/models/User";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return false;
  }

  try {
    connectToDB();

    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "You are not login !!" });
    }

    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return res.status(401).json({ message: "You are not login !!" });
    }

    const user = await userModel.findOne(
      {
        email: tokenPayload.email,
      },
      "firstname lastname role",
    );

    return res.status(200).json({ data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unknown internal Server Error !!" });
  }
};

export default handler;
